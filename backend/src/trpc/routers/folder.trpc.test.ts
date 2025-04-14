// src/trpc/routers/folder.trpc.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appRouter } from '../router'; 
import { createContext } from '../context'; 
import * as folderService from '../../services/folder.service'; 
import { FolderError } from '../../services/folder.service';
import { inferProcedureInput } from '@trpc/server'; 
import { Role } from '@prisma/client';

// --- Mocks ---
vi.mock('../../services/folder.service'); 
vi.mock('../context'); 

// --- Tests ---

describe('Folder TRPC Router', () => {
  const mockFolderService = vi.mocked(folderService);
  const mockCreateContext = vi.mocked(createContext);

  const userId = 'user-trpc-folder-test';
  const folderId = 'folder-trpc-123';
  const parentFolderId = 'parent-folder-trpc-456';
  const collaboratorUserId = 'collab-trpc-xyz';

  // Mock context value
  const mockContext = {
    user: { id: userId, email: 'test@trpc.com', username: 'trpctester' }, // Assume authenticated
    req: { headers: {}, cookies: {} }, 
    res: { cookie: vi.fn(), clearCookie: vi.fn() }, 
    prisma: {}, 
    session: null, 
  };

  beforeEach(() => {
    vi.resetAllMocks();
    mockCreateContext.mockResolvedValue(mockContext as any); 
  });

  // Helper to create caller
  const createCaller = async () => {
      const context = await createContext({} as any); 
      return appRouter.createCaller(context);
  };

  // --- createFolder Procedure ---
  describe('create', () => {
    it('should call folderService.createFolder and return the new folder', async () => {
        // Use undefined for optional root parentId
        const input: inferProcedureInput<typeof appRouter.folders.create> = { name: 'TRPC Folder', parentId: undefined }; 
        const serviceResult = { id: folderId, ...input, userId, parentId: null }; // Service might return null explicitly
        mockFolderService.createFolder.mockResolvedValue(serviceResult as any);
        const caller = await createCaller();

        const result = await caller.folders.create(input); 

        expect(folderService.createFolder).toHaveBeenCalledWith(userId, input);
        expect(result).toEqual(serviceResult); 
    });
     // TODO: Add error test
  });

  // --- listFolders Procedure ---
  describe('list', () => {
     it('should call folderService.getUserFolders and return folders', async () => {
        const input: inferProcedureInput<typeof appRouter.folders.list> = { limit: 10, offset: 0 }; 
        const serviceResult = { data: [], totalCount: 0, page: 1, limit: 10, hasMore: false };
        mockFolderService.getUserFolders.mockResolvedValue(serviceResult as any);
        const caller = await createCaller();

        const result = await caller.folders.list(input); 

        expect(folderService.getUserFolders).toHaveBeenCalledWith(userId, { limit: 10, offset: 0, sortBy: 'name', sortOrder: 'asc' }); 
        expect(result).toEqual(serviceResult); 
     });
      // TODO: Add error test
  });
  
  // --- getFolderTree Procedure ---
  describe('getTree', () => {
     it('should call folderService.getFolderTree and return the tree', async () => {
        const serviceResult: any[] = []; 
        mockFolderService.getFolderTree.mockResolvedValue(serviceResult);
        const caller = await createCaller();

        const result = await caller.folders.getTree(); 

        expect(folderService.getFolderTree).toHaveBeenCalledWith(userId);
        expect(result).toEqual(serviceResult); 
     });
      // TODO: Add error test
  });
  
  // --- getFolderById Procedure ---
  describe('getById', () => {
     it('should call folderService.getFolderById and return the folder', async () => {
        const input: inferProcedureInput<typeof appRouter.folders.getById> = { id: folderId }; 
        const serviceResult = { id: folderId, name: 'TRPC Get Folder', userId };
        mockFolderService.getFolderById.mockResolvedValue(serviceResult as any);
        const caller = await createCaller();

        const result = await caller.folders.getById(input); 

        expect(folderService.getFolderById).toHaveBeenCalledWith(input.id, userId);
        expect(result).toEqual(serviceResult); 
     });
      // TODO: Add error test
  });
  
  // --- updateFolder Procedure ---
  describe('update', () => {
     it('should call folderService.updateFolder', async () => {
        const input: inferProcedureInput<typeof appRouter.folders.update> = { id: folderId, name: 'Updated TRPC Folder' }; 
        const serviceResult = { id: folderId, name: input.name, userId };
        mockFolderService.updateFolder.mockResolvedValue(serviceResult as any);
        const caller = await createCaller();

        const result = await caller.folders.update(input); 

        expect(folderService.updateFolder).toHaveBeenCalledWith(input.id, userId, { name: input.name });
        expect(result).toEqual(serviceResult); 
     });
      // TODO: Add error test
  });
  
  // --- deleteFolder Procedure ---
  describe('delete', () => {
     it('should call folderService.deleteFolder', async () => {
        // Correct input key to moveBookmarksTo
        const input: inferProcedureInput<typeof appRouter.folders.delete> = { id: folderId, moveBookmarksTo: parentFolderId }; 
        mockFolderService.deleteFolder.mockResolvedValue(undefined);
        const caller = await createCaller();

        const result = await caller.folders.delete(input); 

        // Correct service call argument name
        expect(folderService.deleteFolder).toHaveBeenCalledWith(input.id, userId, input.moveBookmarksTo); 
        expect(result).toEqual({ success: true, id: input.id }); 
     });
      // TODO: Add error test
  });
  
  // --- getBookmarksByFolder Procedure ---
  describe('getBookmarks', () => {
     it('should call folderService.getBookmarksByFolder', async () => {
        const input: inferProcedureInput<typeof appRouter.folders.getBookmarks> = { folderId: folderId, limit: 10, offset: 0 }; 
        const serviceResult = { data: [], totalCount: 0, page: 1, limit: 10, hasMore: false };
        mockFolderService.getBookmarksByFolder.mockResolvedValue(serviceResult as any);
        const caller = await createCaller();

        const result = await caller.folders.getBookmarks(input); 

        expect(folderService.getBookmarksByFolder).toHaveBeenCalledWith(input.folderId, userId, { limit: 10, offset: 0, sortBy: 'createdAt', sortOrder: 'desc' });
        expect(result).toEqual(serviceResult); 
     });
      // TODO: Add error test
  });
  
  // --- Collaboration Procedures ---
  describe('addCollaborator', () => { 
    it('should add collaborator successfully', async () => {
        const input: inferProcedureInput<typeof appRouter.folders.addCollaborator> = { folderId: folderId, userId: collaboratorUserId, permission: Role.EDIT }; 
        const serviceResult = { folderId, userId: collaboratorUserId, permission: Role.EDIT, user: { /*...*/ } };
        mockFolderService.addCollaborator.mockResolvedValue(serviceResult as any);
        const caller = await createCaller();

        const result = await caller.folders.addCollaborator(input); 

        expect(folderService.addCollaborator).toHaveBeenCalledWith(input.folderId, userId, input.userId, input.permission);
        expect(result).toEqual(serviceResult); 
    });
     // TODO: Add error test
  });

  describe('updateCollaborator', () => { 
     it('should update collaborator permission successfully', async () => {
        const input: inferProcedureInput<typeof appRouter.folders.updateCollaborator> = { folderId: folderId, collaboratorId: collaboratorUserId, permission: Role.VIEW }; 
        const serviceResult = { folderId, userId: collaboratorUserId, permission: Role.VIEW, user: { /*...*/ } };
        mockFolderService.updateCollaboratorPermission.mockResolvedValue(serviceResult as any);
        const caller = await createCaller();

        const result = await caller.folders.updateCollaborator(input); 

        expect(folderService.updateCollaboratorPermission).toHaveBeenCalledWith(input.folderId, userId, input.collaboratorId, input.permission);
        expect(result).toEqual(serviceResult); 
     });
      // TODO: Add error test
  });

  describe('removeCollaborator', () => { 
     it('should remove collaborator successfully', async () => {
        const input: inferProcedureInput<typeof appRouter.folders.removeCollaborator> = { folderId: folderId, collaboratorId: collaboratorUserId }; 
        mockFolderService.removeCollaborator.mockResolvedValue(undefined);
        const caller = await createCaller();

        const result = await caller.folders.removeCollaborator(input); 

        expect(folderService.removeCollaborator).toHaveBeenCalledWith(input.folderId, userId, input.collaboratorId);
        expect(result).toEqual({ success: true }); 
     });
      // TODO: Add error test
  });

});
