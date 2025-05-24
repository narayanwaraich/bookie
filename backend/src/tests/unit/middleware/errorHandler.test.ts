// src/middleware/errorHandler.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { Prisma } from '@prisma/client';
import errorHandler from './errorHandler'; // Import the default export
import logger from '../config/logger';
import { AuthError } from '../services/auth.service'; // Import custom errors used
import { BookmarkError } from '../services/bookmark.service';
import { CollectionError } from '../services/collection.service';
import { FolderError } from '../services/folder.service';
import { ImportExportError } from '../services/importExport.service';
import { SyncError } from '../services/sync.service';
import { TagError } from '../services/tag.service';
import { UserServiceError } from '../services/user.service';

// --- Mocks ---
vi.mock('../config/logger', () => ({
  default: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));
// Mock custom errors if they have complex logic, otherwise using new Error() might suffice
// For simplicity, we'll assume custom errors primarily set statusCode and message.

// --- Tests ---

describe('Error Handling Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction = vi.fn(); // Not typically used by the final error handler

  // Mock response methods
  const statusMock = vi.fn().mockReturnThis();
  const jsonMock = vi.fn();
  const mockLoggerError = vi.mocked(logger.error);

  beforeEach(() => {
    vi.resetAllMocks();

    mockRequest = {}; // Minimal request needed
    mockResponse = {
      status: statusMock,
      json: jsonMock,
      headersSent: false, // Important for error handler logic
    };
    mockNext = vi.fn();
  });

  it('should handle ZodError and return 400', () => {
    // Arrange
    const zodIssues: ZodIssue[] = [
      {
        code: 'invalid_type',
        expected: 'string',
        received: 'number',
        path: ['name'],
        message: 'Expected string, received number',
      },
    ];
    const error = new ZodError(zodIssues);

    // Act
    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert
    expect(mockLoggerError).toHaveBeenCalledWith(
      'Validation Error:',
      error.errors
    );
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'Validation failed',
      errors: error.errors,
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle PrismaClientKnownRequestError (Unique Constraint P2002) and return 409', () => {
    // Arrange
    const error = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed',
      {
        code: 'P2002',
        clientVersion: 'x.y.z',
        meta: { target: ['email'] },
      }
    );

    // Act
    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert
    expect(mockLoggerError).toHaveBeenCalledWith(
      'Prisma Error:',
      error
    );
    expect(statusMock).toHaveBeenCalledWith(409); // Conflict
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'Conflict: A record with this data already exists.',
      code: 'P2002',
      target: ['email'],
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle PrismaClientKnownRequestError (Not Found P2025) and return 404', () => {
    // Arrange
    const error = new Prisma.PrismaClientKnownRequestError(
      'Record not found',
      { code: 'P2025', clientVersion: 'x.y.z' }
    );

    // Act
    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert
    expect(mockLoggerError).toHaveBeenCalledWith(
      'Prisma Error:',
      error
    );
    expect(statusMock).toHaveBeenCalledWith(404); // Not Found
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'Resource not found.',
      code: 'P2025',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle custom AppError (e.g., AuthError) and return its status code', () => {
    // Arrange
    const error = new AuthError('Invalid credentials', 401);

    // Act
    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert
    expect(mockLoggerError).toHaveBeenCalledWith(
      'Application Error:',
      error
    );
    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid credentials',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle generic Error and return 500', () => {
    // Arrange
    const error = new Error('Something unexpected happened');

    // Act
    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert
    expect(mockLoggerError).toHaveBeenCalledWith(
      'Unhandled Error:',
      error
    );
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'Internal Server Error',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should not send response if headers already sent', () => {
    // Arrange
    const error = new Error('Error after headers sent');
    mockResponse.headersSent = true; // Simulate headers already sent

    // Act
    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert
    expect(mockLoggerError).toHaveBeenCalledWith(
      'Error after headers sent:',
      error
    );
    expect(statusMock).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(error); // Should pass to default Express handler
  });

  // Test specific custom errors
  it('should handle FolderError', () => {
    const error = new FolderError('Folder access denied', 403);
    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );
    expect(statusMock).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'Folder access denied',
    });
  });

  it('should handle BookmarkError', () => {
    const error = new BookmarkError(
      'Bookmark validation failed',
      400
    );
    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'Bookmark validation failed',
    });
  });

  // Add similar tests for CollectionError, ImportExportError, SyncError, TagError, UserServiceError
});
