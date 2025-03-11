// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import prisma from '../config/db';
import logger from '../config/logger';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username: string;
      };
    }
  }
}

export interface TokenPayload {
  id: string;
  email: string;
  username: string;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;

    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Get token from cookie
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        username: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    // Add user to request object
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
};

// Middleware to check ownership of resources
export const checkOwnership = (resourceType: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const resourceId = req.params.id;

      if (!userId || !resourceId) {
        return res.status(400).json({
          success: false,
          message: 'Missing user ID or resource ID',
        });
      }

      let resource;
      
      switch (resourceType) {
        case 'bookmark':
          resource = await prisma.bookmark.findUnique({
            where: { id: resourceId },
            select: { userId: true },
          });
          break;
        case 'folder':
          resource = await prisma.folder.findUnique({
            where: { id: resourceId },
            select: { userId: true },
          });
          break;
        case 'tag':
          resource = await prisma.tag.findUnique({
            where: { id: resourceId },
            select: { userId: true },
          });
          break;
        case 'collection':
          resource = await prisma.collection.findUnique({
            where: { id: resourceId },
            select: { userId: true, ownerId: true },
          });
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid resource type',
          });
      }

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: `${resourceType} not found`,
        });
      }

      // Check if the user is the owner of the resource
      if (resource.userId !== userId && resource.ownerId !== userId) {
        // For collections and folders, check if the user has collaboration rights
        if (resourceType === 'collection') {
          const collaborator = await prisma.collectionCollaborator.findUnique({
            where: {
              collectionId_userId: {
                collectionId: resourceId,
                userId,
              },
            },
          });

          if (!collaborator) {
            return res.status(403).json({
              success: false,
              message: 'Not authorized to access this resource',
            });
          }

          // Check if the operation requires admin or edit rights
          const requiresEditRights = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
          if (requiresEditRights && collaborator.permission === 'view') {
            return res.status(403).json({
              success: false,
              message: 'You do not have permission to modify this resource',
            });
          }
        } else if (resourceType === 'folder') {
          const collaborator = await prisma.folderCollaborator.findUnique({
            where: {
              folderId_userId: {
                folderId: resourceId,
                userId,
              },
            },
          });

          if (!collaborator) {
            return res.status(403).json({
              success: false,
              message: 'Not authorized to access this resource',
            });
          }

          // Check if the operation requires admin or edit rights
          const requiresEditRights = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
          if (requiresEditRights && collaborator.permission === 'view') {
            return res.status(403).json({
              success: false,
              message: 'You do not have permission to modify this resource',
            });
          }
        } else {
          return res.status(403).json({
            success: false,
            message: 'Not authorized to access this resource',
          });
        }
      }

      next();
    } catch (error) {
      logger.error('Check ownership middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while checking resource ownership',
      });
    }
  };
};

// Middleware to validate request body against Zod schema
export const validate = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }
  };
};