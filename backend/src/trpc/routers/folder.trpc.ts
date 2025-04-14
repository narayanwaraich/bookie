// src/trpc/routers/folder.trpc.ts
import { router, protectedProcedure } from '../trpc';
import * as folderService from '../../services/folder.service';
import * as bookmarkService from '../../services/bookmark.service'; // Needed for bookmark relations
import { 
    createFolderSchema, 
    updateFolderSchema,
    getFoldersQuerySchema,
    getBookmarksInContainerQuerySchema,
    addBookmarkToFolderBodySchema,
    deleteBookmarkFromFolderParamsSchema, // Use params schema
    addFolderCollaboratorSchema,
    updateFolderCollaboratorSchema,
    deleteFolderQuerySchema // For delete options
} from '../../models/schemas'; 
import { z } from 'zod'; 
import { TRPCError } from '@trpc/server';
import { FolderError } from '../../services/folder.service'; 
import { BookmarkError } from '../../services/bookmark.service';

export const folderTrpcRouter = router({

  /** Create Folder */
  create: protectedProcedure
    .input(createFolderSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      try {
        return await folderService.createFolder(userId, input);
      } catch (error: any) {
        if (error instanceof FolderError && (error.statusCode === 409 || error.statusCode === 404)) {
             throw new TRPCError({ code: 'BAD_REQUEST', message: error.message, cause: error });
        }
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create folder', cause: error });
      }
    }),

  /** Get Folders (Flat List) */
  list: protectedProcedure
    .input(getFoldersQuerySchema) // Use pagination/sorting schema
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      try {
        return await folderService.getUserFolders(userId, input);
      } catch (error: any) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch folders', cause: error });
      }
    }),

  /** Get Folder Tree */
  getTree: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.user.id;
      try {
        return await folderService.getFolderTree(userId);
      } catch (error: any) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch folder tree', cause: error });
      }
    }),

  /** Get Folder by ID */
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      try {
        return await folderService.getFolderById(input.id, userId);
      } catch (error: any) {
        if (error instanceof FolderError && error.statusCode === 404) throw new TRPCError({ code: 'NOT_FOUND', message: error.message, cause: error });
        if (error instanceof FolderError && error.statusCode === 403) throw new TRPCError({ code: 'FORBIDDEN', message: error.message, cause: error });
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch folder', cause: error });
      }
    }),

  /** Update Folder */
  update: protectedProcedure
    .input(z.object({ id: z.string().uuid() }).merge(updateFolderSchema))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      const userId = ctx.user.id;
      try {
        return await folderService.updateFolder(id, userId, updateData);
      } catch (error: any) {
        if (error instanceof FolderError && (error.statusCode === 404 || error.statusCode === 403 || error.statusCode === 400 || error.statusCode === 409)) {
             throw new TRPCError({ code: 'BAD_REQUEST', message: error.message, cause: error });
        }
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update folder', cause: error });
      }
    }),

  /** Delete Folder */
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }).merge(deleteFolderQuerySchema)) // Combine ID param and query options
    .mutation(async ({ ctx, input }) => {
      const { id, moveBookmarksTo } = input;
      const userId = ctx.user.id;
      try {
        await folderService.deleteFolder(id, userId, moveBookmarksTo);
        return { success: true, id };
      } catch (error: any) {
        if (error instanceof FolderError && (error.statusCode === 404 || error.statusCode === 403 || error.statusCode === 400)) {
             throw new TRPCError({ code: 'BAD_REQUEST', message: error.message, cause: error });
        }
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete folder', cause: error });
      }
    }),
    
  /** Get Bookmarks within Folder */
  getBookmarks: protectedProcedure
    .input(z.object({ folderId: z.string().uuid() }).merge(getBookmarksInContainerQuerySchema))
    .query(async ({ ctx, input }) => {
        const { folderId, ...queryParams } = input;
        const userId = ctx.user.id;
        try {
            // Note: checkFolderAccess happens within the service function now
            return await folderService.getBookmarksByFolder(folderId, userId, queryParams);
        } catch (error: any) {
            if (error instanceof FolderError && (error.statusCode === 404 || error.statusCode === 403)) {
                 throw new TRPCError({ code: error.statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message, cause: error });
            }
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch bookmarks for folder', cause: error });
        }
    }),

  /** Add Bookmark to Folder */
  addBookmark: protectedProcedure
    .input(z.object({ folderId: z.string().uuid() }).merge(addBookmarkToFolderBodySchema))
    .mutation(async ({ ctx, input }) => {
        const userId = ctx.user.id;
        try {
            await bookmarkService.addBookmarkToFolder(userId, input.bookmarkId, input.folderId);
            return { success: true };
        } catch (error: any) {
             if (error instanceof BookmarkError && (error.statusCode === 404 || error.statusCode === 403 || error.statusCode === 409)) {
                 throw new TRPCError({ code: 'BAD_REQUEST', message: error.message, cause: error });
             }
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to add bookmark to folder', cause: error });
        }
    }),

  /** Remove Bookmark from Folder */
  removeBookmark: protectedProcedure
    .input(deleteBookmarkFromFolderParamsSchema) // Use schema validating both params
    .mutation(async ({ ctx, input }) => {
        const userId = ctx.user.id;
        try {
            await bookmarkService.removeBookmarkFromFolder(userId, input.bookmarkId, input.id); // input.id is folderId here
            return { success: true };
        } catch (error: any) {
             if (error instanceof BookmarkError && (error.statusCode === 404 || error.statusCode === 403)) {
                 throw new TRPCError({ code: error.statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message, cause: error });
             }
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to remove bookmark from folder', cause: error });
        }
    }),
    
  // --- Collaboration Procedures ---
  
  /** Add Collaborator */
  addCollaborator: protectedProcedure
    .input(z.object({ folderId: z.string().uuid() }).merge(addFolderCollaboratorSchema))
    .mutation(async ({ ctx, input }) => {
        const ownerId = ctx.user.id;
        try {
            return await folderService.addCollaborator(input.folderId, ownerId, input.userId, input.permission);
        } catch (error: any) {
             if (error instanceof FolderError && (error.statusCode === 404 || error.statusCode === 403 || error.statusCode === 400 || error.statusCode === 409)) {
                 throw new TRPCError({ code: 'BAD_REQUEST', message: error.message, cause: error });
             }
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to add collaborator', cause: error });
        }
    }),
    
  /** Update Collaborator Permission */
  updateCollaborator: protectedProcedure
    .input(z.object({ folderId: z.string().uuid(), collaboratorId: z.string().uuid() }).merge(updateFolderCollaboratorSchema))
    .mutation(async ({ ctx, input }) => {
        const ownerId = ctx.user.id;
        try {
            return await folderService.updateCollaboratorPermission(input.folderId, ownerId, input.collaboratorId, input.permission);
        } catch (error: any) {
             if (error instanceof FolderError && (error.statusCode === 404 || error.statusCode === 403 || error.statusCode === 400)) {
                 throw new TRPCError({ code: 'BAD_REQUEST', message: error.message, cause: error });
             }
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update collaborator', cause: error });
        }
    }),
    
  /** Remove Collaborator */
  removeCollaborator: protectedProcedure
    .input(z.object({ folderId: z.string().uuid(), collaboratorId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
        const ownerId = ctx.user.id;
        try {
            await folderService.removeCollaborator(input.folderId, ownerId, input.collaboratorId);
            return { success: true };
        } catch (error: any) {
             if (error instanceof FolderError && (error.statusCode === 404 || error.statusCode === 403 || error.statusCode === 400)) {
                 throw new TRPCError({ code: 'BAD_REQUEST', message: error.message, cause: error });
             }
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to remove collaborator', cause: error });
        }
    }),

});

export type FolderTrpcRouter = typeof folderTrpcRouter;
