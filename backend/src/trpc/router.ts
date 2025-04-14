// src/trpc/router.ts
import { router, publicProcedure } from './trpc'; // Import publicProcedure if needed
// Import resource routers here as they are created
import { bookmarkTrpcRouter } from './routers/bookmark.trpc';
import { folderTrpcRouter } from './routers/folder.trpc';
import { tagTrpcRouter } from './routers/tag.trpc';
import { collectionTrpcRouter } from './routers/collection.trpc';
import { userTrpcRouter } from './routers/user.trpc';
import { authTrpcRouter } from './routers/auth.trpc'; 
import { syncTrpcRouter } from './routers/sync.trpc';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = router({
  health: publicProcedure.query(() => 'ok'), 
  // --- Merge resource routers here ---
  auth: authTrpcRouter, // Merge the auth router
  user: userTrpcRouter, 
  bookmarks: bookmarkTrpcRouter, 
  folders: folderTrpcRouter, 
  tags: tagTrpcRouter, 
  collections: collectionTrpcRouter, 
  sync: syncTrpcRouter, // Merge the sync router
});

// Export type definition of API
export type AppRouter = typeof appRouter;
