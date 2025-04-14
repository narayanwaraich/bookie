// src/trpc/routers/sync.trpc.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appRouter } from '../router'; 
import { createContext } from '../context'; 
import * as syncService from '../../services/sync.service'; 
import { SyncError } from '../../services/sync.service';
import { inferProcedureInput } from '@trpc/server'; 

// --- Mocks ---
vi.mock('../../services/sync.service'); 
vi.mock('../context'); 

// --- Tests ---

describe('Sync TRPC Router', () => {
  const mockSyncService = vi.mocked(syncService);
  const mockCreateContext = vi.mocked(createContext);

  const userId = 'user-trpc-sync-test';

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

  // --- sync Procedure ---
  describe('sync', () => {
    it('should call syncService.syncData and return the sync result', async () => {
        const input: inferProcedureInput<typeof appRouter.sync.sync> = { 
            lastSyncTimestamp: null, 
            clientChanges: { bookmarks: [], folders: [], tags: [], collections: [] } 
        };
        const serviceResult = { 
            success: true, 
            serverChanges: [], 
            deletedIds: { bookmarks: [], folders: [], tags: [], collections: [] },
            conflicts: [],
            newSyncTimestamp: new Date().toISOString() 
        };
        mockSyncService.syncData.mockResolvedValue(serviceResult as any);
        const caller = await createCaller();

        const result = await caller.sync.sync(input); 

        expect(syncService.syncData).toHaveBeenCalledWith(userId, input.lastSyncTimestamp, input.clientChanges);
        expect(result).toEqual(serviceResult); 
    });

    it('should throw TRPCError if syncService throws SyncError', async () => {
       const input: inferProcedureInput<typeof appRouter.sync.sync> = { 
            lastSyncTimestamp: new Date().toISOString(), 
            clientChanges: { bookmarks: [], folders: [], tags: [], collections: [] } 
       };
       const serviceError = new SyncError('Sync conflict', 409);
       mockSyncService.syncData.mockRejectedValue(serviceError);
       const caller = await createCaller();

       await expect(caller.sync.sync(input))
           .rejects.toThrowError(/Sync conflict/); 
       // Optionally check for specific TRPC error code if mapped
       // await expect(caller.sync.sync(input))
       //     .rejects.toHaveProperty('cause.code', 'CONFLICT'); // Or appropriate code
    });
     // TODO: Add more error tests (e.g., validation errors if applicable)
  });

});
