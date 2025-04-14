// src/trpc/routers/bookmark.trpc.ts
import { router, protectedProcedure } from '../trpc'; // Removed publicProcedure import as it's not used here
import * as bookmarkService from '../../services/bookmark.service';
import { 
    createBookmarkSchema, 
    updateBookmarkSchema, 
    bookmarkSearchSchema,
    bulkActionSchema,
    addTagToBookmarkBodySchema,
    deleteTagFromBookmarkParamsSchema, // Use params schema for delete
    getRecentBookmarksQuerySchema,
    getPopularBookmarksQuerySchema,
    checkUrlExistsQuerySchema // Added for checkUrl
} from '../../models/schemas'; 
import { z } from 'zod'; 
import { TRPCError } from '@trpc/server';
import { BookmarkError } from '../../services/bookmark.service'; // Import custom error

export const bookmarkTrpcRouter = router({
  
  /** Create Bookmark */
  create: protectedProcedure
    .input(createBookmarkSchema) 
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      try {
        const newBookmark = await bookmarkService.createBookmark(userId, input);
        if (!newBookmark) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to retrieve created bookmark details.' });
        return newBookmark; 
      } catch (error: any) {
         if (error instanceof BookmarkError) throw new TRPCError({ code: 'BAD_REQUEST', message: error.message, cause: error });
         throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create bookmark', cause: error });
      }
    }),

  /** Get Bookmark by ID */
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() })) 
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      try {
        return await bookmarkService.getBookmarkById(input.id, userId);
      } catch (error: any) {
         if (error instanceof BookmarkError && error.statusCode === 404) throw new TRPCError({ code: 'NOT_FOUND', message: error.message, cause: error });
         if (error instanceof BookmarkError && error.statusCode === 403) throw new TRPCError({ code: 'FORBIDDEN', message: error.message, cause: error });
         throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch bookmark', cause: error });
      }
    }),
    
  /** Update Bookmark */
  update: protectedProcedure
    .input(z.object({ id: z.string().uuid() }).merge(updateBookmarkSchema)) // Combine ID param with update data schema
    .mutation(async ({ ctx, input }) => { 
        const { id, ...updateData } = input; // Separate ID from update data
        const userId = ctx.user.id;
        try {
            return await bookmarkService.updateBookmark(id, userId, updateData);
        } catch (error: any) {
            if (error instanceof BookmarkError && error.statusCode === 404) throw new TRPCError({ code: 'NOT_FOUND', message: error.message, cause: error });
            if (error instanceof BookmarkError && error.statusCode === 403) throw new TRPCError({ code: 'FORBIDDEN', message: error.message, cause: error });
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update bookmark', cause: error });
        }
    }),
    
  /** Delete Bookmark */
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => { 
        const userId = ctx.user.id;
        try {
            await bookmarkService.deleteBookmark(input.id, userId);
            return { success: true, id: input.id }; // Indicate success
        } catch (error: any) {
             if (error instanceof BookmarkError && error.statusCode === 404) throw new TRPCError({ code: 'NOT_FOUND', message: error.message, cause: error });
             if (error instanceof BookmarkError && error.statusCode === 403) throw new TRPCError({ code: 'FORBIDDEN', message: error.message, cause: error });
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete bookmark', cause: error });
        }
    }),

  /** Search Bookmarks */
  search: protectedProcedure
    .input(bookmarkSearchSchema) // Use the existing comprehensive search schema
    .query(async ({ ctx, input }) => {
        const userId = ctx.user.id;
        try {
            return await bookmarkService.searchBookmarks(userId, input);
        } catch (error: any) {
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to search bookmarks', cause: error });
        }
    }),

  /** Get Recent Bookmarks */
  getRecent: protectedProcedure
    .input(getRecentBookmarksQuerySchema) // Use schema for limit validation
    .query(async ({ ctx, input }) => {
        const userId = ctx.user.id;
        try {
            return await bookmarkService.getRecentBookmarks(userId, input.limit);
        } catch (error: any) {
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch recent bookmarks', cause: error });
        }
    }),

  /** Get Popular Bookmarks */
  getPopular: protectedProcedure
    .input(getPopularBookmarksQuerySchema) // Use schema for limit validation
    .query(async ({ ctx, input }) => {
        const userId = ctx.user.id;
        try {
            return await bookmarkService.getPopularBookmarks(userId, input.limit);
        } catch (error: any) {
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch popular bookmarks', cause: error });
        }
    }),
    
  /** Check if URL Exists */
  checkUrlExists: protectedProcedure
    .input(checkUrlExistsQuerySchema) // Use schema for URL validation
    .query(async ({ ctx, input }) => {
        const userId = ctx.user.id;
        try {
            return await bookmarkService.checkBookmarkUrlExists(userId, input.url);
        } catch (error: any) {
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to check URL existence', cause: error });
        }
    }),

  /** Add Tag to Bookmark */
  addTag: protectedProcedure
    .input(z.object({ bookmarkId: z.string().uuid() }).merge(addTagToBookmarkBodySchema)) // Combine bookmarkId param and tagId body
    .mutation(async ({ ctx, input }) => {
        const userId = ctx.user.id;
        try {
            await bookmarkService.addTagToBookmark(userId, input.bookmarkId, input.tagId);
            return { success: true };
        } catch (error: any) {
             if (error instanceof BookmarkError && (error.statusCode === 404 || error.statusCode === 403)) {
                 throw new TRPCError({ code: error.statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message, cause: error });
             }
             if (error instanceof BookmarkError && error.statusCode === 409) {
                 throw new TRPCError({ code: 'CONFLICT', message: error.message, cause: error });
             }
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to add tag', cause: error });
        }
    }),

  /** Remove Tag from Bookmark */
  removeTag: protectedProcedure
    .input(deleteTagFromBookmarkParamsSchema) // Use schema validating both params
    .mutation(async ({ ctx, input }) => {
        const userId = ctx.user.id;
        try {
            await bookmarkService.removeTagFromBookmark(userId, input.bookmarkId, input.tagId);
            return { success: true };
        } catch (error: any) {
             if (error instanceof BookmarkError && (error.statusCode === 404 || error.statusCode === 403)) {
                 throw new TRPCError({ code: error.statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message, cause: error });
             }
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to remove tag', cause: error });
        }
    }),
    
   /** Perform Bulk Action */
   bulkAction: protectedProcedure
    .input(bulkActionSchema)
    .mutation(async ({ ctx, input }) => {
        const userId = ctx.user.id;
        try {
            // The service function already returns a success object or throws
            return await bookmarkService.performBulkAction(userId, input);
        } catch (error: any) {
             if (error instanceof BookmarkError && (error.statusCode === 404 || error.statusCode === 403 || error.statusCode === 400 || error.statusCode === 409)) {
                 throw new TRPCError({ code: 'BAD_REQUEST', message: error.message, cause: error }); // Use BAD_REQUEST for client errors
             }
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to perform bulk action', cause: error });
        }
    }),

});

// Export type definition of Bookmark router (useful for merging)
export type BookmarkTrpcRouter = typeof bookmarkTrpcRouter;
