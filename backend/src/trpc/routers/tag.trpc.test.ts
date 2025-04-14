// src/trpc/routers/tag.trpc.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appRouter } from '../router'; 
import { createContext } from '../context'; 
import * as tagService from '../../services/tag.service'; 
import { TagError } from '../../services/tag.service';
import { inferProcedureInput } from '@trpc/server'; 

// --- Mocks ---
vi.mock('../../services/tag.service'); 
vi.mock('../context'); 

// --- Tests ---

describe('Tag TRPC Router', () => {
  const mockTagService = vi.mocked(tagService);
  const mockCreateContext = vi.mocked(createContext);

  const userId = 'user-trpc-tag-test';
  const tagId = 'tag-trpc-123';

  // Mock context value
  const mockContext = {
    user: { id: userId, email: 'test@trpc.com', username: 'trpctester' }, // Assume authenticated
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
      const context = await createContext({} as any); 
      return appRouter.createCaller(context);
  };

  // --- createTag Procedure ---
  describe('create', () => {
    it('should call tagService.createTag and return the new tag', async () => {
        const input: inferProcedureInput<typeof appRouter.tags.create> = { name: 'TRPC Tag', color: '#aabbcc' }; // Corrected path
        const serviceResult = { id: tagId, ...input, userId };
        mockTagService.createTag.mockResolvedValue(serviceResult as any);
        const caller = await createCaller();

        const result = await caller.tags.create(input); // Corrected path

        expect(tagService.createTag).toHaveBeenCalledWith(userId, input);
        expect(result).toEqual(serviceResult); 
    });
     // TODO: Add error test
  });

  // --- listTags Procedure ---
  describe('list', () => {
     it('should call tagService.getAllUserTags and return tags', async () => {
        // Input might include pagination/sorting in the future
        const input: inferProcedureInput<typeof appRouter.tags.list> = {}; // Corrected path
        const serviceResult = { data: [], totalCount: 0, page: 1, limit: 100, hasMore: false }; // Service returns paginated
        mockTagService.getAllUserTags.mockResolvedValue(serviceResult as any);
        const caller = await createCaller();

        const result = await caller.tags.list(input); // Corrected path

        expect(tagService.getAllUserTags).toHaveBeenCalledWith(userId); // Service might take pagination args?
        expect(result).toEqual(serviceResult.data); // Router returns only the data array
     });
      // TODO: Add error test
  });
  
  // --- getTagById Procedure ---
  describe('getById', () => {
     it('should call tagService.getTagById and return the tag', async () => {
        const input: inferProcedureInput<typeof appRouter.tags.getById> = { id: tagId }; // Corrected path
        const serviceResult = { id: tagId, name: 'TRPC Get Tag', userId };
        mockTagService.getTagById.mockResolvedValue(serviceResult as any);
        const caller = await createCaller();

        const result = await caller.tags.getById(input); // Corrected path

        expect(tagService.getTagById).toHaveBeenCalledWith(input.id, userId);
        expect(result).toEqual(serviceResult); 
     });
      // TODO: Add error test
  });
  
  // --- updateTag Procedure ---
  describe('update', () => {
     it('should call tagService.updateTag', async () => {
        const input: inferProcedureInput<typeof appRouter.tags.update> = { id: tagId, name: 'Updated TRPC Tag' }; // Corrected path
        const serviceResult = { id: tagId, name: input.name, userId };
        mockTagService.updateTag.mockResolvedValue(serviceResult as any);
        const caller = await createCaller();

        const result = await caller.tags.update(input); // Corrected path

        expect(tagService.updateTag).toHaveBeenCalledWith(input.id, userId, { name: input.name });
        expect(result).toEqual(serviceResult); 
     });
      // TODO: Add error test
  });
  
  // --- deleteTag Procedure ---
  describe('delete', () => {
     it('should call tagService.deleteTag', async () => {
        const input: inferProcedureInput<typeof appRouter.tags.delete> = { id: tagId }; // Corrected path
        mockTagService.deleteTag.mockResolvedValue(undefined);
        const caller = await createCaller();

        const result = await caller.tags.delete(input); // Corrected path

        expect(tagService.deleteTag).toHaveBeenCalledWith(input.id, userId);
        expect(result).toEqual({ success: true, id: input.id }); 
     });
      // TODO: Add error test
  });
  
  // --- getBookmarksByTag Procedure ---
  describe('getBookmarks', () => {
     it('should call tagService.getBookmarksByTag', async () => {
        const input: inferProcedureInput<typeof appRouter.tags.getBookmarks> = { tagId: tagId, limit: 10, offset: 0 }; // Corrected path
        const serviceResult = { data: [], totalCount: 0, page: 1, limit: 10, hasMore: false };
        mockTagService.getBookmarksByTag.mockResolvedValue(serviceResult as any);
        const caller = await createCaller();

        const result = await caller.tags.getBookmarks(input); // Corrected path

        expect(tagService.getBookmarksByTag).toHaveBeenCalledWith(input.tagId, userId, { limit: 10, offset: 0, sortBy: 'createdAt', sortOrder: 'desc' });
        expect(result).toEqual(serviceResult); 
     });
      // TODO: Add error test
  });

});
