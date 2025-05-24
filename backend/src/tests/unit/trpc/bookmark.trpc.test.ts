// src/trpc/routers/bookmark.trpc.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appRouter } from '../router';
import { createContext } from '../context';
import * as bookmarkService from '../../api/services/bookmark.service';
import { BookmarkError } from '../../api/services/bookmark.service';
import { inferProcedureInput } from '@trpc/server';

// --- Mocks ---
vi.mock('../../services/bookmark.service');
vi.mock('../context');

// --- Tests ---

describe('Bookmark TRPC Router', () => {
  const mockBookmarkService = vi.mocked(bookmarkService);
  const mockCreateContext = vi.mocked(createContext);

  const userId = 'user-trpc-bookmark-test';
  const bookmarkId = 'bm-trpc-123';
  const folderId = 'folder-trpc-456';
  const tagId = 'tag-trpc-789';

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

  beforeEach(() => {
    vi.resetAllMocks();
    mockCreateContext.mockResolvedValue(mockContext as any);
  });

  // Helper to create caller
  const createCaller = async () => {
    const context = await createContext({} as any); // Context mock handles user
    return appRouter.createCaller(context);
  };

  // --- create Procedure --- Corrected name
  describe('create', () => {
    it('should call bookmarkService.createBookmark and return the new bookmark', async () => {
      const input: inferProcedureInput<
        typeof appRouter.bookmarks.create
      > = { url: 'http://trpc-create.com', title: 'TRPC Create' }; // Corrected path
      const serviceResult = { id: bookmarkId, ...input, userId };
      mockBookmarkService.createBookmark.mockResolvedValue(
        serviceResult as any
      );
      const caller = await createCaller();

      const result = await caller.bookmarks.create(input); // Corrected path

      expect(bookmarkService.createBookmark).toHaveBeenCalledWith(
        userId,
        input
      );
      // Procedure returns the bookmark directly on success
      expect(result).toEqual(serviceResult);
    });
    // TODO: Add error test
  });

  // --- getById Procedure --- Corrected name
  describe('getById', () => {
    it('should call bookmarkService.getBookmarkById and return the bookmark', async () => {
      const input: inferProcedureInput<
        typeof appRouter.bookmarks.getById
      > = { id: bookmarkId }; // Corrected path
      const serviceResult = {
        id: bookmarkId,
        url: 'http://trpc-get.com',
        title: 'TRPC Get',
        userId,
      };
      mockBookmarkService.getBookmarkById.mockResolvedValue(
        serviceResult as any
      );
      const caller = await createCaller();

      const result = await caller.bookmarks.getById(input); // Corrected path

      expect(bookmarkService.getBookmarkById).toHaveBeenCalledWith(
        input.id,
        userId
      );
      expect(result).toEqual(serviceResult); // Procedure returns bookmark directly
    });
    // TODO: Add error test
  });

  // --- update Procedure --- Corrected name
  describe('update', () => {
    it('should call bookmarkService.updateBookmark and return the updated bookmark', async () => {
      const input: inferProcedureInput<
        typeof appRouter.bookmarks.update
      > = { id: bookmarkId, title: 'Updated TRPC' }; // Corrected path
      const serviceResult = {
        id: bookmarkId,
        url: 'http://trpc-update.com',
        title: input.title,
        userId,
      };
      mockBookmarkService.updateBookmark.mockResolvedValue(
        serviceResult as any
      );
      const caller = await createCaller();

      const result = await caller.bookmarks.update(input); // Corrected path

      expect(bookmarkService.updateBookmark).toHaveBeenCalledWith(
        input.id,
        userId,
        { title: input.title }
      );
      expect(result).toEqual(serviceResult); // Procedure returns updated bookmark
    });
    // TODO: Add error test
  });

  // --- delete Procedure --- Corrected name
  describe('delete', () => {
    it('should call bookmarkService.deleteBookmark', async () => {
      const input: inferProcedureInput<
        typeof appRouter.bookmarks.delete
      > = { id: bookmarkId }; // Corrected path
      mockBookmarkService.deleteBookmark.mockResolvedValue(undefined);
      const caller = await createCaller();

      const result = await caller.bookmarks.delete(input); // Corrected path

      expect(bookmarkService.deleteBookmark).toHaveBeenCalledWith(
        input.id,
        userId
      );
      expect(result).toEqual({ success: true, id: input.id }); // Procedure returns success object
    });
    // TODO: Add error test
  });

  // --- search Procedure --- Corrected name
  describe('search', () => {
    it('should call bookmarkService.searchBookmarks and return results', async () => {
      // Correct input to use offset instead of page
      const input: inferProcedureInput<
        typeof appRouter.bookmarks.search
      > = { query: 'search', limit: 15, offset: 0 }; // Corrected path
      const serviceResult = {
        bookmarks: [],
        totalCount: 0,
        page: 1,
        limit: 15,
        hasMore: false,
      }; // Service might still return page
      mockBookmarkService.searchBookmarks.mockResolvedValue(
        serviceResult as any
      );
      const caller = await createCaller();

      const result = await caller.bookmarks.search(input); // Corrected path

      // Correct service call expectation to use offset
      expect(bookmarkService.searchBookmarks).toHaveBeenCalledWith(
        userId,
        {
          q: input.query,
          limit: input.limit,
          offset: input.offset,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        }
      );
      expect(result).toEqual(serviceResult); // Procedure returns service result directly
    });
    // TODO: Add error test
  });

  // --- getRecent Procedure --- Corrected name
  describe('getRecent', () => {
    it('should call bookmarkService.getRecentBookmarks and return results', async () => {
      const input: inferProcedureInput<
        typeof appRouter.bookmarks.getRecent
      > = { limit: 5 }; // Corrected path
      const serviceResult = { bookmarks: [] };
      mockBookmarkService.getRecentBookmarks.mockResolvedValue(
        serviceResult as any
      );
      const caller = await createCaller();

      const result = await caller.bookmarks.getRecent(input); // Corrected path

      expect(bookmarkService.getRecentBookmarks).toHaveBeenCalledWith(
        userId,
        input.limit
      );
      expect(result).toEqual(serviceResult.bookmarks); // Procedure returns bookmarks array directly
    });
    // TODO: Add error test
  });

  // --- getPopular Procedure --- Corrected name
  describe('getPopular', () => {
    it('should call bookmarkService.getPopularBookmarks and return results', async () => {
      const input: inferProcedureInput<
        typeof appRouter.bookmarks.getPopular
      > = { limit: 10 }; // Corrected path
      const serviceResult = { bookmarks: [] };
      mockBookmarkService.getPopularBookmarks.mockResolvedValue(
        serviceResult as any
      );
      const caller = await createCaller();

      const result = await caller.bookmarks.getPopular(input); // Corrected path

      expect(
        bookmarkService.getPopularBookmarks
      ).toHaveBeenCalledWith(userId, input.limit);
      expect(result).toEqual(serviceResult.bookmarks); // Procedure returns bookmarks array directly
    });
    // TODO: Add error test
  });

  // --- checkUrlExists Procedure --- Corrected name
  describe('checkUrlExists', () => {
    it('should call bookmarkService.checkBookmarkUrlExists and return result', async () => {
      const input: inferProcedureInput<
        typeof appRouter.bookmarks.checkUrlExists
      > = { url: 'http://check.com' }; // Corrected path
      const serviceResult = { exists: false, id: null };
      mockBookmarkService.checkBookmarkUrlExists.mockResolvedValue(
        serviceResult
      );
      const caller = await createCaller();

      const result = await caller.bookmarks.checkUrlExists(input); // Corrected path

      expect(
        bookmarkService.checkBookmarkUrlExists
      ).toHaveBeenCalledWith(userId, input.url);
      expect(result).toEqual(serviceResult); // Procedure returns service result directly
    });
    // TODO: Add error test
  });

  // --- addTag Procedure --- Corrected name
  describe('addTag', () => {
    it('should call bookmarkService.addTagToBookmark', async () => {
      const input: inferProcedureInput<
        typeof appRouter.bookmarks.addTag
      > = { bookmarkId: bookmarkId, tagId: tagId }; // Corrected path
      mockBookmarkService.addTagToBookmark.mockResolvedValue(
        undefined
      );
      const caller = await createCaller();

      const result = await caller.bookmarks.addTag(input); // Corrected path

      expect(bookmarkService.addTagToBookmark).toHaveBeenCalledWith(
        userId,
        input.bookmarkId,
        input.tagId
      );
      expect(result).toEqual({ success: true }); // Procedure returns success object
    });
    // TODO: Add error test
  });

  // --- removeTag Procedure --- Corrected name
  describe('removeTag', () => {
    it('should call bookmarkService.removeTagFromBookmark', async () => {
      const input: inferProcedureInput<
        typeof appRouter.bookmarks.removeTag
      > = { bookmarkId: bookmarkId, tagId: tagId }; // Corrected path
      mockBookmarkService.removeTagFromBookmark.mockResolvedValue(
        undefined
      );
      const caller = await createCaller();

      const result = await caller.bookmarks.removeTag(input); // Corrected path

      expect(
        bookmarkService.removeTagFromBookmark
      ).toHaveBeenCalledWith(userId, input.bookmarkId, input.tagId);
      expect(result).toEqual({ success: true }); // Procedure returns success object
    });
    // TODO: Add error test
  });

  // --- bulkAction Procedure --- Corrected name
  describe('bulkAction', () => {
    it('should call bookmarkService.performBulkAction and return result', async () => {
      const input: inferProcedureInput<
        typeof appRouter.bookmarks.bulkAction
      > = { action: 'delete', bookmarkIds: ['bm1'] }; // Corrected path
      const serviceResult = {
        success: true,
        message: 'Bulk action done',
      };
      mockBookmarkService.performBulkAction.mockResolvedValue(
        serviceResult
      );
      const caller = await createCaller();

      const result = await caller.bookmarks.bulkAction(input); // Corrected path

      expect(bookmarkService.performBulkAction).toHaveBeenCalledWith(
        userId,
        input
      );
      expect(result).toEqual(serviceResult); // Procedure returns service result directly
    });
    // TODO: Add error test
  });
});
