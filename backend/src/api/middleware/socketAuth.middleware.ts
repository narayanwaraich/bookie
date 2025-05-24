import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { config } from '../config';
import logger from '../config/logger';
import prisma from '../config/db';
import { TokenPayload } from './auth.middleware'; // Reuse TokenPayload interface

/**
 * Extends the base Socket.IO Socket interface to include optional user details.
 */
export interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

/**
 * Socket.IO middleware for authenticating connections using JWT.
 *
 * It expects the JWT token to be passed in the `auth.token` property of the socket handshake.
 * Example Client-side setup:
 * ```javascript
 * const socket = io({
 *   auth: {
 *     token: "your_jwt_token_here"
 *   }
 * });
 * ```
 *
 * Verifies the token, checks if the user exists and is active, and attaches user info to `socket.user`.
 * Calls `next()` if authentication succeeds, or `next(new Error(...))` if it fails, rejecting the connection.
 *
 * @param {AuthenticatedSocket} socket - The connecting socket instance.
 * @param {Function} next - Callback function to proceed or reject connection.
 */
export const socketAuthMiddleware = async (
  socket: AuthenticatedSocket,
  next: (err?: Error) => void
) => {
  logger.debug(
    `[Socket Auth]: Attempting authentication for socket ID: ${socket.id}`
  );
  try {
    // 1. Extract token from handshake data (preferred method)
    const token = socket.handshake.auth?.token;

    // Alternative: Extract from query params (less secure)
    // const token = socket.handshake.query?.token as string;

    if (!token) {
      logger.warn(
        `[Socket Auth]: Authentication failed for socket ${socket.id}. Reason: No token provided.`
      );
      // Reject connection if no token
      return next(
        new Error('Authentication error: No token provided')
      );
    }

    // 2. Verify token signature and expiry
    const decoded = jwt.verify(
      token,
      config.jwt.secret
    ) as TokenPayload;
    logger.debug(
      `[Socket Auth]: Token verified for user ID: ${decoded.id}`
    );

    // 3. Check user existence and status in DB (important security check)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        username: true,
        isActive: true,
      },
    });

    if (!user) {
      logger.warn(
        `[Socket Auth]: Authentication failed for socket ${socket.id}. Reason: User ${decoded.id} not found.`
      );
      return next(new Error('Authentication error: User not found'));
    }
    if (!user.isActive) {
      logger.warn(
        `[Socket Auth]: Authentication failed for socket ${socket.id}. Reason: User ${decoded.id} is inactive.`
      );
      return next(
        new Error('Authentication error: User account inactive')
      );
    }

    // 4. Attach user info to the socket object for use in event handlers
    socket.user = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    logger.info(
      `[Socket Auth]: User ${user.username} (ID: ${user.id}) authenticated successfully for socket ${socket.id}`
    );
    // Join the user-specific room for targeted emits
    socket.join(user.id);
    logger.debug(
      `[Socket Auth]: Socket ${socket.id} joined room ${user.id}`
    );

    next(); // Authentication successful, allow connection
  } catch (error) {
    logger.error(
      `[Socket Auth]: Authentication failed for socket ${socket.id}:`,
      error
    );
    if (error instanceof jwt.TokenExpiredError) {
      return next(new Error('Authentication error: Token expired'));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new Error('Authentication error: Invalid token'));
    }
    // Generic error for other issues (e.g., DB connection error during user fetch)
    next(
      new Error('Authentication error: Could not verify credentials')
    );
  }
};
