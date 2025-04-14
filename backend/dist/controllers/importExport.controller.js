"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportExportController = exports.upload = void 0;
const client_1 = require("@prisma/client"); // Import Prisma namespace for error types
const zod_1 = require("zod");
const uuid_1 = require("uuid");
const cheerio = __importStar(require("cheerio"));
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const csv_writer_1 = require("csv-writer");
const metadata_1 = require("../utils/metadata"); // Corrected import
const prisma = new client_1.PrismaClient();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // Create the uploads directory if it doesn't exist
        const uploadPath = path_1.default.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
    fileFilter: (req, file, cb) => {
        // Accept HTML, JSON and CSV files
        if (file.mimetype === 'text/html' ||
            file.mimetype === 'application/json' ||
            file.mimetype === 'text/csv' ||
            file.mimetype === 'application/x-chrome-bookmarks') {
            cb(null, true);
        }
        else {
            cb(new Error('Unsupported file type'));
        }
    }
});
// Validation schemas
const exportOptionsSchema = zod_1.z.object({
    format: zod_1.z.enum(['html', 'json', 'csv']),
    folderId: zod_1.z.string().optional(),
    tagIds: zod_1.z.array(zod_1.z.string()).optional(),
    includeMetadata: zod_1.z.boolean().optional().default(true),
});
exports.ImportExportController = {
    // Import bookmarks from an HTML file (browser export format)
    importFromHTML: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
            }
            const userId = req.user.id; // Added non-null assertion
            const filePath = req.file.path; // Added non-null assertion
            const folderId = req.body.folderId || null;
            // Verify folder exists if provided
            if (folderId) {
                const folder = await prisma.folder.findFirst({
                    where: {
                        id: folderId,
                        userId,
                    }
                });
                if (!folder) {
                    // Delete the uploaded file
                    fs.unlinkSync(filePath);
                    return res.status(404).json({
                        success: false,
                        message: 'Target folder not found'
                    });
                }
            }
            // Read the HTML file
            const htmlContent = fs.readFileSync(filePath, 'utf-8');
            const $ = cheerio.load(htmlContent);
            // Process bookmarks
            const importedBookmarks = []; // Added type
            const failedBookmarks = []; // Added type
            // Find all <a> tags (bookmarks)
            const promises = $('a').map(async (_, element) => {
                try {
                    const url = $(element).attr('href');
                    if (!url || !url.startsWith('http'))
                        return; // Skip invalid URLs
                    const title = $(element).text().trim() || url;
                    const addDate = $(element).attr('add_date'); // Firefox/Chrome add date
                    const created = addDate ? new Date(parseInt(addDate) * 1000) : new Date();
                    // Fetch metadata (title, description, favicon)
                    let metadata = { title, description: '', favicon: '', previewImage: '' };
                    try {
                        metadata = await (0, metadata_1.fetchUrlMetadata)(url);
                    }
                    catch (err) { // Added type
                        console.error(`Error fetching metadata for ${url}:`, err);
                        // Use default metadata on error
                    }
                    // Create the bookmark
                    const bookmark = await prisma.bookmark.create({
                        data: {
                            id: (0, uuid_1.v4)(),
                            url,
                            title: title || metadata.title || url,
                            description: metadata.description || '',
                            favicon: metadata.favicon || '',
                            previewImage: metadata.previewImage || metadata.image || '', // Use previewImage, fallback to image
                            user: {
                                connect: { id: userId }
                            },
                            createdAt: created
                        }
                    });
                    // Add to folder if provided
                    if (folderId) {
                        await prisma.folderBookmark.create({
                            data: {
                                folderId: folderId,
                                bookmarkId: bookmark.id
                            }
                        });
                    }
                    importedBookmarks.push(bookmark);
                }
                catch (err) { // Added type
                    console.error(`Error importing bookmark:`, err);
                    failedBookmarks.push({ url: $(element).attr('href') ?? undefined, title: $(element).text() ?? undefined, error: err.message }); // Added nullish coalescing
                }
            }).get();
            await Promise.all(promises);
            // Delete the uploaded file
            fs.unlinkSync(filePath);
            return res.status(200).json({
                success: true,
                message: `Successfully imported ${importedBookmarks.length} bookmarks`,
                data: {
                    imported: importedBookmarks.length,
                    failed: failedBookmarks.length,
                    failedDetails: failedBookmarks
                }
            });
        }
        catch (error) { // Added type
            console.error('Error importing bookmarks from HTML:', error);
            // Delete the uploaded file if it exists
            if (req.file && fs.existsSync(req.file.path)) { // Added non-null assertion
                fs.unlinkSync(req.file.path); // Added non-null assertion
            }
            return res.status(500).json({
                success: false,
                message: 'Failed to import bookmarks',
                error: error.message
            });
        }
    },
    // Import bookmarks from a JSON file
    importFromJSON: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
            }
            const userId = req.user.id; // Added non-null assertion
            const filePath = req.file.path; // Added non-null assertion
            const folderId = req.body.folderId || null;
            // Verify folder exists if provided
            if (folderId) {
                const folder = await prisma.folder.findFirst({
                    where: {
                        id: folderId,
                        userId,
                    }
                });
                if (!folder) {
                    // Delete the uploaded file
                    fs.unlinkSync(filePath);
                    return res.status(404).json({
                        success: false,
                        message: 'Target folder not found'
                    });
                }
            }
            // Read the JSON file
            const jsonContent = fs.readFileSync(filePath, 'utf-8');
            let bookmarksData; // Changed to any for initial parse
            try {
                bookmarksData = JSON.parse(jsonContent);
            }
            catch (err) { // Added type
                // Delete the uploaded file
                fs.unlinkSync(filePath);
                return res.status(400).json({
                    success: false,
                    message: 'Invalid JSON file'
                });
            }
            // Ensure bookmarksData is an array
            if (!Array.isArray(bookmarksData)) {
                // Check if it's a Chrome bookmarks JSON (which has a specific structure)
                if (bookmarksData.roots && (bookmarksData.roots.bookmark_bar || bookmarksData.roots.other)) {
                    // Extract bookmarks from Chrome format
                    bookmarksData = extractChromeBookmarks(bookmarksData);
                }
                else {
                    // Delete the uploaded file
                    fs.unlinkSync(filePath);
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid bookmarks format'
                    });
                }
            }
            // Process bookmarks
            const importedBookmarks = []; // Added type
            const failedBookmarks = []; // Added type
            for (const item of bookmarksData) {
                try {
                    // Skip if no URL or not starting with http
                    if (!item.url || (typeof item.url === 'string' && !item.url.startsWith('http'))) {
                        continue;
                    }
                    // Create the bookmark
                    const bookmark = await prisma.bookmark.create({
                        data: {
                            id: (0, uuid_1.v4)(),
                            url: item.url,
                            title: item.title || item.name || item.url,
                            description: item.description || '',
                            favicon: item.favicon || '',
                            previewImage: item.previewImage || item.image || '', // Corrected field name, fallback to image
                            user: {
                                connect: { id: userId }
                            },
                            // ...(folderId ? { folder: { connect: { id: folderId } } } : {}), // Folder relation is many-to-many
                            ...(item.createdAt ? { createdAt: new Date(item.createdAt) } : {})
                        }
                    });
                    // Add to folder if provided
                    if (folderId) {
                        await prisma.folderBookmark.create({
                            data: {
                                folderId: folderId,
                                bookmarkId: bookmark.id
                            }
                        });
                    }
                    // Handle tags if present
                    if (Array.isArray(item.tags) && item.tags.length > 0) {
                        for (const tagName of item.tags) {
                            // Find or create the tag
                            let tag = await prisma.tag.findFirst({
                                where: {
                                    name: tagName,
                                    userId
                                }
                            });
                            if (!tag) {
                                tag = await prisma.tag.create({
                                    data: {
                                        id: (0, uuid_1.v4)(),
                                        name: tagName,
                                        user: {
                                            connect: { id: userId }
                                        }
                                    }
                                });
                            }
                            // Create the bookmark-tag association
                            await prisma.bookmarkTag.create({
                                data: {
                                    bookmarkId: bookmark.id,
                                    tagId: tag.id
                                }
                            });
                        }
                    }
                    importedBookmarks.push(bookmark);
                }
                catch (err) { // Added type
                    console.error(`Error importing bookmark:`, err);
                    failedBookmarks.push({ url: item.url, title: item.title, error: err.message });
                }
            }
            // Delete the uploaded file
            fs.unlinkSync(filePath);
            return res.status(200).json({
                success: true,
                message: `Successfully imported ${importedBookmarks.length} bookmarks`,
                data: {
                    imported: importedBookmarks.length,
                    failed: failedBookmarks.length,
                    failedDetails: failedBookmarks
                }
            });
        }
        catch (error) { // Added type
            console.error('Error importing bookmarks from JSON:', error);
            // Delete the uploaded file if it exists
            if (req.file && fs.existsSync(req.file.path)) { // Added non-null assertion
                fs.unlinkSync(req.file.path); // Added non-null assertion
            }
            return res.status(500).json({
                success: false,
                message: 'Failed to import bookmarks',
                error: error.message
            });
        }
    },
    // Import bookmarks from a CSV file
    importFromCSV: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
            }
            const userId = req.user.id; // Added non-null assertion
            const filePath = req.file.path; // Added non-null assertion
            const folderId = req.body.folderId || null;
            // Verify folder exists if provided
            if (folderId) {
                const folder = await prisma.folder.findFirst({
                    where: {
                        id: folderId,
                        userId,
                    }
                });
                if (!folder) {
                    // Delete the uploaded file
                    fs.unlinkSync(filePath);
                    return res.status(404).json({
                        success: false,
                        message: 'Target folder not found'
                    });
                }
            }
            // Read the CSV file
            const csvContent = fs.readFileSync(filePath, 'utf-8');
            const lines = csvContent.split('\n');
            // Detect headers (first line)
            const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
            // Check for required 'url' column
            if (!headers.includes('url')) {
                // Delete the uploaded file
                fs.unlinkSync(filePath);
                return res.status(400).json({
                    success: false,
                    message: 'CSV file must contain a "url" column'
                });
            }
            // Index positions for each field
            const urlIndex = headers.indexOf('url');
            const titleIndex = headers.indexOf('title');
            const descriptionIndex = headers.indexOf('description');
            const faviconIndex = headers.indexOf('favicon');
            const imageIndex = headers.indexOf('image'); // Keep this for reading CSV
            const tagsIndex = headers.indexOf('tags');
            // Process bookmarks
            const importedBookmarks = []; // Added type
            const failedBookmarks = []; // Added type
            // Start from line 1 (skipping headers)
            for (let i = 1; i < lines.length; i++) {
                // Skip empty lines
                if (!lines[i].trim())
                    continue;
                // Split CSV line, handling quoted values
                const values = parseCSVLine(lines[i]);
                try {
                    const url = urlIndex >= 0 ? values[urlIndex] : null;
                    // Skip if no URL or not starting with http
                    if (!url || !url.startsWith('http')) {
                        continue;
                    }
                    // Extract other fields if available
                    const title = titleIndex >= 0 && values[titleIndex] ? values[titleIndex] : url;
                    const description = descriptionIndex >= 0 ? values[descriptionIndex] || '' : '';
                    const favicon = faviconIndex >= 0 ? values[faviconIndex] || '' : '';
                    const image = imageIndex >= 0 ? values[imageIndex] || '' : ''; // Read image value
                    // Create the bookmark
                    const bookmark = await prisma.bookmark.create({
                        data: {
                            id: (0, uuid_1.v4)(),
                            url,
                            title,
                            description,
                            favicon,
                            previewImage: image, // Corrected field name assignment
                            user: {
                                connect: { id: userId } // Added non-null assertion
                            },
                            // ...(folderId ? { folder: { connect: { id: folderId } } } : {}), // Folder relation is many-to-many
                        }
                    });
                    // Add to folder if provided
                    if (folderId) {
                        await prisma.folderBookmark.create({
                            data: {
                                folderId: folderId,
                                bookmarkId: bookmark.id
                            }
                        });
                    }
                    // Handle tags if present
                    if (tagsIndex >= 0 && values[tagsIndex]) {
                        const tagNames = values[tagsIndex].split(',').map(t => t.trim()).filter(t => !!t);
                        for (const tagName of tagNames) {
                            // Find or create the tag
                            let tag = await prisma.tag.findFirst({
                                where: {
                                    name: tagName,
                                    userId
                                }
                            });
                            if (!tag) {
                                tag = await prisma.tag.create({
                                    data: {
                                        id: (0, uuid_1.v4)(),
                                        name: tagName,
                                        user: {
                                            connect: { id: userId }
                                        }
                                    }
                                });
                            }
                            // Create the bookmark-tag association
                            await prisma.bookmarkTag.create({
                                data: {
                                    bookmarkId: bookmark.id,
                                    tagId: tag.id
                                }
                            });
                        }
                    }
                    importedBookmarks.push(bookmark);
                }
                catch (err) { // Added type
                    console.error(`Error importing bookmark:`, err);
                    failedBookmarks.push({ url: values[urlIndex] ?? undefined, error: err.message }); // Added nullish coalescing
                }
            }
            // Delete the uploaded file
            fs.unlinkSync(filePath);
            return res.status(200).json({
                success: true,
                message: `Successfully imported ${importedBookmarks.length} bookmarks`,
                data: {
                    imported: importedBookmarks.length,
                    failed: failedBookmarks.length,
                    failedDetails: failedBookmarks
                }
            });
        }
        catch (error) { // Added type
            console.error('Error importing bookmarks from CSV:', error);
            // Delete the uploaded file if it exists
            if (req.file && fs.existsSync(req.file.path)) { // Added non-null assertion
                fs.unlinkSync(req.file.path); // Added non-null assertion
            }
            return res.status(500).json({
                success: false,
                message: 'Failed to import bookmarks',
                error: error.message
            });
        }
    },
    // Export bookmarks to HTML format
    exportToHTML: async (req, res) => {
        try {
            const userId = req.user.id; // Added non-null assertion
            const { folderId, tagIds } = req.query;
            // Build the query
            const whereClause = { userId }; // Use Prisma type
            if (folderId) {
                whereClause.folders = { some: { folderId: folderId } };
            }
            if (tagIds) {
                const tagIdsArray = tagIds.split(',');
                whereClause.tags = {
                    some: {
                        tagId: { in: tagIdsArray }
                    }
                };
            }
            // Get the bookmarks
            const bookmarks = await prisma.bookmark.findMany({
                where: whereClause,
                include: {
                    folders: { include: { folder: true } }, // Correct include
                    tags: {
                        include: {
                            tag: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            // Generate HTML
            let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
`;
            // Group bookmarks by folder
            const folderMap = new Map(); // Added type
            // Add bookmarks without folders first
            const noFolderBookmarks = bookmarks.filter(b => b.folders.length === 0); // Corrected filter
            if (noFolderBookmarks.length > 0) {
                html += `    <DT><H3>Unsorted Bookmarks</H3>\n    <DL><p>\n`;
                for (const bookmark of noFolderBookmarks) {
                    const addDate = Math.floor(bookmark.createdAt.getTime() / 1000);
                    const tags = bookmark.tags.map((t) => t.tag.name).join(', '); // Added type
                    html += `        <DT><A HREF="${bookmark.url}" ADD_DATE="${addDate}" TAGS="${tags}">${bookmark.title}</A>\n`;
                }
                html += `    </DL><p>\n`;
            }
            // Group remaining bookmarks by folder
            for (const bookmark of bookmarks.filter(b => b.folders.length > 0)) { // Corrected filter
                for (const folderRel of bookmark.folders) { // Iterate through folders
                    const currentFolderId = folderRel.folderId;
                    const folderName = folderRel.folder.name;
                    if (!folderMap.has(currentFolderId)) {
                        folderMap.set(currentFolderId, {
                            name: folderName,
                            bookmarks: []
                        });
                    }
                    // Ensure bookmarks array exists before pushing
                    const folderData = folderMap.get(currentFolderId);
                    if (folderData) {
                        folderData.bookmarks.push(bookmark);
                    }
                }
            }
            // Add folder groups
            for (const [, folderData] of folderMap) {
                html += `    <DT><H3>${folderData.name}</H3>\n    <DL><p>\n`;
                for (const bookmark of folderData.bookmarks) {
                    const addDate = Math.floor(bookmark.createdAt.getTime() / 1000);
                    const tags = bookmark.tags.map((t) => t.tag.name).join(', '); // Added type
                    html += `        <DT><A HREF="${bookmark.url}" ADD_DATE="${addDate}" TAGS="${tags}">${bookmark.title}</A>\n`;
                }
                html += `    </DL><p>\n`;
            }
            html += `</DL><p>`;
            // Set headers for download
            res.setHeader('Content-Type', 'text/html');
            res.setHeader('Content-Disposition', 'attachment; filename="bookmarks.html"');
            return res.status(200).send(html);
        }
        catch (error) { // Added type
            console.error('Error exporting bookmarks to HTML:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to export bookmarks',
                error: error.message
            });
        }
    },
    // Export bookmarks to JSON format
    exportToJSON: async (req, res) => {
        try {
            const userId = req.user.id; // Added non-null assertion
            const { folderId, tagIds, includeMetadata } = req.query;
            const includeMeta = includeMetadata !== 'false';
            // Build the query
            const whereClause = { userId }; // Use Prisma type
            if (folderId) {
                whereClause.folders = { some: { folderId: folderId } };
            }
            if (tagIds) {
                const tagIdsArray = tagIds.split(',');
                whereClause.tags = {
                    some: {
                        tagId: { in: tagIdsArray }
                    }
                };
            }
            // Get the bookmarks
            const bookmarks = await prisma.bookmark.findMany({
                where: whereClause,
                include: {
                    folders: { include: { folder: true } }, // Correct include
                    tags: {
                        include: {
                            tag: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            // Transform bookmarks to desired JSON format
            const jsonBookmarks = bookmarks.map(bookmark => {
                const result = {
                    url: bookmark.url,
                    title: bookmark.title,
                    createdAt: bookmark.createdAt.toISOString(),
                    updatedAt: bookmark.updatedAt.toISOString(),
                    folders: bookmark.folders.map((f) => f.folder.name), // Added type
                    tags: bookmark.tags.map((t) => t.tag.name) // Added type
                };
                // Include metadata if requested
                if (includeMeta) {
                    result.description = bookmark.description;
                    result.favicon = bookmark.favicon;
                    result.previewImage = bookmark.previewImage; // Corrected field name
                }
                return result;
            });
            // Set headers for download
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', 'attachment; filename="bookmarks.json"');
            return res.status(200).json(jsonBookmarks);
        }
        catch (error) { // Added type
            console.error('Error exporting bookmarks to JSON:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to export bookmarks',
                error: error.message
            });
        }
    },
    // Export bookmarks to CSV format
    exportToCSV: async (req, res) => {
        try {
            const userId = req.user.id; // Added non-null assertion
            const { folderId, tagIds, includeMetadata } = req.query;
            const includeMeta = includeMetadata !== 'false';
            // Build the query
            const whereClause = { userId }; // Use Prisma type
            if (folderId) {
                whereClause.folders = { some: { folderId: folderId } };
            }
            if (tagIds) {
                const tagIdsArray = tagIds.split(',');
                whereClause.tags = {
                    some: {
                        tagId: { in: tagIdsArray }
                    }
                };
            }
            // Get the bookmarks
            const bookmarks = await prisma.bookmark.findMany({
                where: whereClause,
                include: {
                    folders: { include: { folder: true } }, // Correct include
                    tags: {
                        include: {
                            tag: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            // Create a temp file for CSV
            const tempFilePath = path_1.default.join(__dirname, '../../temp', `bookmarks-${Date.now()}.csv`);
            // Ensure temp directory exists
            const tempDir = path_1.default.dirname(tempFilePath);
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }
            // Define CSV headers
            const headers = [
                { id: 'url', title: 'URL' },
                { id: 'title', title: 'Title' },
                { id: 'folders', title: 'Folders' }, // Corrected header id
                { id: 'tags', title: 'Tags' },
                { id: 'createdAt', title: 'Created At' }
            ];
            // Add metadata headers if requested
            if (includeMeta) {
                headers.push({ id: 'description', title: 'Description' }, { id: 'favicon', title: 'Favicon' }, { id: 'previewImage', title: 'Preview Image' } // Corrected header id and title
                );
            }
            // Create CSV writer
            const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
                path: tempFilePath,
                header: headers
            });
            // Transform bookmarks for CSV
            const csvBookmarks = bookmarks.map(bookmark => {
                const result = {
                    url: bookmark.url,
                    title: bookmark.title,
                    folders: bookmark.folders.map((f) => f.folder.name).join(', '), // Corrected field name and added type
                    tags: bookmark.tags.map((t) => t.tag.name).join(', '), // Added type
                    createdAt: bookmark.createdAt.toISOString()
                };
                // Include metadata if requested
                if (includeMeta) {
                    result.description = bookmark.description || '';
                    result.favicon = bookmark.favicon || '';
                    result.previewImage = bookmark.previewImage || ''; // Corrected field name
                }
                return result;
            });
            // Write data to CSV file
            await csvWriter.writeRecords(csvBookmarks);
            // Read the CSV file
            const csvContent = fs.readFileSync(tempFilePath, 'utf-8');
            // Delete the temp file
            fs.unlinkSync(tempFilePath);
            // Set headers for download
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="bookmarks.csv"');
            return res.status(200).send(csvContent);
        }
        catch (error) { // Added type
            console.error('Error exporting bookmarks to CSV:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to export bookmarks',
                error: error.message
            });
        }
    },
    // Export bookmarks - router to appropriate format handler
    exportBookmarks: async (req, res) => {
        try {
            // Validate export options
            const validatedOptions = exportOptionsSchema.safeParse(req.query);
            if (!validatedOptions.success) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid export options',
                    errors: validatedOptions.error.errors
                });
            }
            const { format } = validatedOptions.data;
            // Route to appropriate handler
            switch (format) {
                case 'html':
                    return await exports.ImportExportController.exportToHTML(req, res);
                case 'json':
                    return await exports.ImportExportController.exportToJSON(req, res);
                case 'csv':
                    return await exports.ImportExportController.exportToCSV(req, res);
                default:
                    return res.status(400).json({
                        success: false,
                        message: 'Unsupported export format'
                    });
            }
        }
        catch (error) { // Added type
            console.error('Error exporting bookmarks:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to export bookmarks',
                error: error.message
            });
        }
    }
};
// Helper function to extract bookmarks from Chrome JSON format
function extractChromeBookmarks(chromeData) {
    const bookmarks = []; // Added type
    function processNode(node) {
        if (node.type === 'url') {
            bookmarks.push({
                url: node.url,
                title: node.name,
                createdAt: new Date(parseInt(node.date_added) / 1000), // Convert from microseconds (Chrome uses string)
            });
        }
        else if (node.children) {
            for (const child of node.children) {
                processNode(child);
            }
        }
    }
    // Process bookmark bar and other folders
    if (chromeData.roots.bookmark_bar) {
        processNode(chromeData.roots.bookmark_bar);
    }
    if (chromeData.roots.other) {
        processNode(chromeData.roots.other);
    }
    return bookmarks;
}
// Helper function to parse a CSV line, handling quoted values
function parseCSVLine(line) {
    const result = [];
    let inQuotes = false;
    let currentValue = '';
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            // Handle escaped quotes ""
            if (inQuotes && line[i + 1] === '"') {
                currentValue += '"';
                i++; // Skip next quote
            }
            else {
                inQuotes = !inQuotes;
            }
        }
        else if (char === ',' && !inQuotes) {
            result.push(currentValue);
            currentValue = '';
        }
        else {
            currentValue += char;
        }
    }
    // Don't forget the last value
    result.push(currentValue);
    return result;
}
exports.default = exports.ImportExportController;
//# sourceMappingURL=importExport.controller.js.map