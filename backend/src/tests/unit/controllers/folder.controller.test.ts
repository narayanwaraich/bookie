// src/controllers/folder.controller.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended'; // Keep for type usage if needed elsewhere
import { PrismaClient, Role } from '@prisma/client'; // Keep for type usage if needed elsewhere
import prisma from '../config/db'; // Import the actual prisma instance path (Vitest will auto-mock)
import * as folderController from './folder.controller';
import * as folderService from '../services/folder.service';
import { FolderError } from '../services/folder.service';
import logger from '../config/logger';
import { RequestUser, AuthenticatedRequest } from '../types/express'; // Import correct types

// --- Mocks ---
// Folder service is now auto-mocked by Vitest due to __mocks__ folder convention
vi.mock('../services/folder.service');
vi.mock('../config/logger', () => ({
  default: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

// --- Tests ---

describe('Folder Controller', () => {
  // No need for mockPrisma variable here as we mock the service directly

  // Keep mocks for other dependencies/response objects
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction = vi.fn();

  // Mock response methods
  const statusMock = vi.fn().mockReturnThis();
  const jsonMock = vi.fn();
  const sendStatusMock = vi.fn();

  const userId = 'user-folder-test';
  const folderId = 'folder-123';
  const bookmarkId = 'bookmark-abc';
  const collaboratorUserId = 'collab-user-xyz';

  beforeEach(() => {
    vi.resetAllMocks();

    mockRequest = {
      body: {},
      params: {},
      query: {},
      user: {
        id: userId,
        email: 'test@test.com',
        username: 'tester',
      }, // Assume authenticated user
    };
    mockResponse = {
      status: statusMock,
      json: jsonMock,
      sendStatus: sendStatusMock,
    };
    mockNext = vi.fn();
  });

  // --- createFolder Tests ---
  describe('createFolder', () => {
    it('should create a folder successfully and return 201', async () => {
      // Arrange
      const folderInput = { name: 'New Folder', parentId: null };
      const createdFolder = { id: folderId, ...folderInput, userId };
      mockRequest.body = folderInput;
      vi.mocked(folderService.createFolder).mockResolvedValue(
        createdFolder as any
      );

      // Act
      await folderController.createFolder(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(folderService.createFolder).toHaveBeenCalledWith(
        userId,
        folderInput
      );
      expect(statusMock).toHaveBeenCalledWith(201);
      // Controller response uses 'data' key
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: createdFolder,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if service fails', async () => {
      // Arrange
      const folderInput = { name: 'New Folder' };
      const serviceError = new FolderError('Failed to create', 500);
      mockRequest.body = folderInput;
      vi.mocked(folderService.createFolder).mockRejectedValue(
        serviceError
      );

      // Act
      await folderController.createFolder(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(folderService.createFolder).toHaveBeenCalledWith(
        userId,
        folderInput
      );
      expect(mockNext).toHaveBeenCalledWith(serviceError);
    });
  });

  // --- getFolders Tests ---
  describe('getFolders', () => {
    it('should get user folders successfully', async () => {
      // Arrange
      const query = {
        limit: '10',
        page: '1',
        sortBy: 'name',
        sortOrder: 'asc',
      }; // Example query params
      const expectedServiceParams = {
        limit: 10,
        offset: 0,
        sortBy: 'name',
        sortOrder: 'asc',
      }; // Expected after parsing
      const serviceResult = {
        data: [],
        totalCount: 0,
        page: 1,
        limit: 10,
        hasMore: false,
      };
      mockRequest.query = query;
      vi.mocked(folderService.getUserFolders).mockResolvedValue(
        serviceResult
      );

      // Act
      await folderController.getFolders(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(folderService.getUserFolders).toHaveBeenCalledWith(
        userId,
        expectedServiceParams
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        ...serviceResult,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });

  // --- getFolderTree Tests ---
  describe('getFolderTree', () => {
    it('should get folder tree successfully', async () => {
      // Arrange
      const serviceResult: any[] = [];
      vi.mocked(folderService.getFolderTree).mockResolvedValue(
        serviceResult
      );

      // Act
      await folderController.getFolderTree(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(folderService.getFolderTree).toHaveBeenCalledWith(
        userId
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      // Controller response uses 'data' key
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: serviceResult,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });

  // --- getFolder Tests ---
  describe('getFolder', () => {
    it('should get a specific folder successfully', async () => {
      // Arrange
      const folderData = {
        id: folderId,
        name: 'Test Folder',
        userId,
      };
      mockRequest.params = { id: folderId };
      vi.mocked(folderService.getFolderById).mockResolvedValue(
        folderData as any
      );

      // Act
      await folderController.getFolder(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(folderService.getFolderById).toHaveBeenCalledWith(
        folderId,
        userId
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      // Controller response uses 'data' key
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: folderData,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });

  // --- updateFolder Tests ---
  describe('updateFolder', () => {
    it('should update folder successfully', async () => {
      // Arrange
      const updateInput = { name: 'Updated Folder Name' };
      const updatedFolder = {
        id: folderId,
        name: updateInput.name,
        userId,
      };
      mockRequest.params = { id: folderId };
      mockRequest.body = updateInput;
      vi.mocked(folderService.updateFolder).mockResolvedValue(
        updatedFolder as any
      );

      // Act
      await folderController.updateFolder(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(folderService.updateFolder).toHaveBeenCalledWith(
        folderId,
        userId,
        updateInput
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      // Controller response uses 'data' key
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: updatedFolder,
        message: 'Folder updated successfully',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });

  // --- deleteFolder Tests ---
  describe('deleteFolder', () => {
    it('should delete folder successfully', async () => {
      // Arrange
      mockRequest.params = { id: folderId };
      mockRequest.query = { moveToFolderId: 'target-folder' };
      vi.mocked(folderService.deleteFolder).mockResolvedValue(
        undefined
      );

      // Act
      await folderController.deleteFolder(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(folderService.deleteFolder).toHaveBeenCalledWith(
        folderId,
        userId,
        'target-folder'
      );
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(204);
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });

  // --- getBookmarksByFolder Tests ---
  describe('getBookmarksByFolder', () => {
    it('should get bookmarks in folder successfully', async () => {
      // Arrange
      const query = {
        limit: '20',
        page: '1',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }; // Added sort params
      const expectedServiceParams = {
        limit: 20,
        offset: 0,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };
      const serviceResult = {
        data: [],
        totalCount: 0,
        page: 1,
        limit: 20,
        hasMore: false,
      };
      mockRequest.params = { id: folderId }; // Changed from folderId to id
      mockRequest.query = query;
      vi.mocked(folderService.getBookmarksByFolder).mockResolvedValue(
        serviceResult as any
      );

      // Act
      await folderController.getBookmarksByFolder(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(folderService.getBookmarksByFolder).toHaveBeenCalledWith(
        folderId,
        userId,
        expectedServiceParams
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        ...serviceResult,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });

  // --- Collaboration Endpoints ---

  describe('addFolderCollaborator', () => {
    it('should add collaborator successfully', async () => {
      // Arrange
      const input = {
        userId: collaboratorUserId,
        permission: Role.EDIT,
      };
      const serviceResult = {
        folderId,
        userId: collaboratorUserId,
        permission: Role.EDIT,
        user: {
          /*...*/
        },
      };
      mockRequest.params = { id: folderId }; // Changed from folderId to id
      mockRequest.body = input;
      vi.mocked(folderService.addCollaborator).mockResolvedValue(
        serviceResult as any
      );

      // Act
      await folderController.addCollaboratorToFolder(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(folderService.addCollaborator).toHaveBeenCalledWith(
        folderId,
        userId,
        input.userId,
        input.permission
      );
      expect(statusMock).toHaveBeenCalledWith(201);
      // Controller response uses 'data' key
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: serviceResult,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });

  describe('updateFolderCollaborator', () => {
    it('should update collaborator permission successfully', async () => {
      // Arrange
      const input = { permission: Role.VIEW };
      const serviceResult = {
        folderId,
        userId: collaboratorUserId,
        permission: Role.VIEW,
        user: {
          /*...*/
        },
      };
      mockRequest.params = {
        id: folderId,
        collaboratorId: collaboratorUserId,
      }; // Changed from folderId to id
      mockRequest.body = input;
      vi.mocked(
        folderService.updateCollaboratorPermission
      ).mockResolvedValue(serviceResult as any);

      // Act
      await folderController.updateFolderCollaborator(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(
        folderService.updateCollaboratorPermission
      ).toHaveBeenCalledWith(
        folderId,
        userId,
        collaboratorUserId,
        input.permission
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      // Controller response uses 'data' key
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: serviceResult,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });

  describe('removeFolderCollaborator', () => {
    it('should remove collaborator successfully', async () => {
      // Arrange
      mockRequest.params = {
        id: folderId,
        collaboratorId: collaboratorUserId,
      }; // Changed from folderId to id
      vi.mocked(folderService.removeCollaborator).mockResolvedValue(
        undefined
      );

      // Act
      await folderController.removeFolderCollaborator(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(folderService.removeCollaborator).toHaveBeenCalledWith(
        folderId,
        userId,
        collaboratorUserId
      );
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(204);
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });
});
