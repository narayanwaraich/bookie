// src/controllers/sync.controller.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import * as syncController from './sync.controller';
import * as syncService from '../services/sync.service';
import { SyncError } from '../services/sync.service'; // Assuming SyncError exists
import logger from '../config/logger';
import { RequestUser, AuthenticatedRequest } from '../types/express'; // Import correct types

// --- Mocks ---
vi.mock('../services/sync.service'); 
vi.mock('../config/logger', () => ({
  default: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
}));

// --- Tests ---

describe('Sync Controller', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction = vi.fn(); 

  // Mock response methods
  const statusMock = vi.fn().mockReturnThis(); 
  const jsonMock = vi.fn();

  const userId = 'user-sync-test';

  beforeEach(() => {
    vi.resetAllMocks(); 

    mockRequest = {
      body: {}, // Sync data will be in the body
      params: {},
      query: {},
      user: { id: userId, email: 'test@test.com', username: 'tester' }, // Assume authenticated user
    };
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
    mockNext = vi.fn(); 
  });

  // --- handleSync Tests --- Corrected name
  describe('handleSync', () => {
    it('should process sync data successfully and return sync result', async () => {
      // Arrange
      const syncInput = { 
          lastSyncTimestamp: new Date().toISOString(), 
          clientChanges: { bookmarks: [], folders: [], tags: [], collections: [] } // Use clientChanges structure
      };
      const serviceResult = { 
          success: true, 
          serverChanges: [], // Use serverChanges structure
          deletedIds: { bookmarks: [], folders: [], tags: [], collections: [] },
          conflicts: [],
          newSyncTimestamp: new Date().toISOString() 
      };
      mockRequest.body = syncInput;
      vi.mocked(syncService.syncData).mockResolvedValue(serviceResult as any);

      // Act
      await syncController.handleSync(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext); // Use correct controller name

      // Assert
      // Service expects userId, timestamp, and clientChanges object
      expect(syncService.syncData).toHaveBeenCalledWith(userId, syncInput.lastSyncTimestamp, syncInput.clientChanges); 
      expect(statusMock).toHaveBeenCalledWith(200);
      // Controller response includes the full service result
      expect(jsonMock).toHaveBeenCalledWith(serviceResult); 
      expect(mockNext).not.toHaveBeenCalled();
    });

     it('should call next with error if sync service fails', async () => {
      // Arrange
      const syncInput = { lastSyncTimestamp: null, clientChanges: {} }; // Use clientChanges
      const serviceError = new SyncError('Sync failed due to conflict', 409); // Example error
      mockRequest.body = syncInput;
      vi.mocked(syncService.syncData).mockRejectedValue(serviceError);

      // Act
      await syncController.handleSync(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext); // Use correct controller name

      // Assert
      expect(syncService.syncData).toHaveBeenCalledWith(userId, syncInput.lastSyncTimestamp, syncInput.clientChanges);
      expect(mockNext).toHaveBeenCalledWith(serviceError);
      expect(statusMock).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });

     it('should call next with error if input validation fails (simulated)', async () => {
      // Arrange - Simulate invalid body 
      const invalidSyncInput = { lastSyncTimestamp: 'not-a-date', clientChanges: null }; // Use clientChanges
      mockRequest.body = invalidSyncInput;
      
      // Simulate the service throwing due to bad input shape (as validation middleware isn't mocked here)
      const validationError = new Error("Invalid input shape");
      vi.mocked(syncService.syncData).mockRejectedValue(validationError); 
      
      // Act
      await syncController.handleSync(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext); // Use correct controller name

      // Assert
      // Service might still be called if validation happens within the controller before the service call
      // Adjust this expectation based on actual controller logic if needed
      expect(syncService.syncData).toHaveBeenCalledWith(userId, invalidSyncInput.lastSyncTimestamp, invalidSyncInput.clientChanges); 
      expect(mockNext).toHaveBeenCalledWith(validationError); 
    });
  });

});
