// src/services/tag.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended'; // Import mockDeep
import { PrismaClient, Prisma, Tag } from '@prisma/client'; // Import PrismaClient and types
import prisma from '../config/db'; // Import the actual prisma instance path (Vitest will auto-mock)
import * as tagService from './tag.service';
import {
  TagError,
  TAG_LIST_CACHE_KEY,
  TAG_DETAIL_CACHE_KEY,
  TAG_BOOKMARKS_CACHE_KEY,
  USER_TAG_LIST_PATTERN,
} from './tag.service'; // Import necessary constants/types
import logger from '../config/logger';
import {
  cacheWrap,
  invalidateCache,
  invalidateCachePattern,
} from '../utils/cache';
import { emitToUser, SOCKET_EVENTS } from './socket.service';

// --- Mocks ---

// Prisma is now auto-mocked via __mocks__/prisma.ts

// Keep other mocks as they are
vi.mock('../utils/cache', () => ({
  cacheWrap: vi.fn(),
  invalidateCache: vi.fn(),
  invalidateCachePattern: vi.fn(),
}));

vi.mock('./socket.service', () => ({
  // Simplify mock definition back to just vi.fn()
  emitToUser: vi.fn(),
  SOCKET_EVENTS: {
    TAG_CREATED: 'tag:created',
    TAG_UPDATED: 'tag:updated',
    TAG_DELETED: 'tag:deleted',
  },
}));

vi.mock('../config/logger', () => ({
  default: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

// --- Tests ---

describe('Tag Service', () => {
  // Use the deep mocked PrismaClient instance type, casting the auto-mocked import
  let mockPrisma: DeepMockProxy<PrismaClient>;

  // Keep mocks for other dependencies
  const mockCacheWrap = vi.mocked(cacheWrap);
  const mockInvalidateCache = vi.mocked(invalidateCache);
  const mockInvalidateCachePattern = vi.mocked(
    invalidateCachePattern
  );
  const mockEmitToUser = vi.mocked(emitToUser);
  const mockLogger = vi.mocked(logger);

  const userId = 'user-uuid-tag';
  const tagId = 'tag-uuid-1';

  // Helper to create a mock tag object
  const createMockTag = (
    id: string,
    userId: string,
    overrides = {}
  ): Tag => ({
    id,
    userId,
    name: `Tag ${id}`,
    color: '#808080',
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    deletedAt: null,
    ...overrides,
  });

  beforeEach(() => {
    // Reset non-prisma mocks
    vi.resetAllMocks();
    // Assign the deep mock instance (auto-mocked by Vitest)
    mockPrisma = prisma as unknown as DeepMockProxy<PrismaClient>;
    // Default mock for cacheWrap to execute the function directly (cache miss)
    mockCacheWrap.mockImplementation(async (key, fn) => await fn());
    // Rely on the global mock for $transaction from vi.mock('../config/db', ...)
    // NOTE: The mockReset for prisma is handled by the beforeEach in __mocks__/prisma.ts
  });

  // --- createTag Tests ---
  describe('createTag', () => {
    const tagData = { name: 'New Tag', color: '#ff0000' };
    const createdTag = createMockTag('new-tag-id', userId, tagData);

    it('should create a tag successfully', async () => {
      mockPrisma.tag.findFirst.mockResolvedValue(null); // No existing tag
      mockPrisma.tag.create.mockResolvedValue(createdTag);
      const result = await tagService.createTag(userId, tagData);
      expect(mockPrisma.tag.findFirst).toHaveBeenCalledWith({
        where: { name: tagData.name, userId, isDeleted: false },
      });
      expect(mockPrisma.tag.create).toHaveBeenCalledWith({
        data: { ...tagData, userId },
      });
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(
        USER_TAG_LIST_PATTERN(userId)
      );
      expect(mockEmitToUser).toHaveBeenCalledWith(
        expect.any(Object),
        userId,
        SOCKET_EVENTS.TAG_CREATED,
        createdTag
      ); // Added expect.any(Object) for ioInstance
      expect(result).toEqual(createdTag);
    });

    it('should create a tag with default color if not provided', async () => {
      const dataWithoutColor = { name: 'Tag No Color' };
      const createdTagWithDefaultColor = createMockTag(
        'no-color-id',
        userId,
        { ...dataWithoutColor, color: '#808080' }
      );
      mockPrisma.tag.findFirst.mockResolvedValue(null);
      mockPrisma.tag.create.mockResolvedValue(
        createdTagWithDefaultColor
      );
      await tagService.createTag(userId, dataWithoutColor);
      expect(mockPrisma.tag.create).toHaveBeenCalledWith({
        data: {
          name: dataWithoutColor.name,
          color: '#808080',
          userId,
        },
      });
    });

    it('should throw TagError if tag name already exists', async () => {
      mockPrisma.tag.findFirst.mockResolvedValue(createdTag); // Simulate existing tag
      await expect(
        tagService.createTag(userId, tagData)
      ).rejects.toThrow(TagError);
      await expect(
        tagService.createTag(userId, tagData)
      ).rejects.toThrow('A tag with this name already exists');
    });
  });

  // --- getAllUserTags Tests ---
  describe('getAllUserTags', () => {
    const queryParams = {
      limit: 10,
      offset: 0,
      sortBy: 'name' as const,
      sortOrder: 'asc' as const,
    };
    const cacheKey = TAG_LIST_CACHE_KEY(userId, queryParams);
    const mockDbTag = createMockTag(tagId, userId);
    const mockTagWithCount = {
      ...mockDbTag,
      _count: { bookmarks: 3 },
    };
    const mockServiceResult = {
      data: [{ ...mockDbTag, bookmarkCount: 3 }],
      totalCount: 1,
      page: 1,
      limit: 10,
      hasMore: false,
    };

    it('should return cached data if available', async () => {
      mockCacheWrap.mockResolvedValue(mockServiceResult);
      const result = await tagService.getAllUserTags(
        userId,
        queryParams
      );
      expect(mockCacheWrap).toHaveBeenCalledWith(
        cacheKey,
        expect.any(Function)
      );
      expect(result).toEqual(mockServiceResult);
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });

    it('should fetch from DB, cache, and return data if cache miss', async () => {
      mockCacheWrap.mockImplementation(async (key, fn) => await fn());
      mockPrisma.$transaction.mockResolvedValue([
        [mockTagWithCount],
        1,
      ] as any);

      const result = await tagService.getAllUserTags(
        userId,
        queryParams
      );
      expect(mockCacheWrap).toHaveBeenCalledWith(
        cacheKey,
        expect.any(Function)
      );
      expect(mockPrisma.$transaction).toHaveBeenCalled();
      expect(result).toEqual(mockServiceResult);
    });

    it('should throw TagError if cacheWrap returns null', async () => {
      mockCacheWrap.mockResolvedValue(null);
      await expect(
        tagService.getAllUserTags(userId, queryParams)
      ).rejects.toThrow(TagError);
      await expect(
        tagService.getAllUserTags(userId, queryParams)
      ).rejects.toThrow('Failed to fetch tags');
    });
  });

  // --- getTagById Tests ---
  describe('getTagById', () => {
    const cacheKey = TAG_DETAIL_CACHE_KEY(tagId);
    const mockDbTag = createMockTag(tagId, userId);
    const mockTagWithCount = {
      ...mockDbTag,
      _count: { bookmarks: 2 },
    };
    const mockServiceResult = { ...mockDbTag, bookmarkCount: 2 };

    it('should return cached data if available and owned by user', async () => {
      mockCacheWrap.mockResolvedValue(mockServiceResult);
      const result = await tagService.getTagById(tagId, userId);
      expect(mockCacheWrap).toHaveBeenCalledWith(
        cacheKey,
        expect.any(Function)
      );
      expect(result).toEqual(mockServiceResult);
      expect(mockPrisma.tag.findFirst).not.toHaveBeenCalled();
    });

    it('should throw TagError if cached data is not owned by user', async () => {
      const cachedDataWrongUser = {
        ...mockServiceResult,
        userId: 'other-user',
      };
      mockCacheWrap.mockResolvedValue(cachedDataWrongUser);
      await expect(
        tagService.getTagById(tagId, userId)
      ).rejects.toThrow(TagError);
      await expect(
        tagService.getTagById(tagId, userId)
      ).rejects.toThrow('Tag not found');
    });

    it('should fetch from DB, cache, and return data if cache miss', async () => {
      mockCacheWrap.mockImplementation(async (key, fn) => await fn());
      mockPrisma.tag.findFirst.mockResolvedValue(mockTagWithCount);
      const result = await tagService.getTagById(tagId, userId);
      expect(mockCacheWrap).toHaveBeenCalledWith(
        cacheKey,
        expect.any(Function)
      );
      expect(mockPrisma.tag.findFirst).toHaveBeenCalledWith({
        where: { id: tagId, userId, isDeleted: false },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockServiceResult);
    });

    it('should throw TagError if tag not found in DB', async () => {
      mockCacheWrap.mockImplementation(async (key, fn) => await fn());
      mockPrisma.tag.findFirst.mockResolvedValue(null);
      await expect(
        tagService.getTagById(tagId, userId)
      ).rejects.toThrow(TagError);
      await expect(
        tagService.getTagById(tagId, userId)
      ).rejects.toThrow('Tag not found');
    });
  });

  // --- updateTag Tests ---
  describe('updateTag', () => {
    const updateData = { name: 'Updated Tag', color: '#00ff00' };
    const mockExistingTag = createMockTag(tagId, userId);
    const mockUpdatedTag = {
      ...mockExistingTag,
      ...updateData,
      updatedAt: new Date(),
    };

    beforeEach(() => {
      mockPrisma.tag.findFirst.mockResolvedValueOnce(mockExistingTag); // For initial check
      mockPrisma.tag.findFirst.mockResolvedValue(null); // For duplicate check
      mockPrisma.tag.update.mockResolvedValue(mockUpdatedTag);
    });

    it('should update tag successfully', async () => {
      const result = await tagService.updateTag(
        tagId,
        userId,
        updateData
      );
      expect(mockPrisma.tag.findFirst).toHaveBeenCalledWith({
        where: { id: tagId, userId, isDeleted: false },
      });
      expect(mockPrisma.tag.findFirst).toHaveBeenCalledWith({
        where: {
          name: updateData.name,
          userId,
          id: { not: tagId },
          isDeleted: false,
        },
      });
      expect(mockPrisma.tag.update).toHaveBeenCalledWith({
        where: { id: tagId },
        data: updateData,
      });
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        TAG_DETAIL_CACHE_KEY(tagId)
      );
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(
        USER_TAG_LIST_PATTERN(userId)
      );
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(
        `user:${userId}:bookmarks:*`
      );
      expect(mockEmitToUser).toHaveBeenCalledWith(
        expect.any(Object),
        userId,
        SOCKET_EVENTS.TAG_UPDATED,
        mockUpdatedTag
      ); // Added expect.any(Object) for ioInstance
      expect(result).toEqual(mockUpdatedTag);
    });

    it('should throw TagError if tag not found', async () => {
      // Explicitly reset this mock for this test
      vi.mocked(mockPrisma.tag.findFirst).mockReset();
      // Setup mocks specific to this test
      mockPrisma.tag.findFirst.mockResolvedValue(null); // Simulate not found on the *first* check
      await expect(
        tagService.updateTag(tagId, userId, updateData)
      ).rejects.toThrow(TagError);
      await expect(
        tagService.updateTag(tagId, userId, updateData)
      ).rejects.toThrow('Tag not found');
      // Ensure update was not called if findFirst failed
      expect(mockPrisma.tag.update).not.toHaveBeenCalled();
    });

    it('should throw TagError if name already exists', async () => {
      // Setup mocks specific to this test
      mockPrisma.tag.findFirst.mockResolvedValueOnce(mockExistingTag); // Initial check ok
      mockPrisma.tag.findFirst.mockResolvedValue(
        createMockTag('other-tag', userId)
      ); // Duplicate found
      await expect(
        tagService.updateTag(tagId, userId, updateData)
      ).rejects.toThrow(TagError);
      await expect(
        tagService.updateTag(tagId, userId, updateData)
      ).rejects.toThrow('Another tag with this name already exists');
    });
  });

  // --- deleteTag Tests ---
  describe('deleteTag', () => {
    const mockExistingTag = createMockTag(tagId, userId);

    beforeEach(() => {
      mockPrisma.tag.findFirst.mockResolvedValue(mockExistingTag);
      mockPrisma.tag.update.mockResolvedValue({} as any); // Mock soft delete
    });

    it('should soft delete tag successfully', async () => {
      await tagService.deleteTag(tagId, userId);
      expect(mockPrisma.tag.findFirst).toHaveBeenCalledWith({
        where: { id: tagId, userId, isDeleted: false },
      });
      expect(mockPrisma.tag.update).toHaveBeenCalledWith({
        where: { id: tagId },
        data: { isDeleted: true, deletedAt: expect.any(Date) },
      });
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        TAG_DETAIL_CACHE_KEY(tagId)
      );
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(
        USER_TAG_LIST_PATTERN(userId)
      );
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(
        TAG_BOOKMARKS_CACHE_KEY(tagId, '*')
      );
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(
        `user:${userId}:bookmarks:*`
      );
      expect(mockEmitToUser).toHaveBeenCalledWith(
        expect.any(Object),
        userId,
        SOCKET_EVENTS.TAG_DELETED,
        { id: tagId }
      ); // Added expect.any(Object) for ioInstance
    });

    it('should throw TagError if tag not found', async () => {
      mockPrisma.tag.findFirst.mockResolvedValue(null);
      await expect(
        tagService.deleteTag(tagId, userId)
      ).rejects.toThrow(TagError);
      await expect(
        tagService.deleteTag(tagId, userId)
      ).rejects.toThrow('Tag not found');
    });
  });

  // --- getBookmarksByTag Tests ---
  describe('getBookmarksByTag', () => {
    const queryParams = {
      limit: 10,
      offset: 0,
      sortBy: 'createdAt' as const,
      sortOrder: 'desc' as const,
    };
    const cacheKey = TAG_BOOKMARKS_CACHE_KEY(tagId, queryParams);
    const mockTag = createMockTag(tagId, userId);
    const mockBookmark = createMockTag('bm-tag-1', userId); // Using createMockTag for simplicity, adjust if needed
    const mockServiceResult = {
      data: [mockBookmark],
      totalCount: 1,
      page: 1,
      limit: 10,
      hasMore: false,
    };

    beforeEach(() => {
      mockPrisma.tag.findFirst.mockResolvedValue(mockTag); // Tag exists check
    });

    it('should return cached data if available', async () => {
      mockCacheWrap.mockResolvedValue(mockServiceResult);
      const result = await tagService.getBookmarksByTag(
        tagId,
        userId,
        queryParams
      );
      expect(mockPrisma.tag.findFirst).toHaveBeenCalledWith({
        where: { id: tagId, userId, isDeleted: false },
      });
      expect(mockCacheWrap).toHaveBeenCalledWith(
        cacheKey,
        expect.any(Function)
      );
      expect(result).toEqual(mockServiceResult);
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });

    it('should fetch from DB, cache, and return if cache miss', async () => {
      mockCacheWrap.mockImplementation(async (key, fn) => await fn());
      mockPrisma.$transaction.mockResolvedValue([
        [mockBookmark],
        1,
      ] as any);
      const result = await tagService.getBookmarksByTag(
        tagId,
        userId,
        queryParams
      );
      expect(mockPrisma.tag.findFirst).toHaveBeenCalledWith({
        where: { id: tagId, userId, isDeleted: false },
      });
      expect(mockCacheWrap).toHaveBeenCalledWith(
        cacheKey,
        expect.any(Function)
      );
      expect(mockPrisma.$transaction).toHaveBeenCalled();
      expect(result).toEqual(mockServiceResult);
    });

    it('should throw TagError if tag not found', async () => {
      mockPrisma.tag.findFirst.mockResolvedValue(null); // Simulate tag not found
      await expect(
        tagService.getBookmarksByTag(tagId, userId, queryParams)
      ).rejects.toThrow(TagError);
      await expect(
        tagService.getBookmarksByTag(tagId, userId, queryParams)
      ).rejects.toThrow('Tag not found');
    });

    it('should throw TagError if cacheWrap returns null', async () => {
      mockCacheWrap.mockResolvedValue(null);
      await expect(
        tagService.getBookmarksByTag(tagId, userId, queryParams)
      ).rejects.toThrow(TagError);
      await expect(
        tagService.getBookmarksByTag(tagId, userId, queryParams)
      ).rejects.toThrow('Failed to fetch bookmarks by tag');
    });
  });
});
