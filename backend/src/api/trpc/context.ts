// src/trpc/context.ts
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import * as jwt from 'jsonwebtoken';
import { config } from '../config';
import prisma from '../config/db';
import logger from '../config/logger';
import { TokenPayload } from '../middleware/auth.middleware'; // Reuse TokenPayload

// Define the shape of the context object
interface ContextUser {
  id: string;
  email: string;
  username: string;
}

export interface Context {
  req: CreateExpressContextOptions['req'];
  res: CreateExpressContextOptions['res'];
  user: ContextUser | null; // User is nullable initially
}

/**
 * Extracts the JWT token from the request headers.
 */
const getTokenFromHeader = (
  req: CreateExpressContextOptions['req']
): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    return token || null; // Return token if it exists (is truthy), otherwise null
  }
  // Could also check cookies here if needed
  return null;
};

/**
 * Creates the context for each tRPC request.
 * Tries to authenticate the user based on the JWT token.
 */
export const createContext = async ({
  req,
  res,
}: CreateExpressContextOptions): Promise<Context> => {
  const token = getTokenFromHeader(req);
  let user: ContextUser | null = null;

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        config.jwt.secret
      ) as TokenPayload;
      const dbUser = await prisma.user.findUnique({
        where: { id: decoded.id, isActive: true }, // Ensure user is active
        select: { id: true, email: true, username: true },
      });
      if (dbUser) {
        user = dbUser;
        logger.debug(
          `[tRPC Context]: User ${user.id} authenticated via token.`
        );
      } else {
        logger.warn(
          `[tRPC Context]: User ${decoded.id} from token not found or inactive.`
        );
      }
    } catch (error) {
      // Ignore token errors (expired, invalid) - user remains null
      if (
        error instanceof jwt.JsonWebTokenError ||
        error instanceof jwt.TokenExpiredError
      ) {
        logger.warn(
          `[tRPC Context]: Invalid or expired token received.`
        );
      } else {
        logger.error(`[tRPC Context]: Error verifying token:`, error);
      }
    }
  } else {
    logger.debug('[tRPC Context]: No token found in request.');
  }

  return {
    req,
    res,
    user, // User will be null if authentication failed or no token provided
  };
};
