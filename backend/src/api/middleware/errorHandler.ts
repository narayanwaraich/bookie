import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import logger from '../config/logger';
import { AuthError } from '../services/auth.service';
import { BookmarkError } from '../services/bookmark.service';
import { CollectionError } from '../services/collection.service';
import { FolderError } from '../services/folder.service';
import { ImportExportError } from '../services/importExport.service';
import { SyncError } from '../services/sync.service';
import { TagError } from '../services/tag.service';
import { UserServiceError } from '../services/user.service';

// Define a union type for all known custom service errors
type ServiceError =
  | AuthError
  | BookmarkError
  | CollectionError
  | FolderError
  | ImportExportError
  | SyncError
  | TagError
  | UserServiceError;

// Interface for errors that might have a statusCode
interface CustomError extends Error {
  statusCode?: number;
  errors?: any[]; // For Zod validation errors
}

/**
 * Centralized Express error handling middleware.
 * Catches errors passed via `next(error)` and sends a standardized JSON response.
 * Handles specific error types like ZodError, Prisma Errors, and custom Service Errors.
 *
 * @param {CustomError} err - The error object.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function (required signature).
 */
const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Determine default status code and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors: any[] | undefined = undefined; // Initialize errors as undefined

  // --- Logging ---
  // Log server errors (status 500 or unknown) with full stack
  // Log client errors (4xx) or known Prisma issues with less detail
  if (
    statusCode >= 500 &&
    !(err instanceof Prisma.PrismaClientKnownRequestError)
  ) {
    logger.error(
      `[ErrorHandler] ${req.method} ${req.originalUrl} - Status: ${statusCode} - Message: ${err.message} - Stack: ${err.stack}`
    );
  } else {
    logger.warn(
      `[ErrorHandler] ${req.method} ${req.originalUrl} - Status: ${statusCode} - Message: ${err.message}` +
        (err.name ? ` (${err.name})` : '')
    );
  }

  // --- Specific Error Handling ---

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    statusCode = 400; // Bad Request
    message = 'Input validation failed';
    // Format Zod errors for clearer client feedback
    errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    logger.warn(
      `[ErrorHandler] Zod Validation Error: ${JSON.stringify(errors)}`
    );
  }
  // Handle known custom Service errors (AuthError, BookmarkError, etc.)
  // Check if the error name matches any of the known service error names
  else if (
    err.name === 'AuthError' ||
    err.name === 'BookmarkError' ||
    err.name === 'CollectionError' ||
    err.name === 'FolderError' ||
    err.name === 'ImportExportError' ||
    err.name === 'SyncError' ||
    err.name === 'TagError' ||
    err.name === 'UserServiceError'
  ) {
    // Use the status code and message defined in the custom error class
    statusCode = (err as ServiceError).statusCode; // Already set, default is usually 400 or 500
    message = err.message;
  }
  // Handle specific Prisma known request errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': // Unique constraint violation
        statusCode = 409; // Conflict
        const target = (err.meta as any)?.target;
        message =
          `Record already exists or unique constraint failed` +
          (target
            ? ` on field(s): ${
                Array.isArray(target) ? target.join(', ') : target
              }`
            : '');
        break;
      case 'P2025': // Record not found (for update/delete)
        statusCode = 404; // Not Found
        message =
          (err.meta?.cause as string) || 'Required record not found'; // Use Prisma's cause if available
        break;
      // Add more specific Prisma error codes as needed
      // case 'P2003': // Foreign key constraint failed
      //     statusCode = 400;
      //     message = `Foreign key constraint failed on field: ${err.meta?.field_name}`;
      //     break;
      default:
        statusCode = 500; // Default to internal server error for unhandled DB errors
        message = 'Database request error';
        logger.error(
          `[ErrorHandler] Unhandled Prisma Known Request Error Code: ${err.code}`,
          err
        );
        break;
    }
  }
  // Handle Prisma validation errors (e.g., incorrect data type format before DB)
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400; // Bad Request
    message =
      'Database input validation error. Please check your data.';
    logger.warn(
      `[ErrorHandler] Prisma Validation Error: ${err.message}`
    );
  }
  // Handle generic errors or errors without a specific status code
  else if (statusCode === 500) {
    message = 'An unexpected internal server error occurred.'; // Avoid leaking internal details
  }

  // --- Send Response ---
  res.status(statusCode).json({
    success: false,
    message,
    // Include the errors array only if it was populated (e.g., by Zod)
    ...(errors && { errors }),
  });
};

export default errorHandler;
