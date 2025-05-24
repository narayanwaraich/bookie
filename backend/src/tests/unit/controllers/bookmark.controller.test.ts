// src/controllers/bookmark.controller.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import * as bookmarkController from './bookmark.controller';
import * as bookmarkService from '../services/bookmark.service';
import { BookmarkError } from '../services/bookmark.service';
import logger from '../config/logger';
import { RequestUser, AuthenticatedRequest } from '../types/express'; // Import correct types

// --- Mocks ---
// Bookmark service is now auto-mocked by Vitest due to __mocks__ folder convention
vi.mock('../services/bookmark.service');
vi.mock('../config/logger', () => ({
  default: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

// --- Tests ---

describe('Bookmark Controller', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction = vi.fn();

  // Mock response methods
  const statusMock = vi.fn().mockReturnThis();
  const jsonMock = vi.fn();
  const sendStatusMock = vi.fn(); // Mock sendStatus for 204 responses

  const userId = 'user-bookmark-test';
  const bookmarkId = 'bookmark-123';

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
      sendStatus: sendStatusMock, // Use sendStatus mock
    };
    mockNext = vi.fn();
  });

  // --- createBookmark Tests ---
  describe('createBookmark', () => {
    it('should create a bookmark successfully and return 201', async () => {
      // Arrange
      const bookmarkInput = {
        url: 'http://new.com',
        title: 'New Bookmark',
      };
      const createdBookmark = {
        id: bookmarkId,
        ...bookmarkInput,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockRequest.body = bookmarkInput;
      vi.mocked(bookmarkService.createBookmark).mockResolvedValue(
        createdBookmark as any
      );

      // Act
      await bookmarkController.createBookmark(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(bookmarkService.createBookmark).toHaveBeenCalledWith(
        userId,
        bookmarkInput
      );
      expect(statusMock).toHaveBeenCalledWith(201);
      // Expect the response to include success, message, and bookmark
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Bookmark created successfully',
        bookmark: createdBookmark,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if service fails', async () => {
      // Arrange
      const bookmarkInput = {
        url: 'http://new.com',
        title: 'New Bookmark',
      };
      const serviceError = new BookmarkError('Failed to create', 500);
      mockRequest.body = bookmarkInput;
      vi.mocked(bookmarkService.createBookmark).mockRejectedValue(
        serviceError
      );

      // Act
      await bookmarkController.createBookmark(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(bookmarkService.createBookmark).toHaveBeenCalledWith(
        userId,
        bookmarkInput
      );
      expect(mockNext).toHaveBeenCalledWith(serviceError);
      expect(statusMock).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });

  // --- getBookmark Tests --- Corrected name
  describe('getBookmark', () => {
    it('should return bookmark data if found', async () => {
      // Arrange
      const bookmarkData = {
        id: bookmarkId,
        url: 'http://found.com',
        title: 'Found',
        userId,
      };
      mockRequest.params = { id: bookmarkId };
      vi.mocked(bookmarkService.getBookmarkById).mockResolvedValue(
        bookmarkData as any
      );

      // Act
      await bookmarkController.getBookmark(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      ); // Use correct controller name

      // Assert
      expect(bookmarkService.getBookmarkById).toHaveBeenCalledWith(
        bookmarkId,
        userId
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      // Expect the response to include success and bookmark
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        bookmark: bookmarkData,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if service throws', async () => {
      // Arrange
      const serviceError = new BookmarkError('Not found', 404);
      mockRequest.params = { id: bookmarkId };
      vi.mocked(bookmarkService.getBookmarkById).mockRejectedValue(
        serviceError
      );

      // Act
      await bookmarkController.getBookmark(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      ); // Use correct controller name

      // Assert
      expect(bookmarkService.getBookmarkById).toHaveBeenCalledWith(
        bookmarkId,
        userId
      );
      expect(mockNext).toHaveBeenCalledWith(serviceError);
    });
  });

  // --- updateBookmark Tests ---
  describe('updateBookmark', () => {
    it('should update bookmark successfully and return updated data', async () => {
      // Arrange
      const updateInput = { title: 'Updated Title' };
      const updatedBookmark = {
        id: bookmarkId,
        url: 'http://test.com',
        title: updateInput.title,
        userId,
      };
      mockRequest.params = { id: bookmarkId };
      mockRequest.body = updateInput;
      vi.mocked(bookmarkService.updateBookmark).mockResolvedValue(
        updatedBookmark as any
      );

      // Act
      await bookmarkController.updateBookmark(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(bookmarkService.updateBookmark).toHaveBeenCalledWith(
        bookmarkId,
        userId,
        updateInput
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      // Expect the response to include success, message, and bookmark
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Bookmark updated successfully',
        bookmark: updatedBookmark,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if service fails', async () => {
      // Arrange
      const updateInput = { title: 'Updated Title' };
      const serviceError = new BookmarkError('Update failed', 500);
      mockRequest.params = { id: bookmarkId };
      mockRequest.body = updateInput;
      vi.mocked(bookmarkService.updateBookmark).mockRejectedValue(
        serviceError
      );

      // Act
      await bookmarkController.updateBookmark(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(bookmarkService.updateBookmark).toHaveBeenCalledWith(
        bookmarkId,
        userId,
        updateInput
      );
      expect(mockNext).toHaveBeenCalledWith(serviceError);
    });
  });

  // --- deleteBookmark Tests ---
  describe('deleteBookmark', () => {
    it('should delete bookmark successfully and return 204', async () => {
      // Arrange
      mockRequest.params = { id: bookmarkId };
      vi.mocked(bookmarkService.deleteBookmark).mockResolvedValue(
        undefined
      );

      // Act
      await bookmarkController.deleteBookmark(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(bookmarkService.deleteBookmark).toHaveBeenCalledWith(
        bookmarkId,
        userId
      );
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(204); // Use sendStatus for 204
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if service fails', async () => {
      // Arrange
      const serviceError = new BookmarkError('Not found', 404);
      mockRequest.params = { id: bookmarkId };
      vi.mocked(bookmarkService.deleteBookmark).mockRejectedValue(
        serviceError
      );

      // Act
      await bookmarkController.deleteBookmark(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(bookmarkService.deleteBookmark).toHaveBeenCalledWith(
        bookmarkId,
        userId
      );
      expect(mockNext).toHaveBeenCalledWith(serviceError);
    });
  });

  // --- searchBookmarks Tests ---
  describe('searchBookmarks', () => {
    it('should call search service and return results', async () => {
      // Arrange
      const query = { q: 'search term', limit: '10', page: '1' };
      // Correct the service result shape
      const serviceResult = {
        bookmarks: [],
        totalCount: 0,
        page: 1,
        limit: 10,
        hasMore: false,
      };
      mockRequest.query = query;
      vi.mocked(bookmarkService.searchBookmarks).mockResolvedValue(
        serviceResult
      );

      // Act
      await bookmarkController.searchBookmarks(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(bookmarkService.searchBookmarks).toHaveBeenCalledWith(
        userId,
        {
          q: 'search term',
          limit: 10,
          page: 1,
          // Add default sort/filter if applicable by the controller/schema
          sortBy: 'createdAt', // Assuming default from schema if not provided
          sortOrder: 'desc', // Assuming default from schema if not provided
        }
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      // Expect the response to include success and the service result structure
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        ...serviceResult,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });

  // --- getRecentBookmarks Tests ---
  describe('getRecentBookmarks', () => {
    it('should call service and return recent bookmarks', async () => {
      // Arrange
      const query = { limit: '5' };
      // Correct the service result shape
      const serviceResult = {
        bookmarks: [],
        totalCount: 0,
        page: 1,
        limit: 5,
        hasMore: false,
      };
      mockRequest.query = query;
      vi.mocked(bookmarkService.getRecentBookmarks).mockResolvedValue(
        serviceResult as any
      ); // Cast if needed

      // Act
      await bookmarkController.getRecentBookmarks(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(bookmarkService.getRecentBookmarks).toHaveBeenCalledWith(
        userId,
        5
      ); // Service expects number
      expect(statusMock).toHaveBeenCalledWith(200);
      // Expect the response to include success and bookmarks array
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        bookmarks: serviceResult.bookmarks,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });

  // --- getPopularBookmarks Tests ---
  describe('getPopularBookmarks', () => {
    it('should call service and return popular bookmarks', async () => {
      // Arrange
      const query = { limit: '10' };
      // Correct the service result shape
      const serviceResult = {
        bookmarks: [],
        totalCount: 0,
        page: 1,
        limit: 10,
        hasMore: false,
      };
      mockRequest.query = query;
      vi.mocked(
        bookmarkService.getPopularBookmarks
      ).mockResolvedValue(serviceResult as any); // Cast if needed

      // Act
      await bookmarkController.getPopularBookmarks(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(
        bookmarkService.getPopularBookmarks
      ).toHaveBeenCalledWith(userId, 10); // Service expects number
      expect(statusMock).toHaveBeenCalledWith(200);
      // Expect the response to include success and bookmarks array
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        bookmarks: serviceResult.bookmarks,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });

  // --- performBulkAction Tests ---
  describe('performBulkAction', () => {
    it('should call service and return 200 on success', async () => {
      // Arrange
      const bulkActionInput = {
        action: 'delete' as const,
        bookmarkIds: ['bm1', 'bm2'],
      }; // Use 'as const' for action
      mockRequest.body = bulkActionInput;
      // Correct the service result shape
      const serviceResult = {
        success: true,
        message: 'Bulk action completed',
      };
      vi.mocked(bookmarkService.performBulkAction).mockResolvedValue(
        serviceResult
      );

      // Act
      await bookmarkController.performBulkAction(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(bookmarkService.performBulkAction).toHaveBeenCalledWith(
        userId,
        bulkActionInput
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(serviceResult); // Expect the service result directly
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });

  // --- checkBookmarkUrlExists Tests --- Corrected name
  describe('checkBookmarkUrlExists', () => {
    it('should call service and return result', async () => {
      // Arrange
      const urlToCheck = 'http://exists.com';
      const serviceResult = { exists: true, id: 'existing-bm-id' };
      mockRequest.query = { url: urlToCheck };
      vi.mocked(
        bookmarkService.checkBookmarkUrlExists
      ).mockResolvedValue(serviceResult);

      // Act
      await bookmarkController.checkBookmarkUrlExists(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      ); // Use correct controller name

      // Assert
      expect(
        bookmarkService.checkBookmarkUrlExists
      ).toHaveBeenCalledWith(userId, urlToCheck);
      expect(statusMock).toHaveBeenCalledWith(200);
      // Expect the response to include success and the service result
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        ...serviceResult,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });
});
