import prisma from '../config/db';
import { Prisma, Tag } from '@prisma/client';
import { z } from 'zod'; // Import Zod
import {
  CreateTagInput,
  UpdateTagInput,
  getTagsQuerySchema,
  getBookmarksByTagQuerySchema,
} from '../models/schemas';
import logger from '../config/logger';
import { emitToUser, SOCKET_EVENTS } from './socket.service'; // Import socket service
import { getIO } from '../config/socket'; // Import the io instance getter
import {
  cacheWrap,
  invalidateCache,
  invalidateCachePattern,
} from '../utils/cache'; // Import cache utilities

/**
 * Custom error class for tag-related service errors.
 */
export class TagError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'TagError';
    this.statusCode = statusCode;
  }
}

// --- Cache Keys ---
export const TAG_LIST_CACHE_KEY = (
  userId: string,
  queryParams: any
) => `user:${userId}:tags:list:${JSON.stringify(queryParams)}`;
export const TAG_DETAIL_CACHE_KEY = (tagId: string) =>
  `tag:${tagId}:details`;
export const TAG_BOOKMARKS_CACHE_KEY = (
  tagId: string,
  queryParams: any
) => `tag:${tagId}:bookmarks:${JSON.stringify(queryParams)}`;
export const USER_TAG_LIST_PATTERN = (userId: string) =>
  `user:${userId}:tags:list:*`;

// --- Tag CRUD ---

/**
 * Creates a new tag for a user. Invalidates relevant caches.
 */
export const createTag = async (
  userId: string,
  data: CreateTagInput
): Promise<Tag> => {
  const { name, color } = data;
  logger.info(`Creating tag "${name}" for user ${userId}`);

  const existingTag = await prisma.tag.findFirst({
    where: { name, userId, isDeleted: false },
  });
  if (existingTag) {
    throw new TagError('A tag with this name already exists', 409);
  }

  try {
    const newTag = await prisma.tag.create({
      data: { name, color: color || '#808080', userId },
    });
    logger.info(
      `Tag created successfully: ${newTag.id} for user ${userId}`
    );

    // --- Cache Invalidation ---
    await invalidateCachePattern(USER_TAG_LIST_PATTERN(userId)); // Invalidate all tag lists for this user

    emitToUser(getIO(), userId, SOCKET_EVENTS.TAG_CREATED, newTag); // Use getIO()
    return newTag;
  } catch (error) {
    logger.error(
      `Error creating tag "${name}" for user ${userId}:`,
      error
    );
    throw new TagError('Failed to create tag', 500);
  }
};

/**
 * Retrieves all tags for a specific user with pagination and sorting, using caching.
 */
export const getAllUserTags = async (
  userId: string,
  queryParams: z.infer<typeof getTagsQuerySchema>
) => {
  const cacheKey = TAG_LIST_CACHE_KEY(userId, queryParams);

  const cachedResult = await cacheWrap(cacheKey, async () => {
    const { limit, offset, sortBy, sortOrder } = queryParams;
    logger.debug(
      `Fetching tags (DB) for user ${userId} with limit: ${limit}, offset: ${offset}, sortBy: ${sortBy}, sortOrder: ${sortOrder}`
    );

    const where: Prisma.TagWhereInput = { userId, isDeleted: false };

    try {
      const [tags, totalCount] = await prisma.$transaction([
        prisma.tag.findMany({
          where,
          include: {
            _count: {
              select: {
                bookmarks: {
                  where: { bookmark: { isDeleted: false } },
                },
              },
            },
          },
          orderBy: { [sortBy || 'name']: sortOrder },
          skip: offset,
          take: limit,
        }),
        prisma.tag.count({ where }),
      ]);

      // Map tags and remove the _count property
      const tagsWithCount = tags.map((tag) => {
        const { _count, ...rest } = tag;
        return { ...rest, bookmarkCount: _count?.bookmarks ?? 0 };
      });
      logger.info(
        `Found ${tagsWithCount.length} tags (DB) (total: ${totalCount}) for user ${userId}`
      );

      return {
        data: tagsWithCount,
        totalCount,
        page: Math.floor(offset / limit) + 1,
        limit,
        hasMore: offset + tagsWithCount.length < totalCount,
      };
    } catch (error) {
      logger.error(
        `Error fetching tags (DB) for user ${userId}:`,
        error
      );
      throw new TagError('Failed to fetch tags', 500);
    }
  });

  if (cachedResult === null)
    throw new TagError('Failed to fetch tags', 500);
  return cachedResult;
};

/**
 * Retrieves a specific tag by ID for a user, using caching.
 */
export const getTagById = async (tagId: string, userId: string) => {
  const cacheKey = TAG_DETAIL_CACHE_KEY(tagId);

  const cachedResult = await cacheWrap(cacheKey, async () => {
    logger.debug(`Fetching tag ${tagId} (DB) for user ${userId}`);
    try {
      const tag = await prisma.tag.findFirst({
        where: { id: tagId, userId, isDeleted: false },
        include: {
          _count: {
            select: {
              bookmarks: {
                where: { bookmark: { isDeleted: false } },
              },
            },
          },
        },
      });
      if (!tag) {
        logger.warn(
          `Tag ${tagId} not found or deleted for user ${userId}.`
        );
        throw new TagError('Tag not found', 404);
      }
      const { _count, ...tagData } = tag;
      const tagWithCount = {
        ...tagData,
        bookmarkCount: _count?.bookmarks ?? 0,
      };
      logger.info(
        `Tag ${tagId} fetched successfully (DB) for user ${userId}`
      );
      return tagWithCount;
    } catch (error) {
      logger.error(
        `Error fetching tag ${tagId} (DB) for user ${userId}:`,
        error
      );
      if (error instanceof TagError) throw error;
      throw new TagError('Failed to fetch tag', 500);
    }
  });

  if (cachedResult === null)
    throw new TagError('Failed to fetch tag', 500);
  // Re-check ownership on cached data
  if (cachedResult.userId !== userId) {
    logger.warn(
      `Cache access violation attempt: User ${userId} tried to access tag ${tagId} owned by ${cachedResult.userId}`
    );
    throw new TagError('Tag not found', 404); // Treat as not found for security
  }
  return cachedResult;
};

/**
 * Updates an existing tag for a user. Invalidates relevant caches.
 */
export const updateTag = async (
  tagId: string,
  userId: string,
  data: UpdateTagInput
): Promise<Tag> => {
  const { name, color } = data;
  logger.debug(`User ${userId} attempting to update tag ${tagId}`);

  const existingTag = await prisma.tag.findFirst({
    where: { id: tagId, userId, isDeleted: false },
  });
  if (!existingTag) {
    throw new TagError('Tag not found', 404);
  }

  if (name && name !== existingTag.name) {
    const duplicateTag = await prisma.tag.findFirst({
      where: { name, userId, id: { not: tagId }, isDeleted: false },
    });
    if (duplicateTag) {
      throw new TagError(
        'Another tag with this name already exists',
        409
      );
    }
  }

  try {
    const updatedTag = await prisma.tag.update({
      where: { id: tagId },
      data: { name: name ?? undefined, color: color ?? undefined },
    });
    logger.info(
      `Tag updated successfully: ${tagId} by user ${userId}`
    );

    // --- Cache Invalidation ---
    await invalidateCache(TAG_DETAIL_CACHE_KEY(tagId));
    await invalidateCachePattern(USER_TAG_LIST_PATTERN(userId));
    // Invalidate related bookmark caches? Could be many. Pattern invalidation might be safer.
    await invalidateCachePattern(`user:${userId}:bookmarks:*`);

    emitToUser(
      getIO(),
      userId,
      SOCKET_EVENTS.TAG_UPDATED,
      updatedTag
    ); // Use getIO()
    return updatedTag;
  } catch (error) {
    logger.error(
      `Error updating tag ${tagId} for user ${userId}:`,
      error
    );
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new TagError('Tag not found during update', 404);
    }
    if (error instanceof TagError) throw error;
    throw new TagError('Failed to update tag', 500);
  }
};

/**
 * Deletes a tag for a user (soft delete). Invalidates relevant caches.
 */
export const deleteTag = async (
  tagId: string,
  userId: string
): Promise<void> => {
  logger.debug(`User ${userId} attempting to delete tag ${tagId}`);
  const tag = await prisma.tag.findFirst({
    where: { id: tagId, userId, isDeleted: false },
  });
  if (!tag) {
    throw new TagError('Tag not found', 404);
  }

  try {
    await prisma.tag.update({
      where: { id: tagId },
      data: { isDeleted: true, deletedAt: new Date() },
    });
    logger.info(
      `Tag soft deleted successfully: ${tagId} by user ${userId}`
    );

    // --- Cache Invalidation ---
    await invalidateCache(TAG_DETAIL_CACHE_KEY(tagId));
    await invalidateCachePattern(USER_TAG_LIST_PATTERN(userId));
    await invalidateCachePattern(TAG_BOOKMARKS_CACHE_KEY(tagId, '*')); // Invalidate bookmarks list for this tag
    // Invalidate related bookmark caches? Could be many. Pattern invalidation might be safer.
    await invalidateCachePattern(`user:${userId}:bookmarks:*`);

    emitToUser(getIO(), userId, SOCKET_EVENTS.TAG_DELETED, {
      id: tagId,
    }); // Use getIO()
  } catch (error) {
    logger.error(
      `Error deleting tag ${tagId} for user ${userId}:`,
      error
    );
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new TagError('Tag not found during delete', 404);
    }
    if (error instanceof TagError) throw error;
    throw new TagError('Failed to delete tag', 500);
  }
};

// --- Tag/Bookmark Relationship Management ---

/**
 * Retrieves all non-deleted bookmarks associated with a specific tag for a user, with pagination and sorting, using caching.
 */
export const getBookmarksByTag = async (
  tagId: string,
  userId: string,
  queryParams: z.infer<typeof getBookmarksByTagQuerySchema>
) => {
  const cacheKey = TAG_BOOKMARKS_CACHE_KEY(tagId, queryParams);

  // Check if tag exists and belongs to the user *before* caching
  const tag = await prisma.tag.findFirst({
    where: { id: tagId, userId, isDeleted: false },
  });
  if (!tag) {
    logger.warn(
      `Get bookmarks by tag failed: Tag ${tagId} not found or deleted for user ${userId}.`
    );
    throw new TagError('Tag not found', 404);
  }

  const cachedResult = await cacheWrap(cacheKey, async () => {
    const { limit, offset, sortBy, sortOrder } = queryParams;
    logger.debug(
      `Fetching bookmarks for tag ${tagId} (DB), user ${userId} with limit: ${limit}, offset: ${offset}, sortBy: ${sortBy}, sortOrder: ${sortOrder}`
    );

    const where: Prisma.BookmarkWhereInput = {
      userId,
      isDeleted: false,
      tags: { some: { tagId } },
    };

    try {
      const [bookmarks, totalCount] = await prisma.$transaction([
        prisma.bookmark.findMany({
          where,
          include: {
            tags: {
              select: {
                tag: {
                  select: { id: true, name: true, color: true },
                },
              },
            },
            folders: {
              select: {
                folder: { select: { id: true, name: true } },
              },
            },
          },
          orderBy: { [sortBy || 'createdAt']: sortOrder },
          skip: offset,
          take: limit,
        }),
        prisma.bookmark.count({ where }),
      ]);

      logger.info(
        `Found ${bookmarks.length} bookmarks (DB) (total: ${totalCount}) for tag ${tagId}, user ${userId}`
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
        `Error fetching bookmarks (DB) for tag ${tagId}, user ${userId}:`,
        error
      );
      throw new TagError('Failed to fetch bookmarks by tag', 500);
    }
  });

  if (cachedResult === null)
    throw new TagError('Failed to fetch bookmarks by tag', 500);
  return cachedResult;
};

// Note: assignTagToBookmark and removeTagFromBookmark logic is handled in bookmark.service.ts
