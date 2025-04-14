import prisma from '../config/db';
import { Prisma, Bookmark, Role, Folder, Tag, Collection } from '@prisma/client'; // Import necessary types
import logger from '../config/logger';
import { emitToUser, SOCKET_EVENTS } from './socket.service'; // For emitting updates
import { FolderError } from './folder.service'; // Import FolderError for folder checks
import { TagError } from './tag.service'; // Import TagError
import { CollectionError } from './collection.service'; // Import CollectionError
import { v4 as uuidv4 } from 'uuid'; // For collection public links

// --- Types ---

/** Structure for a single bookmark change sent by the client. */
export type ClientBookmarkChange = { // Exported
    id: string; url?: string; title?: string; description?: string; notes?: string;
    updatedAt: string; lastServerUpdatedAt?: string; isDeleted?: boolean; 
    folderIds?: string[]; tagIds?: string[]; 
};

/** Structure for a single folder change sent by the client. */
export type ClientFolderChange = { // Exported
    id: string; name?: string; description?: string | null; icon?: string | null;
    color?: string | null; parentId?: string | null; 
    updatedAt: string; lastServerUpdatedAt?: string; 
    isDeleted?: boolean; 
};

/** Structure for a single tag change sent by the client. */
export type ClientTagChange = { // Exported
    id: string; name?: string; color?: string | null;
    updatedAt: string; lastServerUpdatedAt?: string; 
    isDeleted?: boolean; 
};

/** Structure for a single collection change sent by the client. */
export type ClientCollectionChange = { // Exported
    id: string; name?: string; description?: string | null; isPublic?: boolean;
    thumbnail?: string | null; 
    updatedAt: string; lastServerUpdatedAt?: string; 
    isDeleted?: boolean; 
};

/** Structure expected in the request body */
export type ClientChangesPayload = { // Exported
    bookmarks?: ClientBookmarkChange[];
    folders?: ClientFolderChange[];
    tags?: ClientTagChange[];
    collections?: ClientCollectionChange[];
};

/** Union type for different client change types */
export type AnyClientChange = ClientBookmarkChange | ClientFolderChange | ClientTagChange | ClientCollectionChange; // Exported
/** Union type for different server record types */
export type AnyServerRecord = Bookmark | Folder | Tag | Collection; // Exported

/** Structure for the overall sync response sent back to the client. */
export type SyncResponse = { // Exported
    success: boolean; 
    serverChanges: any[]; 
    deletedIds: { bookmarks: string[]; folders: string[]; tags: string[]; collections: string[]; }; 
    conflicts: { 
        type: 'bookmark' | 'folder' | 'tag' | 'collection'; 
        clientChange: AnyClientChange; 
        serverRecord: AnyServerRecord | { error: string } 
    }[]; 
    newSyncTimestamp: string; 
    message?: string; 
};

/** Custom error class for sync-related service errors. */
export class SyncError extends Error {
    public statusCode: number;
    constructor(message: string, statusCode: number = 500) { 
        super(message); this.name = 'SyncError'; this.statusCode = statusCode;
    }
}

// --- Helper Functions ---

/** Synchronizes the folder and tag relationships for a given bookmark within a transaction. */
const syncBookmarkRelations = async ( tx: Prisma.TransactionClient, userId: string, bookmarkId: string, clientFolderIds?: string[], clientTagIds?: string[] ) => {
    // Folder Sync Logic
    if (clientFolderIds !== undefined) { 
        const currentFolders = await tx.folderBookmark.findMany({ where: { bookmarkId }, select: { folderId: true } });
        const currentFolderIdSet = new Set(currentFolders.map(f => f.folderId));
        const clientFolderIdSet = new Set(clientFolderIds);
        const foldersToAdd = clientFolderIds.filter(id => !currentFolderIdSet.has(id));
        const foldersToRemove = currentFolders.filter(f => !clientFolderIdSet.has(f.folderId)).map(f => f.folderId);
        if (foldersToAdd.length > 0) {
             const accessibleFolders = await tx.folder.count({ where: { id: { in: foldersToAdd }, userId } });
             if (accessibleFolders !== foldersToAdd.length) throw new Error(`Permission denied for adding bookmark ${bookmarkId} to one or more folders.`); 
             await tx.folderBookmark.createMany({ data: foldersToAdd.map(folderId => ({ bookmarkId, folderId })), skipDuplicates: true });
        }
        if (foldersToRemove.length > 0) await tx.folderBookmark.deleteMany({ where: { bookmarkId, folderId: { in: foldersToRemove } } });
    }
    // Tag Sync Logic
    if (clientTagIds !== undefined) { 
        const currentTags = await tx.bookmarkTag.findMany({ where: { bookmarkId }, select: { tagId: true } });
        const currentTagIdSet = new Set(currentTags.map(t => t.tagId));
        const clientTagIdSet = new Set(clientTagIds);
        const tagsToAdd = clientTagIds.filter(id => !currentTagIdSet.has(id));
        const tagsToRemove = currentTags.filter(t => !clientTagIdSet.has(t.tagId)).map(t => t.tagId);
        if (tagsToAdd.length > 0) {
             const accessibleTags = await tx.tag.count({ where: { id: { in: tagsToAdd }, userId } });
             if (accessibleTags !== tagsToAdd.length) throw new Error(`One or more tags not found or not owned by user for bookmark ${bookmarkId}.`); 
             await tx.bookmarkTag.createMany({ data: tagsToAdd.map(tagId => ({ bookmarkId, tagId })), skipDuplicates: true });
        }
        if (tagsToRemove.length > 0) await tx.bookmarkTag.deleteMany({ where: { bookmarkId, tagId: { in: tagsToRemove } } });
    }
};

/** Checks for circular folder references */
const wouldCreateCircularReferenceInternal = async ( folderId: string, newParentId: string | null, userId: string, tx: Prisma.TransactionClient ): Promise<boolean> => {
    if (!newParentId) return false; 
    if (folderId === newParentId) return true; 
    const descendantIds = await getAllDescendantFolderIds(folderId, userId, tx);
    return descendantIds.includes(newParentId);
};

/** Recursively retrieves all descendant folder IDs */
const getAllDescendantFolderIds = async (folderId: string, userId: string, txOrPrisma: Prisma.TransactionClient | typeof prisma): Promise<string[]> => {
    const folders = await txOrPrisma.folder.findMany({ where: { parentId: folderId, userId }, select: { id: true } });
    const childIds = folders.map(f => f.id);
    if (childIds.length === 0) return [];
    const descendantIds: string[] = [...childIds];
    for (const childId of childIds) {
        const descendants = await getAllDescendantFolderIds(childId, userId, txOrPrisma); 
        descendantIds.push(...descendants);
    }
    return descendantIds;
};


/** Main synchronization function. */
export const syncData = async ( userId: string, lastSyncTimestamp: string | null, clientChangesPayload: ClientChangesPayload ): Promise<SyncResponse> => {
    const syncStartTime = new Date(); 
    const lastSyncDate = lastSyncTimestamp ? new Date(lastSyncTimestamp) : new Date(0); 
    logger.info(`[Sync Service] Starting sync for user ${userId}. Last sync: ${lastSyncTimestamp || 'Never'}`);

    const serverChanges: any[] = []; 
    const deletedIds = { bookmarks: [], folders: [], tags: [], collections: [] }; 
    const conflicts: SyncResponse['conflicts'] = []; 
    const processedClientIds = { bookmarks: new Set<string>(), folders: new Set<string>(), tags: new Set<string>(), collections: new Set<string>() }; 

    try {
        // --- 1. Get Server Changes Since Last Sync ---
        logger.debug(`[Sync Service] Fetching server changes since ${lastSyncDate.toISOString()}`);
        
        // Bookmarks
        const updatedBookmarks = await prisma.bookmark.findMany({ where: { userId, updatedAt: { gt: lastSyncDate }, isDeleted: false }, include: { tags: { select: { tag: { select: { id: true } } } }, folders: { select: { folder: { select: { id: true } } } } } });
        if (updatedBookmarks.length > 0) serverChanges.push(...updatedBookmarks.map(b => ({ type: 'bookmark', ...b }))); 
        const deletedBookmarks = await prisma.bookmark.findMany({ where: { userId, isDeleted: true, deletedAt: { gt: lastSyncDate } }, select: { id: true } });
        if (deletedBookmarks.length > 0) deletedIds.bookmarks.push(...deletedBookmarks.map(b => b.id));

        // Folders 
        const updatedFolders = await prisma.folder.findMany({ where: { userId, updatedAt: { gt: lastSyncDate }, isDeleted: false } }); 
        if (updatedFolders.length > 0) serverChanges.push(...updatedFolders.map(f => ({ type: 'folder', ...f })));
        const deletedFolders = await prisma.folder.findMany({ where: { userId, isDeleted: true, deletedAt: { gt: lastSyncDate } }, select: { id: true } });
        if (deletedFolders.length > 0) deletedIds.folders.push(...deletedFolders.map(f => f.id));

        // Tags 
        const updatedTags = await prisma.tag.findMany({ where: { userId, updatedAt: { gt: lastSyncDate }, isDeleted: false } }); 
        if (updatedTags.length > 0) serverChanges.push(...updatedTags.map(t => ({ type: 'tag', ...t })));
        const deletedTags = await prisma.tag.findMany({ where: { userId, isDeleted: true, deletedAt: { gt: lastSyncDate } }, select: { id: true } });
        if (deletedTags.length > 0) deletedIds.tags.push(...deletedTags.map(t => t.id));
        
        // Collections 
        const updatedCollections = await prisma.collection.findMany({ where: { userId, updatedAt: { gt: lastSyncDate }, isDeleted: false } }); 
        if (updatedCollections.length > 0) serverChanges.push(...updatedCollections.map(c => ({ type: 'collection', ...c })));
        const deletedCollections = await prisma.collection.findMany({ where: { userId, isDeleted: true, deletedAt: { gt: lastSyncDate } }, select: { id: true } });
        if (deletedCollections.length > 0) deletedIds.collections.push(...deletedCollections.map(c => c.id));

        logger.info(`[Sync Service] Found server changes - Bookmarks: ${updatedBookmarks.length}, Folders: ${updatedFolders.length}, Tags: ${updatedTags.length}, Collections: ${updatedCollections.length}.`);
        logger.info(`[Sync Service] Found server deletions - Bookmarks: ${deletedIds.bookmarks.length}, Folders: ${deletedIds.folders.length}, Tags: ${deletedIds.tags.length}, Collections: ${deletedIds.collections.length}.`);


        // --- 2. Process Client Changes ---
        
        // Process Bookmarks
        const clientBookmarkChanges = clientChangesPayload.bookmarks || [];
        if (clientBookmarkChanges.length > 0) {
             logger.info(`[Sync Service] Processing ${clientBookmarkChanges.length} client bookmark changes.`);
            for (const change of clientBookmarkChanges) {
                processedClientIds.bookmarks.add(change.id); 
                try {
                    await prisma.$transaction(async (tx) => {
                        const existing = await tx.bookmark.findUnique({ where: { id: change.id } });
                        if (change.isDeleted) {
                            if (existing?.userId === userId && !existing.isDeleted) {
                                await tx.bookmark.update({ where: { id: change.id }, data: { isDeleted: true, deletedAt: syncStartTime } });
                                emitToUser(userId, SOCKET_EVENTS.BOOKMARK_DELETED, { id: change.id });
                            }
                        } else if (existing) { // Update
                            if (existing.userId !== userId) return; 
                            if (existing.isDeleted) { conflicts.push({ type: 'bookmark', clientChange: change, serverRecord: existing }); return; }
                            const clientLastKnown = change.lastServerUpdatedAt ? new Date(change.lastServerUpdatedAt) : new Date(0);
                            if (existing.updatedAt > clientLastKnown) { conflicts.push({ type: 'bookmark', clientChange: change, serverRecord: existing }); return; }
                            
                            await tx.bookmark.update({ where: { id: change.id }, data: { url: change.url, title: change.title, description: change.description, notes: change.notes, updatedAt: syncStartTime } });
                            await syncBookmarkRelations(tx, userId, change.id, change.folderIds, change.tagIds);
                            const updated = await tx.bookmark.findUnique({ where: { id: change.id }, include: { tags: { select: { tag: { select: { id: true } } } }, folders: { select: { folder: { select: { id: true } } } } } });
                            if (updated) emitToUser(userId, SOCKET_EVENTS.BOOKMARK_UPDATED, updated);
                        } else { // Create
                            const created = await tx.bookmark.create({ data: { id: change.id, url: change.url || '', title: change.title || 'Untitled', description: change.description, notes: change.notes, userId, createdAt: syncStartTime, updatedAt: syncStartTime, isDeleted: false } });
                            await syncBookmarkRelations(tx, userId, created.id, change.folderIds, change.tagIds);
                            const createdWithRelations = await tx.bookmark.findUnique({ where: { id: created.id }, include: { tags: { select: { tag: { select: { id: true } } } }, folders: { select: { folder: { select: { id: true } } } } } });
                            if (createdWithRelations) emitToUser(userId, SOCKET_EVENTS.BOOKMARK_CREATED, createdWithRelations);
                        }
                    }); 
                } catch (error) {
                    logger.error(`[Sync Service] Failed processing bookmark change ${change.id}:`, error);
                    if (error instanceof Error) conflicts.push({ type: 'bookmark', clientChange: change, serverRecord: { error: error.message } });
                }
            }
        }

        // Process Folders
        const clientFolderChanges = clientChangesPayload.folders || [];
         if (clientFolderChanges.length > 0) {
             logger.info(`[Sync Service] Processing ${clientFolderChanges.length} client folder changes.`);
             for (const change of clientFolderChanges) {
                 processedClientIds.folders.add(change.id);
                 try {
                     await prisma.$transaction(async (tx) => {
                         const existing = await tx.folder.findUnique({ where: { id: change.id } });
                         if (change.isDeleted) {
                             if (existing?.userId === userId && !existing.isDeleted) {
                                 // Soft delete folder - check if bookmarks should be moved (cannot do easily here)
                                 logger.warn(`[Sync Tx] Soft deleting folder ${change.id}. Bookmarks inside might become orphaned if not moved separately.`);
                                 await tx.folder.update({ where: { id: change.id }, data: { isDeleted: true, deletedAt: syncStartTime } });
                                 emitToUser(userId, SOCKET_EVENTS.FOLDER_DELETED, { id: change.id });
                             }
                         } else if (existing) { // Update
                             if (existing.userId !== userId) return; 
                             if (existing.isDeleted) { conflicts.push({ type: 'folder', clientChange: change, serverRecord: existing }); return; }
                             const clientLastKnown = change.lastServerUpdatedAt ? new Date(change.lastServerUpdatedAt) : new Date(0);
                             if (existing.updatedAt > clientLastKnown) { conflicts.push({ type: 'folder', clientChange: change, serverRecord: existing }); return; }
                             
                             if (change.parentId !== undefined && change.parentId !== existing.parentId) {
                                 const wouldBeCircular = await wouldCreateCircularReferenceInternal(change.id, change.parentId ?? null, userId, tx);
                                 if (wouldBeCircular) throw new FolderError('Cannot move folder, would create circular reference', 400);
                             }
                             if ((change.name && change.name !== existing.name) || (change.parentId !== undefined && change.parentId !== existing.parentId)) {
                                 const effectiveParentId = change.parentId !== undefined ? change.parentId : existing.parentId;
                                 const nameToCheck = change.name || existing.name;
                                 const duplicate = await tx.folder.findFirst({ where: { name: nameToCheck, userId, parentId: effectiveParentId ?? null, id: { not: change.id } } });
                                 if (duplicate) throw new FolderError(`Folder name "${nameToCheck}" already exists at this level`, 409);
                             }

                             const updated = await tx.folder.update({ where: { id: change.id }, data: { name: change.name, description: change.description, icon: change.icon, color: change.color, parentId: change.parentId, updatedAt: syncStartTime, isDeleted: false, deletedAt: null } }); // Ensure delete flags are reset on update
                             emitToUser(userId, SOCKET_EVENTS.FOLDER_UPDATED, updated);
                         } else { // Create
                             const duplicate = await tx.folder.findFirst({ where: { name: change.name || 'Untitled', userId, parentId: change.parentId ?? null } });
                             if (duplicate) throw new FolderError(`Folder name "${change.name || 'Untitled'}" already exists at this level`, 409);
                             if (change.parentId) {
                                 const parentExists = await tx.folder.count({ where: { id: change.parentId, userId, isDeleted: false } }); // Check parent exists and isn't deleted
                                 if (parentExists === 0) throw new FolderError('Parent folder not found or is deleted', 404);
                             }
                             const created = await tx.folder.create({ data: { id: change.id, name: change.name || 'Untitled', description: change.description, icon: change.icon, color: change.color, parentId: change.parentId, userId, createdAt: syncStartTime, updatedAt: syncStartTime, isDeleted: false } });
                             emitToUser(userId, SOCKET_EVENTS.FOLDER_CREATED, created);
                         }
                     });
                 } catch (error) {
                     logger.error(`[Sync Service] Failed processing folder change ${change.id}:`, error);
                     if (error instanceof Error) conflicts.push({ type: 'folder', clientChange: change, serverRecord: { error: error.message } });
                 }
             }
         }

        // Process Tags
         const clientTagChanges = clientChangesPayload.tags || [];
         if (clientTagChanges.length > 0) {
             logger.info(`[Sync Service] Processing ${clientTagChanges.length} client tag changes.`);
              for (const change of clientTagChanges) {
                 processedClientIds.tags.add(change.id);
                 try {
                     await prisma.$transaction(async (tx) => {
                         const existing = await tx.tag.findUnique({ where: { id: change.id } });
                         if (change.isDeleted) {
                             if (existing?.userId === userId && !existing.isDeleted) {
                                 await tx.tag.update({ where: { id: change.id }, data: { isDeleted: true, deletedAt: syncStartTime } });
                                 emitToUser(userId, SOCKET_EVENTS.TAG_DELETED, { id: change.id });
                             }
                         } else if (existing) { // Update
                             if (existing.userId !== userId) return; 
                             if (existing.isDeleted) { conflicts.push({ type: 'tag', clientChange: change, serverRecord: existing }); return; }
                             const clientLastKnown = change.lastServerUpdatedAt ? new Date(change.lastServerUpdatedAt) : new Date(0);
                             if (existing.updatedAt > clientLastKnown) { conflicts.push({ type: 'tag', clientChange: change, serverRecord: existing }); return; }
                             
                             if (change.name && change.name !== existing.name) {
                                 const duplicate = await tx.tag.findFirst({ where: { name: change.name, userId, id: { not: change.id } } });
                                 if (duplicate) throw new TagError('Tag name already exists', 409);
                             }
                             const updated = await tx.tag.update({ where: { id: change.id }, data: { name: change.name, color: change.color, updatedAt: syncStartTime, isDeleted: false, deletedAt: null } }); // Reset delete flags
                             emitToUser(userId, SOCKET_EVENTS.TAG_UPDATED, updated);
                         } else { // Create
                             const duplicate = await tx.tag.findFirst({ where: { name: change.name || 'Untitled', userId } });
                             if (duplicate) throw new TagError('Tag name already exists', 409);
                             const created = await tx.tag.create({ data: { id: change.id, name: change.name || 'Untitled', color: change.color, userId, createdAt: syncStartTime, updatedAt: syncStartTime, isDeleted: false } });
                             emitToUser(userId, SOCKET_EVENTS.TAG_CREATED, created);
                         }
                     });
                 } catch (error) {
                     logger.error(`[Sync Service] Failed processing tag change ${change.id}:`, error);
                     if (error instanceof Error) conflicts.push({ type: 'tag', clientChange: change, serverRecord: { error: error.message } });
                 }
             }
         }

        // Process Collections
         const clientCollectionChanges = clientChangesPayload.collections || [];
         if (clientCollectionChanges.length > 0) {
             logger.info(`[Sync Service] Processing ${clientCollectionChanges.length} client collection changes.`);
              for (const change of clientCollectionChanges) {
                 processedClientIds.collections.add(change.id);
                 try {
                     await prisma.$transaction(async (tx) => {
                         const existing = await tx.collection.findUnique({ where: { id: change.id } });
                         if (change.isDeleted) {
                             if (existing?.userId === userId && !existing.isDeleted) { // Assuming owner deletes
                                 await tx.collection.update({ where: { id: change.id }, data: { isDeleted: true, deletedAt: syncStartTime } });
                                 emitToUser(userId, SOCKET_EVENTS.COLLECTION_DELETED, { id: change.id });
                                 // TODO: Notify collaborators?
                             }
                         } else if (existing) { // Update
                             if (existing.userId !== userId) return; // Only owner can update main fields?
                             if (existing.isDeleted) { conflicts.push({ type: 'collection', clientChange: change, serverRecord: existing }); return; }
                             const clientLastKnown = change.lastServerUpdatedAt ? new Date(change.lastServerUpdatedAt) : new Date(0);
                             if (existing.updatedAt > clientLastKnown) { conflicts.push({ type: 'collection', clientChange: change, serverRecord: existing }); return; }
                             
                             if (change.name && change.name !== existing.name) {
                                 const duplicate = await tx.collection.findFirst({ where: { name: change.name, userId, id: { not: change.id } } });
                                 if (duplicate) throw new CollectionError('Collection name already exists', 409);
                             }
                             let publicLinkUpdate: string | null | undefined = undefined;
                             if (change.isPublic !== undefined && change.isPublic !== existing.isPublic) {
                                 publicLinkUpdate = change.isPublic ? (existing.publicLink || uuidv4()) : null;
                             }
                             const updated = await tx.collection.update({ where: { id: change.id }, data: { name: change.name, description: change.description, isPublic: change.isPublic, thumbnail: change.thumbnail, publicLink: publicLinkUpdate, updatedAt: syncStartTime, isDeleted: false, deletedAt: null } }); // Reset delete flags
                             emitToUser(userId, SOCKET_EVENTS.COLLECTION_UPDATED, updated);
                             // TODO: Emit to collaborators?
                         } else { // Create
                             const duplicate = await tx.collection.findFirst({ where: { name: change.name || 'Untitled', userId } });
                             if (duplicate) throw new CollectionError('Collection name already exists', 409);
                             const publicLink = change.isPublic ? uuidv4() : null;
                             const created = await tx.collection.create({ data: { id: change.id, name: change.name || 'Untitled', description: change.description, isPublic: change.isPublic ?? false, thumbnail: change.thumbnail, publicLink, userId, ownerId: userId, createdAt: syncStartTime, updatedAt: syncStartTime, isDeleted: false } });
                             emitToUser(userId, SOCKET_EVENTS.COLLECTION_CREATED, created);
                         }
                     });
                 } catch (error) {
                     logger.error(`[Sync Service] Failed processing collection change ${change.id}:`, error);
                     if (error instanceof Error) conflicts.push({ type: 'collection', clientChange: change, serverRecord: { error: error.message } });
                 }
             }
         }


        // --- 3. Filter Server Changes ---
        const finalServerChanges = serverChanges.filter(sc => {
            switch(sc.type) {
                case 'bookmark': return !processedClientIds.bookmarks.has(sc.id);
                case 'folder': return !processedClientIds.folders.has(sc.id);
                case 'tag': return !processedClientIds.tags.has(sc.id);
                case 'collection': return !processedClientIds.collections.has(sc.id);
                default: logger.warn(`[Sync Service] Unknown server change type found during filtering: ${sc.type}`); return true; 
            }
        });
        logger.info(`[Sync Service] Sync finished for user ${userId}. Sending ${finalServerChanges.length} server changes, deletions: ${JSON.stringify(deletedIds)}, ${conflicts.length} conflicts.`);

        return {
            success: true,
            serverChanges: finalServerChanges,
            deletedIds,
            conflicts,
            newSyncTimestamp: syncStartTime.toISOString(), 
        };

    } catch (error) {
        logger.error(`[Sync Service] Sync failed catastrophically for user ${userId}:`, error);
        return {
            success: false, serverChanges: [], deletedIds: { bookmarks: [], folders: [], tags: [], collections: [] },
            conflicts: [], newSyncTimestamp: lastSyncTimestamp || new Date(0).toISOString(), 
            message: 'Sync failed due to an unexpected server error.',
        };
    }
};
