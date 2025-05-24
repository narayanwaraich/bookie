// src/middleware/socketAuth.middleware.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended'; // Keep for type usage if needed elsewhere
import { PrismaClient } from '@prisma/client'; // Keep for type usage if needed elsewhere
import prisma from '../config/db'; // Import the actual prisma instance path (Vitest will auto-mock)
import { socketAuthMiddleware } from './socketAuth.middleware'; // Import the middleware
import { verify } from 'jsonwebtoken';
import logger from '../config/logger';
import { AuthError } from '../services/auth.service'; // Assuming AuthError is used

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
  default: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));
// Mock AuthError or use a generic Error
vi.mock('../services/auth.service', () => ({
  AuthError: class extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number = 401) {
      super(message);
      this.statusCode = statusCode;
      this.name = 'AuthError';
    }
  },
}));

// --- Tests ---

describe('Socket Auth Middleware', () => {
  let mockSocket: Partial<Socket>;
  let mockNext: (err?: ExtendedError | undefined) => void;
  let mockPrisma: DeepMockProxy<PrismaClient>; // Use the mocked Prisma client type

  const mockJwtVerify = vi.mocked(verify);
  // No need for mockPrismaUserFindUnique, access via mockPrisma.user.findUnique

  const userId = 'user-socket-auth-test';
  const userEmail = 'socket@test.com';
  const username = 'sockettester';
  const token = 'valid-socket-token';
  const mockUserPayload = {
    id: userId,
    email: userEmail,
    username: username,
  };
  const mockDbUser = {
    ...mockUserPayload,
    name: 'Socket Tester' /* other fields */,
  };

  beforeEach(() => {
    vi.resetAllMocks();
    mockPrisma = prisma as unknown as DeepMockProxy<PrismaClient>; // Assign the auto-mocked instance

    // Mock Socket object with required Handshake properties (without explicit type)
    mockSocket = {
      handshake: {
        auth: {},
        headers: {},
        time: new Date().toISOString(),
        address: '::1',
        xdomain: false,
        secure: false,
        issued: Date.now(),
        url: '/socket.io/',
        query: {},
      },
      data: {},
    };
    mockNext = vi.fn();
  });

  it('should call next() if token is valid (from auth object) and user exists', async () => {
    // Arrange
    mockSocket.handshake!.auth = { token: token };
    mockJwtVerify.mockReturnValue(mockUserPayload as any);
    mockPrisma.user.findUnique.mockResolvedValue(mockDbUser as any);

    // Act
    await socketAuthMiddleware(mockSocket as Socket, mockNext);

    // Assert
    expect(mockJwtVerify).toHaveBeenCalledWith(
      token,
      expect.any(String)
    );
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: userId },
    });
    expect((mockSocket as Socket).data.user).toEqual(mockUserPayload);
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should call next() if token is valid (from Authorization header) and user exists', async () => {
    // Arrange
    mockSocket.handshake!.headers = {
      authorization: `Bearer ${token}`,
    };
    mockJwtVerify.mockReturnValue(mockUserPayload as any);
    mockPrisma.user.findUnique.mockResolvedValue(mockDbUser as any);

    // Act
    await socketAuthMiddleware(mockSocket as Socket, mockNext);

    // Assert
    expect(mockJwtVerify).toHaveBeenCalledWith(
      token,
      expect.any(String)
    );
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: userId },
    });
    expect((mockSocket as Socket).data.user).toEqual(mockUserPayload);
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should call next(error) if no token is provided', async () => {
    // Arrange
    mockSocket.handshake!.auth = {};
    mockSocket.handshake!.headers = {};

    // Act
    await socketAuthMiddleware(mockSocket as Socket, mockNext);

    // Assert
    expect(mockJwtVerify).not.toHaveBeenCalled();
    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Authentication error: Token not provided',
      })
    );
  });

  it('should call next(error) if token verification fails', async () => {
    // Arrange
    mockSocket.handshake!.auth = { token: 'invalid-token' };
    const verifyError = new Error('Invalid signature');
    mockJwtVerify.mockImplementation(() => {
      throw verifyError;
    });

    // Act
    await socketAuthMiddleware(mockSocket as Socket, mockNext);

    // Assert
    expect(mockJwtVerify).toHaveBeenCalledWith(
      'invalid-token',
      expect.any(String)
    );
    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Authentication error: Invalid token',
      })
    );
  });

  it('should call next(error) if user not found in DB', async () => {
    // Arrange
    mockSocket.handshake!.auth = { token: token };
    mockJwtVerify.mockReturnValue(mockUserPayload as any);
    mockPrisma.user.findUnique.mockResolvedValue(null); // User not found

    // Act
    await socketAuthMiddleware(mockSocket as Socket, mockNext);

    // Assert
    expect(mockJwtVerify).toHaveBeenCalledWith(
      token,
      expect.any(String)
    );
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: userId },
    });
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Authentication error: User not found',
      })
    );
  });
});
