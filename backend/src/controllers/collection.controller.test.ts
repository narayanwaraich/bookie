// src/controllers/collection.controller.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended'; // Keep for type usage if needed elsewhere, though not strictly necessary here
import { PrismaClient } from '@prisma/client'; // Keep for type usage if needed elsewhere
import prisma from '../config/db'; // Import the actual prisma instance path (Vitest will auto-mock)
import * as collectionController from './collection.controller';
import * as collectionService from '../services/collection.service';
import { CollectionError } from '../services/collection.service';
import logger from '../config/logger';
import { RequestUser, AuthenticatedRequest } from '../types/express'; // Import correct types

// --- Mocks ---
// Collection service is now auto-mocked by Vitest due to __mocks__ folder convention
vi.mock('../services/collection.service');
vi.mock('../config/logger', () => ({
  default: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
}));

// --- Tests ---

describe('Collection Controller', () => {
  // No need for mockPrisma variable here as we mock the service directly

  // Keep mocks for other dependencies/response objects
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction = vi.fn();

  // Mock response methods
  const statusMock = vi.fn().mockReturnThis();
  const jsonMock = vi.fn();
  const sendStatusMock = vi.fn();

  const userId = 'user-collection-test';
  const collectionId = 'collection-123';
  const bookmarkId = 'bookmark-abc';
  const publicLink = 'public-link-test';

  beforeEach(() => {
    vi.resetAllMocks();

    mockRequest = {
      body: {},
      params: {},
      query: {},
      user: { id: userId, email: 'test@test.com', username: 'tester' }, // Assume authenticated user
    };
    mockResponse = {
      status: statusMock,
      json: jsonMock,
      sendStatus: sendStatusMock,
    };
    mockNext = vi.fn();
  });

  // --- createCollection Tests ---
  describe('createCollection', () => {
    it('should create a collection successfully and return 201', async () => {
      // Arrange
      const collectionInput = { name: 'My New Collection', description: 'A test collection', isPublic: false };
      const createdCollection = { id: collectionId, ...collectionInput, userId, ownerId: userId, createdAt: new Date(), updatedAt: new Date() }; // Added ownerId
      mockRequest.body = collectionInput;
      vi.mocked(collectionService.createCollection).mockResolvedValue(createdCollection as any);

      // Act
      await collectionController.createCollection(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      // Assert
      // Controller adds userId and ownerId before calling service
      expect(collectionService.createCollection).toHaveBeenCalledWith({ ...collectionInput, userId, ownerId: userId });
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, message: 'Collection created successfully', collection: createdCollection });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if service fails', async () => {
      // Arrange
      const collectionInput = { name: 'My New Collection' };
      const serviceError = new CollectionError('Failed to create', 500);
      mockRequest.body = collectionInput;
      vi.mocked(collectionService.createCollection).mockRejectedValue(serviceError);

      // Act
      await collectionController.createCollection(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      // Assert
      expect(collectionService.createCollection).toHaveBeenCalledWith({ ...collectionInput, userId, ownerId: userId });
      expect(mockNext).toHaveBeenCalledWith(serviceError);
    });
  });

  // --- getUserCollections Tests ---
  describe('getUserCollections', () => {
    it('should get user collections successfully', async () => {
      // Arrange
      const query = { limit: '10', page: '1', sortBy: 'name', sortOrder: 'asc' }; // Example query params
      const expectedServiceParams = { limit: 10, offset: 0, sortBy: 'name', sortOrder: 'asc' }; // Expected after parsing
      const serviceResult = { data: [], totalCount: 0, page: 1, limit: 10, hasMore: false };
      mockRequest.query = query;
      vi.mocked(collectionService.getUserCollections).mockResolvedValue(serviceResult);

      // Act
      await collectionController.getUserCollections(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      // Assert
      expect(collectionService.getUserCollections).toHaveBeenCalledWith(userId, expectedServiceParams);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, ...serviceResult });
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });

  // --- getCollectionById Tests ---
  describe('getCollectionById', () => {
    it('should get a specific collection successfully', async () => {
      // Arrange
      const query = { limit: '5', page: '1', sortBy: 'createdAt', sortOrder: 'desc' };
      const expectedServiceParams = { limit: 5, offset: 0, sortBy: 'createdAt', sortOrder: 'desc' };
      const collectionData = { id: collectionId, name: 'Test Collection', userId, bookmarks: { data: [], totalCount: 0, page: 1, limit: 5, hasMore: false } };
      mockRequest.params = { id: collectionId };
      mockRequest.query = query;
      vi.mocked(collectionService.getCollectionById).mockResolvedValue(collectionData as any);

      // Act
      await collectionController.getCollectionById(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      // Assert
      expect(collectionService.getCollectionById).toHaveBeenCalledWith(collectionId, userId, expectedServiceParams);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, collection: collectionData });
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });

  // --- getPublicCollectionByLink Tests ---
  describe('getPublicCollectionByLink', () => {
    it('should get a public collection successfully', async () => {
      // Arrange
      const query = { limit: '10', page: '1' }; // Query params might be used for bookmarks within public collection
      const expectedServiceParams = { limit: 10, offset: 0, sortBy: 'createdAt', sortOrder: 'desc' };
      const collectionData = { id: collectionId, name: 'Public Collection', isPublic: true, publicLink, bookmarks: { data: [], totalCount: 0, page: 1, limit: 10, hasMore: false } };
      mockRequest.params = { publicLink }; // Correct param name
      mockRequest.query = query;
      vi.mocked(collectionService.getPublicCollectionByLink).mockResolvedValue(collectionData as any);

      // Act
      await collectionController.getPublicCollectionByLink(mockRequest as Request, mockResponse as Response, mockNext); // Non-authenticated request

      // Assert
      // Service might not need queryParams for the main public fetch, adjust if needed
      expect(collectionService.getPublicCollectionByLink).toHaveBeenCalledWith(publicLink);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, collection: collectionData });
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });

  // --- updateCollection Tests ---
  describe('updateCollection', () => {
    it('should update collection successfully', async () => {
      // Arrange
      const updateInput = { name: 'Updated Collection Name' };
      const updatedCollection = { id: collectionId, name: updateInput.name, userId };
      mockRequest.params = { id: collectionId };
      mockRequest.body = updateInput;
      vi.mocked(collectionService.updateCollection).mockResolvedValue(updatedCollection as any);

      // Act
      await collectionController.updateCollection(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      // Assert
      expect(collectionService.updateCollection).toHaveBeenCalledWith(collectionId, userId, updateInput);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, message: 'Collection updated successfully', collection: updatedCollection });
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });

  // --- deleteCollection Tests ---
  describe('deleteCollection', () => {
    it('should delete collection successfully', async () => {
      // Arrange
      mockRequest.params = { id: collectionId };
      vi.mocked(collectionService.deleteCollection).mockResolvedValue(undefined);

      // Act
      await collectionController.deleteCollection(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      // Assert
      expect(collectionService.deleteCollection).toHaveBeenCalledWith(collectionId, userId);
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(204);
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });

  // --- addBookmarkToCollection Tests ---
  describe('addBookmarkToCollection', () => {
    it('should add bookmark to collection successfully', async () => {
      // Arrange
      mockRequest.params = { collectionId, bookmarkId };
      vi.mocked(collectionService.addBookmarkToCollection).mockResolvedValue({} as any);

      // Act
      await collectionController.addBookmarkToCollection(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      // Assert
      expect(collectionService.addBookmarkToCollection).toHaveBeenCalledWith(collectionId, bookmarkId, userId);
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(204);
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });

  // --- removeBookmarkFromCollection Tests ---
  describe('removeBookmarkFromCollection', () => {
    it('should remove bookmark from collection successfully', async () => {
      // Arrange
      mockRequest.params = { collectionId, bookmarkId };
      vi.mocked(collectionService.removeBookmarkFromCollection).mockResolvedValue(undefined);

      // Act
      await collectionController.removeBookmarkFromCollection(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      // Assert
      expect(collectionService.removeBookmarkFromCollection).toHaveBeenCalledWith(collectionId, bookmarkId, userId);
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(204);
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });

});
