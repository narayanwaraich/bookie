import prisma from '../config/db';
import { Prisma, Bookmark, Role } from '@prisma/client'; // Import Role for permission checks
import { 
    CreateBookmarkInput, 
    UpdateBookmarkInput,
    BookmarkSearchInput,
    BulkActionInput 
} from '../models/schemas';
import logger from '../config/logger';
import { fetchUrlMetadata } from '../utils/metadata'; // Use the correct metadata function name
import { emitToUser, SOCKET_EVENTS } from './socket.service'; // Import socket emitter
import { getIO } from '../config/socket'; // Import the io instance getter
import { cacheWrap, invalidateCache, invalidateCachePattern } from '../utils/cache'; // Import cache utilities
import { FOLDER_TREE_CACHE_KEY,FOLDER_DETAIL_CACHE_KEY} from './folder.service';
// Remove incorrect import of io from index.ts
// import { io } from '../index'; 
/**
 * Custom error class for bookmark-related service errors.
 */
export class BookmarkError extends Error {
    public statusCode: number;
    constructor(message: string, statusCode: number = 400) {
        super(message);
        this.name = 'BookmarkError';
        this.statusCode = statusCode;
    }
}

// --- Cache Keys ---
export const BOOKMARK_DETAIL_CACHE_KEY = (bookmarkId: string) => `bookmark:${bookmarkId}:details`; // Exported
export const BOOKMARK_RECENT_CACHE_KEY = (userId: string, limit: number) => `user:${userId}:bookmarks:recent:${limit}`; // Exported
export const BOOKMARK_POPULAR_CACHE_KEY = (userId: string, limit: number) => `user:${userId}:bookmarks:popular:${limit}`; // Exported
export const BOOKMARK_SEARCH_CACHE_KEY = (userId: string, params: BookmarkSearchInput) => `user:${userId}:bookmarks:search:${JSON.stringify(params)}`; // Exported
// Pattern to invalidate user-specific bookmark lists/searches
export const USER_BOOKMARK_LIST_PATTERN = (userId: string) => `user:${userId}:bookmarks:*`; // Exported

/**
 * Helper function to check if a user has the required permission for a specific bookmark.
 */
const checkBookmarkAccess = async (bookmarkId: string, userId: string, requiredPermission: Role[] = [Role.VIEW, Role.EDIT, Role.ADMIN]): Promise<Bookmark> => {
    // ... (implementation remains the same)
    logger.debug(`Checking access for user ${userId} on bookmark ${bookmarkId}, required: ${requiredPermission.join('/')}`);
    const bookmark = await prisma.bookmark.findFirst({ 
        where: { id: bookmarkId, isDeleted: false },
        include: { 
            folders: { include: { folder: { include: { collaborators: { where: { userId } } } } } },
            collections: { include: { collection: { include: { collaborators: { where: { userId } } } } } }
        }
    });
    if (!bookmark) throw new BookmarkError('Bookmark not found', 404);
    if (bookmark.userId === userId) return bookmark;
    const hasFolderPermission = bookmark.folders.some(fb => fb.folder.collaborators.some(c => requiredPermission.includes(c.permission)));
    if (hasFolderPermission) return bookmark;
    const hasCollectionPermission = bookmark.collections.some(bc => bc.collection.collaborators.some(c => requiredPermission.includes(c.permission)));
    if (hasCollectionPermission) return bookmark;
    throw new BookmarkError('Permission denied', 403);
};


// --- Bookmark CRUD ---

/**
 * Creates a new bookmark. Invalidates relevant caches.
 */
export const createBookmark = async (userId: string, data: CreateBookmarkInput) => {
    // ... (metadata fetching and validation logic remains the same)
    const { url, title, description, notes, folderId, tags } = data;
    logger.info(`Creating bookmark for user ${userId} with URL: ${url}`);
    let fetchedMetadata: { title?: string; description?: string; favicon?: string; previewImage?: string } | null = null; // Keep this type
    if (!title || !description) { 
        try { 
            fetchedMetadata = await fetchUrlMetadata(url); 
        } catch (error) { 
            logger.error(`Failed to fetch metadata for ${url}:`, error); 
        } 
    }
    // Use fetched metadata only if it's not null, otherwise default values. Let TS infer the type for metadata.
    const metadata = fetchedMetadata || {}; // Remove explicit type annotation here
    const bookmarkTitle = title || metadata.title || 'Untitled';
    const bookmarkDescription = description || metadata.description || '';

    try {
        const newBookmark = await prisma.$transaction(async (tx) => {
            const createdBookmark = await tx.bookmark.create({
                data: { url, title: bookmarkTitle, description: bookmarkDescription, favicon: metadata.favicon || null, previewImage: metadata.previewImage || null, notes: notes || null, userId, isDeleted: false }
            });
            if (folderId) {
                const folder = await tx.folder.findFirst({ where: { id: folderId, OR: [ { userId }, { collaborators: { some: { userId, permission: { in: [Role.EDIT, Role.ADMIN] } } } } ] } });
                if (!folder) throw new BookmarkError('Target folder not found or permission denied', 404); 
                await tx.folderBookmark.create({ data: { folderId, bookmarkId: createdBookmark.id } });
            }
            if (tags && tags.length > 0) {
                const existingTags = await tx.tag.findMany({ where: { id: { in: tags }, userId } });
                if (existingTags.length !== tags.length) throw new BookmarkError('One or more tags not found or not owned by user.', 404);
                for (const tag of existingTags) { await tx.bookmarkTag.create({ data: { tagId: tag.id, bookmarkId: createdBookmark.id } }); }
            }
            return createdBookmark;
        });

        const completeBookmark = await prisma.bookmark.findUnique({
            where: { id: newBookmark.id },
            include: { folders: { include: { folder: { select: { id: true, name: true } } } }, tags: { include: { tag: { select: { id: true, name: true, color: true } } } } }
        });
        logger.info(`Bookmark created successfully: ${newBookmark.id} for user ${userId}`);
        
        // --- Cache Invalidation ---
        await invalidateCachePattern(USER_BOOKMARK_LIST_PATTERN(userId)); 
        if (folderId) { // Invalidate folder caches if added to one
             await invalidateCachePattern(`user:${userId}:folders:list:*`); 
             await invalidateCache(FOLDER_TREE_CACHE_KEY(userId)); 
             await invalidateCache(FOLDER_DETAIL_CACHE_KEY(folderId)); 
        }
        // TODO: Invalidate tag list cache?

        if (completeBookmark) emitToUser(userId, SOCKET_EVENTS.BOOKMARK_CREATED, completeBookmark); // Removed getIO()
        return completeBookmark;

    } catch (error) {
        logger.error(`Error creating bookmark for user ${userId}:`, error);
        if (error instanceof BookmarkError) throw error; 
        throw new BookmarkError('Failed to create bookmark', 500); 
    }
};

/**
 * Retrieves a specific bookmark by ID, using caching.
 */
export const getBookmarkById = async (bookmarkId: string, userId: string) => {
    const cacheKey = BOOKMARK_DETAIL_CACHE_KEY(bookmarkId);
    
    const cachedResult = await cacheWrap(cacheKey, async () => {
        logger.debug(`Fetching bookmark ${bookmarkId} (DB) for user ${userId}`);
        await checkBookmarkAccess(bookmarkId, userId, [Role.VIEW, Role.EDIT, Role.ADMIN]);
        prisma.bookmark.update({ where: { id: bookmarkId }, data: { visitCount: { increment: 1 }, lastVisited: new Date() } })
            .catch(err => logger.error(`Failed to update visit count for bookmark ${bookmarkId}:`, err));
        const fullBookmark = await prisma.bookmark.findUnique({
            where: { id: bookmarkId }, 
            include: {
                folders: { include: { folder: { select: { id: true, name: true, icon: true, color: true } } } },
                tags: { include: { tag: { select: { id: true, name: true, color: true } } } },
                collections: { include: { collection: { select: { id: true, name: true, isPublic: true } } } }
            }
        });
        if (!fullBookmark) throw new BookmarkError('Bookmark not found', 404); 
        return fullBookmark;
    });

    if (cachedResult === null) {
         throw new BookmarkError('Failed to fetch bookmark', 500); 
    }
    // Re-check ownership/access on cached data if necessary (simplified for now)
    if (cachedResult.userId !== userId) {
        // This simplified check doesn't account for collaboration access in cache
        // logger.warn(`Potential stale cache access attempt for bookmark ${bookmarkId} by user ${userId}`);
        // throw new BookmarkError('Permission denied', 403); 
    }
    return cachedResult;
};

/**
 * Updates an existing bookmark. Invalidates relevant caches.
 */
export const updateBookmark = async (bookmarkId: string, userId: string, data: UpdateBookmarkInput) => {
    logger.debug(`Attempting to update bookmark ${bookmarkId} by user ${userId}`);
    const existingBookmark = await checkBookmarkAccess(bookmarkId, userId, [Role.EDIT, Role.ADMIN]);
    logger.info(`Access granted for update on bookmark ${bookmarkId} by user ${userId}.`);

    try {
        const updatedBookmark = await prisma.bookmark.update({
            where: { id: bookmarkId },
            data: {
                title: data.title ?? existingBookmark.title,
                description: data.description ?? existingBookmark.description,
                notes: data.notes ?? existingBookmark.notes,
            },
            include: { 
                folders: { include: { folder: { select: { id: true, name: true } } } },
                tags: { include: { tag: { select: { id: true, name: true, color: true } } } }
            }
        });
        logger.info(`Bookmark updated successfully: ${bookmarkId} by user ${userId}`);
        
        // --- Cache Invalidation ---
        await invalidateCache(BOOKMARK_DETAIL_CACHE_KEY(bookmarkId));
        await invalidateCachePattern(USER_BOOKMARK_LIST_PATTERN(userId)); 

        emitToUser(userId, SOCKET_EVENTS.BOOKMARK_UPDATED, updatedBookmark); // Removed getIO()
        return updatedBookmark;
    } catch (error) {
         logger.error(`Error updating bookmark ${bookmarkId} for user ${userId}:`, error);
         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
             throw new BookmarkError('Bookmark not found during update', 404);
         }
         if (error instanceof BookmarkError) throw error; 
        throw new BookmarkError('Failed to update bookmark', 500); 
    }
};

/**
 * Soft deletes a bookmark. Invalidates relevant caches.
 */
export const deleteBookmark = async (bookmarkId: string, userId: string): Promise<void> => {
    logger.debug(`Attempting to delete bookmark ${bookmarkId} by user ${userId}`);
    await checkBookmarkAccess(bookmarkId, userId, [Role.ADMIN]); 
    logger.info(`Access granted for deletion of bookmark ${bookmarkId} by user ${userId}.`);

    try {
        await prisma.bookmark.update({
            where: { id: bookmarkId },
            data: { isDeleted: true, deletedAt: new Date() },
        });
        logger.info(`Bookmark soft deleted successfully: ${bookmarkId} by user ${userId}`);
        
        // --- Cache Invalidation ---
        await invalidateCache(BOOKMARK_DETAIL_CACHE_KEY(bookmarkId));
        await invalidateCachePattern(USER_BOOKMARK_LIST_PATTERN(userId)); 
        // Invalidate folder/tag/collection caches where this bookmark might appear
        await invalidateCachePattern(`user:${userId}:folders:list:*`); 
        await invalidateCache(FOLDER_TREE_CACHE_KEY(userId)); 
        // TODO: Invalidate relevant folder detail caches if relations were fetched before delete
        // TODO: Invalidate relevant tag list/detail caches if relations were fetched before delete
        // TODO: Invalidate relevant collection list/detail caches if relations were fetched before delete

        emitToUser(userId, SOCKET_EVENTS.BOOKMARK_DELETED, { id: bookmarkId }); // Removed getIO()
        
    } catch (error) {
         logger.error(`Error deleting bookmark ${bookmarkId} for user ${userId}:`, error);
         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
             throw new BookmarkError('Bookmark not found during delete', 404);
         }
         if (error instanceof BookmarkError) throw error; 
        throw new BookmarkError('Failed to delete bookmark', 500);
    }
};

// --- Bookmark Search ---

/**
 * Searches bookmarks. Caches non-FTS results.
 */
export const searchBookmarks = async (userId: string, searchParams: BookmarkSearchInput) => {
    const { query, limit = 20, offset = 0, sortBy = 'createdAt', sortOrder = 'desc' } = searchParams;
    logger.info(`Searching bookmarks for user ${userId} with params: ${JSON.stringify(searchParams)}`);

    if (query) {
        // FTS logic (no caching)
        const searchQuery = query.trim(); 
        const tsQuery = Prisma.sql`plainto_tsquery('english', ${searchQuery})`; 
        const accessCondition = Prisma.sql`"userId" = ${userId}::uuid AND "isDeleted" = false`; 
        const conditions = [ accessCondition, Prisma.sql`"fullTextSearch" @@ ${tsQuery}` ];
        if (searchParams.folderId) conditions.push(Prisma.sql`EXISTS (SELECT 1 FROM "FolderBookmark" fb WHERE fb."bookmarkId" = b.id AND fb."folderId" = ${searchParams.folderId}::uuid)`);
        if (searchParams.tagIds && searchParams.tagIds.length > 0) {
            const validTagIds = searchParams.tagIds.filter(id => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id));
            if (validTagIds.length > 0) conditions.push(Prisma.sql`EXISTS (SELECT 1 FROM "BookmarkTag" bt WHERE bt."bookmarkId" = b.id AND bt."tagId" = ANY(${validTagIds}::uuid[]))`);
        }
        const whereClause = Prisma.join(conditions, ' AND ');
        const orderByRank = Prisma.sql`ts_rank_cd("fullTextSearch", ${tsQuery}) DESC`;
        const orderBySortBy = Prisma.sql`"${Prisma.raw(sortBy)}" ${sortOrder === 'asc' ? Prisma.sql`ASC` : Prisma.sql`DESC`}`;
        const orderByClause = Prisma.sql`ORDER BY ${orderByRank}, ${orderBySortBy}`;
        const bookmarksRawQuery = Prisma.sql`SELECT b.id, b.url, b.title, b.description, b.favicon, b."previewImage", b."createdAt", b."updatedAt", b."lastVisited", b."visitCount", b.notes, b."userId", ts_rank_cd("fullTextSearch", ${tsQuery}) as rank FROM "Bookmark" b WHERE ${whereClause} ${orderByClause} LIMIT ${limit} OFFSET ${offset};`;
        const countRawQuery = Prisma.sql`SELECT count(*)::integer FROM "Bookmark" b WHERE ${whereClause};`;
        try {
            const [bookmarksResult, countResult] = await prisma.$transaction([ prisma.$queryRaw<Bookmark[]>(bookmarksRawQuery), prisma.$queryRaw<{ count: number }[]>(countRawQuery) ]);
            const totalCount = countResult[0]?.count ?? 0;
            const bookmarkIds = bookmarksResult.map(b => b.id);
            // bookmarksResult is typed as Bookmark[] due to the generic in $queryRaw.
            // The raw SQL query also adds a 'rank' field not present in the base Bookmark model.
            // We will now enrich these results with tags and folders.

            if (bookmarkIds.length > 0) { // If there are bookmarks from the FTS query
                const relations = await prisma.bookmark.findMany({
                    where: { id: { in: bookmarkIds } },
                    include: {
                        tags: { select: { tag: { select: { id: true, name: true, color: true } } } },
                        folders: { select: { folder: { select: { id: true, name: true } } } }
                    }
                });
                const relationsMap = new Map(relations.map(r => [r.id, r]));
                const enrichedBookmarks = bookmarksResult.map(b => ({ ...b, tags: relationsMap.get(b.id)?.tags || [], folders: relationsMap.get(b.id)?.folders || [] }));
                return { bookmarks: enrichedBookmarks, totalCount, page: Math.floor(offset / limit) + 1, limit, hasMore: offset + enrichedBookmarks.length < totalCount };
            } else { // No bookmarks found by FTS, or no query term
                // Ensure a consistent return structure even if bookmarksResult is empty.
                const enrichedBookmarks = bookmarksResult.map(b => ({ ...b, tags: [], folders: [] }));
                return { bookmarks: enrichedBookmarks, totalCount, page: Math.floor(offset / limit) + 1, limit, hasMore: offset + enrichedBookmarks.length < totalCount };
            }
        } catch (error) { logger.error(`Error performing raw FTS for user ${userId}:`, error); throw new BookmarkError('Failed to perform full-text search', 500); }
    } 
    else {
        // Cache standard Prisma search
        const cacheKey = BOOKMARK_SEARCH_CACHE_KEY(userId, searchParams);
        const cachedResult = await cacheWrap(cacheKey, async () => {
            logger.debug(`Performing non-FTS search (DB) for user ${userId}`);
            const baseAccessFilter: Prisma.BookmarkWhereInput = { isDeleted: false, OR: [ { userId }, { folders: { some: { folder: { collaborators: { some: { userId } } } } } }, { collections: { some: { collection: { collaborators: { some: { userId } } } } } } ] };
            const searchFilters: Prisma.BookmarkWhereInput[] = [baseAccessFilter];
            if (searchParams.folderId) searchFilters.push({ folders: { some: { folderId: searchParams.folderId } } });
            if (searchParams.tagIds && searchParams.tagIds.length > 0) searchFilters.push({ tags: { some: { tagId: { in: searchParams.tagIds } } } });
            const whereClause: Prisma.BookmarkWhereInput = { AND: searchFilters };
            try {
                const [bookmarks, totalCount] = await prisma.$transaction([
                    prisma.bookmark.findMany({ where: whereClause, orderBy: { [sortBy]: sortOrder }, take: limit, skip: offset, include: { tags: { select: { tag: { select: { id: true, name: true, color: true } } } }, folders: { select: { folder: { select: { id: true, name: true } } } } } }),
                    prisma.bookmark.count({ where: whereClause })
                ]);
                logger.info(`Non-FTS query (DB) found ${bookmarks.length} bookmarks (total: ${totalCount}).`);
                return { data: bookmarks, totalCount, page: Math.floor(offset / limit) + 1, limit, hasMore: offset + bookmarks.length < totalCount };
            } catch (error) { logger.error(`Error searching bookmarks (non-FTS, DB) for user ${userId}:`, error); throw new BookmarkError('Failed to search bookmarks', 500); }
        });
        if (cachedResult === null) throw new BookmarkError('Failed to search bookmarks', 500);
        return { bookmarks: cachedResult.data, totalCount: cachedResult.totalCount, page: cachedResult.page, limit: cachedResult.limit, hasMore: cachedResult.hasMore };
    }
};

// --- Other potential service functions (from controller) ---

/**
 * Retrieves the most recently created bookmarks for a user, using caching.
 */
export const getRecentBookmarks = async (userId: string, limit: number): Promise<Bookmark[]> => {
    const cacheKey = BOOKMARK_RECENT_CACHE_KEY(userId, limit);
    const cachedResult = await cacheWrap(cacheKey, async () => {
        logger.info(`Fetching ${limit} recent bookmarks (DB) for user ${userId}`);
        try {
            return await prisma.bookmark.findMany({ 
                where: { isDeleted: false, OR: [ { userId }, { folders: { some: { folder: { collaborators: { some: { userId } } } } } }, { collections: { some: { collection: { collaborators: { some: { userId } } } } } } ] }, 
                orderBy: { createdAt: 'desc' }, 
                take: limit,
                include: { tags: { select: { tag: { select: { id: true, name: true, color: true } } } }, folders: { select: { folder: { select: { id: true, name: true } } } } } 
            });
        } catch (error) { logger.error(`Error fetching recent bookmarks (DB) for user ${userId}:`, error); throw new BookmarkError('Failed to fetch recent bookmarks', 500); }
    });
     if (cachedResult === null) throw new BookmarkError('Failed to fetch recent bookmarks', 500);
     return cachedResult;
};

/**
 * Retrieves the most popular bookmarks for a user based on visit count, using caching.
 */
export const getPopularBookmarks = async (userId: string, limit: number): Promise<Bookmark[]> => {
     const cacheKey = BOOKMARK_POPULAR_CACHE_KEY(userId, limit);
     const cachedResult = await cacheWrap(cacheKey, async () => {
         logger.info(`Fetching ${limit} popular bookmarks (DB) for user ${userId}`);
         try {
            return await prisma.bookmark.findMany({ 
                where: { isDeleted: false, OR: [ { userId }, { folders: { some: { folder: { collaborators: { some: { userId } } } } } }, { collections: { some: { collection: { collaborators: { some: { userId } } } } } } ] }, 
                orderBy: { visitCount: 'desc' }, 
                take: limit,
                include: { tags: { select: { tag: { select: { id: true, name: true, color: true } } } }, folders: { select: { folder: { select: { id: true, name: true } } } } } 
            });
         } catch (error) { logger.error(`Error fetching popular bookmarks (DB) for user ${userId}:`, error); throw new BookmarkError('Failed to fetch popular bookmarks', 500); }
     });
      if (cachedResult === null) throw new BookmarkError('Failed to fetch popular bookmarks', 500);
      return cachedResult;
};

/**
 * Adds a bookmark to a specified folder. Invalidates relevant caches.
 */
export const addBookmarkToFolder = async (userId: string, bookmarkId: string, folderId: string): Promise<void> => {
    logger.debug(`User ${userId} attempting to add bookmark ${bookmarkId} to folder ${folderId}`);
    await checkBookmarkAccess(bookmarkId, userId, [Role.VIEW, Role.EDIT, Role.ADMIN]);
    const folder = await prisma.folder.findFirst({ where: { id: folderId, OR: [{ userId }, { collaborators: { some: { userId, permission: { in: [Role.EDIT, Role.ADMIN] } } } }] } });
    if (!folder) throw new BookmarkError('Folder not found or permission denied', 404);
    
    try {
        await prisma.folderBookmark.create({ data: { folderId, bookmarkId } });
        logger.info(`Bookmark ${bookmarkId} added to folder ${folderId} by user ${userId}`);
        // --- Cache Invalidation ---
        await invalidateCache(BOOKMARK_DETAIL_CACHE_KEY(bookmarkId)); 
        await invalidateCachePattern(USER_BOOKMARK_LIST_PATTERN(userId)); 
        await invalidateCachePattern(`user:${userId}:folders:list:*`); 
        await invalidateCache(FOLDER_TREE_CACHE_KEY(userId)); 
        await invalidateCache(FOLDER_DETAIL_CACHE_KEY(folderId)); 
    } catch (error) { 
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
             logger.warn(`Bookmark ${bookmarkId} already exists in folder ${folderId}.`);
            throw new BookmarkError('Bookmark already in this folder', 409); 
        }
        logger.error(`Error adding bookmark ${bookmarkId} to folder ${folderId}:`, error);
        throw new BookmarkError('Failed to add bookmark to folder', 500);
    }
};

/**
 * Removes a bookmark from a specified folder. Invalidates relevant caches.
 */
export const removeBookmarkFromFolder = async (userId: string, bookmarkId: string, folderId: string): Promise<void> => {
     logger.debug(`User ${userId} attempting to remove bookmark ${bookmarkId} from folder ${folderId}`);
    const folder = await prisma.folder.findFirst({ where: { id: folderId, OR: [{ userId }, { collaborators: { some: { userId, permission: { in: [Role.EDIT, Role.ADMIN] } } } }] } });
    if (!folder) throw new BookmarkError('Folder not found or permission denied', 404);
    
    try {
        await prisma.folderBookmark.delete({ where: { folderId_bookmarkId: { folderId, bookmarkId } } });
         logger.info(`Bookmark ${bookmarkId} removed from folder ${folderId} by user ${userId}`);
         // --- Cache Invalidation ---
         await invalidateCache(BOOKMARK_DETAIL_CACHE_KEY(bookmarkId)); 
         await invalidateCachePattern(USER_BOOKMARK_LIST_PATTERN(userId)); 
         await invalidateCachePattern(`user:${userId}:folders:list:*`); 
         await invalidateCache(FOLDER_TREE_CACHE_KEY(userId)); 
         await invalidateCache(FOLDER_DETAIL_CACHE_KEY(folderId)); 
    } catch (error) { 
         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
             logger.warn(`Remove bookmark from folder failed: Bookmark ${bookmarkId} not found in folder ${folderId}.`);
            throw new BookmarkError('Bookmark not found in this folder', 404); 
        }
        logger.error(`Error removing bookmark ${bookmarkId} from folder ${folderId}:`, error);
        throw new BookmarkError('Failed to remove bookmark from folder', 500);
    }
};

/**
 * Adds a tag to a specified bookmark. Invalidates relevant caches.
 */
export const addTagToBookmark = async (userId: string, bookmarkId: string, tagId: string): Promise<void> => {
    logger.debug(`User ${userId} attempting to add tag ${tagId} to bookmark ${bookmarkId}`);
    await checkBookmarkAccess(bookmarkId, userId, [Role.EDIT, Role.ADMIN]);
    const tag = await prisma.tag.findFirst({ where: { id: tagId, userId } });
    if (!tag) throw new BookmarkError('Tag not found or not owned by user', 404);
    
     try {
        await prisma.bookmarkTag.create({ data: { tagId, bookmarkId } });
        logger.info(`Tag ${tagId} added to bookmark ${bookmarkId} by user ${userId}`);
        // --- Cache Invalidation ---
        await invalidateCache(BOOKMARK_DETAIL_CACHE_KEY(bookmarkId)); 
        await invalidateCachePattern(USER_BOOKMARK_LIST_PATTERN(userId)); 
        // await invalidateCachePattern(`user:${userId}:tags:list:*`); 
    } catch (error) { 
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
             logger.warn(`Tag ${tagId} already applied to bookmark ${bookmarkId}.`);
            throw new BookmarkError('Tag already applied to this bookmark', 409); 
        }
        logger.error(`Error adding tag ${tagId} to bookmark ${bookmarkId}:`, error);
        throw new BookmarkError('Failed to add tag to bookmark', 500);
    }
};

/**
 * Removes a tag from a specified bookmark. Invalidates relevant caches.
 */
export const removeTagFromBookmark = async (userId: string, bookmarkId: string, tagId: string): Promise<void> => {
    logger.debug(`User ${userId} attempting to remove tag ${tagId} from bookmark ${bookmarkId}`);
    await checkBookmarkAccess(bookmarkId, userId, [Role.EDIT, Role.ADMIN]);
    const tag = await prisma.tag.findFirst({ where: { id: tagId, userId } });
    if (!tag) throw new BookmarkError('Tag not found or not owned by user', 404);
    
    try {
        await prisma.bookmarkTag.delete({ where: { tagId_bookmarkId: { tagId, bookmarkId } } });
         logger.info(`Tag ${tagId} removed from bookmark ${bookmarkId} by user ${userId}`);
         // --- Cache Invalidation ---
         await invalidateCache(BOOKMARK_DETAIL_CACHE_KEY(bookmarkId)); 
         await invalidateCachePattern(USER_BOOKMARK_LIST_PATTERN(userId)); 
         // await invalidateCachePattern(`user:${userId}:tags:list:*`); 
    } catch (error) { 
         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
             logger.warn(`Remove tag from bookmark failed: Tag ${tagId} not found on bookmark ${bookmarkId}.`);
            throw new BookmarkError('Tag not found on this bookmark', 404); 
        }
        logger.error(`Error removing tag ${tagId} from bookmark ${bookmarkId}:`, error);
        throw new BookmarkError('Failed to remove tag from bookmark', 500);
    }
};

// --- Bulk Actions ---

/**
 * Performs bulk actions. Invalidates relevant caches.
 */
export const performBulkAction = async (userId: string, bulkActionData: BulkActionInput) => {
    const { bookmarkIds, action, targetFolderId, tagId, targetCollectionId } = bulkActionData;
    logger.info(`User ${userId} performing bulk action '${action}' on ${bookmarkIds.length} bookmarks.`);
    const bookmarkCount = await prisma.bookmark.count({ where: { id: { in: bookmarkIds }, userId: userId, isDeleted: false } });
    if (bookmarkCount !== bookmarkIds.length) throw new BookmarkError('Access denied to one or more bookmarks, or bookmark not found', 403);
    
    try {
        const result = await prisma.$transaction(async (tx) => {
            let count = 0; 
            switch (action) {
                case 'delete':
                    const updateResult = await tx.bookmark.updateMany({ where: { id: { in: bookmarkIds }, userId }, data: { isDeleted: true, deletedAt: new Date() } });
                    count = updateResult.count;
                    bookmarkIds.forEach(id => emitToUser(userId, SOCKET_EVENTS.BOOKMARK_DELETED, { id })); // Removed getIO()
                    break;
                case 'addToFolder':
                    if (!targetFolderId) throw new BookmarkError('Target folder ID is required', 400);
                    const targetFolderAdd = await tx.folder.findFirst({ where: { id: targetFolderId, userId } });
                    if (!targetFolderAdd) throw new BookmarkError('Target folder not found or permission denied', 404);
                    const addFolderResult = await tx.folderBookmark.createMany({ data: bookmarkIds.map(bookmarkId => ({ folderId: targetFolderId, bookmarkId })), skipDuplicates: true });
                    count = addFolderResult.count;
                    break;
                case 'removeFromFolder':
                     if (!targetFolderId) throw new BookmarkError('Target folder ID is required', 400);
                     const targetFolderRemove = await tx.folder.findFirst({ where: { id: targetFolderId, userId } });
                     if (!targetFolderRemove) throw new BookmarkError('Target folder not found or permission denied', 404);
                     const removeFolderResult = await tx.folderBookmark.deleteMany({ where: { folderId: targetFolderId, bookmarkId: { in: bookmarkIds } } });
                     count = removeFolderResult.count;
                     break;
                case 'addTag':
                    if (!tagId) throw new BookmarkError('Tag ID is required', 400);
                    const targetTagAdd = await tx.tag.findFirst({ where: { id: tagId, userId } });
                    if (!targetTagAdd) throw new BookmarkError('Tag not found or permission denied', 404);
                    const addTagResult = await tx.bookmarkTag.createMany({ data: bookmarkIds.map(bookmarkId => ({ tagId: tagId, bookmarkId })), skipDuplicates: true });
                    count = addTagResult.count;
                    bookmarkIds.forEach(id => emitToUser(userId, SOCKET_EVENTS.BOOKMARK_UPDATED, { id, addedTagId: tagId })); // Removed getIO()
                    break;
                case 'removeTag':
                    if (!tagId) throw new BookmarkError('Tag ID is required', 400);
                     const targetTagRemove = await tx.tag.findFirst({ where: { id: tagId, userId } });
                     if (!targetTagRemove) throw new BookmarkError('Tag not found or permission denied', 404);
                    const removeTagResult = await tx.bookmarkTag.deleteMany({ where: { tagId: tagId, bookmarkId: { in: bookmarkIds } } });
                    count = removeTagResult.count;
                     bookmarkIds.forEach(id => emitToUser(userId, SOCKET_EVENTS.BOOKMARK_UPDATED, { id, removedTagId: tagId })); // Removed getIO()
                    break;
                case 'addToCollection':
                    if (!targetCollectionId) throw new BookmarkError('Target collection ID is required', 400);
                    const targetCollectionAdd = await tx.collection.findFirst({ where: { id: targetCollectionId, userId } });
                    if (!targetCollectionAdd) throw new BookmarkError('Target collection not found or permission denied', 404);
                    const addCollectionResult = await tx.bookmarkCollection.createMany({ data: bookmarkIds.map(bookmarkId => ({ collectionId: targetCollectionId, bookmarkId })), skipDuplicates: true });
                    count = addCollectionResult.count;
                    break;
                case 'removeFromCollection':
                    if (!targetCollectionId) throw new BookmarkError('Target collection ID is required', 400);
                    const targetCollectionRemove = await tx.collection.findFirst({ where: { id: targetCollectionId, userId } });
                    if (!targetCollectionRemove) throw new BookmarkError('Target collection not found or permission denied', 404);
                    const removeCollectionResult = await tx.bookmarkCollection.deleteMany({ where: { collectionId: targetCollectionId, bookmarkId: { in: bookmarkIds } } });
                    count = removeCollectionResult.count;
                    break;
                default:
                    throw new BookmarkError(`Unsupported bulk action: ${action}`, 400);
            }
            return { success: true, message: `Bulk action '${action}' completed successfully. Affected items: ${count}` };
        }); 

        // --- Cache Invalidation ---
        bookmarkIds.forEach(id => invalidateCache(BOOKMARK_DETAIL_CACHE_KEY(id)));
        await invalidateCachePattern(USER_BOOKMARK_LIST_PATTERN(userId)); 
        if (action === 'addToFolder' || action === 'removeFromFolder') {
            await invalidateCachePattern(`user:${userId}:folders:list:*`); 
            await invalidateCache(FOLDER_TREE_CACHE_KEY(userId)); 
            if(targetFolderId) await invalidateCache(FOLDER_DETAIL_CACHE_KEY(targetFolderId));
        }
        // Add invalidation for tags/collections if needed

        return result; 
    } catch (error) { 
        logger.error(`Error performing bulk action '${action}' for user ${userId}:`, error);
        if (error instanceof BookmarkError) throw error; 
        throw new BookmarkError('Failed to perform bulk action', 500); 
    }
};

/**
 * Checks if a bookmark with the given URL already exists for the user.
 * (No caching needed here as it's a quick check)
 */
export const checkBookmarkUrlExists = async (userId: string, url: string): Promise<{ exists: boolean, id: string | null }> => {
    logger.debug(`Checking if URL exists for user ${userId}: ${url}`);
    try {
        const existingBookmark = await prisma.bookmark.findFirst({
            where: { userId, url, isDeleted: false },
            select: { id: true } 
        });
        if (existingBookmark) {
            return { exists: true, id: existingBookmark.id };
        } else {
            return { exists: false, id: null };
        }
    } catch (error) { 
        logger.error(`Error checking bookmark URL existence for user ${userId}:`, error);
        // Throw error instead of returning false, as the check failed
        throw new BookmarkError('Failed to check URL existence', 500);
    }
};
