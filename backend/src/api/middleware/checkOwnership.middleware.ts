// src/middleware/checkOwnership.middleware.ts
import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import logger from '../config/logger';
import { AuthenticatedRequest } from '../types/express/index'; // Import AuthenticatedRequest

type ResourceType = 'folder' | 'tag' | 'collection';

/**
 * Middleware factory to create ownership checking middleware for different resource types.
 *
 * IMPORTANT: This middleware currently ONLY checks for direct ownership (user ID matching the resource's userId/ownerId).
 * It DOES NOT check for collaborator permissions. Routes requiring collaborator access
 * (e.g., viewing/editing shared folders/collections) need additional checks in the controller or service layer,
 * or a separate, more complex authorization middleware.
 *
 * Assumes `protect` middleware has run first and attached `req.user`.
 * Assumes resource ID is available in `req.params.id`.
 *
 * @param resourceType - The type of resource to check ('folder', 'tag', 'collection').
 * @returns Express middleware function.
 */
const checkOwnership = (resourceType: ResourceType) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    // User should be guaranteed by 'protect' middleware running before this
    const userId = req.user?.id;
    const resourceId = req.params.id;

    // Basic validation
    if (!userId) {
      // This should technically not happen if 'protect' runs first
      logger.error(
        '[checkOwnership Middleware]: User ID not found on request object. Ensure protect middleware runs first.'
      );
      return res
        .status(401)
        .json({ success: false, message: 'Not authenticated' });
    }
    if (!resourceId) {
      logger.warn(
        `[checkOwnership Middleware]: Resource ID missing in request params for type ${resourceType}.`
      );
      return res.status(400).json({
        success: false,
        message: 'Resource ID parameter is required',
      });
    }

    logger.debug(
      `[checkOwnership Middleware]: Checking ownership for user ${userId} on ${resourceType} ${resourceId}`
    );

    try {
      let isOwner = false;

      // Query based on resource type to check ownership
      switch (resourceType) {
        case 'folder':
          const folder = await prisma.folder.findUnique({
            where: { id: resourceId },
            select: { userId: true }, // Select only the owner ID
          });
          if (folder?.userId === userId) isOwner = true;
          break;
        case 'tag':
          const tag = await prisma.tag.findUnique({
            where: { id: resourceId },
            select: { userId: true },
          });
          if (tag?.userId === userId) isOwner = true;
          break;
        case 'collection':
          // For collections, the owner is stored in 'ownerId' field
          const collection = await prisma.collection.findUnique({
            where: { id: resourceId },
            select: { ownerId: true },
          });
          if (collection?.ownerId === userId) isOwner = true;
          break;
        default:
          // Should not happen if types are correct, but handle defensively
          logger.error(
            `[checkOwnership Middleware]: Invalid resource type specified: ${resourceType}`
          );
          return res.status(500).json({
            success: false,
            message:
              'Internal server error: Invalid resource type for ownership check',
          });
      }

      // If not the owner, deny access (as this middleware only checks ownership)
      if (!isOwner) {
        logger.warn(
          `[checkOwnership Middleware]: Access denied. User ${userId} is not the owner of ${resourceType} ${resourceId}.`
        );
        // Return 403 Forbidden, as the resource might exist but user lacks ownership permission
        return res.status(403).json({
          success: false,
          message: 'Permission denied: You do not own this resource.',
        });
      }

      // Ownership confirmed
      logger.debug(
        `[checkOwnership Middleware]: Ownership confirmed for user ${userId} on ${resourceType} ${resourceId}.`
      );
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      logger.error(
        `[checkOwnership Middleware]: Database error checking ownership for ${resourceType} ${resourceId}:`,
        error
      );
      // Pass error to the central error handler
      return next(error);
    }
  };
};

export default checkOwnership;
