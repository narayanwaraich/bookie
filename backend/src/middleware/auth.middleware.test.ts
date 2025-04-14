// src/middleware/auth.middleware.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended'; // Keep for type usage if needed elsewhere
import { PrismaClient } from '@prisma/client'; // Keep for type usage if needed elsewhere
import prisma from '../config/db'; // Import the actual prisma instance path (Vitest will auto-mock)
import { protect } from './auth.middleware'; // Import the middleware
import { verify } from 'jsonwebtoken';
import logger from '../config/logger';
import { AuthError } from '../services/auth.service'; // Assuming AuthError is appropriate
import { RequestUser } from '../types/express';

// --- Mocks ---
vi.mock('jsonwebtoken');
// Prisma is now auto-mocked via __mocks__/prisma.ts
vi.mock('../config/db', async () => {
  const originalModule = await vi.importActual('../config/db');
  return {
    ...originalModule,
    default: mockDeep<PrismaClient>(),
  };
});
vi.mock('../config/logger', () => ({
  default: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
}));
// Mock AuthError or use a generic Error if AuthError isn't defined/needed here
vi.mock('../services/auth.service', () => ({
  AuthError: class extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number = 401) {
      super(message);
      this.statusCode = statusCode;
      this.name = 'AuthError';
    }
  }
}));


// --- Tests ---

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction = vi.fn();
  let mockPrisma: DeepMockProxy<PrismaClient>; // Use the mocked Prisma client type

  const mockJwtVerify = vi.mocked(verify);
  // No need for mockPrismaUserFindUnique, access via mockPrisma.user.findUnique

  const userId = 'user-auth-middleware-test';
  const userEmail = 'auth@test.com';
  const username = 'authtester';
  const token = 'valid-token';
  const mockUserPayload = { id: userId, email: userEmail, username: username };
  const mockDbUser = { ...mockUserPayload, name: 'Auth Tester' /* other fields */ };

  beforeEach(() => {
    vi.resetAllMocks();
    mockPrisma = prisma as unknown as DeepMockProxy<PrismaClient>; // Assign the auto-mocked instance

    mockRequest = {
      headers: {},
      cookies: {}, // Initialize cookies
    };
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    mockNext = vi.fn();
  });

  describe('protect', () => {
    it('should call next() if token is valid and user exists', async () => {
      // Arrange
      mockRequest.headers = { authorization: `Bearer ${token}` };
      mockJwtVerify.mockReturnValue(mockUserPayload as any); // Mock successful verification
      mockPrisma.user.findUnique.mockResolvedValue(mockDbUser as any); // Mock user found

      // Act
      await protect(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockJwtVerify).toHaveBeenCalledWith(token, expect.any(String)); // Check verify was called
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
      expect((mockRequest as any).user).toEqual(mockUserPayload); // Check user is attached
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(); // Called without error
    });

    it('should call next with AuthError if no token is provided (no header)', async () => {
      // Arrange
      mockRequest.headers = {}; // No authorization header

      // Act
      await protect(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockJwtVerify).not.toHaveBeenCalled();
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthError));
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ message: 'Not authorized, no token', statusCode: 401 }));
    });

    it('should call next with AuthError if no token is provided (no cookie)', async () => {
      // Arrange
      mockRequest.headers = {}; // No authorization header
      mockRequest.cookies = {}; // No cookie either

      // Act
      await protect(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockJwtVerify).not.toHaveBeenCalled();
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthError));
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ message: 'Not authorized, no token', statusCode: 401 }));
    });

    it('should call next with AuthError if authorization header is malformed', async () => {
      // Arrange
      mockRequest.headers = { authorization: 'Bearer' }; // Missing token part

      // Act
      await protect(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockJwtVerify).not.toHaveBeenCalled();
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthError));
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ message: 'Not authorized, token failed', statusCode: 401 })); // Or a more specific message
    });

    it('should call next with AuthError if token verification fails', async () => {
      // Arrange
      mockRequest.headers = { authorization: `Bearer ${token}` };
      const verifyError = new Error('Invalid signature');
      mockJwtVerify.mockImplementation(() => { throw verifyError; }); // Mock verification failure

      // Act
      await protect(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockJwtVerify).toHaveBeenCalledWith(token, expect.any(String));
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthError));
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ message: 'Not authorized, token failed', statusCode: 401 }));
    });

    it('should call next with AuthError if user not found in DB after token verification', async () => {
      // Arrange
      mockRequest.headers = { authorization: `Bearer ${token}` };
      mockJwtVerify.mockReturnValue(mockUserPayload as any);
      mockPrisma.user.findUnique.mockResolvedValue(null); // Mock user not found

      // Act
      await protect(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockJwtVerify).toHaveBeenCalledWith(token, expect.any(String));
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthError));
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ message: 'User not found', statusCode: 401 }));
    });

    it('should use token from cookie if authorization header is missing', async () => {
      // Arrange
      mockRequest.headers = {}; // No authorization header
      mockRequest.cookies = { token: token }; // Token in cookie
      mockJwtVerify.mockReturnValue(mockUserPayload as any);
      mockPrisma.user.findUnique.mockResolvedValue(mockDbUser as any);

      // Act
      await protect(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockJwtVerify).toHaveBeenCalledWith(token, expect.any(String));
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
      expect((mockRequest as any).user).toEqual(mockUserPayload);
      expect(mockNext).toHaveBeenCalledWith();
    });
  });
});
