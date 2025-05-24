// src/trpc/routers/collection.trpc.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appRouter } from '../router';
import { createContext } from '../context';
import * as collectionService from '../../api/services/collection.service';
import { CollectionError } from '../../api/services/collection.service';
import { inferProcedureInput } from '@trpc/server';
import { Role } from '@prisma/client'; // Import Role

// --- Mocks ---
vi.mock('../../services/collection.service');
vi.mock('../context');

// --- Tests ---

describe('Collection TRPC Router', () => {
  const mockCollectionService = vi.mocked(collectionService);
  const mockCreateContext = vi.mocked(createContext);

  const userId = 'user-trpc-collection-test';
  const collectionId = 'coll-trpc-123';
  const bookmarkId = 'bm-trpc-abc';
  const collaboratorUserId = 'collab-trpc-xyz';
  const publicLink = 'public-link-trpc';

  // Mock context value
  const mockContext = {
    user: {
      id: userId,
      email: 'test@trpc.com',
      username: 'trpctester',
    }, // Assume authenticated
    req: { headers: {}, cookies: {} },
    res: { cookie: vi.fn(), clearCookie: vi.fn() },
    prisma: {},
    session: null,
  };
  // Mock context for unauthenticated user (for public routes)
  const mockPublicContext = { ...mockContext, user: null };

  beforeEach(() => {
    vi.resetAllMocks();
    // Default to authenticated context
    mockCreateContext.mockResolvedValue(mockContext as any);
  });

  // Helper to create caller
  const createCaller = async (
    user: {
      id: string;
      email: string;
      username: string;
    } | null = mockContext.user
  ) => {
    const context = await createContext({} as any);
    context.user = user; // Set user for the specific caller
    return appRouter.createCaller(context);
  };

  // --- create Procedure ---
  describe('create', () => {
    it('should call collectionService.createCollection and return the new collection', async () => {
      const input: inferProcedureInput<
        typeof appRouter.collections.create
      > = { name: 'TRPC Collection', isPublic: false }; // Corrected path
      const serviceResult = {
        id: collectionId,
        ...input,
        userId,
        ownerId: userId,
      }; // Add ownerId
      mockCollectionService.createCollection.mockResolvedValue(
        serviceResult as any
      );
      const caller = await createCaller();

      const result = await caller.collections.create(input); // Corrected path

      expect(collectionService.createCollection).toHaveBeenCalledWith(
        { ...input, userId, ownerId: userId }
      ); // Service expects ownerId too
      expect(result).toEqual(serviceResult);
    });
    // TODO: Add error test
  });

  // --- list Procedure --- Corrected name
  describe('list', () => {
    it('should call collectionService.getUserCollections and return collections', async () => {
      // Correct input to use offset
      const input: inferProcedureInput<
        typeof appRouter.collections.list
      > = { limit: 10, offset: 0 }; // Corrected path & input
      const serviceResult = {
        data: [],
        totalCount: 0,
        page: 1,
        limit: 10,
        hasMore: false,
      }; // Service returns page, but input is offset
      mockCollectionService.getUserCollections.mockResolvedValue(
        serviceResult as any
      );
      const caller = await createCaller();

      const result = await caller.collections.list(input); // Corrected path

      // Correct service call expectation
      expect(
        collectionService.getUserCollections
      ).toHaveBeenCalledWith(userId, {
        limit: 10,
        offset: 0,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      expect(result).toEqual(serviceResult);
    });
    // TODO: Add error test
  });

  // --- getById Procedure ---
  describe('getById', () => {
    it('should call collectionService.getCollectionById and return the collection', async () => {
      // Correct input to use offset
      const input: inferProcedureInput<
        typeof appRouter.collections.getById
      > = { id: collectionId, limit: 5, offset: 0 }; // Corrected path & input
      const serviceResult = {
        id: collectionId,
        name: 'TRPC Get',
        userId,
        bookmarks: {
          data: [],
          totalCount: 0,
          page: 1,
          limit: 5,
          hasMore: false,
        },
      };
      mockCollectionService.getCollectionById.mockResolvedValue(
        serviceResult as any
      );
      const caller = await createCaller();

      const result = await caller.collections.getById(input); // Corrected path

      // Correct service call expectation
      expect(
        collectionService.getCollectionById
      ).toHaveBeenCalledWith(input.id, userId, {
        limit: 5,
        offset: 0,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      expect(result).toEqual(serviceResult);
    });
    // TODO: Add error test
  });

  // --- getByPublicLink Procedure --- Corrected name
  describe('getByPublicLink', () => {
    it('should call collectionService.getPublicCollectionByLink', async () => {
      // Correct input to use 'link'
      const input: inferProcedureInput<
        typeof appRouter.collections.getByPublicLink
      > = { link: publicLink }; // Corrected path & input
      const serviceResult = {
        id: collectionId,
        name: 'Public TRPC',
        isPublic: true,
        publicLink,
        bookmarks: {
          data: [],
          totalCount: 0,
          page: 1,
          limit: 10,
          hasMore: false,
        },
      };
      mockCollectionService.getPublicCollectionByLink.mockResolvedValue(
        serviceResult as any
      );
      const caller = await createCaller(null);

      const result = await caller.collections.getByPublicLink(input); // Corrected path

      // Correct service call expectation (service doesn't take pagination for public link)
      expect(
        collectionService.getPublicCollectionByLink
      ).toHaveBeenCalledWith(input.link);
      expect(result).toEqual(serviceResult);
    });
    // TODO: Add error test
  });

  // --- update Procedure ---
  describe('update', () => {
    it('should call collectionService.updateCollection', async () => {
      const input: inferProcedureInput<
        typeof appRouter.collections.update
      > = { id: collectionId, name: 'Updated TRPC Coll' }; // Corrected path
      const serviceResult = {
        id: collectionId,
        name: input.name,
        userId,
      };
      mockCollectionService.updateCollection.mockResolvedValue(
        serviceResult as any
      );
      const caller = await createCaller();

      const result = await caller.collections.update(input); // Corrected path

      expect(collectionService.updateCollection).toHaveBeenCalledWith(
        input.id,
        userId,
        { name: input.name }
      );
      expect(result).toEqual(serviceResult);
    });
    // TODO: Add error test
  });

  // --- delete Procedure ---
  describe('delete', () => {
    it('should call collectionService.deleteCollection', async () => {
      const input: inferProcedureInput<
        typeof appRouter.collections.delete
      > = { id: collectionId }; // Corrected path
      mockCollectionService.deleteCollection.mockResolvedValue(
        undefined
      );
      const caller = await createCaller();

      const result = await caller.collections.delete(input); // Corrected path

      expect(collectionService.deleteCollection).toHaveBeenCalledWith(
        input.id,
        userId
      );
      expect(result).toEqual({ success: true, id: input.id });
    });
    // TODO: Add error test
  });

  // --- addBookmark Procedure ---
  describe('addBookmark', () => {
    it('should call collectionService.addBookmarkToCollection', async () => {
      const input: inferProcedureInput<
        typeof appRouter.collections.addBookmark
      > = { collectionId: collectionId, bookmarkId: bookmarkId }; // Corrected path
      mockCollectionService.addBookmarkToCollection.mockResolvedValue(
        {} as any
      );
      const caller = await createCaller();

      const result = await caller.collections.addBookmark(input); // Corrected path

      expect(
        collectionService.addBookmarkToCollection
      ).toHaveBeenCalledWith(
        input.collectionId,
        input.bookmarkId,
        userId
      );
      expect(result).toEqual({ success: true });
    });
    // TODO: Add error test
  });

  // --- removeBookmark Procedure ---
  describe('removeBookmark', () => {
    it('should call collectionService.removeBookmarkFromCollection', async () => {
      const input: inferProcedureInput<
        typeof appRouter.collections.removeBookmark
      > = { collectionId: collectionId, bookmarkId: bookmarkId }; // Corrected path
      mockCollectionService.removeBookmarkFromCollection.mockResolvedValue(
        undefined
      );
      const caller = await createCaller();

      const result = await caller.collections.removeBookmark(input); // Corrected path

      expect(
        collectionService.removeBookmarkFromCollection
      ).toHaveBeenCalledWith(
        input.collectionId,
        input.bookmarkId,
        userId
      );
      expect(result).toEqual({ success: true });
    });
    // TODO: Add error test
  });

  // --- Collaboration Procedures --- Corrected names
  describe('addCollaborator', () => {
    it('should add collaborator successfully', async () => {
      const input: inferProcedureInput<
        typeof appRouter.collections.addCollaborator
      > = {
        collectionId: collectionId,
        userId: collaboratorUserId,
        permission: Role.EDIT,
      }; // Corrected path
      const serviceResult = {
        collectionId,
        userId: collaboratorUserId,
        permission: Role.EDIT,
        user: {
          /*...*/
        },
      };
      mockCollectionService.addCollaborator.mockResolvedValue(
        serviceResult as any
      );
      const caller = await createCaller();

      const result = await caller.collections.addCollaborator(input); // Corrected path

      expect(collectionService.addCollaborator).toHaveBeenCalledWith(
        input.collectionId,
        userId,
        input.userId,
        input.permission
      );
      expect(result).toEqual(serviceResult);
    });
    // TODO: Add error test
  });

  describe('updateCollaborator', () => {
    // Corrected name
    it('should update collaborator permission successfully', async () => {
      const input: inferProcedureInput<
        typeof appRouter.collections.updateCollaborator
      > = {
        collectionId: collectionId,
        collaboratorId: collaboratorUserId,
        permission: Role.VIEW,
      }; // Corrected path
      const serviceResult = {
        collectionId,
        userId: collaboratorUserId,
        permission: Role.VIEW,
        user: {
          /*...*/
        },
      };
      mockCollectionService.updateCollaboratorPermission.mockResolvedValue(
        serviceResult as any
      );
      const caller = await createCaller();

      const result = await caller.collections.updateCollaborator(
        input
      ); // Corrected path

      expect(
        collectionService.updateCollaboratorPermission
      ).toHaveBeenCalledWith(
        input.collectionId,
        userId,
        input.collaboratorId,
        input.permission
      );
      expect(result).toEqual(serviceResult);
    });
    // TODO: Add error test
  });

  describe('removeCollaborator', () => {
    // Corrected name
    it('should remove collaborator successfully', async () => {
      const input: inferProcedureInput<
        typeof appRouter.collections.removeCollaborator
      > = {
        collectionId: collectionId,
        collaboratorId: collaboratorUserId,
      }; // Corrected path
      mockCollectionService.removeCollaborator.mockResolvedValue(
        undefined
      );
      const caller = await createCaller();

      const result = await caller.collections.removeCollaborator(
        input
      ); // Corrected path

      expect(
        collectionService.removeCollaborator
      ).toHaveBeenCalledWith(
        input.collectionId,
        userId,
        input.collaboratorId
      );
      expect(result).toEqual({ success: true });
    });
    // TODO: Add error test
  });
});
