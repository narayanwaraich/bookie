// src/trpc/routers/sync.trpc.ts
import { router, protectedProcedure } from '../trpc';
import * as syncService from '../../services/sync.service';
import { syncRequestBodySchema } from '../../models/schemas'; 
import { TRPCError } from '@trpc/server';
import { SyncError } from '../../services/sync.service'; 

export const syncTrpcRouter = router({

  /** Sync Data */
  sync: protectedProcedure
    .input(syncRequestBodySchema) // Validate the entire sync payload
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      try {
        // Pass the full payload to the service function
        const result = await syncService.syncData(userId, input.lastSyncTimestamp, input.clientChanges);
        
        // The service function returns a success flag and potentially a message
        if (!result.success) {
             // Throw a TRPC error if the service indicates failure
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: result.message || 'Sync operation failed' });
        }
        
        // Return the full sync result (serverChanges, deletedIds, conflicts, newSyncTimestamp)
        return result; 
      } catch (error: any) {
         // Handle specific SyncError or other errors
         if (error instanceof SyncError) {
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message, cause: error });
         }
         // Handle potential Zod errors from input validation (though less likely if schema matches)
         if (error.name === 'ZodError') {
              throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid sync payload structure.', cause: error });
         }
         throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Sync failed due to an unexpected error.', cause: error });
      }
    }),

});

export type SyncTrpcRouter = typeof syncTrpcRouter;
