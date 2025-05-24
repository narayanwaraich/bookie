// src/trpc/routers/user.trpc.ts
import { router, protectedProcedure } from '../trpc';
import * as userService from '../../services/user.service';
import {
  updateUserSchema,
  changePasswordSchema,
  deleteAccountSchema, // Use schema for delete validation
} from '../../models/schemas';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { UserServiceError } from '../../services/user.service';

export const userTrpcRouter = router({
  /** Get Current User Profile */
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    try {
      // Service function already fetches profile based on authenticated user ID
      return await userService.getUserProfile(userId);
    } catch (error: any) {
      if (
        error instanceof UserServiceError &&
        error.statusCode === 404
      )
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: error.message,
          cause: error,
        });
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch profile',
        cause: error,
      });
    }
  }),

  /** Update User Profile */
  updateProfile: protectedProcedure
    .input(updateUserSchema) // Validate input using the existing Zod schema
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      try {
        // Service handles password change logic internally if passwords are provided
        return await userService.updateUserProfile(userId, input);
      } catch (error: any) {
        if (
          error instanceof UserServiceError &&
          (error.statusCode === 400 ||
            error.statusCode === 409 ||
            error.statusCode === 404)
        ) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: error.message,
            cause: error,
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update profile',
          cause: error,
        });
      }
    }),

  /** Change Password */
  changePassword: protectedProcedure
    .input(changePasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      try {
        return await userService.changeUserPassword(userId, input);
      } catch (error: any) {
        if (
          error instanceof UserServiceError &&
          (error.statusCode === 400 || error.statusCode === 404)
        ) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: error.message,
            cause: error,
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to change password',
          cause: error,
        });
      }
    }),

  /** Delete Account */
  deleteAccount: protectedProcedure
    .input(deleteAccountSchema) // Requires current password
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      try {
        // Pass the validated password to the service
        return await userService.deleteUserAccount(
          userId,
          input.password
        );
        // TODO: Handle cookie clearing/session invalidation on the client after this succeeds
      } catch (error: any) {
        if (
          error instanceof UserServiceError &&
          (error.statusCode === 400 || error.statusCode === 404)
        ) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: error.message,
            cause: error,
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete account',
          cause: error,
        });
      }
    }),
});

export type UserTrpcRouter = typeof userTrpcRouter;
