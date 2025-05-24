// src/trpc/routers/tag.trpc.ts
import { router, protectedProcedure } from '../trpc';
import * as tagService from '../../services/tag.service';
import {
  createTagSchema,
  updateTagSchema,
  getTagsQuerySchema,
  getBookmarksByTagQuerySchema,
} from '../../models/schemas';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { TagError } from '../../services/tag.service';

export const tagTrpcRouter = router({
  /** Create Tag */
  create: protectedProcedure
    .input(createTagSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      try {
        return await tagService.createTag(userId, input);
      } catch (error: any) {
        if (error instanceof TagError && error.statusCode === 409) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: error.message,
            cause: error,
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create tag',
          cause: error,
        });
      }
    }),

  /** Get All Tags (Paginated) */
  list: protectedProcedure
    .input(getTagsQuerySchema) // Use pagination/sorting schema
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      try {
        return await tagService.getAllUserTags(userId, input);
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch tags',
          cause: error,
        });
      }
    }),

  /** Get Tag by ID */
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      try {
        return await tagService.getTagById(input.id, userId);
      } catch (error: any) {
        if (error instanceof TagError && error.statusCode === 404)
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: error.message,
            cause: error,
          });
        if (error instanceof TagError && error.statusCode === 403)
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: error.message,
            cause: error,
          }); // Should not happen if using userId
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch tag',
          cause: error,
        });
      }
    }),

  /** Update Tag */
  update: protectedProcedure
    .input(z.object({ id: z.string().uuid() }).merge(updateTagSchema))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      const userId = ctx.user.id;
      try {
        return await tagService.updateTag(id, userId, updateData);
      } catch (error: any) {
        if (
          error instanceof TagError &&
          (error.statusCode === 404 || error.statusCode === 409)
        ) {
          throw new TRPCError({
            code: error.statusCode === 404 ? 'NOT_FOUND' : 'CONFLICT',
            message: error.message,
            cause: error,
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update tag',
          cause: error,
        });
      }
    }),

  /** Delete Tag */
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      try {
        await tagService.deleteTag(input.id, userId);
        return { success: true, id: input.id };
      } catch (error: any) {
        if (error instanceof TagError && error.statusCode === 404)
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: error.message,
            cause: error,
          });
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete tag',
          cause: error,
        });
      }
    }),

  /** Get Bookmarks by Tag */
  getBookmarks: protectedProcedure
    .input(
      z
        .object({ tagId: z.string().uuid() })
        .merge(getBookmarksByTagQuerySchema)
    )
    .query(async ({ ctx, input }) => {
      const { tagId, ...queryParams } = input;
      const userId = ctx.user.id;
      try {
        return await tagService.getBookmarksByTag(
          tagId,
          userId,
          queryParams
        );
      } catch (error: any) {
        if (error instanceof TagError && error.statusCode === 404) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: error.message,
            cause: error,
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch bookmarks for tag',
          cause: error,
        });
      }
    }),
});

export type TagTrpcRouter = typeof tagTrpcRouter;
