// src/middleware/checkOwnership.middleware.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended'; // Keep for type usage if needed elsewhere
import { PrismaClient, Prisma, Role } from '@prisma/client'; // Import Role for collaborator checks (though not used by this middleware)
import prisma from '../config/db'; // Import the actual prisma instance path (Vitest will auto-mock)
import checkOwnership from './checkOwnership.middleware';
import logger from '../config/logger';
import { AuthenticatedRequest, RequestUser } from '../types/express';

// --- Mocks ---
// Prisma is now auto-mocked via __mocks__/prisma.ts
vi.mock('../config/db', async () => {
  const originalModule = await vi.importActual('../config/db');
  return {
    ...originalModule,
    default: mockDeep<PrismaClient>(),
  };
});
vi.mock('../config/logger', () => ({
  default: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

// --- Tests ---

describe('Check Ownership Middleware', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction = vi.fn();
  let mockPrisma: DeepMockProxy<PrismaClient>; // Use the mocked Prisma client type

  // No need for specific model mocks, access via mockPrisma

  const userId = 'user-owner-test';
  const otherUserId = 'other-user';
  const resourceId = 'resource-123';

  beforeEach(() => {
    vi.resetAllMocks();
    mockPrisma = prisma as unknown as DeepMockProxy<PrismaClient>; // Assign the auto-mocked instance

    mockRequest = {
      params: { id: resourceId },
      user: {
        id: userId,
        email: 'owner@test.com',
        username: 'owner',
      },
    };
    // Mock response object with status and json needed for error responses
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    mockNext = vi.fn();
  });

  // --- Test Cases for Different Resource Types ---

  describe('Folder Ownership', () => {
    const middleware = checkOwnership('folder'); // Only one argument

    it('should call next() if user owns the folder', async () => {
      mockPrisma.folder.findUnique.mockResolvedValue({
        id: resourceId,
        userId: userId,
      } as any);
      await middleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );
      // Middleware now only selects userId
      expect(mockPrisma.folder.findUnique).toHaveBeenCalledWith({
        where: { id: resourceId },
        select: { userId: true },
      });
      expect(mockNext).toHaveBeenCalledWith(); // No error
    });

    it('should call res.status(404) if folder not found', async () => {
      mockPrisma.folder.findUnique.mockResolvedValue(null);
      await middleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );
      expect(mockPrisma.folder.findUnique).toHaveBeenCalledWith({
        where: { id: resourceId },
        select: { userId: true },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(404); // Middleware sends response directly now
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Folder not found' })
      );
      expect(mockNext).not.toHaveBeenCalled(); // next() is not called on error response
    });

    it('should call res.status(403) if user does not own the folder', async () => {
      mockPrisma.folder.findUnique.mockResolvedValue({
        id: resourceId,
        userId: otherUserId,
      } as any);
      await middleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );
      expect(mockPrisma.folder.findUnique).toHaveBeenCalledWith({
        where: { id: resourceId },
        select: { userId: true },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Permission denied: You do not own this resource.',
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle database errors during lookup', async () => {
      const dbError = new Error('DB lookup failed');
      mockPrisma.folder.findUnique.mockRejectedValue(dbError);
      await middleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );
      expect(mockPrisma.folder.findUnique).toHaveBeenCalledWith({
        where: { id: resourceId },
        select: { userId: true },
      });
      expect(mockNext).toHaveBeenCalledWith(dbError); // Pass the original error to error handler
      expect(mockResponse.status).not.toHaveBeenCalled(); // Should not send response directly
    });
  });

  describe('Tag Ownership', () => {
    const middleware = checkOwnership('tag');

    it('should call next() if user owns the tag', async () => {
      mockPrisma.tag.findUnique.mockResolvedValue({
        id: resourceId,
        userId: userId,
      } as any);
      await middleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );
      expect(mockPrisma.tag.findUnique).toHaveBeenCalledWith({
        where: { id: resourceId },
        select: { userId: true },
      });
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should call res.status(404) if tag not found', async () => {
      mockPrisma.tag.findUnique.mockResolvedValue(null);
      await middleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );
      expect(mockPrisma.tag.findUnique).toHaveBeenCalledWith({
        where: { id: resourceId },
        select: { userId: true },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Tag not found' })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call res.status(403) if user does not own the tag', async () => {
      mockPrisma.tag.findUnique.mockResolvedValue({
        id: resourceId,
        userId: otherUserId,
      } as any);
      await middleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );
      expect(mockPrisma.tag.findUnique).toHaveBeenCalledWith({
        where: { id: resourceId },
        select: { userId: true },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Permission denied: You do not own this resource.',
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Collection Ownership', () => {
    // Note: Middleware uses ownerId field
    const middleware = checkOwnership('collection');

    it('should call next() if user owns the collection', async () => {
      mockPrisma.collection.findUnique.mockResolvedValue({
        id: resourceId,
        ownerId: userId,
      } as any); // Use ownerId
      await middleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );
      expect(mockPrisma.collection.findUnique).toHaveBeenCalledWith({
        where: { id: resourceId },
        select: { ownerId: true },
      });
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should call res.status(404) if collection not found', async () => {
      mockPrisma.collection.findUnique.mockResolvedValue(null);
      await middleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );
      expect(mockPrisma.collection.findUnique).toHaveBeenCalledWith({
        where: { id: resourceId },
        select: { ownerId: true },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Collection not found' })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call res.status(403) if user does not own the collection', async () => {
      mockPrisma.collection.findUnique.mockResolvedValue({
        id: resourceId,
        ownerId: otherUserId,
      } as any); // Use ownerId
      await middleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );
      expect(mockPrisma.collection.findUnique).toHaveBeenCalledWith({
        where: { id: resourceId },
        select: { ownerId: true },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Permission denied: You do not own this resource.',
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Invalid Resource Type', () => {
    it('should call res.status(500) for unsupported resource type', async () => {
      // Arrange
      const middleware = checkOwnership('invalidType' as any); // Force invalid type

      // Act
      await middleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message:
            'Internal server error: Invalid resource type for ownership check',
        })
      );
      expect(mockNext).not.toHaveBeenCalled(); // Middleware sends response directly
    });
  });
});
