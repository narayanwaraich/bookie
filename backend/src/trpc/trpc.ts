// src/trpc/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context'; // We'll create this next
import logger from '../config/logger';

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create();

// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  // ctx.user is populated by the createContext function
  if (!ctx.user) {
    logger.warn('[tRPC Middleware]: Authentication check failed - User context missing.');
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }
  logger.debug(`[tRPC Middleware]: User ${ctx.user.id} authenticated.`);
  return next({
    ctx: {
      // Infers the `user` as non-nullable
      user: ctx.user,
    },
  });
});

/**
 * Protected procedure
 **/
export const protectedProcedure = t.procedure.use(isAuthed);
