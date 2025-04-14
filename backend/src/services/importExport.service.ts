import prisma from '../config/db';
import { Prisma, Role, Folder, Bookmark } from '@prisma/client'; // Added Folder, Bookmark types
import { ImportOptionsInput, ExportOptionsInput } from '../models/schemas'; 
import logger from '../config/logger';
import { fetchUrlMetadata } from '../utils/metadata'; // For fetching metadata during import
import * as cheerio from 'cheerio'; // Import cheerio for HTML parsing
// Removed specific Element import, will use cheerio.Element
import * as papaparse from 'papaparse'; // Import papaparse for CSV parsing
import { v4 as uuidv4 } from 'uuid'; // For generating public links if needed
import { config } from '../config'; // For base URL of public links
import { emitToUser, SOCKET_EVENTS } from './socket.service'; // Import socket emitter
import { FolderError } from './folder.service'; // Import FolderError

/**
 * Custom error class for import/export related service errors.
 */
export class ImportExportError extends Error {
    public statusCode: number;
    constructor(message: string, statusCode: number = 400) {
        super(message);
        this.name = 'ImportExportError';
        this.statusCode = statusCode;
    }
}

// --- Helper Functions ---

/**
 * Recursively retrieves all descendant folder IDs for a given folder.
 */
const getAllDescendantFolderIds = async (folderId: string, userId: string, txOrPrisma: Prisma.TransactionClient | typeof prisma): Promise<string[]> => {
    const folders = await txOrPrisma.folder.findMany({
        where: { parentId: folderId, userId }, 
        select: { id: true },
    });
    const childIds = folders.map(folder => folder.id);
    if (childIds.length === 0) return [];
    const descendantIds: string[] = [...childIds];
    for (const childId of childIds) {
        const descendants = await getAllDescendantFolderIds(childId, userId, txOrPrisma); 
        descendantIds.push(...descendants);
    }
    return descendantIds;
};


// --- Import Service ---

/**
 * Type definition for a bookmark parsed from an import file.
 */
type ParsedBookmark = {
    url: string;
    title?: string;
    description?: string; 
    tags?: string[]; 
    folderPath?: string[]; 
    addDate?: number; 
};

/**
 * Recursively parses a Cheerio element representing a <DL> node in a bookmark HTML file.
 */
const parseHtmlDlNode = (
    $: cheerio.Root, 
    element: cheerio.Element, // Correct type usage
    currentPath: string[], 
    bookmarks: ParsedBookmark[]
): void => {
    $(element).children('dt').each((_, dtElement) => { 
        const anchor = $(dtElement).children('a').first();
        const header = $(dtElement).children('h3').first();

        if (anchor.length > 0) { // Bookmark
            const url = anchor.attr('href');
            const title = anchor.text();
            const addDateStr = anchor.attr('add_date');
            const addDate = addDateStr ? parseInt(addDateStr, 10) : undefined;
            const description = $(dtElement).next('dd').text().trim() || undefined; 
            const tagsStr = anchor.attr('tags'); 
            const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(t => t) : [];

            if (url && !url.startsWith('place:') && !url.startsWith('javascript:')) {
                bookmarks.push({ url, title: title || 'Untitled', folderPath: [...currentPath], addDate, description, tags });
            }
        } else if (header.length > 0) { // Folder
            const folderName = header.text().trim(); 
            const nextDl = $(dtElement).next('dl').first(); 
            if (folderName && nextDl.length > 0 && nextDl.get(0)) { 
                const newPath = [...currentPath, folderName]; 
                parseHtmlDlNode($, nextDl.get(0)!, newPath, bookmarks); // Recurse
            }
        }
    });
};

/**
 * Parses bookmarks from an HTML file content (Netscape Bookmark File Format).
 */
const parseHtmlBookmarks = (fileContent: string): ParsedBookmark[] => {
    logger.info('[Import Service]: Parsing HTML bookmarks hierarchically using cheerio.');
    const bookmarks: ParsedBookmark[] = [];
    try {
        const $ = cheerio.load(fileContent);
        const firstDl = $('h1').first().nextAll('dl').first(); 
        if (firstDl.length > 0 && firstDl.get(0)) {
             parseHtmlDlNode($, firstDl.get(0)!, [], bookmarks); 
        } else {
            logger.warn("Could not find standard starting <DL> after <H1> in HTML bookmark file.");
            $('body > dl').first().each((_, dlElement) => {
                 parseHtmlDlNode($, dlElement, [], bookmarks);
            });
        }
         logger.info(`[Import Service]: Parsed ${bookmarks.length} bookmarks from HTML (hierarchical).`);
    } catch (error) {
        logger.error('[Import Service]: Cheerio hierarchical HTML parsing error:', error);
    }
    return bookmarks;
};

/**
 * Parses bookmarks from CSV file content.
 */
const parseCsvBookmarks = (fileContent: string): ParsedBookmark[] => {
    logger.info('[Import Service]: Parsing CSV bookmarks using papaparse.');
    const bookmarks: ParsedBookmark[] = [];
    try {
        const result = papaparse.parse<Record<string, string>>(fileContent, { 
            header: true, dynamicTyping: false, skipEmptyLines: true,
        });
        if (result.errors.length > 0) {
             logger.error('[Import Service]: Papaparse encountered errors:', result.errors);
        }
        if (result.data && Array.isArray(result.data)) {
            result.data.forEach((row, index) => {
                const url = row.URL || row.url; 
                const title = row.Title || row.title;
                const description = row.Description || row.description;
                const tagsRaw = row.Tags || row.tags;
                const tags = tagsRaw ? tagsRaw.split(';').map(t => t.trim()).filter(t => t) : []; 
                if (url) {
                    bookmarks.push({ url, title: title || 'Untitled', description, tags });
                } else {
                    logger.warn(`[Import Service]: Skipping CSV row ${index + 2} due to missing URL.`);
                }
            });
             logger.info(`[Import Service]: Parsed ${bookmarks.length} bookmarks from CSV.`);
        }
    } catch (error) {
        logger.error('[Import Service]: Papaparse CSV parsing error:', error);
    }
    return bookmarks;
};

/**
 * Parses bookmarks from a JSON structure, potentially nested (like Chrome's format).
 */
const parseJsonBookmarks = (jsonData: any): ParsedBookmark[] => {
     logger.info('[Import Service]: Parsing JSON bookmarks (attempting hierarchical).');
     const bookmarks: ParsedBookmark[] = [];
     const traverseNodes = (node: any, currentPath: string[]) => {
         if (!node) return;
         if (node.roots && typeof node.roots === 'object') {
             logger.debug('Detected Chrome JSON structure with roots.');
             Object.values(node.roots).forEach((root: any) => traverseNodes(root, [])); 
             return; 
         }
         if (Array.isArray(node)) {
              logger.debug('Detected JSON array structure.');
              node.forEach(item => traverseNodes(item, currentPath));
              return;
         }
         const type = node.type;
         const name = node.name;
         const url = node.url;
         const children = node.children;
         const tags = Array.isArray(node.tags) ? node.tags.map(String) : []; 

         if (type === 'folder' || (children && Array.isArray(children))) {
             const folderName = name || 'Unnamed Folder';
             const newPath = [...currentPath, folderName];
             if (children) {
                 children.forEach((child: any) => traverseNodes(child, newPath));
             }
         } else if (type === 'url' || url) {
             if (url && typeof url === 'string' && url.startsWith('http')) {
                 bookmarks.push({ url: url, title: name || 'Untitled', folderPath: [...currentPath], tags });
             } else {
                  logger.warn(`[Import Service]: Skipping JSON item due to invalid/missing URL: ${url || 'N/A'}`);
             }
         }
     };
     traverseNodes(jsonData, []);
     logger.info(`[Import Service]: Parsed ${bookmarks.length} bookmarks from JSON (hierarchical).`);
     return bookmarks;
};

/**
 * Finds or creates a folder based on a path array within a transaction.
 */
const findOrCreateFolderByPath = async (userId: string, path: string[], tx: Prisma.TransactionClient, baseParentId: string | null = null): Promise<string | null> => {
    if (!path || path.length === 0) return baseParentId; 
    let currentParentId: string | null = baseParentId;
    logger.debug(`Finding/creating folder path: ${path.join('/')} for user ${userId} under parent ${baseParentId || 'root'}`);
    for (const folderName of path) {
        if (!folderName) continue; 
        let folder: Folder | null = await tx.folder.findFirst({ 
            where: { name: folderName, userId: userId, parentId: currentParentId }
        });
        if (!folder) {
            logger.info(`Creating folder "${folderName}" under parent ${currentParentId || 'root'} for user ${userId}`);
            try {
                folder = await tx.folder.create({ data: { name: folderName, userId: userId, parentId: currentParentId } });
            } catch (createError) {
                 logger.error(`Failed to create folder "${folderName}" for user ${userId}:`, createError);
                 if (createError instanceof Prisma.PrismaClientKnownRequestError && createError.code === 'P2002') {
                     folder = await tx.folder.findFirst({ where: { name: folderName, userId: userId, parentId: currentParentId } });
                     if (!folder) throw new FolderError(`Failed to find or create folder "${folderName}" due to potential conflict.`, 500);
                 } else { throw new FolderError(`Failed to create folder "${folderName}".`, 500); }
            }
        }
        currentParentId = folder.id; 
    }
    logger.debug(`Path resolved to folder ID: ${currentParentId}`);
    return currentParentId; 
};


/**
 * Imports bookmarks from parsed data into a user's account.
 */
export const importBookmarks = async (userId: string, importData: any, options: ImportOptionsInput) => {
    const { format, folderId: targetRootFolderId } = options; 
    logger.info(`Starting bookmark import for user ${userId}, format: ${format}` + (targetRootFolderId ? `, target root folder: ${targetRootFolderId}` : ''));
    let parsedBookmarks: ParsedBookmark[] = [];

    // 1. Parse input
    try {
        switch (format) {
            case 'json': parsedBookmarks = parseJsonBookmarks(importData); break;
            case 'html': parsedBookmarks = parseHtmlBookmarks(importData as string); break;
            case 'csv': parsedBookmarks = parseCsvBookmarks(importData as string); break;
            default: throw new ImportExportError(`Unsupported import format: ${format}`, 400);
        }
    } catch (error) {
         logger.error(`[Import Service]: Error parsing ${format} data:`, error);
         if (error instanceof ImportExportError) throw error;
         throw new ImportExportError(`Failed to parse ${format} data. Please check the file format and content.`, 400);
    }

    if (parsedBookmarks.length === 0) {
         logger.warn(`[Import Service]: No valid bookmarks found to import for user ${userId} from the provided ${format} file.`);
        return { success: true, message: 'No valid bookmarks found to import.', stats: { total: 0, imported: 0, failed: 0 } };
    }
     logger.info(`[Import Service]: Parsed ${parsedBookmarks.length} potential bookmarks. Starting database import for user ${userId}.`);

    // 2. Check target ROOT folder access if provided
    if (targetRootFolderId) {
         logger.debug(`Verifying target root folder ${targetRootFolderId} for user ${userId}`);
        const targetRootFolder = await prisma.folder.findFirst({
            where: { id: targetRootFolderId, OR: [{ userId }, { collaborators: { some: { userId, permission: { in: [Role.EDIT, Role.ADMIN] } } } }] }
        });
        if (!targetRootFolder) {
             logger.error(`Import failed: Target root folder ${targetRootFolderId} not found or permission denied for user ${userId}.`);
            throw new ImportExportError('Target root folder not found or permission denied', 404);
        }
         logger.debug(`Target root folder ${targetRootFolderId} verified.`);
    }

    // 3. Process and import bookmarks
    const stats = { total: parsedBookmarks.length, imported: 0, failed: 0 };
    const createdBookmarkIds: string[] = [];

    for (const [index, bookmarkData] of parsedBookmarks.entries()) {
        try {
            if (!bookmarkData.url || typeof bookmarkData.url !== 'string' || !bookmarkData.url.startsWith('http')) {
                logger.warn(`[Import Service]: Skipping bookmark #${index + 1} due to invalid or missing URL: ${bookmarkData.url}`);
                stats.failed++; continue;
            }
            const title = bookmarkData.title || 'Untitled';
            const description = bookmarkData.description || '';

            const newBookmark = await prisma.$transaction(async (tx) => {
                const finalFolderId = await findOrCreateFolderByPath(userId, bookmarkData.folderPath || [], tx, targetRootFolderId || null);
                const created = await tx.bookmark.create({
                    data: { url: bookmarkData.url, title, description, userId, createdAt: bookmarkData.addDate ? new Date(bookmarkData.addDate * 1000) : undefined }
                });
                if (finalFolderId) {
                    await tx.folderBookmark.create({ data: { folderId: finalFolderId, bookmarkId: created.id } });
                }
                if (bookmarkData.tags && bookmarkData.tags.length > 0) {
                    const tagOps = bookmarkData.tags.map(async (name) => {
                        if (typeof name !== 'string' || !name.trim()) return; 
                        let tag = await tx.tag.findFirst({ where: { name, userId } });
                        if (!tag) {
                            try { tag = await tx.tag.create({ data: { name, userId } }); } 
                            catch (e) { if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') { tag = await tx.tag.findFirst({ where: { name, userId } }); if (!tag) throw e; } else { throw e; } }
                        }
                        await tx.bookmarkTag.create({ data: { tagId: tag.id, bookmarkId: created.id } });
                    });
                    await Promise.all(tagOps); 
                }
                return created;
            });
            createdBookmarkIds.push(newBookmark.id);
            stats.imported++;
             if ((index + 1) % 100 === 0) logger.info(`[Import Service]: Imported ${stats.imported}/${stats.total} bookmarks for user ${userId}...`);
        } catch (error) {
            logger.error(`[Import Service]: Error importing individual bookmark #${index + 1} (URL: ${bookmarkData.url}):`, error);
            stats.failed++;
        }
    }
    logger.info(`[Import Service]: Import completed for user ${userId}. Stats: Imported=${stats.imported}, Failed=${stats.failed}, Total=${stats.total}`);
    return { success: true, message: `Import completed. Imported ${stats.imported} bookmarks, failed ${stats.failed}.`, stats };
};


// --- Export Service ---

/**
 * Helper type for building folder hierarchy for export. Includes bookmarks.
 */
type FolderHierarchyNode = Folder & { 
    children: FolderHierarchyNode[]; 
    bookmarks: (Bookmark & { tags: { tag: { name: string } }[] })[]; 
};

/**
 * Recursively builds HTML folder structure for export.
 */
const buildHtmlFolderNode = (node: FolderHierarchyNode | null, indent: number = 0): string => {
    if (!node) return ''; 
    let html = '';
    const indentStr = '  '.repeat(indent + 1); 
    const escapedFolderName = (node.name || 'Unnamed Folder').replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"');

    // Only add folder tags if it's not the virtual root
    if (node.id !== 'root') { 
        html += `${indentStr}<DT><H3>${escapedFolderName}</H3>\n`;
        html += `${indentStr}<DL><p>\n`; 
    }

    // Add bookmarks directly within this folder
    (node.bookmarks || []).forEach((b) => { 
        const addDate = Math.floor(new Date(b.createdAt).getTime() / 1000);
        const escapedTitle = (b.title || 'Untitled').replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"');
        const tagsAttribute = b.tags.length > 0 ? ` TAGS="${b.tags.map(t => t.tag.name).join(',')}"` : ''; 
        const bookmarkIndent = node.id !== 'root' ? `${indentStr}  ` : indentStr; 
        html += `${bookmarkIndent}<DT><A HREF="${b.url}" ADD_DATE="${addDate}"${tagsAttribute}>${escapedTitle}</A>\n`;
        if (b.description) {
            const escapedDescription = (b.description || '').replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"');
            html += `${bookmarkIndent}  <DD>${escapedDescription}\n`; 
        }
    });

    // Recursively add subfolders
    (node.children || []).forEach(childNode => { 
        html += buildHtmlFolderNode(childNode, node.id !== 'root' ? indent + 1 : indent); 
    });

    // Close folder tags only if it's not the virtual root
    if (node.id !== 'root') {
        html += `${indentStr}</DL><p>\n`; 
    }
    return html;
};

/**
 * Helper to recursively build JSON folder structure for export.
 */
const buildJsonFolderNode = (node: FolderHierarchyNode | null): any => {
     if (!node) return null; 

    // If it's the virtual root, handle its children directly
    if (node.id === 'root') {
        return {
            children: [
                 ...(node.children || []).map(childNode => buildJsonFolderNode(childNode)),
                 ...(node.bookmarks || []).map(b => ({
                    type: 'url', url: b.url, name: b.title, 
                    tags: b.tags.map((t: any) => t.tag.name) // Add explicit type 'any' or define tag type
                 }))
            ],
            date_added: "0", date_modified: "0", guid: uuidv4(), id: "1", 
            name: "Bookmarks bar", type: "folder"
        };
    }

    // For regular folders
    return {
        type: 'folder', name: node.name,
        // guid: node.id, // Use actual folder ID as GUID? Or generate new ones?
        // date_added, date_modified - could add if needed
        children: [
            ...(node.children || []).map(childNode => buildJsonFolderNode(childNode)),
            ...(node.bookmarks || []).map(b => ({
                type: 'url', url: b.url, name: b.title, 
                tags: b.tags.map((t: any) => t.tag.name) // Add explicit type 'any' or define tag type
            })),
        ]
    };
};


/**
 * Exports bookmarks for a user in the specified format (JSON, HTML, CSV).
 * Handles folder hierarchy for HTML and JSON export.
 */
export const exportBookmarks = async (userId: string, options: ExportOptionsInput) => {
    const { format, folderId, includeSubfolders } = options; 
    logger.info(`Starting bookmark export for user ${userId}, format: ${format}` + (folderId ? `, folder: ${folderId}` : '') + (includeSubfolders ? ' (including subfolders)' : ''));

    // 1. Determine target folder IDs and fetch all necessary folders for hierarchy
    let targetFolderIds: string[] | undefined = undefined;
    let allRelevantFolders: Folder[] = []; 
    let rootFolderIdForHierarchy: string | null = folderId || null; 

    if (folderId) {
        const rootFolderAccess = await prisma.folder.findFirst({ where: { id: folderId, OR: [{ userId }, { collaborators: { some: { userId } } }] } });
        if (!rootFolderAccess) throw new ImportExportError('Folder not found or permission denied', 404);
        targetFolderIds = [folderId];
        if (includeSubfolders) {
             const descendantIds = await getAllDescendantFolderIds(folderId, userId, prisma);
             targetFolderIds.push(...descendantIds);
             logger.info(`Including ${descendantIds.length} subfolders in export.`);
        }
        // Fetch only the relevant folders (owner check ensures we only get user's folders in the hierarchy)
        // Ensure we fetch folders owned by the user within the target hierarchy
        allRelevantFolders = await prisma.folder.findMany({ where: { id: { in: targetFolderIds }, userId } }); 
    } else {
         // Exporting all bookmarks, fetch all user folders
         logger.debug("Exporting all bookmarks, fetching all folders for hierarchy.");
         allRelevantFolders = await prisma.folder.findMany({ where: { userId } });
         targetFolderIds = undefined; 
         rootFolderIdForHierarchy = null; // Start hierarchy from true root
    }

    // 2. Build base query for bookmarks
     const whereClause: Prisma.BookmarkWhereInput = { userId, isDeleted: false };
    if (targetFolderIds) { 
         whereClause.folders = { some: { folderId: { in: targetFolderIds } } };
    }

    // 3. Fetch bookmarks with relations
    logger.debug(`Fetching bookmarks for export for user ${userId} with where clause: ${JSON.stringify(whereClause)}`);
    const bookmarks = await prisma.bookmark.findMany({
        where: whereClause,
        include: {
            tags: { select: { tag: { select: { name: true } } } }, 
            folders: { select: { folder: { select: { id: true } } } } // Only need folder IDs to map
        },
        orderBy: { createdAt: 'asc' } 
    });
    logger.info(`Found ${bookmarks.length} bookmarks to export for user ${userId}.`);

    // 4. Build Hierarchy Map (for HTML/JSON export)
    const folderMapForExport: Record<string, FolderHierarchyNode> = {};
    allRelevantFolders.forEach(f => {
        folderMapForExport[f.id] = { ...f, children: [], bookmarks: [] };
    });
    const VIRTUAL_ROOT_ID = 'root'; 
    if (!rootFolderIdForHierarchy) {
         folderMapForExport[VIRTUAL_ROOT_ID] = { 
             id: VIRTUAL_ROOT_ID, name: 'Bookmarks Bar', 
             userId: userId, parentId: null, createdAt: new Date(), updatedAt: new Date(), 
             description: null, icon: null, color: null, 
             children: [], bookmarks: [] 
            };
    }

    // Assign bookmarks to their folders in the map
    bookmarks.forEach(b => {
        let placedInFolder = false;
        if (b.folders.length > 0) {
            b.folders.forEach(fb => {
                const folderMFE = folderMapForExport[fb.folder.id];
                if (folderMFE) { 
                    // Use type assertion carefully, ensure 'b' matches expected structure
                    folderMFE.bookmarks.push(b as unknown as Bookmark & { tags: { tag: { name: string } }[] }); 
                    placedInFolder = true;
                }
            });
        } 
        // If exporting all and bookmark wasn't placed in a specific folder, add to virtual root
        if (!placedInFolder && !rootFolderIdForHierarchy && folderMapForExport[VIRTUAL_ROOT_ID]) { 
             // Use type assertion carefully
            folderMapForExport[VIRTUAL_ROOT_ID].bookmarks.push(b as unknown as Bookmark & { tags: { tag: { name: string } }[] });
        }
    });

     // Build the tree structure within the map
     Object.values(folderMapForExport).forEach(folder => {
         if (folder.id !== VIRTUAL_ROOT_ID && folder.parentId) {
            const folderMFE = folderMapForExport[folder.parentId];
            if (folderMFE) folderMFE.children.push(folder);
         } else if (folder.id !== VIRTUAL_ROOT_ID && !folder.parentId && !rootFolderIdForHierarchy && folderMapForExport[VIRTUAL_ROOT_ID]) {
             folderMapForExport[VIRTUAL_ROOT_ID].children.push(folder);
         }
     });

    // 5. Format output
    try {
        logger.debug(`Formatting export data as ${format}`);
        // Determine the starting node for hierarchical formats
        const rootNode = folderMapForExport[rootFolderIdForHierarchy || VIRTUAL_ROOT_ID]; 
        // Add a check for rootNode existence before proceeding with hierarchical formats
        if (!rootNode && (format === 'html' || format === 'json')) {
             logger.error("Root node for hierarchy not found during export formatting.");
             throw new ImportExportError('Failed to build export hierarchy.', 500);
        }

        if(rootNode) {
        switch (format) {
            case 'json':
                const jsonRootNode = buildJsonFolderNode(rootNode); 
                const jsonOutput = {
                    checksum: "dummy_checksum", 
                    roots: { bookmarks_bar: jsonRootNode }, version: 1
                };
                return { 
                    contentType: 'application/json', 
                    data: JSON.stringify(jsonOutput, null, 2),
                    filename: 'bookmarks.json' 
                };

            case 'html':
                let html = '<!DOCTYPE NETSCAPE-Bookmark-file-1>\n';
                html += '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n';
                html += '<TITLE>Bookmarks</TITLE>\n<H1>Bookmarks</H1>\n<DL><p>\n';
                // Build the nested DL structure recursively from the root node
                html += buildHtmlFolderNode(rootNode); 
                html += '</DL><p>\n';
                return { 
                    contentType: 'text/html', 
                    data: html, 
                    filename: 'bookmarks.html' 
                };

            case 'csv':
                 // CSV remains flat
                 const escapeCsv = (field: string | null | undefined): string => {
                    if (field === null || field === undefined) return '';
                    const str = String(field);
                    if (str.includes('"') || str.includes(',') || str.includes('\n')) {
                        return `"${str.replace(/"/g, '""')}"`;
                    }
                    return str;
                 };
                 const headers = ['URL', 'Title', 'Description', 'Notes', 'CreatedDate', 'Tags', 'Folders']; 
                 const rows = bookmarks.map(b => [
                     escapeCsv(b.url), escapeCsv(b.title), escapeCsv(b.description), escapeCsv(b.notes), 
                     b.createdAt.toISOString(), 
                     escapeCsv(b.tags.map(t => t.tag.name).join(';')), 
                     // Get folder names from the map using the IDs associated with the bookmark
                     escapeCsv(b.folders.map(f => folderMapForExport[f.folder.id]?.name || '').filter(name => name).join(';')) 
                 ].join(',')); 
                 const csv = [headers.join(','), ...rows].join('\n');
                 return { 
                    contentType: 'text/csv', 
                    data: csv, 
                    filename: 'bookmarks.csv' 
                 };

            default:
                throw new ImportExportError(`Unsupported export format: ${format}`, 400);
        }
        }
    } catch (error) {
        logger.error(`[Export Service]: Error formatting data for ${format}:`, error);
        throw new ImportExportError(`Failed to format data for ${format}`, 500);
    }
};
