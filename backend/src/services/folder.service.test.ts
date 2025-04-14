// src/services/folder.service.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended'; // Import mockDeep
import { PrismaClient, Prisma, Role, Folder } from '@prisma/client'; // Import PrismaClient and types
import prisma from '../config/db'; // Import the actual prisma instance path (Vitest will auto-mock)
import * as folderService from './folder.service';
import { FolderError, FOLDER_TREE_CACHE_KEY, FOLDER_DETAIL_CACHE_KEY, FOLDER_LIST_CACHE_KEY } from './folder.service'; // Import necessary constants/types
import logger from '../config/logger';
import { cacheWrap, invalidateCache, invalidateCachePattern } from '../utils/cache';
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
  emitToUser: vi.fn(),
  SOCKET_EVENTS: {
    FOLDER_CREATED: 'folder:created',
    FOLDER_UPDATED: 'folder:updated',
    FOLDER_DELETED: 'folder:deleted',
  }
}));

vi.mock('../config/logger', () => ({
  default: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
}));

// --- Tests ---

describe('Folder Service', () => {
  // Use the deep mocked PrismaClient instance type, casting the auto-mocked import
  let mockPrisma: DeepMockProxy<PrismaClient>;

  // Keep mocks for other dependencies
  const mockCacheWrap = vi.mocked(cacheWrap);
  const mockInvalidateCache = vi.mocked(invalidateCache);
  const mockInvalidateCachePattern = vi.mocked(invalidateCachePattern);
  const mockEmitToUser = vi.mocked(emitToUser);
  const mockLogger = vi.mocked(logger);

  const userId = 'user-uuid-folder';
  const folderId = 'folder-uuid-1';
  const parentId = 'parent-folder-uuid';
  const collaboratorUserId = 'collab-user-uuid';

  // Helper to create a mock folder object
  const createMockFolder = (id: string, userId: string, parentId: string | null = null, overrides = {}): Folder => ({
    id, userId, parentId,
    name: `Folder ${id}`,
    description: null, icon: null, color: null,
    createdAt: new Date(), updatedAt: new Date(),
    isDeleted: false, deletedAt: null,
    ...overrides
  });

  beforeEach(() => {
    // Reset non-prisma mocks
    vi.resetAllMocks();
    // Assign the deep mock instance (auto-mocked by Vitest)
    mockPrisma = prisma as unknown as DeepMockProxy<PrismaClient>;
    // Default mock for cacheWrap to execute the function directly (cache miss)
    mockCacheWrap.mockImplementation(async (key, fn) => await fn());
    // Mock the $transaction implementation to pass the main mock prisma instance
    mockPrisma.$transaction.mockImplementation(async (callback) => {
      // Pass the main mockPrisma instance as the transaction client 'tx'
      return await callback(mockPrisma);
    });
    // NOTE: The mockReset for prisma is handled by the beforeEach in setup.ts
  });

  // --- createFolder Tests ---
  describe('createFolder', () => {
    const folderData = { name: 'New Folder', parentId: undefined, description: 'Desc', icon: 'icon', color: '#fff' };
    const createdFolder = { ...folderData, id: folderId, userId: userId, createdAt: new Date(), updatedAt: new Date(), isDeleted: false, deletedAt: null, parentId: null };

    it('should create a root folder successfully', async () => {
      mockPrisma.folder.findFirst.mockResolvedValue(null);
      mockPrisma.folder.create.mockResolvedValue(createdFolder);
      const result = await folderService.createFolder(userId, { ...folderData, parentId: undefined });
      expect(mockPrisma.folder.findFirst).toHaveBeenCalledWith({ where: { name: folderData.name, userId, parentId: null, isDeleted: false } });
      expect(mockPrisma.folder.create).toHaveBeenCalledWith({ data: { ...folderData, userId, parentId: null } });
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(`user:${userId}:folders:list:*`);
      expect(mockInvalidateCache).toHaveBeenCalledWith(FOLDER_TREE_CACHE_KEY(userId));
      expect(mockEmitToUser).toHaveBeenCalledWith(userId, SOCKET_EVENTS.FOLDER_CREATED, createdFolder); // Reverted
      expect(result).toEqual(createdFolder);
    });

    it('should create a subfolder successfully', async () => {
      const subfolderData = { ...folderData, parentId: parentId };
      const createdSubfolder = { ...subfolderData, id: 'subfolder-uuid', userId: userId, createdAt: new Date(), updatedAt: new Date(), isDeleted: false, deletedAt: null };
      mockPrisma.folder.findFirst.mockResolvedValueOnce(null); // Name check
      mockPrisma.folder.findFirst.mockResolvedValueOnce({ id: parentId } as any); // Parent check
      mockPrisma.folder.create.mockResolvedValue(createdSubfolder);
      const result = await folderService.createFolder(userId, subfolderData);
      expect(mockPrisma.folder.findFirst).toHaveBeenCalledWith({ where: { name: subfolderData.name, userId, parentId: parentId, isDeleted: false } });
      expect(mockPrisma.folder.findFirst).toHaveBeenCalledWith({ where: { id: parentId, userId, isDeleted: false } });
      expect(mockPrisma.folder.create).toHaveBeenCalledWith({ data: { ...subfolderData, userId } });
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(`user:${userId}:folders:list:*`);
      expect(mockInvalidateCache).toHaveBeenCalledWith(FOLDER_TREE_CACHE_KEY(userId));
      expect(mockEmitToUser).toHaveBeenCalledWith(userId, SOCKET_EVENTS.FOLDER_CREATED, createdSubfolder); // Reverted
      expect(result).toEqual(createdSubfolder);
    });

    it('should throw FolderError if folder name already exists at the same level', async () => {
      mockPrisma.folder.findFirst.mockResolvedValue(createdFolder);
      await expect(folderService.createFolder(userId, { ...folderData, parentId: undefined })).rejects.toThrow(FolderError);
      await expect(folderService.createFolder(userId, { ...folderData, parentId: undefined })).rejects.toThrow('A folder with this name already exists at this level');
    });

    it('should throw FolderError if parent folder does not exist', async () => {
      const subfolderData = { ...folderData, parentId: parentId };
      mockPrisma.folder.findFirst.mockResolvedValueOnce(null); // Name check
      mockPrisma.folder.findFirst.mockResolvedValueOnce(null); // Parent check
      await expect(folderService.createFolder(userId, subfolderData)).rejects.toThrow(FolderError);
      await expect(folderService.createFolder(userId, subfolderData)).rejects.toThrow('Parent folder not found');
    });
  });

  // --- getUserFolders Tests ---
  describe('getUserFolders', () => {
    const queryParams = { limit: 10, offset: 0, sortBy: 'name' as const, sortOrder: 'asc' as const };
    const cacheKey = FOLDER_LIST_CACHE_KEY(userId, queryParams); // Use exported function
    const mockDbFolder = createMockFolder(folderId, userId);
    // Simulate the _count structure from Prisma
    const mockFolderWithCount = { ...mockDbFolder, _count: { bookmarks: 5 } };
    // Expected result shape after service processing
    const mockServiceResult = { data: [{ ...mockDbFolder, bookmarkCount: 5 }], totalCount: 1, page: 1, limit: 10, hasMore: false };

    it('should return cached data if available', async () => {
      mockCacheWrap.mockResolvedValue(mockServiceResult);
      const result = await folderService.getUserFolders(userId, queryParams);
      expect(mockCacheWrap).toHaveBeenCalledWith(cacheKey, expect.any(Function));
      expect(result).toEqual(mockServiceResult);
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });

    it('should fetch from DB, cache, and return data if cache miss', async () => {
      mockCacheWrap.mockImplementation(async (key, fn) => await fn());
      mockPrisma.$transaction.mockResolvedValue([ [mockFolderWithCount], 1 ] as any); // Mock DB response

      const result = await folderService.getUserFolders(userId, queryParams);
      expect(mockCacheWrap).toHaveBeenCalledWith(cacheKey, expect.any(Function));
      expect(mockPrisma.$transaction).toHaveBeenCalled();
      expect(result).toEqual(mockServiceResult); // Check against the processed shape
    });

    it('should throw FolderError if cacheWrap returns null', async () => {
      mockCacheWrap.mockResolvedValue(null);
      await expect(folderService.getUserFolders(userId, queryParams)).rejects.toThrow(FolderError);
      await expect(folderService.getUserFolders(userId, queryParams)).rejects.toThrow('Failed to fetch folders');
    });
  });

  // --- getFolderTree Tests ---
  describe('getFolderTree', () => {
    const cacheKey = FOLDER_TREE_CACHE_KEY(userId); // Use exported function
    const mockDbFolders = [
      { id: 'root1', name: 'Root 1', userId, parentId: null, _count: { bookmarks: 2 }, collaborators: [] },
      { id: 'child1', name: 'Child 1', userId, parentId: 'root1', _count: { bookmarks: 1 }, collaborators: [] },
    ];
    const expectedTree = [
      { id: 'root1', name: 'Root 1', userId, parentId: null, children: [
        { id: 'child1', name: 'Child 1', userId, parentId: 'root1', children: [], bookmarkCount: 1, color: null, createdAt: expect.any(Date), deletedAt: null, description: null, icon: null, isDeleted: false, updatedAt: expect.any(Date) } // Added missing properties
      ], bookmarkCount: 2, color: null, createdAt: expect.any(Date), deletedAt: null, description: null, icon: null, isDeleted: false, updatedAt: expect.any(Date) } // Added missing properties
    ];

    it('should return cached tree if available', async () => {
      mockCacheWrap.mockResolvedValue(expectedTree);
      const result = await folderService.getFolderTree(userId);
      expect(mockCacheWrap).toHaveBeenCalledWith(cacheKey, expect.any(Function));
      expect(result).toEqual(expectedTree);
      expect(mockPrisma.folder.findMany).not.toHaveBeenCalled();
    });

    it('should fetch from DB, build tree, cache, and return if cache miss', async () => {
      mockCacheWrap.mockImplementation(async (key, fn) => await fn());
      mockPrisma.folder.findMany.mockResolvedValue(mockDbFolders as any);
      const result = await folderService.getFolderTree(userId);
      expect(mockCacheWrap).toHaveBeenCalledWith(cacheKey, expect.any(Function));
      expect(mockPrisma.folder.findMany).toHaveBeenCalled();
      // Use expect.objectContaining for nested objects due to Date differences
      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({
          id: 'root1',
          children: expect.arrayContaining([
            expect.objectContaining({ id: 'child1' })
          ])
        })
      ]));
    });

    it('should throw FolderError if cacheWrap returns null', async () => {
      mockCacheWrap.mockResolvedValue(null);
      await expect(folderService.getFolderTree(userId)).rejects.toThrow(FolderError);
      await expect(folderService.getFolderTree(userId)).rejects.toThrow('Failed to fetch folder tree');
    });
  });

  // --- updateFolder Tests ---
  describe('updateFolder', () => {
    const updateData = { name: 'Updated Name', color: '#aaa' };
    const mockExistingFolder = createMockFolder(folderId, userId);
    const mockUpdatedFolder = { ...mockExistingFolder, ...updateData, updatedAt: new Date() };

    beforeEach(() => {
      // Mock the checkFolderAccess call (outside transaction)
      mockPrisma.folder.findUnique.mockResolvedValue(mockExistingFolder);
      // Mock the update call (inside transaction)
      mockPrisma.folder.update.mockResolvedValue(mockUpdatedFolder);
      // Default mock for findFirst (inside transaction) - no conflict
      mockPrisma.folder.findFirst.mockResolvedValue(null);
    });

    it('should update folder successfully', async () => {
      const result = await folderService.updateFolder(folderId, userId, updateData);

      // Check checkFolderAccess call
      expect(mockPrisma.folder.findUnique).toHaveBeenCalledWith({ where: { id: folderId }, include: expect.any(Object) });
      // Check transaction was called
      expect(mockPrisma.$transaction).toHaveBeenCalled();
      // Check findFirst *within* transaction mock
      expect(mockPrisma.folder.findFirst).toHaveBeenCalledWith({ where: { name: updateData.name, userId, parentId: mockExistingFolder.parentId, id: { not: folderId }, isDeleted: false } });
      // Check update *within* transaction mock
      expect(mockPrisma.folder.update).toHaveBeenCalledWith({ where: { id: folderId }, data: updateData });

      // Check cache invalidations
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(`user:${userId}:folders:list:*`);
      expect(mockInvalidateCache).toHaveBeenCalledWith(FOLDER_TREE_CACHE_KEY(userId));
      expect(mockInvalidateCache).toHaveBeenCalledWith(FOLDER_DETAIL_CACHE_KEY(folderId));
      // Check socket emit
      expect(mockEmitToUser).toHaveBeenCalledWith(userId, SOCKET_EVENTS.FOLDER_UPDATED, mockUpdatedFolder); // Reverted
      // Check result
      expect(result).toEqual(mockUpdatedFolder);
    });

    it('should throw FolderError if name already exists at the same level', async () => {
      // Mock findFirst (within transaction) to find a conflicting folder
      mockPrisma.folder.findFirst.mockResolvedValue(createMockFolder('other-folder', userId, mockExistingFolder.parentId));

      // Expect the service call to reject
      await expect(folderService.updateFolder(folderId, userId, updateData)).rejects.toThrow(FolderError);
      await expect(folderService.updateFolder(folderId, userId, updateData)).rejects.toThrow('A folder with this name already exists at this level');
      // Ensure update was NOT called
      expect(mockPrisma.folder.update).not.toHaveBeenCalled();
    });

    // TODO: Add tests for moving folders, circular references, parent not found, permission denied
  });

  // --- deleteFolder Tests ---
  describe('deleteFolder', () => {
    const mockFolder = createMockFolder(folderId, userId);
    const descendantId = 'descendant-folder-id';
    const mockDescendantFolder = createMockFolder(descendantId, userId, folderId);

    beforeEach(() => {
      // Mock check outside transaction
      mockPrisma.folder.findUnique.mockResolvedValue(mockFolder);
      // Mocks inside transaction
      mockPrisma.folder.findMany
        .mockResolvedValueOnce([mockDescendantFolder]) // First call for descendants of folderId
        .mockResolvedValueOnce([]); // Second call for descendants of descendantId
      mockPrisma.folder.updateMany.mockResolvedValue({ count: 2 });
    });

    it('should soft delete folder and descendants successfully', async () => {
      await folderService.deleteFolder(folderId, userId);

      // Check initial findUnique
      expect(mockPrisma.folder.findUnique).toHaveBeenCalledWith({ where: { id: folderId } });
      // Check transaction was called
      expect(mockPrisma.$transaction).toHaveBeenCalled();
      // Check findMany calls within transaction
      expect(mockPrisma.folder.findMany).toHaveBeenCalledWith({ where: { parentId: folderId, userId }, select: { id: true } });
      expect(mockPrisma.folder.findMany).toHaveBeenCalledWith({ where: { parentId: descendantId, userId }, select: { id: true } });
      // Check updateMany call within transaction
      expect(mockPrisma.folder.updateMany).toHaveBeenCalledWith({
        where: { id: { in: [folderId, descendantId] } },
        data: { isDeleted: true, deletedAt: expect.any(Date) }
      });
      // Check cache invalidations
      expect(mockInvalidateCachePattern).toHaveBeenCalledWith(`user:${userId}:folders:list:*`);
      expect(mockInvalidateCache).toHaveBeenCalledWith(FOLDER_TREE_CACHE_KEY(userId));
      expect(mockInvalidateCache).toHaveBeenCalledWith(FOLDER_DETAIL_CACHE_KEY(folderId));
      expect(mockInvalidateCache).toHaveBeenCalledWith(FOLDER_DETAIL_CACHE_KEY(descendantId));
      // Check socket emit
      expect(mockEmitToUser).toHaveBeenCalledWith(userId, SOCKET_EVENTS.FOLDER_DELETED, { id: folderId, descendantIds: [descendantId] }); // Reverted
    });
  });

  // --- Collaboration Tests ---
  describe('Collaboration', () => {
    // Define variables needed within this scope
    const ownerId = userId; // Alias for clarity
    const mockFolder = createMockFolder(folderId, ownerId);
    const mockCollaboratorUser = { id: collaboratorUserId, email: 'collab@test.com', username: 'collaborator', name: 'Collab User', profileImage: null }; // Added missing fields
    const mockCollaboratorRecord = { folderId, userId: collaboratorUserId, permission: Role.EDIT, addedAt: new Date(), user: mockCollaboratorUser };

    describe('addCollaborator', () => {
      beforeEach(() => {
        mockPrisma.folder.findUnique.mockResolvedValue(mockFolder);
        mockPrisma.user.findUnique.mockResolvedValue(mockCollaboratorUser as any);
        mockPrisma.folderCollaborator.create.mockResolvedValue(mockCollaboratorRecord as any);
      });

      it('should add a collaborator successfully', async () => {
        const result = await folderService.addCollaborator(folderId, userId, collaboratorUserId, Role.EDIT);
        expect(mockPrisma.folder.findUnique).toHaveBeenCalledWith({ where: { id: folderId } });
        expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: collaboratorUserId } });
        expect(mockPrisma.folderCollaborator.create).toHaveBeenCalledWith({
          data: { folderId, userId: collaboratorUserId, permission: Role.EDIT },
          include: expect.any(Object)
        });
        expect(mockInvalidateCache).toHaveBeenCalledWith(FOLDER_DETAIL_CACHE_KEY(folderId));
        expect(mockInvalidateCache).toHaveBeenCalledWith(FOLDER_TREE_CACHE_KEY(ownerId));
        expect(mockInvalidateCachePattern).toHaveBeenCalledWith(`user:${ownerId}:folders:list:*`);
        expect(mockInvalidateCache).toHaveBeenCalledWith(FOLDER_TREE_CACHE_KEY(collaboratorUserId));
        expect(mockInvalidateCachePattern).toHaveBeenCalledWith(`user:${collaboratorUserId}:folders:list:*`);
        expect(mockEmitToUser).toHaveBeenCalledTimes(2);
        expect(result).toEqual(mockCollaboratorRecord);
      });

      it('should throw if user is not owner', async () => {
        await expect(folderService.addCollaborator(folderId, 'not-owner-id', collaboratorUserId, Role.EDIT)).rejects.toThrow('Only the owner can add collaborators');
      });

      it('should throw if collaborator user not found', async () => {
        mockPrisma.user.findUnique.mockResolvedValue(null);
        await expect(folderService.addCollaborator(folderId, userId, collaboratorUserId, Role.EDIT)).rejects.toThrow('Collaborator user not found');
      });

      it('should throw if owner tries to add self', async () => {
        await expect(folderService.addCollaborator(folderId, userId, userId, Role.EDIT)).rejects.toThrow('Owner cannot be added as a collaborator');
      });

      it('should throw if user is already a collaborator (Prisma error)', async () => {
        const prismaError = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', { code: 'P2002', clientVersion: 'x.y.z', meta: {} }); // Added meta
        mockPrisma.folderCollaborator.create.mockRejectedValue(prismaError);
        await expect(folderService.addCollaborator(folderId, userId, collaboratorUserId, Role.EDIT)).rejects.toThrow('User is already a collaborator on this folder');
      });
    });

    describe('updateCollaboratorPermission', () => {
      beforeEach(() => {
        mockPrisma.folder.findUnique.mockResolvedValue(mockFolder);
        mockPrisma.folderCollaborator.update.mockResolvedValue({ ...mockCollaboratorRecord, permission: Role.VIEW } as any);
      });

      it('should update collaborator permission successfully', async () => {
        const result = await folderService.updateCollaboratorPermission(folderId, userId, collaboratorUserId, Role.VIEW);
        expect(mockPrisma.folderCollaborator.update).toHaveBeenCalledWith({
          where: { folderId_userId: { folderId, userId: collaboratorUserId } },
          data: { permission: Role.VIEW },
          include: expect.any(Object)
        });
        expect(mockInvalidateCache).toHaveBeenCalledWith(FOLDER_DETAIL_CACHE_KEY(folderId));
        // ... other cache invalidations ...
        expect(mockEmitToUser).toHaveBeenCalledTimes(2);
        expect(result.permission).toBe(Role.VIEW);
      });

      it('should throw if collaborator not found (Prisma error)', async () => {
        const prismaError = new Prisma.PrismaClientKnownRequestError('Record to update not found.', { code: 'P2025', clientVersion: 'x.y.z', meta: {} }); // Added meta
        mockPrisma.folderCollaborator.update.mockRejectedValue(prismaError);
        await expect(folderService.updateCollaboratorPermission(folderId, userId, collaboratorUserId, Role.VIEW)).rejects.toThrow('Collaborator not found on this folder');
      });

      // TODO: Add tests for not owner, updating self
    });

    describe('removeCollaborator', () => {
      beforeEach(() => {
        mockPrisma.folder.findUnique.mockResolvedValue(mockFolder);
        mockPrisma.folderCollaborator.delete.mockResolvedValue({} as any);
      });

      it('should remove collaborator successfully', async () => {
        await folderService.removeCollaborator(folderId, userId, collaboratorUserId);
        expect(mockPrisma.folderCollaborator.delete).toHaveBeenCalledWith({
          where: { folderId_userId: { folderId, userId: collaboratorUserId } }
        });
        expect(mockInvalidateCache).toHaveBeenCalledWith(FOLDER_DETAIL_CACHE_KEY(folderId));
        // ... other cache invalidations ...
        expect(mockEmitToUser).toHaveBeenCalledTimes(2); // Owner and collaborator
      });

      it('should throw if collaborator not found (Prisma error)', async () => {
        const prismaError = new Prisma.PrismaClientKnownRequestError('Record to delete not found.', { code: 'P2025', clientVersion: 'x.y.z', meta: {} }); // Added meta
        mockPrisma.folderCollaborator.delete.mockRejectedValue(prismaError);
        await expect(folderService.removeCollaborator(folderId, userId, collaboratorUserId)).rejects.toThrow('Collaborator not found on this folder');
      });

      // TODO: Add tests for not owner, removing self
    });
  });

  // TODO: Add tests for getFolderById, getBookmarksByFolder

});
