// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import * as jwt from 'jsonwebtoken';
import prisma from '../config/db';
import logger from '../config/logger';
import { Role } from '@prisma/client'; // Keep Role if needed for future admin checks

// Extend Express Request type to include user
// This allows us to attach user info to the request object after authentication
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username: string;
        // Add other non-sensitive fields if needed later (e.g., role)
      };
    }
  }
}

/**
 * Interface for the decoded JWT payload.
 */
export interface TokenPayload {
  id: string;
  email: string;
  username: string;
  // iat: number; // Issued at timestamp (added by jwt.verify)
  // exp: number; // Expiration timestamp (added by jwt.verify)
}

/**
 * Middleware to protect routes by verifying JWT token.
 * Extracts token from 'Authorization: Bearer <token>' header or 'token' cookie.
 * Verifies the token, fetches the user, checks if active, and attaches user info to `req.user`.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;
  const authHeader = req.headers.authorization;

  // 1. Extract token
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
    logger.debug('Token found in Authorization header.');
  }
  // else if (req.cookies && req.cookies.token) { // Example: Check cookie if needed
  //   token = req.cookies.token;
  //    logger.debug('Token found in cookie.');
  // }

  // 2. Check if token exists
  if (!token) {
    logger.warn('Authorization failed: No token provided.');
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided.',
    });
  }

  try {
    // 3. Verify token
    const decoded = jwt.verify(
      token,
      config.jwt.secret
    ) as TokenPayload;
    logger.debug(`Token verified for user ID: ${decoded.id}`);

    // 4. Check if user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        // Select only necessary fields
        id: true,
        email: true,
        username: true,
        isActive: true,
      },
    });

    if (!user) {
      logger.warn(
        `Authorization failed: User ${decoded.id} not found.`
      );
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.',
      });
    }

    if (!user.isActive) {
      logger.warn(
        `Authorization failed: User ${decoded.id} is not active.`
      );
      return res.status(401).json({
        success: false,
        message: 'User account is inactive.',
      });
    }

    // 5. Attach user to request object
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    next(); // User is authenticated and authorized
  } catch (error) {
    logger.error('Authentication error:', error);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expired, please log in again.',
      });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid token.' });
    }

    // Generic fallback for other errors during verification/user fetch
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized.' });
  }
};

// Note: checkOwnership and validate middleware are now in their dedicated files.
