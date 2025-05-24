// src/services/collection.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended'; // Import mockDeep
import {
  PrismaClient,
  Prisma,
  Role,
  Collection,
  Bookmark,
  CollectionCollaborator,
} from '@prisma/client'; // Import PrismaClient and types
import prisma from '../config/db'; // Import the actual prisma instance path for mocking
import * as collectionService from './collection.service';
import {
  CollectionError,
  USER_COLLECTION_LIST_PATTERN,
  COLLECTION_DETAIL_CACHE_KEY,
  COLLECTION_PUBLIC_CACHE_KEY,
} from './collection.service'; // Import necessary constants/types
// Correctly import BOOKMARK_DETAIL_CACHE_KEY from bookmark.service
import { BOOKMARK_DETAIL_CACHE_KEY } from './bookmark.service';
import logger from '../config/logger';
import {
  cacheWrap,
  invalidateCache,
  invalidateCachePattern,
} from '../utils/cache';
import { emitToUser, SOCKET_EVENTS } from './socket.service';
import { v4 as uuidv4 } from 'uuid';

// --- Mocks ---

// Mock the Prisma client using vitest-mock-extended
vi.mock('../config/db', async () => {
  const originalModule = await vi.importActual('../config/db');
  return {
    ...originalModule, // Keep other exports if any
    default: mockDeep<PrismaClient>(), // Deep mock the default export (PrismaClient instance)
  };
});

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
    COLLECTION_CREATED: 'collection:created',
    COLLECTION_UPDATED: 'collection:updated',
    COLLECTION_DELETED: 'collection:deleted',
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

vi.mock('uuid', () => ({ v4: vi.fn() }));

// --- Tests ---

describe('Collection Service', () => {
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
  const mockUuidv4 = vi.mocked(uuidv4);

  const userId = 'user-uuid-collection';
  const ownerId = userId; // Often the same for creation
  const collectionId = 'collection-uuid-1';
  const bookmarkId = 'bookmark-uuid-coll';
  const collaboratorUserId = 'collab-user-uuid';

  // Helper to create mock collection
  const createMockCollection = (
    id: string,
    userId: string,
    ownerId: string,
    overrides = {}
  ): Collection => ({
    id,
    userId,
    ownerId,
    name: `Collection ${id}`,
    description: null,
    isPublic: false,
    publicLink: null,
    thumbnail: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    deletedAt: null,
    ...overrides,
  });

  // Helper to create mock bookmark
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

  beforeEach(() => {
    vi.resetAllMocks();
    // Assign the deep mock instance before each test
    mockPrisma = prisma as unknown as DeepMockProxy<PrismaClient>;
    // Default mock for cacheWrap to execute the function directly (cache miss)
    mockCacheWrap.mockImplementation(async (key, fn) => await fn());
    // Mock the transaction implementation
    mockPrisma.$transaction.mockImplementation(async (callback) =>
      callback(mockPrisma)
    );
  });

  // --- createCollection Tests ---
  describe('createCollection', () => {
    const collectionData = {
      name: 'My New Collection',
      description: 'Desc',
      isPublic: false,
    };
    const createdCollection = createMockCollection(
      'new-coll-id',
      userId,
      ownerId,
      collectionData
    );

    it('should create a private collection successfully', async () => {
      mockPrisma.collection.create.mockResolvedValue(
        createdCollection
      );
      const result = await collectionService.createCollection({
        ...collectionData,
        userId,
        ownerId,
      });
      expect(mockPrisma.collection.create).toHaveBeenCalledWith({
        data: {
          ...collectionData,
          userId,
          ownerId,
          publicLink: null,
        },
      });
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(
        USER_COLLECTION_LIST_PATTERN(userId)
      );
      expect(mockEmitToUser).toHaveBeenCalledWith(
        userId,
        SOCKET_EVENTS.COLLECTION_CREATED,
        createdCollection
      ); // Reverted: Removed expect.any(Object)
      expect(result).toEqual(createdCollection);
      expect(mockUuidv4).not.toHaveBeenCalled(); // Not called for private
    });

    it('should create a public collection successfully with a public link', async () => {
      const publicData = { ...collectionData, isPublic: true };
      const publicLink = 'public-uuid-link';
      const createdPublicCollection = createMockCollection(
        'new-public-coll-id',
        userId,
        ownerId,
        { ...publicData, publicLink }
      );
      mockUuidv4.mockReturnValue(publicLink);
      mockPrisma.collection.create.mockResolvedValue(
        createdPublicCollection
      );

      const result = await collectionService.createCollection({
        ...publicData,
        userId,
        ownerId,
      });
      expect(mockUuidv4).toHaveBeenCalled();
      expect(mockPrisma.collection.create).toHaveBeenCalledWith({
        data: { ...publicData, userId, ownerId, publicLink },
      });
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(
        USER_COLLECTION_LIST_PATTERN(userId)
      );
      expect(mockEmitToUser).toHaveBeenCalledWith(
        userId,
        SOCKET_EVENTS.COLLECTION_CREATED,
        createdPublicCollection
      ); // Reverted: Removed expect.any(Object)
      expect(result).toEqual(createdPublicCollection);
    });

    it('should throw CollectionError if name already exists (Prisma error)', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed',
        { code: 'P2002', clientVersion: 'x.y.z', meta: {} }
      ); // Added meta
      mockPrisma.collection.create.mockRejectedValue(prismaError);
      await expect(
        collectionService.createCollection({
          ...collectionData,
          userId,
          ownerId,
        })
      ).rejects.toThrow(
        'A collection with this name already exists.'
      );
    });
  });

  // --- getUserCollections Tests ---
  describe('getUserCollections', () => {
    const queryParams = {
      limit: 10,
      offset: 0,
      sortBy: 'name' as const,
      sortOrder: 'asc' as const,
    };
    const cacheKey = collectionService.COLLECTION_LIST_CACHE_KEY(
      userId,
      queryParams
    ); // Use exported function
    const mockCollection = createMockCollection(
      collectionId,
      userId,
      ownerId
    );
    // Simulate the _count structure
    const mockCollectionWithCount = {
      ...mockCollection,
      _count: { bookmarks: 5 },
      owner: {},
      collaborators: [],
    };
    const mockDbResult = {
      data: [
        {
          ...mockCollection,
          bookmarkCount: 5,
          owner: {},
          collaborators: [],
        },
      ],
      totalCount: 1,
      page: 1,
      limit: 10,
      hasMore: false,
    };

    it('should return cached data if available', async () => {
      mockCacheWrap.mockResolvedValue(mockDbResult);
      const result = await collectionService.getUserCollections(
        userId,
        queryParams
      );
      expect(mockCacheWrap).toHaveBeenCalledWith(
        cacheKey,
        expect.any(Function)
      );
      expect(result).toEqual(mockDbResult);
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });

    it('should fetch from DB, cache, and return data if cache miss', async () => {
      mockCacheWrap.mockImplementation(async (key, fn) => await fn());
      mockPrisma.$transaction.mockResolvedValue([
        [mockCollectionWithCount],
        1,
      ] as any); // Mock DB response with _count

      const result = await collectionService.getUserCollections(
        userId,
        queryParams
      );
      expect(mockCacheWrap).toHaveBeenCalledWith(
        cacheKey,
        expect.any(Function)
      );
      expect(mockPrisma.$transaction).toHaveBeenCalled();
      // Check the structure of the returned data
      expect(result.data[0]).toHaveProperty('bookmarkCount', 5);
      expect(result.data[0]).not.toHaveProperty('_count'); // Ensure _count is removed
      expect(result.totalCount).toBe(1);
    });

    it('should throw CollectionError if cacheWrap returns null', async () => {
      mockCacheWrap.mockResolvedValue(null);
      await expect(
        collectionService.getUserCollections(userId, queryParams)
      ).rejects.toThrow(CollectionError);
      await expect(
        collectionService.getUserCollections(userId, queryParams)
      ).rejects.toThrow('Failed to fetch collections');
    });
  });

  // --- getCollectionById Tests ---
  describe('getCollectionById', () => {
    const queryParams = {
      limit: 5,
      offset: 0,
      sortBy: 'title' as const,
      sortOrder: 'desc' as const,
    };
    const cacheKey =
      COLLECTION_DETAIL_CACHE_KEY(collectionId) +
      `:user:${userId}:${JSON.stringify(queryParams)}`; // Use exported function
    const mockCollection = createMockCollection(
      collectionId,
      userId,
      ownerId
    );
    const mockBookmark = createMockBookmark('bm-in-coll', userId);
    // Simulate the structure returned by the service function
    const mockFullCollection = {
      ...mockCollection,
      owner: {},
      collaborators: [],
      bookmarks: {
        data: [mockBookmark],
        totalCount: 1,
        page: 1,
        limit: 5,
        hasMore: false,
      },
    };

    beforeEach(() => {
      // Mock permission check to succeed by returning the collection with collaborators
      // Ensure the mock includes the 'collaborators' array expected by the include
      mockPrisma.collection.findUnique.mockResolvedValueOnce({
        ...mockCollection,
        collaborators: [],
      } as any);
      // Mock the transaction for fetching details + bookmarks
      mockPrisma.$transaction.mockResolvedValue([
        { ...mockCollection, owner: {}, collaborators: [] }, // collectionDetails
        [mockBookmark], // bookmarks
        1, // totalBookmarkCount
      ] as any);
    });

    it('should return cached data if available', async () => {
      mockCacheWrap.mockResolvedValue(mockFullCollection);
      const result = await collectionService.getCollectionById(
        collectionId,
        userId,
        queryParams
      );
      expect(mockCacheWrap).toHaveBeenCalledWith(
        cacheKey,
        expect.any(Function)
      );
      expect(result).toEqual(mockFullCollection);
      expect(mockPrisma.collection.findUnique).not.toHaveBeenCalled(); // Should not call DB if cached
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });

    it('should fetch from DB, cache, and return data if cache miss', async () => {
      mockCacheWrap.mockImplementation(async (key, fn) => await fn());
      const result = await collectionService.getCollectionById(
        collectionId,
        userId,
        queryParams
      );
      expect(mockCacheWrap).toHaveBeenCalledWith(
        cacheKey,
        expect.any(Function)
      );
      expect(mockPrisma.collection.findUnique).toHaveBeenCalledTimes(
        1
      ); // Only for permission check now
      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1); // Transaction fetches details
      expect(result).toEqual(mockFullCollection);
    });

    it('should throw if checkCollectionPermission fails', async () => {
      mockCacheWrap.mockImplementation(async (key, fn) => await fn());
      mockPrisma.collection.findUnique.mockResolvedValueOnce(null); // Simulate permission check fail
      await expect(
        collectionService.getCollectionById(
          collectionId,
          userId,
          queryParams
        )
      ).rejects.toThrow('Collection not found');
    });
  });

  // --- getPublicCollectionByLink Tests ---
  describe('getPublicCollectionByLink', () => {
    const publicLink = 'public-link-uuid';
    const cacheKey = COLLECTION_PUBLIC_CACHE_KEY(publicLink); // Use exported function
    const mockCollection = createMockCollection(
      collectionId,
      userId,
      ownerId,
      { isPublic: true, publicLink }
    );
    const mockBookmark = createMockBookmark(
      'bm-in-public-coll',
      userId
    );
    // Simulate the structure returned by the service function
    const mockFullCollection = {
      ...mockCollection,
      owner: {},
      bookmarks: {
        data: [mockBookmark],
        totalCount: 1,
        page: 1,
        limit: 1,
        hasMore: false,
      },
    };
    // Simulate the raw DB result with _count and nested bookmark relations
    const mockDbResult = {
      ...mockCollection,
      owner: {},
      _count: { bookmarks: 1 },
      bookmarks: [
        { bookmark: mockBookmark, addedAt: new Date(), order: 0 },
      ],
    };

    beforeEach(() => {
      mockPrisma.collection.findUnique.mockResolvedValue(
        mockDbResult
      );
    });

    it('should return cached data if available', async () => {
      mockCacheWrap.mockResolvedValue(mockFullCollection);
      const result =
        await collectionService.getPublicCollectionByLink(publicLink);
      expect(mockCacheWrap).toHaveBeenCalledWith(
        cacheKey,
        expect.any(Function)
      );
      expect(result).toEqual(mockFullCollection);
      expect(mockPrisma.collection.findUnique).not.toHaveBeenCalled();
    });

    it('should fetch from DB, cache, and return data if cache miss', async () => {
      mockCacheWrap.mockImplementation(async (key, fn) => await fn());
      const result =
        await collectionService.getPublicCollectionByLink(publicLink);
      expect(mockCacheWrap).toHaveBeenCalledWith(
        cacheKey,
        expect.any(Function)
      );
      expect(mockPrisma.collection.findUnique).toHaveBeenCalledWith({
        where: { publicLink, isPublic: true, isDeleted: false },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockFullCollection);
    });

    it('should throw if collection not found or not public', async () => {
      mockCacheWrap.mockImplementation(async (key, fn) => await fn());
      mockPrisma.collection.findUnique.mockResolvedValue(null);
      await expect(
        collectionService.getPublicCollectionByLink(publicLink)
      ).rejects.toThrow(
        'Public collection not found or link is invalid'
      );
    });
  });

  // --- updateCollection Tests ---
  describe('updateCollection', () => {
    const updateData = { name: 'Updated Collection', isPublic: true };
    const mockExisting = createMockCollection(
      collectionId,
      userId,
      ownerId
    );
    const generatedPublicLink = 'generated-public-uuid';
    const mockUpdated = {
      ...mockExisting,
      ...updateData,
      publicLink: generatedPublicLink,
      updatedAt: new Date(),
    };

    beforeEach(() => {
      // Mock permission check
      mockPrisma.collection.findUnique.mockResolvedValueOnce({
        ...mockExisting,
        collaborators: [],
      } as any); // For checkCollectionPermission
      // Mock isPublic check
      mockPrisma.collection.findUnique.mockResolvedValueOnce(
        mockExisting
      ); // For isPublic check inside update
      // Mock check for existing name (return null = no conflict)
      mockPrisma.collection.findFirst.mockResolvedValue(null);
      // Mock the actual update
      mockPrisma.collection.update.mockResolvedValue(mockUpdated);
      // Mock uuidv4 for public link generation
      mockUuidv4.mockReturnValue(generatedPublicLink);
    });

    it('should update collection and generate public link', async () => {
      const result = await collectionService.updateCollection(
        collectionId,
        userId,
        updateData
      );
      expect(mockPrisma.collection.findUnique).toHaveBeenCalledTimes(
        2
      ); // Permission check + isPublic check
      expect(mockPrisma.collection.findFirst).toHaveBeenCalledWith({
        where: {
          name: updateData.name,
          userId,
          id: { not: collectionId },
          isDeleted: false,
        },
      });
      expect(mockUuidv4).toHaveBeenCalled();
      expect(mockPrisma.collection.update).toHaveBeenCalledWith({
        where: { id: collectionId },
        data: {
          name: updateData.name,
          description: undefined,
          isPublic: updateData.isPublic,
          thumbnail: undefined,
          publicLink: generatedPublicLink,
        },
      }); // Check specific data
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        COLLECTION_DETAIL_CACHE_KEY(collectionId)
      );
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        COLLECTION_PUBLIC_CACHE_KEY(generatedPublicLink)
      );
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(
        USER_COLLECTION_LIST_PATTERN(userId)
      );
      expect(mockEmitToUser).toHaveBeenCalledWith(
        userId,
        SOCKET_EVENTS.COLLECTION_UPDATED,
        mockUpdated
      ); // Reverted: Removed expect.any(Object)
      expect(result).toEqual(mockUpdated);
    });

    // TODO: Add tests for making public->private, name conflict, permission denied
  });

  // --- deleteCollection Tests ---
  describe('deleteCollection', () => {
    const mockExisting = createMockCollection(
      collectionId,
      userId,
      ownerId,
      { publicLink: 'some-link' }
    );

    beforeEach(() => {
      mockPrisma.collection.findUnique.mockResolvedValue(
        mockExisting
      );
      mockPrisma.collection.update.mockResolvedValue({} as any); // Mock soft delete
    });

    it('should soft delete collection successfully', async () => {
      await collectionService.deleteCollection(collectionId, userId);
      expect(mockPrisma.collection.findUnique).toHaveBeenCalledWith({
        where: { id: collectionId },
      });
      expect(mockPrisma.collection.update).toHaveBeenCalledWith({
        where: { id: collectionId },
        data: { isDeleted: true, deletedAt: expect.any(Date) },
      });
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        COLLECTION_DETAIL_CACHE_KEY(collectionId)
      );
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        COLLECTION_PUBLIC_CACHE_KEY(mockExisting.publicLink!)
      ); // Use non-null assertion
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(
        USER_COLLECTION_LIST_PATTERN(userId)
      );
      expect(mockEmitToUser).toHaveBeenCalledWith(
        userId,
        SOCKET_EVENTS.COLLECTION_DELETED,
        { id: collectionId }
      ); // Reverted: Removed expect.any(Object)
    });

    // TODO: Add tests for permission denied, collection not found
  });

  // --- Bookmark Relationship Tests ---
  describe('Bookmark Relationships', () => {
    const mockCollection = createMockCollection(
      collectionId,
      userId,
      ownerId
    );
    const mockBookmark = createMockBookmark(bookmarkId, userId);

    beforeEach(() => {
      // Mock permission check to succeed
      mockPrisma.collection.findUnique.mockResolvedValue({
        ...mockCollection,
        collaborators: [],
      } as any);
      mockPrisma.bookmark.findUnique.mockResolvedValue(mockBookmark);
    });

    it('addBookmarkToCollection should create relation and invalidate caches', async () => {
      mockPrisma.bookmarkCollection.create.mockResolvedValue(
        {} as any
      );
      await collectionService.addBookmarkToCollection(
        collectionId,
        bookmarkId,
        userId
      );
      expect(
        mockPrisma.bookmarkCollection.create
      ).toHaveBeenCalledWith({ data: { collectionId, bookmarkId } });
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        COLLECTION_DETAIL_CACHE_KEY(collectionId)
      );
      // expect(mockInvalidateCachePattern).toHaveBeenCalledWith(COLLECTION_PUBLIC_CACHE_KEY(mockCollection.publicLink!)); // Only if collection is public
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(
        USER_COLLECTION_LIST_PATTERN(userId)
      );
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        BOOKMARK_DETAIL_CACHE_KEY(bookmarkId)
      ); // Use imported constant
      expect(mockEmitToUser).toHaveBeenCalled();
    });

    it('removeBookmarkFromCollection should delete relation and invalidate caches', async () => {
      mockPrisma.bookmarkCollection.delete.mockResolvedValue(
        {} as any
      );
      await collectionService.removeBookmarkFromCollection(
        collectionId,
        bookmarkId,
        userId
      );
      expect(
        mockPrisma.bookmarkCollection.delete
      ).toHaveBeenCalledWith({
        where: {
          collectionId_bookmarkId: { collectionId, bookmarkId },
        },
      });
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        COLLECTION_DETAIL_CACHE_KEY(collectionId)
      );
      // ... other invalidations ...
      expect(mockEmitToUser).toHaveBeenCalled();
    });

    // TODO: Add tests for bookmark not found, permission denied, already exists/not found errors
  });

  // --- Collaborator Tests ---
  describe('Collaboration', () => {
    const mockCollection = createMockCollection(
      collectionId,
      ownerId,
      ownerId
    );
    const mockCollaboratorUser = {
      id: collaboratorUserId,
      name: 'Collab User',
      username: 'collab',
      profileImage: null,
    };
    const mockCollaboratorEntry = {
      collectionId,
      userId: collaboratorUserId,
      permission: Role.EDIT,
      user: mockCollaboratorUser,
    } as CollectionCollaborator & {
      user: {
        id: string;
        username: string;
        name: string | null;
        profileImage: string | null;
      };
    }; // Type assertion

    beforeEach(() => {
      mockPrisma.collection.findUnique.mockResolvedValue(
        mockCollection
      );
      mockPrisma.user.findUnique.mockResolvedValue(
        mockCollaboratorUser as any
      ); // Mock collaborator user lookup
    });

    it('addCollaborator should add collaborator successfully', async () => {
      mockPrisma.collectionCollaborator.create.mockResolvedValue(
        mockCollaboratorEntry
      );

      const result = await collectionService.addCollaborator(
        collectionId,
        ownerId,
        collaboratorUserId,
        Role.EDIT
      );

      expect(mockPrisma.collection.findUnique).toHaveBeenCalledWith({
        where: { id: collectionId },
      });
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: collaboratorUserId },
      });
      expect(
        mockPrisma.collectionCollaborator.create
      ).toHaveBeenCalledWith({
        data: {
          collectionId,
          userId: collaboratorUserId,
          permission: Role.EDIT,
        },
        include: expect.any(Object),
      });
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        COLLECTION_DETAIL_CACHE_KEY(collectionId)
      );
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(
        USER_COLLECTION_LIST_PATTERN(ownerId)
      );
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(
        USER_COLLECTION_LIST_PATTERN(collaboratorUserId)
      );
      expect(mockEmitToUser).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockCollaboratorEntry);
    });

    it('updateCollaboratorPermission should update permission successfully', async () => {
      const updatedPermission = Role.VIEW;
      const updatedCollaboratorEntry = {
        ...mockCollaboratorEntry,
        permission: updatedPermission,
      };
      mockPrisma.collectionCollaborator.update.mockResolvedValue(
        updatedCollaboratorEntry
      );

      const result =
        await collectionService.updateCollaboratorPermission(
          collectionId,
          ownerId,
          collaboratorUserId,
          updatedPermission
        );

      expect(mockPrisma.collection.findUnique).toHaveBeenCalledWith({
        where: { id: collectionId },
      });
      expect(
        mockPrisma.collectionCollaborator.update
      ).toHaveBeenCalledWith({
        where: {
          collectionId_userId: {
            collectionId,
            userId: collaboratorUserId,
          },
        },
        data: { permission: updatedPermission },
        include: expect.any(Object),
      });
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        COLLECTION_DETAIL_CACHE_KEY(collectionId)
      );
      // ... other invalidations ...
      expect(mockEmitToUser).toHaveBeenCalledTimes(2);
      expect(result).toEqual(updatedCollaboratorEntry);
    });

    it('removeCollaborator should remove collaborator successfully', async () => {
      mockPrisma.collectionCollaborator.delete.mockResolvedValue(
        {} as any
      );

      await collectionService.removeCollaborator(
        collectionId,
        ownerId,
        collaboratorUserId
      );

      expect(mockPrisma.collection.findUnique).toHaveBeenCalledWith({
        where: { id: collectionId },
      });
      expect(
        mockPrisma.collectionCollaborator.delete
      ).toHaveBeenCalledWith({
        where: {
          collectionId_userId: {
            collectionId,
            userId: collaboratorUserId,
          },
        },
      });
      expect(mockInvalidateCache).toHaveBeenCalledWith(
        COLLECTION_DETAIL_CACHE_KEY(collectionId)
      );
      // ... other invalidations ...
      expect(mockEmitToUser).toHaveBeenCalledTimes(2); // Owner and collaborator
    });

    // TODO: Add tests for permission errors, user not found, already collaborator, etc.
  });
});
