import prisma from '../config/db';
import { Prisma, Role, Collection, BookmarkCollection, CollectionCollaborator, Folder, Bookmark } from '@prisma/client'; // Import necessary types
import { z } from 'zod'; // Import Zod
import { 
    CreateCollectionInput, 
    UpdateCollectionInput,
    getCollectionsQuerySchema, 
    getBookmarksInContainerQuerySchema 
} from '../models/schemas'; 
import { v4 as uuidv4 } from 'uuid'; 
import { config } from '../config'; 
import logger from '../config/logger';
import { emitToUser, SOCKET_EVENTS } from './socket.service'; 
import { getIO } from '../config/socket'; // Import the io instance getter
import { cacheWrap, invalidateCache, invalidateCachePattern } from '../utils/cache'; // Import cache utilities
// Import bookmark cache keys for invalidation
import { BOOKMARK_DETAIL_CACHE_KEY, USER_BOOKMARK_LIST_PATTERN } from './bookmark.service'; 

/**
 * Custom error class for collection-related service errors.
 */
export class CollectionError extends Error {
    public statusCode: number;
    constructor(message: string, statusCode: number = 400) {
        super(message);
        this.name = 'CollectionError';
        this.statusCode = statusCode;
    }
}

// --- Cache Keys ---
export const COLLECTION_LIST_CACHE_KEY = (userId: string, queryParams: any) => `user:${userId}:collections:list:${JSON.stringify(queryParams)}`;
export const COLLECTION_DETAIL_CACHE_KEY = (collectionId: string) => `collection:${collectionId}:details`;
export const COLLECTION_PUBLIC_CACHE_KEY = (publicLink: string) => `collection:public:${publicLink}`;
export const USER_COLLECTION_LIST_PATTERN = (userId: string) => `user:${userId}:collections:list:*`;

/**
 * Helper function to check if a user has the required permission for a specific collection.
 * (Consider caching this check if it becomes a performance issue)
 */
const checkCollectionPermission = async (collectionId: string, userId: string, requiredPermission: Role[] = [Role.VIEW, Role.EDIT, Role.ADMIN]) => {
    // ... (implementation remains the same)
    logger.debug(`Checking access for user ${userId} on collection ${collectionId}, required: ${requiredPermission.join('/')}`);
    const collection = await prisma.collection.findUnique({ where: { id: collectionId }, include: { collaborators: { where: { userId } } } });
    if (!collection || collection.isDeleted) throw new CollectionError('Collection not found', 404);
    if (collection.isPublic && requiredPermission.includes(Role.VIEW) && requiredPermission.length === 1) return collection; 
    if (collection.ownerId === userId) return collection; 
    const collaborator = collection.collaborators[0];
    if (collaborator && requiredPermission.includes(collaborator.permission)) return collection;
    throw new CollectionError('Permission denied', 403);
};


// --- Collection CRUD ---

/**
 * Creates a new collection for a user. Invalidates relevant caches.
 */
export const createCollection = async (data: CreateCollectionInput & { userId: string; ownerId: string }): Promise<Collection> => {
    logger.info(`Creating collection "${data.name}" for user ${data.userId}`);
    const publicLink = data.isPublic ? uuidv4() : null; 
    if (publicLink) logger.debug(`Generated public link for new collection: ${publicLink}`);
    
    try {
        const collection = await prisma.collection.create({ data: { ...data, publicLink: publicLink } });
        logger.info(`Collection created successfully: ${collection.id}`);
        
        // --- Cache Invalidation ---
        await invalidateCachePattern(USER_COLLECTION_LIST_PATTERN(data.userId));

        emitToUser(getIO(), data.userId, SOCKET_EVENTS.COLLECTION_CREATED, collection); // Use getIO()
        return collection;
    } catch (error: unknown) { 
         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new CollectionError('A collection with this name already exists.', 409); 
        }
        logger.error('Error creating collection in service:', error);
        throw new CollectionError('Failed to create collection', 500);
    }
};

/**
 * Retrieves collections owned by or collaborated on by a specific user, with pagination and sorting, using caching.
 */
export const getUserCollections = async (userId: string, queryParams: z.infer<typeof getCollectionsQuerySchema>) => {
    const cacheKey = COLLECTION_LIST_CACHE_KEY(userId, queryParams);

    const cachedResult = await cacheWrap(cacheKey, async () => {
        const { limit, offset, sortBy, sortOrder } = queryParams;
        logger.debug(`Fetching collections (DB) for user ${userId} with limit: ${limit}, offset: ${offset}, sortBy: ${sortBy}, sortOrder: ${sortOrder}`);
        
        const where: Prisma.CollectionWhereInput = { isDeleted: false, OR: [ { ownerId: userId }, { collaborators: { some: { userId } } } ] };

        try {
            const [collections, totalCount] = await prisma.$transaction([
                prisma.collection.findMany({
                    where,
                    include: { _count: { select: { bookmarks: { where: { bookmark: { isDeleted: false } } } } }, owner: { select: { id: true, username: true, name: true } }, collaborators: { select: { user: { select: { id: true, username: true, name: true, profileImage: true } }, permission: true } } },
                    orderBy: { [sortBy || 'updatedAt']: sortOrder }, 
                    skip: offset, take: limit,
                }),
                prisma.collection.count({ where })
            ]);
            logger.info(`Found ${collections.length} collections (DB) (total: ${totalCount}) for user ${userId}`);
            return { data: collections, totalCount, page: Math.floor(offset / limit) + 1, limit, hasMore: offset + collections.length < totalCount };
        } catch (error) { logger.error(`Error fetching collections (DB) for user ${userId}:`, error); throw new CollectionError('Failed to fetch collections', 500); }
    });

    if (cachedResult === null) throw new CollectionError('Failed to fetch collections', 500);
    return cachedResult;
};

/**
 * Retrieves a specific collection by ID, using caching. Handles public access and user permissions.
 * Includes bookmarks with pagination and sorting.
 */
export const getCollectionById = async (collectionId: string, userId?: string, queryParams?: z.infer<typeof getBookmarksInContainerQuerySchema>) => {
    const cacheKey = COLLECTION_DETAIL_CACHE_KEY(collectionId) + (userId ? `:user:${userId}` : ':public') + `:${JSON.stringify(queryParams || {})}`;

    const cachedResult = await cacheWrap(cacheKey, async () => {
        logger.debug(`Fetching collection ${collectionId} (DB)` + (userId ? ` for user ${userId}` : ' (public access attempt)'));
        let collectionMetadata: Collection | null = null;
        const { limit = 20, offset = 0, sortBy = 'createdAt', sortOrder = 'desc' } = queryParams || {}; 

        // Check access/existence first
        if (userId) {
            collectionMetadata = await checkCollectionPermission(collectionId, userId, [Role.VIEW, Role.EDIT, Role.ADMIN]);
        } else {
            collectionMetadata = await prisma.collection.findUnique({ where: { id: collectionId, isPublic: true, isDeleted: false } }); 
            if (!collectionMetadata) throw new CollectionError('Collection not found or is private', 404); 
        }
        if (!collectionMetadata) throw new CollectionError('Collection not found', 404); 

        // Fetch details and paginated/sorted bookmarks
        try {
            const whereBookmarks: Prisma.BookmarkWhereInput = { isDeleted: false, collections: { some: { collectionId } } };
            const [collectionDetails, bookmarks, totalBookmarkCount] = await prisma.$transaction([
                prisma.collection.findUnique({ 
                    where: { id: collectionId },
                    include: { owner: { select: { id: true, username: true, name: true, profileImage: true } }, collaborators: { select: { user: { select: { id: true, username: true, name: true, profileImage: true } }, permission: true } } }
                }),
                prisma.bookmark.findMany({ 
                    where: whereBookmarks,
                    include: { tags: { select: { tag: { select: { id: true, name: true, color: true } } } } },
                    orderBy: { [sortBy]: sortOrder }, skip: offset, take: limit,
                }),
                prisma.bookmark.count({ where: whereBookmarks })
            ]);
            if (!collectionDetails) throw new CollectionError('Collection not found during final fetch', 404); 
            return { ...collectionDetails, bookmarks: { data: bookmarks, totalCount: totalBookmarkCount, page: Math.floor(offset / limit) + 1, limit, hasMore: offset + bookmarks.length < totalBookmarkCount } };
        } catch (error) { logger.error(`Error fetching full details (DB) for collection ${collectionId}:`, error); throw new CollectionError('Failed to fetch collection details', 500); }
    });

     if (cachedResult === null) throw new CollectionError('Failed to fetch collection', 500);
     // Optional: Add permission re-check on cached data if needed
     return cachedResult;
};

/**
 * Retrieves a public collection using its unique shareable link, using caching.
 */
export const getPublicCollectionByLink = async (publicLink: string) => {
     const cacheKey = COLLECTION_PUBLIC_CACHE_KEY(publicLink);
     
     const cachedResult = await cacheWrap(cacheKey, async () => {
         logger.debug(`Fetching public collection by link (DB): ${publicLink}`);
        const collection = await prisma.collection.findUnique({
            where: { publicLink, isPublic: true, isDeleted: false }, 
             include: {
                owner: { select: { id: true, username: true, name: true, profileImage: true } },
                bookmarks: { where: { bookmark: { isDeleted: false } }, select: { bookmark: { include: { tags: { select: { tag: { select: { id: true, name: true, color: true } } } } } }, addedAt: true, order: true }, orderBy: { order: 'asc' } },
                 _count: { select: { bookmarks: { where: { bookmark: { isDeleted: false } } } } } 
            }
        });
        if (!collection) throw new CollectionError('Public collection not found or link is invalid', 404);
         logger.info(`Public collection ${collection.id} fetched successfully (DB) via link.`);
         const { _count, bookmarks: bookmarkRelations, ...collectionData } = collection;
         return { ...collectionData, bookmarks: { data: bookmarkRelations.map(br => br.bookmark), totalCount: _count?.bookmarks ?? 0, page: 1, limit: _count?.bookmarks ?? 0, hasMore: false } };
     });

      if (cachedResult === null) throw new CollectionError('Failed to fetch public collection', 500);
      return cachedResult;
};

/**
 * Updates an existing collection. Invalidates relevant caches.
 */
export const updateCollection = async (collectionId: string, userId: string, data: UpdateCollectionInput): Promise<Collection> => {
    logger.debug(`User ${userId} attempting to update collection ${collectionId}`);
    await checkCollectionPermission(collectionId, userId, [Role.EDIT, Role.ADMIN]);
    logger.info(`Access granted for user ${userId} to update collection ${collectionId}.`);
    let publicLinkUpdate: string | null | undefined = undefined; 
    let oldPublicLink: string | null = null; // Store old link for invalidation

    if (data.isPublic !== undefined) { 
        const currentCollection = await prisma.collection.findUnique({ where: { id: collectionId }, select: { isPublic: true, publicLink: true } });
        if (!currentCollection) throw new CollectionError('Collection not found', 404); 
        oldPublicLink = currentCollection.publicLink; // Store old link
        if (data.isPublic === true && !currentCollection.isPublic) publicLinkUpdate = currentCollection.publicLink || uuidv4();
        else if (data.isPublic === false && currentCollection.isPublic) publicLinkUpdate = null;
    }

    try {
        if (data.name) {
             const existing = await prisma.collection.findFirst({ where: { name: data.name, userId, id: { not: collectionId }, isDeleted: false } });
             if (existing) throw new CollectionError('Collection name already exists', 409);
        }
        const updatedCollection = await prisma.collection.update({
            where: { id: collectionId },
            data: { name: data.name, description: data.description, isPublic: data.isPublic, thumbnail: data.thumbnail, ...(publicLinkUpdate !== undefined && { publicLink: publicLinkUpdate }) },
        });
        logger.info(`Collection updated successfully: ${collectionId}`);
        
        // --- Cache Invalidation ---
        await invalidateCache(COLLECTION_DETAIL_CACHE_KEY(collectionId));
        if (oldPublicLink) await invalidateCache(COLLECTION_PUBLIC_CACHE_KEY(oldPublicLink)); // Invalidate old public link cache
        if (updatedCollection.publicLink) await invalidateCache(COLLECTION_PUBLIC_CACHE_KEY(updatedCollection.publicLink)); // Invalidate new public link cache
        await invalidateCachePattern(USER_COLLECTION_LIST_PATTERN(userId)); 
        // TODO: Invalidate caches for collaborators if needed

        emitToUser(getIO(), userId, SOCKET_EVENTS.COLLECTION_UPDATED, updatedCollection); // Use getIO()
        return updatedCollection;
    } catch (error: unknown) { 
         logger.error(`Error updating collection ${collectionId} in service:`, error);
         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') throw new CollectionError('Collection not found during update', 404);
         else if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new CollectionError('Collection name already exists', 409);
         else if (error instanceof Error) throw new CollectionError(`Failed to update collection: ${error.message}`, 500);
        throw new CollectionError('Failed to update collection', 500);
    }
};

/**
 * Deletes a collection (soft delete). Invalidates relevant caches.
 */
export const deleteCollection = async (collectionId: string, userId: string): Promise<void> => {
    logger.debug(`User ${userId} attempting to delete collection ${collectionId}`);
    const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
    if (!collection) throw new CollectionError('Collection not found', 404);
    if (collection.ownerId !== userId) throw new CollectionError('Permission denied: Only the owner can delete a collection', 403);
     logger.info(`Ownership verified for deletion of collection ${collectionId} by user ${userId}.`);

    try {
        await prisma.collection.update({
            where: { id: collectionId },
            data: { isDeleted: true, deletedAt: new Date() }
        });
        logger.info(`Collection soft deleted successfully: ${collectionId}`);
        
        // --- Cache Invalidation ---
        await invalidateCache(COLLECTION_DETAIL_CACHE_KEY(collectionId));
        if (collection.publicLink) await invalidateCache(COLLECTION_PUBLIC_CACHE_KEY(collection.publicLink));
        await invalidateCachePattern(USER_COLLECTION_LIST_PATTERN(userId)); 
        // TODO: Invalidate caches for collaborators?

        emitToUser(getIO(), userId, SOCKET_EVENTS.COLLECTION_DELETED, { id: collectionId }); // Use getIO()
    } catch (error: unknown) { 
         logger.error(`Error deleting collection ${collectionId} in service:`, error);
         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') throw new CollectionError('Collection not found during delete', 404);
         else if (error instanceof Error) throw new CollectionError(`Failed to delete collection: ${error.message}`, 500);
        throw new CollectionError('Failed to delete collection', 500);
    }
};

// --- Bookmarks in Collection ---

/**
 * Adds a bookmark to a collection. Invalidates relevant caches.
 */
export const addBookmarkToCollection = async (collectionId: string, bookmarkId: string, userId: string): Promise<BookmarkCollection> => {
    logger.debug(`User ${userId} attempting to add bookmark ${bookmarkId} to collection ${collectionId}`);
    const collection = await checkCollectionPermission(collectionId, userId, [Role.EDIT, Role.ADMIN]); // Check edit access to collection
    logger.info(`Access granted for user ${userId} to modify collection ${collectionId}.`);

    const bookmark = await prisma.bookmark.findUnique({ where: { id: bookmarkId, isDeleted: false } }); 
    if (!bookmark) throw new CollectionError('Bookmark not found', 404);
    // Optional: Check if user can access the bookmark they are adding (view is enough)
    // await checkBookmarkAccess(bookmarkId, userId); 

    try {
        const result = await prisma.bookmarkCollection.create({ data: { collectionId, bookmarkId } });
        logger.info(`Bookmark ${bookmarkId} added successfully to collection ${collectionId}`);
        
        // --- Cache Invalidation ---
        await invalidateCache(COLLECTION_DETAIL_CACHE_KEY(collectionId)); 
        if (collection.publicLink) await invalidateCache(COLLECTION_PUBLIC_CACHE_KEY(collection.publicLink));
        await invalidateCachePattern(USER_COLLECTION_LIST_PATTERN(userId)); 
        await invalidateCache(BOOKMARK_DETAIL_CACHE_KEY(bookmarkId)); // Invalidate bookmark details

        emitToUser(getIO(), userId, SOCKET_EVENTS.COLLECTION_UPDATED, { id: collectionId, addedBookmarkId: bookmarkId }); // Use getIO()
        return result;
    } catch (error: unknown) { 
         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new CollectionError('Bookmark already exists in this collection', 409); 
        }
        logger.error(`Error adding bookmark ${bookmarkId} to collection ${collectionId}:`, error);
        throw new CollectionError('Failed to add bookmark to collection', 500);
    }
};

/**
 * Removes a bookmark from a collection. Invalidates relevant caches.
 */
export const removeBookmarkFromCollection = async (collectionId: string, bookmarkId: string, userId: string): Promise<void> => {
    logger.debug(`User ${userId} attempting to remove bookmark ${bookmarkId} from collection ${collectionId}`);
    const collection = await checkCollectionPermission(collectionId, userId, [Role.EDIT, Role.ADMIN]); // Check edit access
     logger.info(`Access granted for user ${userId} to modify collection ${collectionId}.`);

    try {
        await prisma.bookmarkCollection.delete({ where: { collectionId_bookmarkId: { collectionId, bookmarkId } } });
        logger.info(`Bookmark ${bookmarkId} removed successfully from collection ${collectionId}`);
        
        // --- Cache Invalidation ---
        await invalidateCache(COLLECTION_DETAIL_CACHE_KEY(collectionId)); 
        if (collection.publicLink) await invalidateCache(COLLECTION_PUBLIC_CACHE_KEY(collection.publicLink));
        await invalidateCachePattern(USER_COLLECTION_LIST_PATTERN(userId)); 
        await invalidateCache(BOOKMARK_DETAIL_CACHE_KEY(bookmarkId)); 

        emitToUser(getIO(), userId, SOCKET_EVENTS.COLLECTION_UPDATED, { id: collectionId, removedBookmarkId: bookmarkId }); // Use getIO()
    } catch (error: unknown) { 
         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new CollectionError('Bookmark not found in this collection', 404);
        }
        logger.error(`Error removing bookmark ${bookmarkId} from collection ${collectionId}:`, error);
        throw new CollectionError('Failed to remove bookmark from collection', 500);
    }
};

// --- Collection Collaboration ---

/**
 * Adds a collaborator to a collection. Invalidates relevant caches.
 */
export const addCollaborator = async (collectionId: string, ownerId: string, collaboratorUserId: string, permission: Role) => {
    logger.debug(`Owner ${ownerId} attempting to add collaborator ${collaboratorUserId} to collection ${collectionId} with permission ${permission}`);
    const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
    if (!collection || collection.isDeleted) throw new CollectionError('Collection not found', 404); 
    if (collection.ownerId !== ownerId) throw new CollectionError('Only the owner can add collaborators', 403);
    const collaboratorUser = await prisma.user.findUnique({ where: { id: collaboratorUserId } });
    if (!collaboratorUser) throw new CollectionError('Collaborator user not found', 404);
    if (ownerId === collaboratorUserId) throw new CollectionError('Owner cannot be added as a collaborator', 400);

    try {
        const collaborator = await prisma.collectionCollaborator.create({
            data: { collectionId, userId: collaboratorUserId, permission },
            include: { user: { select: { id: true, username: true, name: true, profileImage: true } } }
        });
        logger.info(`Collaborator ${collaboratorUserId} added successfully to collection ${collectionId} by owner ${ownerId}`);
        
        // --- Cache Invalidation ---
        await invalidateCache(COLLECTION_DETAIL_CACHE_KEY(collectionId)); 
        await invalidateCachePattern(USER_COLLECTION_LIST_PATTERN(ownerId)); 
        await invalidateCachePattern(USER_COLLECTION_LIST_PATTERN(collaboratorUserId)); 

        emitToUser(getIO(), ownerId, SOCKET_EVENTS.COLLECTION_UPDATED, { id: collectionId, collaborators: [collaborator] }); // Use getIO()
        emitToUser(getIO(), collaboratorUserId, SOCKET_EVENTS.COLLECTION_UPDATED, { id: collectionId, collaborators: [collaborator] }); // Use getIO()
        return collaborator;
    } catch (error: unknown) { 
         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new CollectionError('User is already a collaborator on this collection', 409); 
        }
        logger.error(`Error adding collaborator ${collaboratorUserId} to collection ${collectionId}:`, error);
        throw new CollectionError('Failed to add collaborator', 500);
    }
};

/**
 * Updates the permission of a collaborator on a collection. Invalidates relevant caches.
 */
export const updateCollaboratorPermission = async (collectionId: string, ownerId: string, collaboratorUserId: string, permission: Role) => {
     logger.debug(`Owner ${ownerId} attempting to update collaborator ${collaboratorUserId} permission to ${permission} on collection ${collectionId}`);
    const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
    if (!collection || collection.isDeleted) throw new CollectionError('Collection not found', 404); 
    if (collection.ownerId !== ownerId) throw new CollectionError('Only the owner can update permissions', 403);
    if (ownerId === collaboratorUserId) throw new CollectionError('Cannot change owner permission', 400);

    try {
        const updatedCollaborator = await prisma.collectionCollaborator.update({
            where: { collectionId_userId: { collectionId, userId: collaboratorUserId } }, 
            data: { permission },
             include: { user: { select: { id: true, username: true, name: true, profileImage: true } } }
        });
         logger.info(`Collaborator ${collaboratorUserId} permission updated successfully to ${permission} in collection ${collectionId}`);
         
         // --- Cache Invalidation ---
         await invalidateCache(COLLECTION_DETAIL_CACHE_KEY(collectionId)); 
         await invalidateCachePattern(USER_COLLECTION_LIST_PATTERN(ownerId)); 
         await invalidateCachePattern(USER_COLLECTION_LIST_PATTERN(collaboratorUserId)); 

         emitToUser(getIO(), ownerId, SOCKET_EVENTS.COLLECTION_UPDATED, { id: collectionId, collaborators: [updatedCollaborator] }); // Use getIO()
         emitToUser(getIO(), collaboratorUserId, SOCKET_EVENTS.COLLECTION_UPDATED, { id: collectionId, collaborators: [updatedCollaborator] }); // Use getIO()
        return updatedCollaborator;
    } catch (error: unknown) { 
         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new CollectionError('Collaborator not found on this collection', 404);
        }
        logger.error(`Error updating permission for collaborator ${collaboratorUserId} on collection ${collectionId}:`, error);
        throw new CollectionError('Failed to update collaborator permission', 500);
    }
};

/**
 * Removes a collaborator from a collection. Invalidates relevant caches.
 */
export const removeCollaborator = async (collectionId: string, ownerId: string, collaboratorUserId: string): Promise<void> => {
    logger.debug(`Owner ${ownerId} attempting to remove collaborator ${collaboratorUserId} from collection ${collectionId}`);
    const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
    if (!collection || collection.isDeleted) throw new CollectionError('Collection not found', 404); 
    if (collection.ownerId !== ownerId) throw new CollectionError('Only the owner can remove collaborators', 403);
    if (ownerId === collaboratorUserId) throw new CollectionError('Owner cannot be removed as a collaborator', 400);

    try {
        await prisma.collectionCollaborator.delete({
            where: { collectionId_userId: { collectionId, userId: collaboratorUserId } }, 
        });
        logger.info(`Collaborator ${collaboratorUserId} removed successfully from collection ${collectionId}`);
        
        // --- Cache Invalidation ---
         await invalidateCache(COLLECTION_DETAIL_CACHE_KEY(collectionId)); 
         await invalidateCachePattern(USER_COLLECTION_LIST_PATTERN(ownerId)); 
         await invalidateCachePattern(USER_COLLECTION_LIST_PATTERN(collaboratorUserId)); 

        emitToUser(getIO(), ownerId, SOCKET_EVENTS.COLLECTION_UPDATED, { id: collectionId, removedCollaboratorId: collaboratorUserId }); // Use getIO()
        emitToUser(getIO(), collaboratorUserId, SOCKET_EVENTS.COLLECTION_DELETED, { id: collectionId }); // Notify collaborator they lost access // Use getIO()

    } catch (error: unknown) { 
         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new CollectionError('Collaborator not found on this collection', 404);
        }
        logger.error(`Error removing collaborator ${collaboratorUserId} from collection ${collectionId}:`, error);
        throw new CollectionError('Failed to remove collaborator', 500);
    }
};
