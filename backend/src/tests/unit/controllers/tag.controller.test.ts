// src/controllers/tag.controller.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended'; // Keep for type usage if needed elsewhere
import { PrismaClient } from '@prisma/client'; // Keep for type usage if needed elsewhere
import prisma from '../config/db'; // Import the actual prisma instance path (Vitest will auto-mock)
import * as tagController from './tag.controller';
import * as tagService from '../services/tag.service';
import { TagError } from '../services/tag.service';
import logger from '../config/logger';
import { RequestUser, AuthenticatedRequest } from '../types/express'; // Import correct types

// --- Mocks ---
// Tag service is now auto-mocked by Vitest due to __mocks__ folder convention
vi.mock('../services/tag.service');
vi.mock('../config/logger', () => ({
  default: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

// --- Tests ---

describe('Tag Controller', () => {
  // No need for mockPrisma variable here as we mock the service directly

  // Keep mocks for other dependencies/response objects
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction = vi.fn();

  // Mock response methods
  const statusMock = vi.fn().mockReturnThis();
  const jsonMock = vi.fn();
  const sendStatusMock = vi.fn();

  const userId = 'user-tag-test';
  const tagId = 'tag-123';

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

  // --- createTag Tests ---
  describe('createTag', () => {
    it('should create a tag successfully and return 201', async () => {
      // Arrange
      const tagInput = { name: 'New Tag', color: '#ff0000' };
      const createdTag = { id: tagId, ...tagInput, userId };
      mockRequest.body = tagInput;
      vi.mocked(tagService.createTag).mockResolvedValue(
        createdTag as any
      );

      // Act
      await tagController.createTag(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(tagService.createTag).toHaveBeenCalledWith(
        userId,
        tagInput
      );
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Tag created successfully',
        tag: createdTag,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if service fails', async () => {
      // Arrange
      const tagInput = { name: 'New Tag' };
      const serviceError = new TagError('Tag already exists', 409);
      mockRequest.body = tagInput;
      vi.mocked(tagService.createTag).mockRejectedValue(serviceError);

      // Act
      await tagController.createTag(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(tagService.createTag).toHaveBeenCalledWith(
        userId,
        tagInput
      );
      expect(mockNext).toHaveBeenCalledWith(serviceError);
    });
  });

  // --- getAllTags Tests ---
  describe('getAllTags', () => {
    it('should get all user tags successfully', async () => {
      // Arrange
      const query = {
        limit: '20',
        page: '1',
        sortBy: 'name',
        sortOrder: 'desc',
      }; // Example query
      const expectedServiceParams = {
        limit: 20,
        offset: 0,
        sortBy: 'name',
        sortOrder: 'desc',
      };
      const serviceResult = {
        data: [],
        totalCount: 0,
        page: 1,
        limit: 20,
        hasMore: false,
      };
      mockRequest.query = query;
      vi.mocked(tagService.getAllUserTags).mockResolvedValue(
        serviceResult as any
      ); // Cast if needed

      // Act
      await tagController.getAllTags(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(tagService.getAllUserTags).toHaveBeenCalledWith(
        userId,
        expectedServiceParams
      ); // Pass parsed params
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        tags: serviceResult.data,
      }); // Controller returns tags array directly
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });

  // --- getTagById Tests ---
  describe('getTagById', () => {
    it('should get a specific tag successfully', async () => {
      // Arrange
      const tagData = { id: tagId, name: 'Test Tag', userId };
      mockRequest.params = { id: tagId };
      vi.mocked(tagService.getTagById).mockResolvedValue(
        tagData as any
      );

      // Act
      await tagController.getTagById(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(tagService.getTagById).toHaveBeenCalledWith(
        tagId,
        userId
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        tag: tagData,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });

  // --- updateTag Tests ---
  describe('updateTag', () => {
    it('should update tag successfully', async () => {
      // Arrange
      const updateInput = { name: 'Updated Tag Name' };
      const updatedTag = {
        id: tagId,
        name: updateInput.name,
        userId,
      };
      mockRequest.params = { id: tagId };
      mockRequest.body = updateInput;
      vi.mocked(tagService.updateTag).mockResolvedValue(
        updatedTag as any
      );

      // Act
      await tagController.updateTag(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(tagService.updateTag).toHaveBeenCalledWith(
        tagId,
        userId,
        updateInput
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Tag updated successfully',
        tag: updatedTag,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });

  // --- deleteTag Tests ---
  describe('deleteTag', () => {
    it('should delete tag successfully', async () => {
      // Arrange
      mockRequest.params = { id: tagId };
      vi.mocked(tagService.deleteTag).mockResolvedValue(undefined);

      // Act
      await tagController.deleteTag(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(tagService.deleteTag).toHaveBeenCalledWith(
        tagId,
        userId
      );
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(204);
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });

  // --- getBookmarksByTag Tests ---
  describe('getBookmarksByTag', () => {
    it('should get bookmarks by tag successfully', async () => {
      // Arrange
      const query = {
        limit: '15',
        page: '1',
        sortBy: 'title',
        sortOrder: 'asc',
      }; // Example query
      const expectedServiceParams = {
        limit: 15,
        offset: 0,
        sortBy: 'title',
        sortOrder: 'asc',
      };
      const serviceResult = {
        data: [],
        totalCount: 0,
        page: 1,
        limit: 15,
        hasMore: false,
      };
      mockRequest.params = { id: tagId }; // Changed from tagId to id
      mockRequest.query = query;
      vi.mocked(tagService.getBookmarksByTag).mockResolvedValue(
        serviceResult as any
      ); // Cast if needed

      // Act
      await tagController.getBookmarksByTag(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(tagService.getBookmarksByTag).toHaveBeenCalledWith(
        tagId,
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
});
