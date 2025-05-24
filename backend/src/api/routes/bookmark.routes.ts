import { Router, RequestHandler } from 'express'; // Import RequestHandler
import * as bookmarkController from '../controllers/bookmark.controller';
import validate from '../middleware/validation.middleware'; // Default import
import { protect } from '../middleware/auth.middleware'; // Import protect middleware
import {
  createBookmarkSchema,
  updateBookmarkSchema,
  // bookmarkSearchSchema, // Validation handled in controller for query params
  bulkActionSchema, // Import bulk action schema
  // Schemas for relationship management
  addTagToBookmarkBodySchema, // Renamed schema
  // deleteTagFromBookmarkParamsSchema // Params validation in controller/service
  // checkUrlExistsQuerySchema // Validation handled in controller for query params
} from '../models/schemas';

const router = Router();

// Note: Authentication (protect middleware) is applied in src/routes/index.ts

// --- Search & Retrieval ---

// GET /api/bookmarks/search - Search bookmarks (Needs to be before /:id)
// Query parameter validation is handled within the controller
router.get(
  '/search',
  bookmarkController.searchBookmarks as RequestHandler
);

// GET /api/bookmarks/check-url - Check if a URL exists (Needs to be before /:id)
// Query parameter validation is handled within the controller
router.get(
  '/check-url',
  bookmarkController.checkBookmarkUrlExists as RequestHandler
);

// GET /api/bookmarks/recent - Get recent bookmarks
// Query parameter validation is handled within the controller
router.get(
  '/recent',
  bookmarkController.getRecentBookmarks as RequestHandler
);

// GET /api/bookmarks/popular - Get popular bookmarks
// Query parameter validation is handled within the controller
router.get(
  '/popular',
  bookmarkController.getPopularBookmarks as RequestHandler
);

// --- CRUD Operations ---

// POST /api/bookmarks - Create a new bookmark
router.post(
  '/',
  validate(createBookmarkSchema),
  bookmarkController.createBookmark as RequestHandler
);

// GET /api/bookmarks/:id - Get a specific bookmark by ID
router.get('/:id', bookmarkController.getBookmark as RequestHandler);

// PUT /api/bookmarks/:id - Update a bookmark
router.put(
  '/:id',
  validate(updateBookmarkSchema),
  bookmarkController.updateBookmark as RequestHandler
);

// DELETE /api/bookmarks/:id - Delete a bookmark
router.delete(
  '/:id',
  bookmarkController.deleteBookmark as RequestHandler
);

// --- Tag Relationship Management Routes ---
// (Folder relationship routes moved to folder.routes.ts)

// POST /api/bookmarks/:bookmarkId/tags - Add tag to bookmark (Corrected route)
router.post(
  '/:bookmarkId/tags', // Use bookmarkId in route param
  validate(addTagToBookmarkBodySchema), // Validate body has tagId
  bookmarkController.addTagToBookmark as RequestHandler
);

// DELETE /api/bookmarks/:bookmarkId/tags/:tagId - Remove tag from bookmark
router.delete(
  '/:bookmarkId/tags/:tagId',
  // Params validation happens implicitly or in controller
  bookmarkController.removeTagFromBookmark as RequestHandler
);

// --- Bulk Actions ---

// POST /api/bookmarks/bulk - Perform bulk actions
router.post(
  '/bulk',
  validate(bulkActionSchema), // Validate the request body
  bookmarkController.performBulkAction as RequestHandler
);

// --- Import/Export/Sync routes are handled in separate files ---

export default router;
