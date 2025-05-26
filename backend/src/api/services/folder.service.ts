import prisma from '../config/db';
import { Prisma, Folder, Role } from '@prisma/client';
import { z } from 'zod'; // Import Zod
import {
  CreateFolderInput,
  UpdateFolderInput,
  getFoldersQuerySchema,
  getBookmarksInContainerQuerySchema, // Import schema for bookmarks
} from '../models/schemas';
import logger from '../config/logger';
import { emitToUser, SOCKET_EVENTS } from './socket.service'; // Import socket emitter
import { getIO } from '../config/socket'; // Import the io instance getter
import {
  cacheWrap,
  invalidateCache,
  invalidateCachePattern,
} from '../utils/cache'; // Import cache utilities

/**
 * Custom error class for folder-related service errors.
 */
export class FolderError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'FolderError';
    this.statusCode = statusCode;
  }
}

// --- Cache Keys ---
// Define functions to generate cache keys consistently
export const FOLDER_LIST_CACHE_KEY = (
  userId: string,
  queryParams: any
) => `user:${userId}:folders:list:${JSON.stringify(queryParams)}`;
export const FOLDER_TREE_CACHE_KEY = (userId: string) =>
  `user:${userId}:folders:tree`;
export const FOLDER_DETAIL_CACHE_KEY = (folderId: string) =>
  `folder:${folderId}:details`; // Example for single folder cache

// --- Helper Functions (Internal to Service) ---

/**
 * Recursively retrieves all descendant folder IDs for a given folder.
 */
const getAllDescendantIdsInternal = async (
  folderId: string,
  userId: string,
  tx: Prisma.TransactionClient
): Promise<string[]> => {
  const folders = await tx.folder.findMany({
    where: { parentId: folderId, userId },
    select: { id: true },
  });
  const childIds = folders.map((folder) => folder.id);
  if (childIds.length === 0) return [];
  const descendantIds: string[] = [...childIds];
  for (const childId of childIds) {
    const descendants = await getAllDescendantIdsInternal(
      childId,
      userId,
      tx
    );
    descendantIds.push(...descendants);
  }
  return descendantIds;
};

/**
 * Checks if setting a new parent for a folder would create a circular reference.
 */
const wouldCreateCircularReferenceInternal = async (
  folderId: string,
  newParentId: string | null,
  userId: string,
  tx: Prisma.TransactionClient
): Promise<boolean> => {
  if (!newParentId) return false;
  if (folderId === newParentId) return true;
  logger.debug(
    `Checking for circular reference: moving folder ${folderId} under ${newParentId}`
  );
  const descendantIds = await getAllDescendantIdsInternal(
    folderId,
    userId,
    tx
  );
  const wouldBeCircular = descendantIds.includes(newParentId);
  if (wouldBeCircular) {
    logger.warn(
      `Circular reference detected: folder ${folderId} cannot be moved under its descendant ${newParentId}.`
    );
  }
  return wouldBeCircular;
};

/**
 * Helper function to check if a user has the required permission for a specific folder.
 * (Consider caching the result of this check if it becomes a bottleneck)
 */
const checkFolderAccess = async (
  folderId: string,
  userId: string,
  requiredPermission: Role[] = [Role.VIEW, Role.EDIT, Role.ADMIN]
): Promise<Folder> => {
  logger.debug(
    `Checking access for user ${userId} on folder ${folderId}, required: ${requiredPermission.join(
      '/'
    )}`
  );
  // Caching this might be complex due to collaborator changes, skip for now
  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    include: { collaborators: { where: { userId } } },
  });

  if (!folder || folder.isDeleted) {
    logger.warn(
      `Access check failed: Folder ${folderId} not found or deleted.`
    );
    throw new FolderError('Folder not found', 404);
  }
  if (folder.userId === userId) {
    logger.debug(
      `Access granted for folder ${folderId}: User ${userId} is owner.`
    );
    return folder;
  }
  const collaborator = folder.collaborators[0];
  if (
    collaborator &&
    requiredPermission.includes(collaborator.permission)
  ) {
    logger.debug(
      `Access granted for folder ${folderId}: User ${userId} has collaborator permission (${collaborator.permission}).`
    );
    return folder;
  }
  logger.warn(
    `Access denied for user ${userId} on folder ${folderId}. Required: ${requiredPermission.join(
      '/'
    )}`
  );
  throw new FolderError('Permission denied', 403);
};

// --- Folder CRUD ---

/**
 * Creates a new folder for a user. Invalidates relevant caches.
 */
export const createFolder = async (
  userId: string,
  data: CreateFolderInput
): Promise<Folder> => {
  const { name, parentId, description, icon, color } = data;
  logger.info(
    `Creating folder "${name}" for user ${userId}` +
      (parentId ? ` under parent ${parentId}` : ' at root')
  );

  const existingFolder = await prisma.folder.findFirst({
    where: {
      name,
      userId,
      parentId: parentId ?? null,
      isDeleted: false,
    },
  });
  if (existingFolder) {
    throw new FolderError(
      'A folder with this name already exists at this level',
      409
    );
  }
  if (parentId) {
    const parentFolder = await prisma.folder.findFirst({
      where: { id: parentId, userId, isDeleted: false },
    });
    if (!parentFolder) {
      throw new FolderError('Parent folder not found', 404);
    }
  }

  try {
    const newFolder = await prisma.folder.create({
      data: {
        name,
        description,
        icon,
        color,
        parentId: parentId ?? null,
        userId,
      },
    });
    logger.info(
      `Folder created successfully: ${newFolder.id} for user ${userId}`
    );

    // --- Cache Invalidation ---
    await invalidateCachePattern(`user:${userId}:folders:list:*`); // Invalidate all list caches for user
    await invalidateCache(FOLDER_TREE_CACHE_KEY(userId)); // Invalidate tree cache

    emitToUser(userId, SOCKET_EVENTS.FOLDER_CREATED, newFolder); // Removed getIO()
    return newFolder;
  } catch (error) {
    logger.error(`Error creating folder for user ${userId}:`, error);
    throw new FolderError('Failed to create folder', 500);
  }
};

/**
 * Retrieves a specific folder by ID after checking user access.
 * (Caching for single items can be added if needed)
 */
export const getFolderById = async (
  folderId: string,
  userId: string
): Promise<Folder> => {
  // Example of caching a single item (adjust TTL as needed)
  // const cacheKey = FOLDER_DETAIL_CACHE_KEY(folderId);
  // return cacheWrap(cacheKey, async () => {
  logger.debug(
    `Attempting to get folder ${folderId} for user ${userId}`
  );
  const folder = await checkFolderAccess(folderId, userId, [
    Role.VIEW,
    Role.EDIT,
    Role.ADMIN,
  ]);
  logger.info(
    `Access granted for folder ${folderId} to user ${userId}.`
  );
  return folder;
  // });
};

/**
 * Retrieves folders for a user (flat list) with pagination and sorting, using caching.
 */
export const getUserFolders = async (
  userId: string,
  queryParams: z.infer<typeof getFoldersQuerySchema>
) => {
  const cacheKey = FOLDER_LIST_CACHE_KEY(userId, queryParams);

  // Use cacheWrap to get data either from cache or by executing the provided function
  const cachedResult = await cacheWrap(cacheKey, async () => {
    const { limit, offset, sortBy, sortOrder } = queryParams;
    logger.debug(
      `Fetching folders (DB) for user ${userId} with limit: ${limit}, offset: ${offset}, sortBy: ${sortBy}, sortOrder: ${sortOrder}`
    );

    const where: Prisma.FolderWhereInput = {
      userId,
      isDeleted: false,
    };

    try {
      const [folders, totalCount] = await prisma.$transaction([
        prisma.folder.findMany({
          where,
          include: {
            _count: {
              select: {
                bookmarks: {
                  where: { bookmark: { isDeleted: false } },
                },
              },
            },
          }, // Count non-deleted bookmarks
          orderBy: { [sortBy || 'name']: sortOrder },
          skip: offset,
          take: limit,
        }),
        prisma.folder.count({ where }),
      ]);

      // Map folders and remove the _count property
      const foldersWithCount = folders.map((folder) => {
        const { _count, ...rest } = folder;
        return { ...rest, bookmarkCount: _count?.bookmarks ?? 0 };
      });
      logger.info(
        `Found ${foldersWithCount.length} folders (DB) (total: ${totalCount}) for user ${userId}`
      );

      // Structure the data as expected by the return type of cacheWrap
      return {
        data: foldersWithCount,
        totalCount,
        page: Math.floor(offset / limit) + 1,
        limit,
        hasMore: offset + foldersWithCount.length < totalCount,
      };
    } catch (error) {
      logger.error(
        `Error fetching folders (DB) for user ${userId}:`,
        error
      );
      throw new FolderError('Failed to fetch folders', 500);
    }
  }); // Default TTL applied by cacheWrap

  // cacheWrap returns null if the underlying function fails and cache is empty
  if (cachedResult === null) {
    throw new FolderError('Failed to fetch folders', 500);
  }
  return cachedResult;
};

/**
 * Retrieves the folder structure as a nested tree for a user, using caching.
 */
export const getFolderTree = async (
  userId: string
): Promise<any[]> => {
  const cacheKey = FOLDER_TREE_CACHE_KEY(userId);

  const cachedResult = await cacheWrap(cacheKey, async () => {
    logger.debug(`Fetching folder tree (DB) for user ${userId}`);
    const folders = await prisma.folder.findMany({
      where: {
        OR: [{ userId }, { collaborators: { some: { userId } } }],
        isDeleted: false,
      },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            bookmarks: { where: { bookmark: { isDeleted: false } } },
          },
        }, // Count non-deleted
        collaborators: {
          where: { userId },
          select: { userId: true },
        },
      },
    });
    logger.info(
      `Found ${folders.length} folders (DB) for user ${userId} to build tree.`
    );

    const folderMap: Record<string, any> = {};
    const rootFolders: any[] = [];

    folders.forEach((folder) => {
      folderMap[folder.id] = {
        ...folder,
        children: [],
        bookmarkCount: folder._count?.bookmarks || 0,
      };
      delete folderMap[folder.id]._count;
      delete folderMap[folder.id].collaborators;
    });

    folders.forEach((folder) => {
      if (folder.parentId && folderMap[folder.parentId]) {
        folderMap[folder.parentId].children.push(
          folderMap[folder.id]
        );
      } else {
        rootFolders.push(folderMap[folder.id]);
      }
    });

    logger.debug(
      `Built folder tree (DB) for user ${userId} with ${rootFolders.length} root nodes.`
    );
    return rootFolders;
  }); // Default TTL

  if (cachedResult === null) {
    throw new FolderError('Failed to fetch folder tree', 500);
  }
  return cachedResult;
};

type FolderPathNode = {
  id: string;
  name: string;
};

/**
 * Takes a folderId and returns an array of ancestor folders using recursion.
 */
const getFolderPathRecursive = async (
  userId: string,
  folderId: string | null, // Allow null for the initial call or when parentId is null
  path: FolderPathNode[] = [] // Accumulator for the path
): Promise<FolderPathNode[]> => {
  // Base case: if folderId is null, we've reached the top or started with null
  if (!folderId) {
    logger.debug(
      `[getFolderPathRecursive] Reached end of path or initial folderId is null for user ${userId}. Path: ${JSON.stringify(
        path
      )}`
    );
    return path;
  }

  const folder = await prisma.folder.findFirst({
    where: {
      id: folderId,
      isDeleted: false,
      // Ensure user has access (owner or collaborator)
      OR: [{ userId }, { collaborators: { some: { userId } } }],
    },
    select: { id: true, name: true, parentId: true },
  });

  if (!folder) {
    // If a folder in the path is not found or accessible, stop building the path
    logger.warn(
      `[getFolderPathRecursive] Folder ${folderId} not found or access denied for user ${userId}. Current path: ${JSON.stringify(
        path
      )}`
    );
    // Return the path accumulated so far, or an empty array if this was the first problematic folder
    return path;
  }

  // Add current folder to the beginning of the path
  const newPath = [{ id: folder.id, name: folder.name }, ...path];

  // Recursive call for the parent folder
  return getFolderPathRecursive(userId, folder.parentId, newPath);
};

/**
 * Main function to initiate the recursive path fetching.
 * This wrapper keeps the initial signature the same as the original function.
 */
export const getFolderPath = async (
  userId: string,
  folderId: string
): Promise<FolderPathNode[]> => {
  // The recursive function builds the path in reverse, so we call it and then reverse the result.
  // Or, more efficiently, the recursive function can prepend elements.

  // Helper function to do the actual recursion and build the path in the correct order.
  const buildPath = async (
    currentId: string | null
  ): Promise<FolderPathNode[]> => {
    if (!currentId) {
      return []; // Base case: no more parent folders
    }

    const folderData = await prisma.folder.findFirst({
      where: {
        id: currentId,
        isDeleted: false,
        OR: [{ userId }, { collaborators: { some: { userId } } }],
      },
      select: { id: true, name: true, parentId: true },
    });

    if (!folderData) {
      logger.warn(
        `[getFolderPath] Folder ${currentId} not found or access denied for user ${userId}`
      );
      return []; // Stop if folder not found or accessible
    }

    // Recursively get the path of the parent
    const parentPath = await buildPath(folderData.parentId);

    // Append the current folder to the path obtained from the parent
    return [
      ...parentPath,
      { id: folderData.id, name: folderData.name },
    ];
  };

  const path = await buildPath(folderId);
  logger.debug(
    `[getFolderPath] Path for folder ${folderId}, user ${userId}: ${JSON.stringify(
      path
    )}`
  );
  return path;
};

/**
 * Updates an existing folder. Invalidates relevant caches.
 */
export const updateFolder = async (
  folderId: string,
  userId: string,
  data: UpdateFolderInput
): Promise<Folder> => {
  logger.debug(
    `User ${userId} attempting to update folder ${folderId}`
  );
  const folder = await checkFolderAccess(folderId, userId, [
    Role.EDIT,
    Role.ADMIN,
  ]);
  logger.info(
    `Access granted for user ${userId} to update folder ${folderId}.`
  );
  const { name, parentId, description, icon, color } = data;
  const oldParentId = folder.parentId; // Store old parent ID for cache invalidation if moved

  try {
    const updatedFolder = await prisma.$transaction(async (tx) => {
      if (parentId !== undefined && parentId !== folder.parentId) {
        const wouldBeCircular =
          await wouldCreateCircularReferenceInternal(
            folderId,
            parentId ?? null,
            userId,
            tx
          );
        if (wouldBeCircular)
          throw new FolderError(
            'Cannot move folder as it would create a circular reference',
            400
          );
        if (parentId) {
          const parentFolder = await tx.folder.findFirst({
            where: { id: parentId, userId, isDeleted: false },
          });
          if (!parentFolder)
            throw new FolderError(
              'Target parent folder not found or permission denied',
              404
            );
        }
      }
      if (name !== undefined && name !== folder.name) {
        const effectiveParentId =
          parentId !== undefined ? parentId : folder.parentId;
        const existingFolder = await tx.folder.findFirst({
          where: {
            name,
            userId,
            parentId: effectiveParentId ?? null,
            id: { not: folderId },
            isDeleted: false,
          },
        });
        if (existingFolder)
          throw new FolderError(
            'A folder with this name already exists at this level',
            409
          );
      }
      return tx.folder.update({
        where: { id: folderId },
        data: {
          name,
          parentId:
            parentId !== undefined
              ? parentId === null
                ? null
                : parentId
              : undefined,
          description,
          icon,
          color,
        },
      });
    });

    logger.info(
      `Folder updated successfully: ${folderId} by user ${userId}`
    );

    // --- Cache Invalidation ---
    await invalidateCachePattern(`user:${userId}:folders:list:*`);
    await invalidateCache(FOLDER_TREE_CACHE_KEY(userId));
    await invalidateCache(FOLDER_DETAIL_CACHE_KEY(folderId));
    // If parent changed, invalidate old parent's detail cache too? (Might be overkill)
    // if (parentId !== undefined && parentId !== oldParentId && oldParentId) {
    //     await invalidateCache(FOLDER_DETAIL_CACHE_KEY(oldParentId));
    // }
    // if (parentId) await invalidateCache(FOLDER_DETAIL_CACHE_KEY(parentId));

    emitToUser(userId, SOCKET_EVENTS.FOLDER_UPDATED, updatedFolder); // Removed getIO()
    return updatedFolder;
  } catch (error) {
    logger.error(
      `Error updating folder ${folderId} for user ${userId}:`,
      error
    );
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new FolderError('Folder not found during update', 404);
    }
    if (error instanceof FolderError) throw error;
    throw new FolderError('Failed to update folder', 500);
  }
};

/**
 * Deletes a folder and all its descendants (soft delete). Invalidates relevant caches.
 */
export const deleteFolder = async (
  folderId: string,
  userId: string,
  moveBookmarksToFolderId?: string
): Promise<void> => {
  logger.debug(
    `User ${userId} attempting to delete folder ${folderId}` +
      (moveBookmarksToFolderId
        ? ` and move bookmarks to ${moveBookmarksToFolderId}`
        : '')
  );
  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
  });
  if (!folder || folder.userId !== userId) {
    throw new FolderError(
      'Folder not found or permission denied',
      403
    );
  }
  logger.info(
    `Ownership verified for deletion of folder ${folderId} by user ${userId}.`
  );

  try {
    await prisma.$transaction(async (tx) => {
      const descendantIds = await getAllDescendantIdsInternal(
        folderId,
        userId,
        tx
      );
      const allFolderIdsToDelete = [folderId, ...descendantIds];
      logger.info(
        `Found ${descendantIds.length} descendants. Total folders to soft delete: ${allFolderIdsToDelete.length}`
      );

      if (moveBookmarksToFolderId) {
        const targetFolder = await tx.folder.findFirst({
          where: {
            id: moveBookmarksToFolderId,
            userId,
            isDeleted: false,
          },
        });
        if (!targetFolder)
          throw new FolderError(
            'Target folder for moving bookmarks not found or permission denied',
            404
          );
        const bookmarksToMove = await tx.folderBookmark.findMany({
          where: { folderId: { in: allFolderIdsToDelete } },
          select: { bookmarkId: true },
          distinct: ['bookmarkId'],
        });
        const uniqueBookmarkIds = bookmarksToMove.map(
          (bm) => bm.bookmarkId
        );
        if (uniqueBookmarkIds.length > 0) {
          await tx.folderBookmark.deleteMany({
            where: {
              folderId: { in: allFolderIdsToDelete },
              bookmarkId: { in: uniqueBookmarkIds },
            },
          });
          const newConnections = uniqueBookmarkIds.map(
            (bookmarkId) => ({
              bookmarkId: bookmarkId,
              folderId: moveBookmarksToFolderId,
            })
          );
          await tx.folderBookmark.createMany({
            data: newConnections,
            skipDuplicates: true,
          });
        }
      }
      const deleteTime = new Date();
      await tx.folder.updateMany({
        where: { id: { in: allFolderIdsToDelete } },
        data: { isDeleted: true, deletedAt: deleteTime },
      });
      logger.info(
        `Folder ${folderId} and its descendants soft deleted successfully by user ${userId}`
      );

      // --- Cache Invalidation ---
      await invalidateCachePattern(`user:${userId}:folders:list:*`);
      await invalidateCache(FOLDER_TREE_CACHE_KEY(userId));
      allFolderIdsToDelete.forEach((id) =>
        invalidateCache(FOLDER_DETAIL_CACHE_KEY(id))
      );

      emitToUser(userId, SOCKET_EVENTS.FOLDER_DELETED, {
        id: folderId,
        descendantIds,
      }); // Removed getIO()
    });
  } catch (error) {
    logger.error(
      `Error deleting folder ${folderId} for user ${userId}:`,
      error
    );
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new FolderError('Folder not found during delete', 404);
    }
    if (error instanceof FolderError) throw error;
    throw new FolderError('Failed to delete folder', 500);
  }
};

/**
 * Retrieves bookmarks within a specific folder, with pagination and sorting.
 * (Caching could be added here if this is frequently accessed)
 */
export const getBookmarksByFolder = async (
  folderId: string,
  userId: string,
  queryParams: z.infer<typeof getBookmarksInContainerQuerySchema>
) => {
  // Consider adding cacheWrap here if needed, using a key like `folder:${folderId}:bookmarks:${JSON.stringify(queryParams)}`
  const { limit, offset, sortBy, sortOrder } = queryParams;
  logger.debug(
    `Fetching bookmarks for folder ${folderId}, user ${userId} with limit: ${limit}, offset: ${offset}, sortBy: ${sortBy}, sortOrder: ${sortOrder}`
  );
  await checkFolderAccess(folderId, userId, [
    Role.VIEW,
    Role.EDIT,
    Role.ADMIN,
  ]);
  logger.info(
    `Access granted for user ${userId} to view folder ${folderId}. Fetching bookmarks.`
  );
  const where: Prisma.BookmarkWhereInput = {
    userId,
    isDeleted: false,
    folders: { some: { folderId } },
  };
  try {
    const [bookmarks, totalCount] = await prisma.$transaction([
      prisma.bookmark.findMany({
        where,
        include: {
          tags: {
            select: {
              tag: { select: { id: true, name: true, color: true } },
            },
          },
          folders: {
            select: { folder: { select: { id: true, name: true } } },
          },
        },
        orderBy: { [sortBy || 'createdAt']: sortOrder },
        skip: offset,
        take: limit,
      }),
      prisma.bookmark.count({ where }),
    ]);
    logger.info(
      `Found ${bookmarks.length} bookmarks (total: ${totalCount}) in folder ${folderId} for user ${userId}`
    );
    return {
      data: bookmarks,
      totalCount,
      page: Math.floor(offset / limit) + 1,
      limit,
      hasMore: offset + bookmarks.length < totalCount,
    };
  } catch (error) {
    logger.error(
      `Error fetching bookmarks for folder ${folderId}, user ${userId}:`,
      error
    );
    throw new FolderError(
      'Failed to fetch bookmarks for folder',
      500
    );
  }
};

// --- Folder Collaboration ---
// Note: Collaboration changes also need cache invalidation for affected users/folders

/**
 * Adds a collaborator to a folder. Invalidates relevant caches.
 */
export const addCollaborator = async (
  folderId: string,
  ownerId: string,
  collaboratorUserId: string,
  permission: Role
) => {
  // ... (validation logic remains the same)
  logger.debug(
    `Owner ${ownerId} attempting to add collaborator ${collaboratorUserId} to folder ${folderId} with permission ${permission}`
  );
  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
  });
  if (!folder || folder.isDeleted)
    throw new FolderError('Folder not found', 404);
  if (folder.userId !== ownerId)
    throw new FolderError(
      'Only the owner can add collaborators',
      403
    );
  const collaboratorUser = await prisma.user.findUnique({
    where: { id: collaboratorUserId },
  });
  if (!collaboratorUser)
    throw new FolderError('Collaborator user not found', 404);
  if (ownerId === collaboratorUserId)
    throw new FolderError(
      'Owner cannot be added as a collaborator',
      400
    );

  try {
    const collaborator = await prisma.folderCollaborator.create({
      data: { folderId, userId: collaboratorUserId, permission },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });
    logger.info(
      `Collaborator ${collaboratorUserId} added successfully to folder ${folderId} by owner ${ownerId}`
    );

    // --- Cache Invalidation ---
    await invalidateCache(FOLDER_DETAIL_CACHE_KEY(folderId));
    await invalidateCache(FOLDER_TREE_CACHE_KEY(ownerId));
    await invalidateCachePattern(`user:${ownerId}:folders:list:*`);
    await invalidateCache(FOLDER_TREE_CACHE_KEY(collaboratorUserId)); // Invalidate collaborator's tree too
    await invalidateCachePattern(
      `user:${collaboratorUserId}:folders:list:*`
    ); // Invalidate collaborator's list

    emitToUser(ownerId, SOCKET_EVENTS.FOLDER_UPDATED, {
      id: folderId,
      collaborators: [collaborator],
    }); // Removed getIO()
    emitToUser(collaboratorUserId, SOCKET_EVENTS.FOLDER_UPDATED, {
      id: folderId,
      collaborators: [collaborator],
    }); // Removed getIO()
    return collaborator;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new FolderError(
        'User is already a collaborator on this folder',
        409
      );
    }
    logger.error(
      `Error adding collaborator ${collaboratorUserId} to folder ${folderId}:`,
      error
    );
    throw new FolderError('Failed to add collaborator', 500);
  }
};

/**
 * Updates the permission of a collaborator on a folder. Invalidates relevant caches.
 */
export const updateCollaboratorPermission = async (
  folderId: string,
  ownerId: string,
  collaboratorUserId: string,
  permission: Role
) => {
  // ... (validation logic remains the same)
  logger.debug(
    `Owner ${ownerId} attempting to update collaborator ${collaboratorUserId} permission to ${permission} on folder ${folderId}`
  );
  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
  });
  if (!folder || folder.isDeleted)
    throw new FolderError('Folder not found', 404);
  if (folder.userId !== ownerId)
    throw new FolderError(
      'Only the owner can update permissions',
      403
    );
  if (ownerId === collaboratorUserId)
    throw new FolderError('Cannot change owner permission', 400);

  try {
    const updatedCollaborator =
      await prisma.folderCollaborator.update({
        where: {
          folderId_userId: { folderId, userId: collaboratorUserId },
        },
        data: { permission },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              profileImage: true,
            },
          },
        },
      });
    logger.info(
      `Collaborator ${collaboratorUserId} permission updated successfully to ${permission} in folder ${folderId}`
    );

    // --- Cache Invalidation ---
    await invalidateCache(FOLDER_DETAIL_CACHE_KEY(folderId));
    await invalidateCache(FOLDER_TREE_CACHE_KEY(ownerId));
    await invalidateCachePattern(`user:${ownerId}:folders:list:*`);
    await invalidateCache(FOLDER_TREE_CACHE_KEY(collaboratorUserId));
    await invalidateCachePattern(
      `user:${collaboratorUserId}:folders:list:*`
    );

    emitToUser(ownerId, SOCKET_EVENTS.FOLDER_UPDATED, {
      id: folderId,
      collaborators: [updatedCollaborator],
    }); // Removed getIO()
    emitToUser(collaboratorUserId, SOCKET_EVENTS.FOLDER_UPDATED, {
      id: folderId,
      collaborators: [updatedCollaborator],
    }); // Removed getIO()
    return updatedCollaborator;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new FolderError(
        'Collaborator not found on this folder',
        404
      );
    }
    logger.error(
      `Error updating permission for collaborator ${collaboratorUserId} on folder ${folderId}:`,
      error
    );
    throw new FolderError(
      'Failed to update collaborator permission',
      500
    );
  }
};

/**
 * Removes a collaborator from a folder. Invalidates relevant caches.
 */
export const removeCollaborator = async (
  folderId: string,
  ownerId: string,
  collaboratorUserId: string
): Promise<void> => {
  // ... (validation logic remains the same)
  logger.debug(
    `Owner ${ownerId} attempting to remove collaborator ${collaboratorUserId} from folder ${folderId}`
  );
  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
  });
  if (!folder || folder.isDeleted)
    throw new FolderError('Folder not found', 404);
  if (folder.userId !== ownerId)
    throw new FolderError(
      'Only the owner can remove collaborators',
      403
    );
  if (ownerId === collaboratorUserId)
    throw new FolderError(
      'Owner cannot be removed as a collaborator',
      400
    );

  try {
    await prisma.folderCollaborator.delete({
      where: {
        folderId_userId: { folderId, userId: collaboratorUserId },
      },
    });
    logger.info(
      `Collaborator ${collaboratorUserId} removed successfully from folder ${folderId}`
    );

    // --- Cache Invalidation ---
    await invalidateCache(FOLDER_DETAIL_CACHE_KEY(folderId));
    await invalidateCache(FOLDER_TREE_CACHE_KEY(ownerId));
    await invalidateCachePattern(`user:${ownerId}:folders:list:*`);
    await invalidateCache(FOLDER_TREE_CACHE_KEY(collaboratorUserId));
    await invalidateCachePattern(
      `user:${collaboratorUserId}:folders:list:*`
    );

    emitToUser(ownerId, SOCKET_EVENTS.FOLDER_UPDATED, {
      id: folderId,
      removedCollaboratorId: collaboratorUserId,
    }); // Removed getIO()
    emitToUser(collaboratorUserId, SOCKET_EVENTS.FOLDER_DELETED, {
      id: folderId,
    }); // Notify collaborator they lost access // Removed getIO()
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new FolderError(
        'Collaborator not found on this folder',
        404
      );
    }
    logger.error(
      `Error removing collaborator ${collaboratorUserId} from folder ${folderId}:`,
      error
    );
    throw new FolderError('Failed to remove collaborator', 500);
  }
};
