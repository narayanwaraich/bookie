import { Router, RequestHandler } from 'express'; // Re-add RequestHandler import
import * as folderController from '../controllers/folder.controller';
import validate from '../middleware/validation.middleware';
// protect middleware is applied in routes/index.ts
import checkOwnership from '../middleware/checkOwnership.middleware';
// Removed ensureAuthenticated import
// Removed asyncHandler import
import {
  createFolderSchema,
  updateFolderSchema,
  addFolderCollaboratorSchema,
  updateFolderCollaboratorSchema,
  addBookmarkToFolderBodySchema,
  getBookmarksInContainerQuerySchema,
} from '../models/schemas';

const router = Router();

// Note: Authentication (protect middleware) is applied in src/routes/index.ts

// --- General Folder Retrieval ---

// GET /api/folders - Get all folders (flat list) for the user
router.get(
  '/',
  folderController.getFolders as RequestHandler // Use assertion
);

// GET /api/folders/tree - Get folder structure as a tree
router.get(
  '/tree',
  folderController.getFolderTree as RequestHandler // Use assertion
);

// --- Folder CRUD ---

// POST /api/folders - Create a new folder
router.post(
  '/',
  validate(createFolderSchema),
  folderController.createFolder as RequestHandler // Use assertion
);

// GET /api/folders/:id - Get a specific folder by ID
router.get(
  '/:id',
  checkOwnership('folder'),
  folderController.getFolder as RequestHandler // Use assertion
);

// PUT /api/folders/:id - Update a folder
router.put(
  '/:id',
  checkOwnership('folder'),
  validate(updateFolderSchema),
  folderController.updateFolder as RequestHandler // Use assertion
);

// DELETE /api/folders/:id - Delete a folder (Query param validation in controller)
router.delete(
  '/:id',
  checkOwnership('folder'),
  folderController.deleteFolder as RequestHandler // Use assertion
);

// --- Bookmarks within Folder Routes ---

// GET /api/folders/:id/bookmarks - Get bookmarks within this folder (paginated/sorted)
router.get(
  '/:id/bookmarks',
  checkOwnership('folder'),
  folderController.getBookmarksByFolder as RequestHandler // Use assertion
);

// POST /api/folders/:id/bookmarks - Add a bookmark to this folder
router.post(
  '/:id/bookmarks',
  checkOwnership('folder'),
  validate(addBookmarkToFolderBodySchema),
  folderController.addBookmarkToFolder as RequestHandler // Use assertion
);

// DELETE /api/folders/:id/bookmarks/:bookmarkId - Remove a bookmark from this folder
router.delete(
  '/:id/bookmarks/:bookmarkId',
  checkOwnership('folder'),
  folderController.removeBookmarkFromFolder as RequestHandler // Use assertion
);

// --- Folder Collaboration Routes ---

// POST /api/folders/:id/collaborators - Add a collaborator
router.post(
  '/:id/collaborators',
  checkOwnership('folder'),
  validate(addFolderCollaboratorSchema),
  folderController.addCollaboratorToFolder as RequestHandler // Use assertion
);

// PUT /api/folders/:id/collaborators/:collaboratorId - Update collaborator permission
router.put(
  '/:id/collaborators/:collaboratorId',
  checkOwnership('folder'),
  validate(updateFolderCollaboratorSchema),
  folderController.updateFolderCollaborator as RequestHandler // Use assertion
);

// DELETE /api/folders/:id/collaborators/:collaboratorId - Remove a collaborator
router.delete(
  '/:id/collaborators/:collaboratorId',
  checkOwnership('folder'),
  folderController.removeFolderCollaborator as RequestHandler // Use assertion
);

export default router;
