import { Router, RequestHandler } from 'express'; // Import RequestHandler
import * as collectionController from '../controllers/collection.controller';
import validate from '../middleware/validation.middleware'; // Default import
import {
  createCollectionSchema,
  updateCollectionSchema,
  addBookmarkToCollectionSchema,
  addCollectionCollaboratorSchema,
  updateCollectionCollaboratorSchema,
} from '../models/schemas';
import { protect } from '../middleware/auth.middleware'; // Import 'protect' middleware
import checkOwnership from '../middleware/checkOwnership.middleware'; // Import the checkOwnership middleware

const router = Router();

// === Public Collection Route ===

// GET /api/collections/public/:link - Get a public collection by its link (No auth needed)
router.get(
  '/public/:link',
  collectionController.getPublicCollectionByLink
);

// === Protected Collection Routes ===

// Note: Authentication (protect middleware) is applied in src/routes/index.ts

// --- Collection CRUD ---

// GET /api/collections - Get collections for the logged-in user
router.get(
  '/',
  collectionController.getUserCollections as RequestHandler
);

// POST /api/collections - Create a new collection
router.post(
  '/',
  validate(createCollectionSchema), // Validate request body
  collectionController.createCollection as RequestHandler
);

// GET /api/collections/:id - Get a specific collection by ID
// Middleware checks ownership/collaboration for private collections
router.get(
  '/:id',
  checkOwnership('collection'), // Requires auth (from router.use) and ownership/collaboration
  collectionController.getCollectionById as RequestHandler // Controller handles final access logic if needed
);

// PUT /api/collections/:id - Update a collection
router.put(
  '/:id',
  checkOwnership('collection'), // Check ownership/edit permission
  validate(updateCollectionSchema), // Validate request body
  collectionController.updateCollection as RequestHandler
);

// DELETE /api/collections/:id - Delete a collection
router.delete(
  '/:id',
  checkOwnership('collection'), // Check ownership
  collectionController.deleteCollection as RequestHandler
);

// --- Bookmarks within Collection Routes ---

// POST /api/collections/:id/bookmarks - Add a bookmark to a collection
router.post(
  '/:id/bookmarks',
  checkOwnership('collection'), // Check ownership/edit permission
  validate(addBookmarkToCollectionSchema), // Validate request body
  collectionController.addBookmarkToCollection as RequestHandler
);

// DELETE /api/collections/:id/bookmarks/:bookmarkId - Remove a bookmark from a collection
router.delete(
  '/:id/bookmarks/:bookmarkId',
  checkOwnership('collection'), // Check ownership/edit permission
  collectionController.removeBookmarkFromCollection as RequestHandler
);

// --- Collaborators within Collection Routes ---

// POST /api/collections/:id/collaborators - Add a collaborator to a collection
router.post(
  '/:id/collaborators',
  checkOwnership('collection'), // Check ownership (service layer re-verifies owner specifically)
  validate(addCollectionCollaboratorSchema), // Validate request body
  collectionController.addCollaboratorToCollection as RequestHandler
);

// PUT /api/collections/:id/collaborators/:collaboratorId - Update collaborator permission
router.put(
  '/:id/collaborators/:collaboratorId',
  checkOwnership('collection'), // Check ownership (service layer re-verifies owner specifically)
  validate(updateCollectionCollaboratorSchema), // Validate request body
  collectionController.updateCollaboratorPermission as RequestHandler
);

// DELETE /api/collections/:id/collaborators/:collaboratorId - Remove a collaborator
router.delete(
  '/:id/collaborators/:collaboratorId',
  checkOwnership('collection'), // Check ownership (service layer re-verifies owner specifically)
  collectionController.removeCollaboratorFromCollection as RequestHandler
);

export default router;
