// src/routes/tag.routes.ts
import { Router, RequestHandler } from 'express'; // Import RequestHandler
import * as tagController from '../controllers/tag.controller'; // Import named exports
import { protect } from '../middleware/auth.middleware';
import rateLimit from 'express-rate-limit';
import validate from '../middleware/validation.middleware'; // Import validation middleware
import checkOwnership from '../middleware/checkOwnership.middleware'; // Import the checkOwnership middleware
import { createTagSchema, updateTagSchema } from '../models/schemas'; // Import schemas

const router = Router();

// Note: Authentication (protect middleware) is applied in src/routes/index.ts

// Apply rate limiting (adjust limits as needed)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// --- Tag CRUD Operations ---

// GET /api/tags - Get all tags for the current user
router.get('/', tagController.getAllTags as RequestHandler);

// GET /api/tags/:tagId - Get a specific tag by ID
router.get(
  '/:tagId',
  checkOwnership('tag'), // Ensure user owns the tag
  tagController.getTagById as RequestHandler
);

// POST /api/tags - Create a new tag
router.post(
  '/',
  apiLimiter, // Apply rate limiting
  validate(createTagSchema), // Validate request body
  tagController.createTag as RequestHandler
);

// PUT /api/tags/:tagId - Update an existing tag
router.put(
  '/:tagId',
  apiLimiter, // Apply rate limiting
  checkOwnership('tag'), // Ensure user owns the tag
  validate(updateTagSchema), // Validate request body
  tagController.updateTag as RequestHandler
);

// DELETE /api/tags/:tagId - Delete a tag
router.delete(
  '/:tagId',
  apiLimiter, // Apply rate limiting
  checkOwnership('tag'), // Ensure user owns the tag
  tagController.deleteTag as RequestHandler
);

// --- Bookmarks by Tag ---

// GET /api/tags/:tagId/bookmarks - Get bookmarks associated with a tag
router.get(
  '/:tagId/bookmarks',
  checkOwnership('tag'), // Ensure user owns the tag to view its bookmarks
  tagController.getBookmarksByTag as RequestHandler
);

// Note: Assigning/removing tags from bookmarks is handled via bookmark routes/service
// Note: Bulk tag operations are handled via bookmark routes/service

export default router;
