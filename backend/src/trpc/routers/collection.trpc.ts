// src/trpc/routers/collection.trpc.ts
import { router, protectedProcedure, publicProcedure } from '../trpc';
import * as collectionService from '../../services/collection.service';
import { 
    createCollectionSchema, 
    updateCollectionSchema,
    getCollectionsQuerySchema,
    getBookmarksInContainerQuerySchema, // Used for input validation shape
    addBookmarkToCollectionSchema, 
    addCollectionCollaboratorSchema,
    updateCollectionCollaboratorSchema
} from '../../models/schemas'; 
import { z } from 'zod'; 
import { TRPCError } from '@trpc/server';
import { CollectionError } from '../../services/collection.service'; 

// Define the input schema for getById explicitly combining params and query parts
const getCollectionByIdInputSchema = z.object({ 
    id: z.string().uuid(), 
    // Use .optional().default() here to ensure values are always passed
    limit: z.number().int().positive().optional().default(20),
    offset: z.number().int().nonnegative().optional().default(0),
    sortBy: z.enum(['createdAt', 'updatedAt', 'title', 'visitCount']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const collectionTrpcRouter = router({

  /** Create Collection */
  create: protectedProcedure
    .input(createCollectionSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      try {
        return await collectionService.createCollection({ ...input, userId, ownerId: userId });
      } catch (error: any) {
        if (error instanceof CollectionError && error.statusCode === 409) {
             throw new TRPCError({ code: 'CONFLICT', message: error.message, cause: error });
        }
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create collection', cause: error });
      }
    }),

  /** Get User's Collections (Paginated) */
  list: protectedProcedure
    .input(getCollectionsQuerySchema) 
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      try {
        // Service function already handles defaults from schema
        return await collectionService.getUserCollections(userId, input);
      } catch (error: any) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch collections', cause: error });
      }
    }),

  /** Get Collection by ID (Protected) */
  getById: protectedProcedure
    .input(getCollectionByIdInputSchema) // Use the combined schema with defaults
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { id, ...queryParams } = input; // queryParams now guaranteed to have defaults
      try {
        // Pass queryParams for bookmark pagination/sorting
        return await collectionService.getCollectionById(id, userId, queryParams); 
      } catch (error: any) {
        if (error instanceof CollectionError && error.statusCode === 404) throw new TRPCError({ code: 'NOT_FOUND', message: error.message, cause: error });
        if (error instanceof CollectionError && error.statusCode === 403) throw new TRPCError({ code: 'FORBIDDEN', message: error.message, cause: error }); 
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch collection', cause: error });
      }
    }),
    
  /** Get Public Collection by Link */
  getByPublicLink: publicProcedure 
    .input(z.object({ link: z.string() })) 
    .query(async ({ input }) => {
        try {
            // Note: Service function getPublicCollectionByLink doesn't currently support pagination/sorting
            return await collectionService.getPublicCollectionByLink(input.link);
        } catch (error: any) {
            if (error instanceof CollectionError && error.statusCode === 404) throw new TRPCError({ code: 'NOT_FOUND', message: error.message, cause: error });
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch public collection', cause: error });
        }
    }),

  /** Update Collection */
  update: protectedProcedure
    .input(z.object({ id: z.string().uuid() }).merge(updateCollectionSchema))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      const userId = ctx.user.id;
      try {
        return await collectionService.updateCollection(id, userId, updateData);
      } catch (error: any) {
        if (error instanceof CollectionError && (error.statusCode === 404 || error.statusCode === 403 || error.statusCode === 409)) {
             throw new TRPCError({ code: error.statusCode === 409 ? 'CONFLICT' : (error.statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN'), message: error.message, cause: error });
        }
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update collection', cause: error });
      }
    }),

  /** Delete Collection */
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      try {
        await collectionService.deleteCollection(input.id, userId);
        return { success: true, id: input.id };
      } catch (error: any) {
        if (error instanceof CollectionError && (error.statusCode === 404 || error.statusCode === 403)) {
             throw new TRPCError({ code: error.statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message, cause: error });
        }
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete collection', cause: error });
      }
    }),
    
  // --- Bookmarks within Collection ---
  
  /** Add Bookmark to Collection */
  addBookmark: protectedProcedure
    .input(z.object({ collectionId: z.string().uuid() }).merge(addBookmarkToCollectionSchema))
    .mutation(async ({ ctx, input }) => {
        const userId = ctx.user.id;
        try {
            return await collectionService.addBookmarkToCollection(input.collectionId, input.bookmarkId, userId);
        } catch (error: any) {
             if (error instanceof CollectionError && (error.statusCode === 404 || error.statusCode === 403 || error.statusCode === 409)) {
                 throw new TRPCError({ code: 'BAD_REQUEST', message: error.message, cause: error });
             }
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to add bookmark to collection', cause: error });
        }
    }),

  /** Remove Bookmark from Collection */
  removeBookmark: protectedProcedure
    .input(z.object({ collectionId: z.string().uuid(), bookmarkId: z.string().uuid() })) 
    .mutation(async ({ ctx, input }) => {
        const userId = ctx.user.id;
        try {
            await collectionService.removeBookmarkFromCollection(input.collectionId, input.bookmarkId, userId);
            return { success: true };
        } catch (error: any) {
             if (error instanceof CollectionError && (error.statusCode === 404 || error.statusCode === 403)) {
                 throw new TRPCError({ code: error.statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message, cause: error });
             }
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to remove bookmark from collection', cause: error });
        }
    }),
    
  // --- Collaboration Procedures ---
  
  /** Add Collaborator */
  addCollaborator: protectedProcedure
    .input(z.object({ collectionId: z.string().uuid() }).merge(addCollectionCollaboratorSchema))
    .mutation(async ({ ctx, input }) => {
        const ownerId = ctx.user.id;
        try {
            return await collectionService.addCollaborator(input.collectionId, ownerId, input.userId, input.permission);
        } catch (error: any) {
             if (error instanceof CollectionError && (error.statusCode === 404 || error.statusCode === 403 || error.statusCode === 400 || error.statusCode === 409)) {
                 throw new TRPCError({ code: 'BAD_REQUEST', message: error.message, cause: error });
             }
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to add collaborator', cause: error });
        }
    }),
    
  /** Update Collaborator Permission */
  updateCollaborator: protectedProcedure
    .input(z.object({ collectionId: z.string().uuid(), collaboratorId: z.string().uuid() }).merge(updateCollectionCollaboratorSchema))
    .mutation(async ({ ctx, input }) => {
        const ownerId = ctx.user.id;
        try {
            return await collectionService.updateCollaboratorPermission(input.collectionId, ownerId, input.collaboratorId, input.permission);
        } catch (error: any) {
             if (error instanceof CollectionError && (error.statusCode === 404 || error.statusCode === 403 || error.statusCode === 400)) {
                 throw new TRPCError({ code: 'BAD_REQUEST', message: error.message, cause: error });
             }
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update collaborator', cause: error });
        }
    }),
    
  /** Remove Collaborator */
  removeCollaborator: protectedProcedure
    .input(z.object({ collectionId: z.string().uuid(), collaboratorId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
        const ownerId = ctx.user.id;
        try {
            await collectionService.removeCollaborator(input.collectionId, ownerId, input.collaboratorId);
            return { success: true };
        } catch (error: any) {
             if (error instanceof CollectionError && (error.statusCode === 404 || error.statusCode === 403 || error.statusCode === 400)) {
                 throw new TRPCError({ code: 'BAD_REQUEST', message: error.message, cause: error });
             }
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to remove collaborator', cause: error });
        }
    }),

});

export type CollectionTrpcRouter = typeof collectionTrpcRouter;
