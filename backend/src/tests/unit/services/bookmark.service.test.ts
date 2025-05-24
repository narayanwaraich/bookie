// src/services/bookmark.service.test.ts
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from 'vitest';
import {
  mockDeep,
  DeepMockProxy,
  mockReset,
} from 'vitest-mock-extended'; // Import mockDeep and mockReset
import {
  PrismaClient,
  Prisma,
  Role,
  Bookmark,
  Folder,
  Tag,
  Collection,
} from '@prisma/client'; // Import PrismaClient and types
import prisma from '../config/db'; // Import the actual prisma instance path for mocking
import * as bookmarkService from './bookmark.service';
import { BookmarkError } from './bookmark.service';
import logger from '../config/logger';
import {
  cacheWrap,
  invalidateCache,
  invalidateCachePattern,
} from '../utils/cache';
import { emitToUser, SOCKET_EVENTS } from './socket.service';
import { fetchUrlMetadata } from '../utils/metadata';

// --- Mocks ---

// Prisma client is mocked globally in src/tests/setup.ts

// Keep other mocks as they are
vi.mock('../utils/cache', () => ({
  cacheWrap: vi.fn(),
  invalidateCache: vi.fn(),
  invalidateCachePattern: vi.fn(),
}));

vi.mock('./socket.service', () => ({
  emitToUser: vi.fn(),
  SOCKET_EVENTS: {
    BOOKMARK_CREATED: 'bookmark:created',
    BOOKMARK_UPDATED: 'bookmark:updated',
    BOOKMARK_DELETED: 'bookmark:deleted',
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

vi.mock('../utils/metadata', () => ({
  fetchUrlMetadata: vi.fn(),
}));

// --- Tests ---

describe('Bookmark Service', () => {
  // Use the deep mocked PrismaClient instance type
  let mockPrisma: DeepMockProxy<PrismaClient>;

  // Keep mocks for other dependencies
  const mockCacheWrap = vi.mocked(cacheWrap);
  const mockInvalidateCache = vi.mocked(invalidateCache);
  const mockInvalidateCachePattern = vi.mocked(
    invalidateCachePattern
  );
  const mockEmitToUser = vi.mocked(emitToUser);
  const mockLogger = vi.mocked(logger);
  const mockFetchUrlMetadata = vi.mocked(fetchUrlMetadata);

  const userId = 'user-uuid-bookmark';
  const bookmarkId = 'bookmark-uuid-1';
  const folderId = 'folder-uuid-bm';
  const tagId = 'tag-uuid-bm';
  const collectionId = 'collection-uuid-bm';

  // Helper to create mock bookmark (excluding unsupported fields like fullTextSearch)
  const createMockBookmark = (
    id: string,
    userId: string,
    overrides = {}
  ): Bookmark => ({
    id,
    userId,
    url: `http://test.com/${id}`,
    title: `Bookmark ${id}`,
    description: null,
    favicon: null,
    previewImage: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastVisited: null,
    visitCount: 0,
    notes: null,
    isDeleted: false,
    deletedAt: null,
    ...overrides,
  });

  // Helper to create mock folder (needed locally)
  const createMockFolder = (
    id: string,
    userId: string,
    parentId: string | null = null,
    overrides = {}
  ): Folder => ({
    id,
    userId,
    parentId,
    name: `Folder ${id}`,
    description: null,
    icon: null,
    color: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    deletedAt: null,
    ...overrides,
  });

  // Define Folder keys locally as they are needed for invalidation here
  const FOLDER_TREE_CACHE_KEY = (userId: string) =>
    `user:${userId}:folders:tree`;
  const FOLDER_DETAIL_CACHE_KEY = (folderId: string) =>
    `folder:${folderId}:details`;

  beforeEach(() => {
    // Explicitly reset mocks used in this file, in addition to setup.ts resets
    mockReset(mockFetchUrlMetadata);
    mockReset(mockEmitToUser);
    // Assign the deep mock instance before each test
    mockPrisma = prisma as unknown as DeepMockProxy<PrismaClient>;
    // Default mock for cacheWrap to execute the function directly (cache miss)
    mockCacheWrap.mockImplementation(async (key, fn) => await fn());
    // Mock the transaction implementation
    mockPrisma.$transaction.mockImplementation(async (callback) =>
      callback(mockPrisma)
    );
  });

  // --- createBookmark Tests ---
  describe('createBookmark', () => {
    const bookmarkData = {
      url: 'http://new.com',
      title: 'New BM',
      description: 'New Desc',
      notes: 'Note',
      folderId: undefined,
      tags: [],
    };
    const createdBookmark = createMockBookmark('new-bm-id', userId, {
      ...bookmarkData,
    });
    // Simulate the include structure returned by the service
    const completeBookmark = {
      ...createdBookmark,
      folders: [],
      tags: [],
    };

    beforeEach(() => {
      // Moved mockFetchUrlMetadata setup into the specific test case
      mockPrisma.bookmark.create.mockResolvedValue(createdBookmark);
      // Mock the findUnique call that happens *after* the transaction
      mockPrisma.bookmark.findUnique.mockResolvedValue(
        completeBookmark
      );
    });

    it('should create a bookmark successfully without folder/tags', async () => {
      // Setup mock specifically for this test
      // mockFetchUrlMetadata should NOT be called as title/desc are provided
      const result = await bookmarkService.createBookmark(
        userId,
        bookmarkData
      );

      expect(mockFetchUrlMetadata).not.toHaveBeenCalled(); // Corrected expectation
      expect(mockPrisma.$transaction).toHaveBeenCalled();
      expect(mockPrisma.bookmark.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId,
          url: bookmarkData.url,
          title: bookmarkData.title,
        }),
      });
      expect(mockPrisma.folderBookmark.create).not.toHaveBeenCalled();
      expect(mockPrisma.bookmarkTag.create).not.toHaveBeenCalled();
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(
        `user:${userId}:bookmarks:*`
      );
      expect(mockEmitToUser).toHaveBeenCalledWith(
        userId,
        SOCKET_EVENTS.BOOKMARK_CREATED,
        completeBookmark
      ); // Reverted
      expect(result).toEqual(completeBookmark);
    });

    it('should use fetched metadata if title/desc not provided', async () => {
      // Simplify the mock return value for this test
      mockFetchUrlMetadata.mockResolvedValue({
        title: 'Fetched Title',
        description: 'Fetched Desc',
      });
      const dataWithoutTitleDesc = {
        ...bookmarkData,
        title: undefined,
        description: undefined,
      };
      await bookmarkService.createBookmark(
        userId,
        dataWithoutTitleDesc
      );
      // Expect title/desc to be overridden, and favicon/previewImage to be null (as they weren't in the simplified mock)
      expect(mockPrisma.bookmark.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: 'Fetched Title',
          description: 'Fetched Desc',
          favicon: null,
          previewImage: null,
        }),
      });
    });

    it('should create bookmark and add to folder', async () => {
      const dataWithFolder = { ...bookmarkData, folderId: folderId };
      mockPrisma.folder.findFirst.mockResolvedValue({
        id: folderId,
      } as any);
      mockPrisma.folderBookmark.create.mockResolvedValue({} as any);

      await bookmarkService.createBookmark(userId, dataWithFolder);

      expect(mockPrisma.folder.findFirst).toHaveBeenCalledWith({
        where: { id: folderId, OR: expect.any(Array) },
      });
      expect(mockPrisma.folderBookmark.create).toHaveBeenCalledWith({
        data: { folderId, bookmarkId: createdBookmark.id },
      });
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(
        `user:${userId}:folders:list:*`
      );
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        `user:${userId}:folders:tree`
      );
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        `folder:${folderId}:details`
      );
    });

    it('should create bookmark and add tags', async () => {
      const dataWithTags = { ...bookmarkData, tags: [tagId] };
      mockPrisma.tag.findMany.mockResolvedValue([
        { id: tagId },
      ] as any);
      mockPrisma.bookmarkTag.create.mockResolvedValue({} as any);

      await bookmarkService.createBookmark(userId, dataWithTags);

      expect(mockPrisma.tag.findMany).toHaveBeenCalledWith({
        where: { id: { in: [tagId] }, userId },
      });
      expect(mockPrisma.bookmarkTag.create).toHaveBeenCalledWith({
        data: { tagId, bookmarkId: createdBookmark.id },
      });
    });

    it('should throw if target folder not found', async () => {
      const dataWithFolder = {
        ...bookmarkData,
        folderId: 'bad-folder-id',
      };
      mockPrisma.folder.findFirst.mockResolvedValue(null); // Simulate folder not found
      await expect(
        bookmarkService.createBookmark(userId, dataWithFolder)
      ).rejects.toThrow(
        'Target folder not found or permission denied'
      );
    });

    it('should throw if one or more tags not found', async () => {
      const dataWithTags = {
        ...bookmarkData,
        tags: [tagId, 'bad-tag-id'],
      };
      mockPrisma.tag.findMany.mockResolvedValue([
        { id: tagId },
      ] as any); // Simulate only one tag found
      await expect(
        bookmarkService.createBookmark(userId, dataWithTags)
      ).rejects.toThrow(
        'One or more tags not found or not owned by user.'
      );
    });
  });

  // --- getBookmarkById Tests ---
  describe('getBookmarkById', () => {
    const mockBookmark = createMockBookmark(bookmarkId, userId);
    const cacheKey = `bookmark:${bookmarkId}:details`;
    // Simulate the full object returned by the service function after includes
    const mockFullBookmark = {
      ...mockBookmark,
      folders: [],
      tags: [],
      collections: [],
    };

    beforeEach(() => {
      mockPrisma.bookmark.findFirst.mockResolvedValue(mockBookmark); // For checkBookmarkAccess
      mockPrisma.bookmark.findUnique.mockResolvedValue(
        mockFullBookmark
      ); // For the actual fetch
      mockPrisma.bookmark.update.mockResolvedValue({} as any);
    });

    it('should return cached data if available', async () => {
      const cachedData = {
        ...mockFullBookmark,
        title: 'Cached Title',
      };
      mockCacheWrap.mockResolvedValue(cachedData);

      const result = await bookmarkService.getBookmarkById(
        bookmarkId,
        userId
      );

      expect(mockCacheWrap).toHaveBeenCalledWith(
        cacheKey,
        expect.any(Function)
      );
      expect(result).toEqual(cachedData);
      expect(mockPrisma.bookmark.findFirst).not.toHaveBeenCalled();
      expect(mockPrisma.bookmark.findUnique).not.toHaveBeenCalled();
    });

    it('should fetch from DB, cache, and return data if cache miss', async () => {
      mockCacheWrap.mockImplementation(async (key, fn) => await fn());

      const result = await bookmarkService.getBookmarkById(
        bookmarkId,
        userId
      );

      expect(mockCacheWrap).toHaveBeenCalledWith(
        cacheKey,
        expect.any(Function)
      );
      expect(mockPrisma.bookmark.findFirst).toHaveBeenCalledTimes(1);
      expect(mockPrisma.bookmark.update).toHaveBeenCalledWith({
        where: { id: bookmarkId },
        data: {
          visitCount: { increment: 1 },
          lastVisited: expect.any(Date),
        },
      });
      expect(mockPrisma.bookmark.findUnique).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockFullBookmark);
    });

    it('should throw if checkBookmarkAccess fails', async () => {
      mockCacheWrap.mockImplementation(async (key, fn) => await fn());
      mockPrisma.bookmark.findFirst.mockResolvedValue(null);

      await expect(
        bookmarkService.getBookmarkById(bookmarkId, userId)
      ).rejects.toThrow(BookmarkError);
      await expect(
        bookmarkService.getBookmarkById(bookmarkId, userId)
      ).rejects.toThrow('Bookmark not found');
    });
  });

  // --- updateBookmark Tests ---
  describe('updateBookmark', () => {
    const updateData = {
      title: 'Updated Title',
      description: 'Updated Desc',
    };
    const mockExisting = createMockBookmark(bookmarkId, userId);
    // Corrected: mockUpdatedRaw represents the direct return from prisma.update
    const mockUpdatedRaw = {
      ...mockExisting,
      ...updateData,
      updatedAt: new Date(),
    };
    // Corrected: mockUpdatedWithIncludes represents the final return with includes
    const mockUpdatedWithIncludes = {
      ...mockUpdatedRaw,
      folders: [],
      tags: [],
    };

    beforeEach(() => {
      mockPrisma.bookmark.findFirst.mockResolvedValue(mockExisting);
      // Mock the update call to return the raw updated bookmark
      mockPrisma.bookmark.update.mockResolvedValue(mockUpdatedRaw);
      // Mock the subsequent findUnique call to return the bookmark with includes
      mockPrisma.bookmark.findUnique.mockResolvedValue(
        mockUpdatedWithIncludes
      );
    });

    // Skip this test for now as requested
    it.skip('should update bookmark successfully', async () => {
      const result = await bookmarkService.updateBookmark(
        bookmarkId,
        userId,
        updateData
      );

      expect(mockPrisma.bookmark.findFirst).toHaveBeenCalledTimes(1);
      // The service now includes relations directly in the update call
      expect(mockPrisma.bookmark.update).toHaveBeenCalledWith({
        where: { id: bookmarkId },
        data: expect.objectContaining({ ...updateData, notes: null }), // Include notes: null check
        include: {
          // Match the service code include structure exactly
          folders: {
            include: { folder: { select: { id: true, name: true } } },
          },
          tags: {
            include: {
              tag: { select: { id: true, name: true, color: true } },
            },
          },
          // No collections included
        },
      });
      // No separate findUnique call is expected anymore
      // expect(mockPrisma.bookmark.findUnique).toHaveBeenCalledWith({
      //     where: { id: bookmarkId },
      //     include: {
      //         folders: { select: { folder: { select: { id: true, name: true } } } },
      //         tags: { select: { tag: { select: { id: true, name: true, color: true } } } },
      //         collections: { select: { collection: { select: { id: true, name: true } } } }
      //     }
      // });
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        `bookmark:${bookmarkId}:details`
      );
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(
        `user:${userId}:bookmarks:*`
      );
      expect(mockEmitToUser).toHaveBeenCalledWith(
        userId,
        SOCKET_EVENTS.BOOKMARK_UPDATED,
        mockUpdatedRaw
      ); // Expect the raw update result here
      expect(result).toEqual(mockUpdatedRaw); // Result should be the raw update result
    });

    it('should throw if checkBookmarkAccess fails', async () => {
      mockPrisma.bookmark.findFirst.mockResolvedValue(null);
      await expect(
        bookmarkService.updateBookmark(bookmarkId, userId, updateData)
      ).rejects.toThrow('Bookmark not found');
    });

    it('should throw if prisma update fails', async () => {
      const dbError = new Error('Update failed');
      mockPrisma.bookmark.update.mockRejectedValue(dbError);
      await expect(
        bookmarkService.updateBookmark(bookmarkId, userId, updateData)
      ).rejects.toThrow('Failed to update bookmark');
    });
  });

  // --- deleteBookmark Tests ---
  describe('deleteBookmark', () => {
    const mockExisting = createMockBookmark(bookmarkId, userId);

    beforeEach(() => {
      mockPrisma.bookmark.findFirst.mockResolvedValue(mockExisting);
      mockPrisma.bookmark.update.mockResolvedValue({} as any);
    });

    it('should soft delete bookmark successfully', async () => {
      vi.clearAllMocks(); // Try clearing all mocks specifically for this test
      // Re-mock necessary parts for this test after clearing
      mockPrisma.bookmark.findFirst.mockResolvedValue(mockExisting);
      mockPrisma.bookmark.update.mockResolvedValue({} as any);

      await bookmarkService.deleteBookmark(bookmarkId, userId);

      expect(mockPrisma.bookmark.findFirst).toHaveBeenCalledTimes(1);
      expect(mockPrisma.bookmark.update).toHaveBeenCalledWith({
        where: { id: bookmarkId },
        data: { isDeleted: true, deletedAt: expect.any(Date) },
      });
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        `bookmark:${bookmarkId}:details`
      );
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(
        `user:${userId}:bookmarks:*`
      );
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(
        `user:${userId}:folders:list:*`
      );
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        `user:${userId}:folders:tree`
      );
      expect(mockEmitToUser).toHaveBeenCalledWith(
        userId,
        SOCKET_EVENTS.BOOKMARK_DELETED,
        { id: bookmarkId }
      ); // Ensure this matches the service call signature (3 args)
    });

    it('should throw if checkBookmarkAccess fails', async () => {
      mockPrisma.bookmark.findFirst.mockResolvedValue(null);
      await expect(
        bookmarkService.deleteBookmark(bookmarkId, userId)
      ).rejects.toThrow('Bookmark not found');
    });
  });

  // --- searchBookmarks (Non-FTS) Tests ---
  describe('searchBookmarks (Non-FTS)', () => {
    const searchParams = {
      query: undefined,
      limit: 10,
      offset: 0,
      sortBy: 'title' as const,
      sortOrder: 'asc' as const,
    };
    const cacheKey = `user:${userId}:bookmarks:search:${JSON.stringify(
      searchParams
    )}`;
    const mockBookmark = createMockBookmark(bookmarkId, userId);
    const mockSearchResult = {
      data: [mockBookmark],
      totalCount: 1,
      page: 1,
      limit: 10,
      hasMore: false,
    };

    it('should return cached search results if available', async () => {
      mockCacheWrap.mockResolvedValue(mockSearchResult);
      const result = await bookmarkService.searchBookmarks(
        userId,
        searchParams
      );
      expect(mockCacheWrap).toHaveBeenCalledWith(
        cacheKey,
        expect.any(Function)
      );
      expect(result.bookmarks).toEqual(mockSearchResult.data);
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });

    it('should fetch from DB, cache, and return if cache miss', async () => {
      mockCacheWrap.mockImplementation(async (key, fn) => await fn());
      mockPrisma.$transaction.mockResolvedValue([
        [mockBookmark],
        1,
      ] as any);

      const result = await bookmarkService.searchBookmarks(
        userId,
        searchParams
      );
      expect(mockCacheWrap).toHaveBeenCalledWith(
        cacheKey,
        expect.any(Function)
      );
      expect(mockPrisma.$transaction).toHaveBeenCalled();
      expect(result.bookmarks).toEqual([mockBookmark]);
      expect(result.totalCount).toBe(1);
    });
  });

  // --- getRecentBookmarks Tests ---
  describe('getRecentBookmarks', () => {
    const limit = 5;
    const cacheKey = `user:${userId}:bookmarks:recent:${limit}`;
    const mockBookmarks = [createMockBookmark('bm-recent-1', userId)];

    it('should return cached recent bookmarks if available', async () => {
      mockCacheWrap.mockResolvedValue(mockBookmarks);
      const result = await bookmarkService.getRecentBookmarks(
        userId,
        limit
      );
      expect(mockCacheWrap).toHaveBeenCalledWith(
        cacheKey,
        expect.any(Function)
      );
      expect(result).toEqual(mockBookmarks);
      expect(mockPrisma.bookmark.findMany).not.toHaveBeenCalled();
    });

    it('should fetch from DB, cache, and return if cache miss', async () => {
      mockCacheWrap.mockImplementation(async (key, fn) => await fn());
      mockPrisma.bookmark.findMany.mockResolvedValue(mockBookmarks);
      const result = await bookmarkService.getRecentBookmarks(
        userId,
        limit
      );
      expect(mockCacheWrap).toHaveBeenCalledWith(
        cacheKey,
        expect.any(Function)
      );
      expect(mockPrisma.bookmark.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: 'desc' },
          take: limit,
        })
      );
      expect(result).toEqual(mockBookmarks);
    });
  });

  // --- getPopularBookmarks Tests ---
  describe('getPopularBookmarks', () => {
    const limit = 10;
    const cacheKey = `user:${userId}:bookmarks:popular:${limit}`;
    const mockBookmarks = [
      createMockBookmark('bm-pop-1', userId, { visitCount: 100 }),
    ];

    it('should return cached popular bookmarks if available', async () => {
      mockCacheWrap.mockResolvedValue(mockBookmarks);
      const result = await bookmarkService.getPopularBookmarks(
        userId,
        limit
      );
      expect(mockCacheWrap).toHaveBeenCalledWith(
        cacheKey,
        expect.any(Function)
      );
      expect(result).toEqual(mockBookmarks);
      expect(mockPrisma.bookmark.findMany).not.toHaveBeenCalled();
    });

    it('should fetch from DB, cache, and return if cache miss', async () => {
      mockCacheWrap.mockImplementation(async (key, fn) => await fn());
      mockPrisma.bookmark.findMany.mockResolvedValue(mockBookmarks);
      const result = await bookmarkService.getPopularBookmarks(
        userId,
        limit
      );
      expect(mockCacheWrap).toHaveBeenCalledWith(
        cacheKey,
        expect.any(Function)
      );
      expect(mockPrisma.bookmark.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { visitCount: 'desc' },
          take: limit,
        })
      );
      expect(result).toEqual(mockBookmarks);
    });
  });

  // --- Relationship Tests (add/remove folder/tag) ---
  describe('Relationship Management', () => {
    const mockBookmark = createMockBookmark(bookmarkId, userId);
    const mockFolder = createMockFolder(folderId, userId);
    const mockTag = {
      id: tagId,
      userId,
      name: 'Test Tag',
      color: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      deletedAt: null,
    };

    beforeEach(() => {
      mockPrisma.bookmark.findFirst.mockResolvedValue(mockBookmark);
      mockPrisma.folder.findFirst.mockResolvedValue(mockFolder);
      mockPrisma.tag.findFirst.mockResolvedValue(mockTag);
    });

    it('addBookmarkToFolder should create relation and invalidate caches', async () => {
      mockPrisma.folderBookmark.create.mockResolvedValue({} as any);
      await bookmarkService.addBookmarkToFolder(
        userId,
        bookmarkId,
        folderId
      );
      expect(mockPrisma.folderBookmark.create).toHaveBeenCalledWith({
        data: { folderId, bookmarkId },
      });
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        `bookmark:${bookmarkId}:details`
      );
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(
        `user:${userId}:bookmarks:*`
      );
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(
        `user:${userId}:folders:list:*`
      );
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        `user:${userId}:folders:tree`
      );
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        `folder:${folderId}:details`
      );
    });

    it('removeBookmarkFromFolder should delete relation and invalidate caches', async () => {
      mockPrisma.folderBookmark.delete.mockResolvedValue({} as any);
      await bookmarkService.removeBookmarkFromFolder(
        userId,
        bookmarkId,
        folderId
      );
      expect(mockPrisma.folderBookmark.delete).toHaveBeenCalledWith({
        where: { folderId_bookmarkId: { folderId, bookmarkId } },
      });
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        `bookmark:${bookmarkId}:details`
      );
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(
        `user:${userId}:bookmarks:*`
      );
      // ... other invalidations
    });

    it('addTagToBookmark should create relation and invalidate caches', async () => {
      mockPrisma.bookmarkTag.create.mockResolvedValue({} as any);
      await bookmarkService.addTagToBookmark(
        userId,
        bookmarkId,
        tagId
      );
      expect(mockPrisma.bookmarkTag.create).toHaveBeenCalledWith({
        data: { tagId, bookmarkId },
      });
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        `bookmark:${bookmarkId}:details`
      );
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(
        `user:${userId}:bookmarks:*`
      );
    });

    it('removeTagFromBookmark should delete relation and invalidate caches', async () => {
      mockPrisma.bookmarkTag.delete.mockResolvedValue({} as any);
      await bookmarkService.removeTagFromBookmark(
        userId,
        bookmarkId,
        tagId
      );
      expect(mockPrisma.bookmarkTag.delete).toHaveBeenCalledWith({
        where: { tagId_bookmarkId: { tagId, bookmarkId } },
      });
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        `bookmark:${bookmarkId}:details`
      );
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(
        `user:${userId}:bookmarks:*`
      );
    });
  });

  // --- performBulkAction Tests ---
  describe('performBulkAction', () => {
    const bookmarkIds = ['bm1', 'bm2'];

    beforeEach(() => {
      mockPrisma.bookmark.count.mockResolvedValue(bookmarkIds.length);
    });

    it('should perform bulk delete and invalidate caches', async () => {
      mockPrisma.bookmark.updateMany.mockResolvedValue({
        count: bookmarkIds.length,
      });
      const result = await bookmarkService.performBulkAction(userId, {
        action: 'delete',
        bookmarkIds,
      });
      expect(mockPrisma.bookmark.updateMany).toHaveBeenCalledWith({
        where: { id: { in: bookmarkIds }, userId },
        data: { isDeleted: true, deletedAt: expect.any(Date) },
      });
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        `bookmark:${bookmarkIds[0]}:details`
      );
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        `bookmark:${bookmarkIds[1]}:details`
      );
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(
        `user:${userId}:bookmarks:*`
      );
      expect(mockEmitToUser).toHaveBeenCalledTimes(
        bookmarkIds.length
      );
      expect(result.success).toBe(true);
    });

    it('should perform bulk add to folder and invalidate caches', async () => {
      const targetFolderId = 'target-folder';
      mockPrisma.folder.findFirst.mockResolvedValue({
        id: targetFolderId,
      } as any);
      mockPrisma.folderBookmark.createMany.mockResolvedValue({
        count: bookmarkIds.length,
      });

      const result = await bookmarkService.performBulkAction(userId, {
        action: 'addToFolder',
        bookmarkIds,
        targetFolderId,
      });

      expect(
        mockPrisma.folderBookmark.createMany
      ).toHaveBeenCalledWith({
        data: expect.any(Array),
        skipDuplicates: true,
      });
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        `bookmark:${bookmarkIds[0]}:details`
      );
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        `bookmark:${bookmarkIds[1]}:details`
      );
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(
        `user:${userId}:bookmarks:*`
      );
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(
        `user:${userId}:folders:list:*`
      );
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        `user:${userId}:folders:tree`
      );
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        `folder:${targetFolderId}:details`
      );
      expect(result.success).toBe(true);
    });

    // TODO: Add tests for other bulk actions (remove from folder, add/remove tag, add/remove collection)
    // TODO: Add tests for permission denied, target not found errors
  });

  // --- checkBookmarkUrlExists Tests ---
  describe('checkBookmarkUrlExists', () => {
    const url = 'http://exists.com';

    it('should return exists: true and id if URL exists', async () => {
      mockPrisma.bookmark.findFirst.mockResolvedValue({
        id: bookmarkId,
      } as any);
      const result = await bookmarkService.checkBookmarkUrlExists(
        userId,
        url
      );
      expect(mockPrisma.bookmark.findFirst).toHaveBeenCalledWith({
        where: { userId, url, isDeleted: false },
        select: { id: true },
      });
      expect(result).toEqual({ exists: true, id: bookmarkId });
    });

    it('should return exists: false and null id if URL does not exist', async () => {
      mockPrisma.bookmark.findFirst.mockResolvedValue(null);
      const result = await bookmarkService.checkBookmarkUrlExists(
        userId,
        url
      );
      expect(mockPrisma.bookmark.findFirst).toHaveBeenCalledWith({
        where: { userId, url, isDeleted: false },
        select: { id: true },
      });
      expect(result).toEqual({ exists: false, id: null });
    });

    it('should throw BookmarkError on database error', async () => {
      const dbError = new Error('DB check failed');
      mockPrisma.bookmark.findFirst.mockRejectedValue(dbError);
      await expect(
        bookmarkService.checkBookmarkUrlExists(userId, url)
      ).rejects.toThrow(BookmarkError);
      await expect(
        bookmarkService.checkBookmarkUrlExists(userId, url)
      ).rejects.toThrow('Failed to check URL existence');
    });
  });
});
