// src/controllers/folder.controller.ts
import { Response, NextFunction } from 'express';
import * as folderService from '../services/folder.service'; // Import the service
import { z } from 'zod'; // Import Zod
import { 
    CreateFolderInput, 
    UpdateFolderInput,
    AddFolderCollaboratorInput,
    UpdateFolderCollaboratorInput,
    deleteFolderQuerySchema, 
    addBookmarkToFolderBodySchema,
    getFoldersQuerySchema, 
    getBookmarksInContainerQuerySchema // Import schema for bookmarks
} from '../models/schemas';
import { AuthenticatedRequest } from '../types/express/index';
import logger from '../config/logger';
import { FolderError } from '../services/folder.service'; // Import custom error if defined
import * as bookmarkService from '../services/bookmark.service'; // Import bookmark service

/**
 * @openapi
 * /folders:
 *   post:
 *     tags: [Folders]
 *     summary: Create a new folder
 *     description: Creates a new folder for the authenticated user, optionally nested under a parent folder.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the new folder.
 *               description:
 *                 type: string
 *                 nullable: true
 *               icon:
 *                 type: string
 *                 nullable: true
 *               color:
 *                 type: string
 *                 nullable: true
 *               parentId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: ID of the parent folder (null for root folder).
 *     responses:
 *       '201':
 *         description: Folder created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Folder' # Assuming a Folder schema exists
 *       '400':
 *         description: Bad Request - Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Parent folder not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '409':
 *         description: Conflict - Folder with the same name already exists at this level.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const createFolder = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id; 
    const folderData: CreateFolderInput = req.body;
    const newFolder = await folderService.createFolder(userId, folderData);
    logger.info(`Folder created: ${newFolder.id} by user ${userId}`);
    res.status(201).json({ success: true, data: newFolder });
  } catch (error) {
    logger.error('Error creating folder:', error);
    next(error);
  }
};

/**
 * @openapi
 * /folders:
 *   get:
 *     tags: [Folders]
 *     summary: Get user folders (flat list)
 *     description: Retrieves a paginated and sorted flat list of folders owned by or collaborated on by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Maximum number of results per page.
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of results to skip for pagination.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, createdAt, updatedAt]
 *           default: name
 *         description: Field to sort by.
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order.
 *     responses:
 *       '200':
 *         description: Folders retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FolderWithCount' # Assuming schema includes bookmark count
 *                 totalCount:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 hasMore:
 *                   type: boolean
 *       '400':
 *         description: Bad Request - Invalid query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const getFolders = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user!.id; 
  try {
    // Validate query parameters
    const queryParams = getFoldersQuerySchema.parse(req.query);
    const result = await folderService.getUserFolders(userId, queryParams);
    res.status(200).json({ success: true, ...result }); // Spread results (data, totalCount, etc.)
  } catch (error) {
     if (error instanceof z.ZodError) { 
        logger.error('Get folders query validation error:', error.errors);
     } else {
        logger.error(`Error fetching folders for user ${userId}:`, error);
     }
    next(error);
  }
};

/**
 * @openapi
 * /folders/tree:
 *   get:
 *     tags: [Folders]
 *     summary: Get folder tree structure
 *     description: Retrieves the user's folder hierarchy (owned and collaborated) as a nested tree structure.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Folder tree retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FolderTreeNode' # Define a recursive schema for the tree node
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const getFolderTree = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user!.id; 
  try {
    const folderTree = await folderService.getFolderTree(userId);
    res.status(200).json({ success: true, data: folderTree });
  } catch (error) {
    logger.error(`Error fetching folder tree for user ${userId}:`, error);
    next(error);
  }
};

/**
 * @openapi
 * /folders/{id}:
 *   get:
 *     tags: [Folders]
 *     summary: Get folder by ID
 *     description: Retrieves details for a specific folder. Requires ownership or view/edit/admin collaboration permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the folder to retrieve.
 *     responses:
 *       '200':
 *         description: Folder details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Folder' 
 *       '400':
 *         description: Bad Request - Invalid Folder ID format.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden - User does not have permission to view this folder.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Folder not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const getFolder = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const folderId = req.params.id;
  try {
    const userId = req.user!.id; 
    if (!folderId) throw new FolderError("Folder ID is required.", 400); 
    // Ownership/access checked by middleware/service
    const folder = await folderService.getFolderById(folderId, userId); 
    res.status(200).json({ success: true, data: folder }); 
  } catch (error) {
    logger.error(`Error fetching folder ${folderId}:`, error);
    next(error);
  }
};

/**
 * @openapi
 * /folders/{id}:
 *   put:
 *     tags: [Folders]
 *     summary: Update a folder
 *     description: Updates the properties (name, description, icon, color, parentId) of a specific folder. Requires ownership or edit/admin collaboration permission. Checks for circular references if moving.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the folder to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *                 nullable: true
 *               icon:
 *                 type: string
 *                 nullable: true
 *               color:
 *                 type: string
 *                 nullable: true
 *               parentId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: New parent folder ID (null for root).
 *     responses:
 *       '200':
 *         description: Folder updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Folder' 
 *       '400':
 *         description: Bad Request - Invalid input, circular reference detected, or target parent not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden - User does not have permission to edit this folder.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Folder not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '409':
 *         description: Conflict - Folder with the same name already exists at the target level.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const updateFolder = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const folderId = req.params.id;
  try {
    const userId = req.user!.id; 
    const updateData: UpdateFolderInput = req.body;
    if (!folderId) throw new FolderError("Folder ID is required.", 400); 
    // Ownership/access checked by middleware/service
    const updatedFolder = await folderService.updateFolder(folderId, userId, updateData);
    logger.info(`Folder updated: ${folderId} by user ${userId}`);
    res.status(200).json({ success: true, data: updatedFolder, message: 'Folder updated successfully' });
  } catch (error) {
    logger.error(`Error updating folder ${folderId}:`, error);
    next(error);
  }
};

/**
 * @openapi
 * /folders/{id}:
 *   delete:
 *     tags: [Folders]
 *     summary: Delete a folder
 *     description: Soft deletes a folder and all its descendants. Only the owner can delete. Bookmarks within can optionally be moved.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the folder to delete.
 *       - in: query
 *         name: moveBookmarksTo
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Optional ID of another folder to move bookmarks from the deleted hierarchy into.
 *     responses:
 *       '204':
 *         description: Folder deleted successfully (No Content).
 *       '400':
 *         description: Bad Request - Invalid Folder ID or moveBookmarksTo ID format.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden - Only the owner can delete a folder.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Folder or target move folder not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const deleteFolder = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const folderId = req.params.id;
  try {
    const userId = req.user!.id; 
    // Validate query params
    const { moveBookmarksTo } = deleteFolderQuerySchema.parse(req.query); 
    if (!folderId) throw new FolderError("Folder ID is required.", 400); 
    // Ownership checked by middleware/service
    await folderService.deleteFolder(folderId, userId, moveBookmarksTo);
    logger.info(`Folder deleted: ${folderId} by user ${userId}`);
    res.status(204).send(); 
  } catch (error) {
     if (error instanceof z.ZodError) { 
        logger.error('Delete folder query validation error:', error.errors);
     } else {
        logger.error(`Error deleting folder ${folderId}:`, error);
     }
    next(error);
  }
};

// --- Bookmarks within Folder ---

/**
 * @openapi
 * /folders/{id}/bookmarks:
 *   get:
 *     tags: [Folders, Bookmarks]
 *     summary: Get bookmarks in folder
 *     description: Retrieves a paginated and sorted list of bookmarks within a specific folder. Requires view permission on the folder.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the folder.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, title, visitCount]
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       '200':
 *         description: Bookmarks retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               # Similar structure to /bookmarks/search response
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data: # Renamed from 'bookmarks' for consistency? Or keep as bookmarks?
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BookmarkWithRelations' 
 *                 totalCount:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 hasMore:
 *                   type: boolean
 *       '400':
 *         description: Bad Request - Invalid Folder ID or query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden - Permission denied to view folder.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Folder not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const getBookmarksByFolder = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const folderId = req.params.id;
    try {
        const userId = req.user!.id;
        
        if (!folderId) throw new FolderError("Folder ID is required.", 400);
        // Validate query parameters for pagination/sorting
        const queryParams = getBookmarksInContainerQuerySchema.parse(req.query);

        // Ownership/access checked by middleware before calling service
        const result = await folderService.getBookmarksByFolder(folderId, userId, queryParams);
        res.status(200).json({ success: true, ...result }); // Spread results (data, totalCount, etc.)
    } catch (error) {
         if (error instanceof z.ZodError) { 
            logger.error(`Get bookmarks by folder query validation error for folder ${folderId}:`, error.errors);
         } else {
            logger.error(`Error fetching bookmarks for folder ${folderId}:`, error);
         }
        next(error);
    }
};

/**
 * @openapi
 * /folders/{id}/bookmarks:
 *   post:
 *     tags: [Folders, Bookmarks]
 *     summary: Add bookmark to folder
 *     description: Adds an existing bookmark to a specific folder. Requires edit permission on the folder.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the folder.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookmarkId]
 *             properties:
 *               bookmarkId:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the bookmark to add.
 *     responses:
 *       '200':
 *         description: Bookmark added to folder successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *       '400':
 *         description: Bad Request - Invalid ID format.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden - Permission denied to modify folder.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Folder or Bookmark not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '409':
 *         description: Conflict - Bookmark already in this folder.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const addBookmarkToFolder = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const folderId = req.params.id;
  try {
    const userId = req.user!.id; 
    // Validate body
    const { bookmarkId } = addBookmarkToFolderBodySchema.parse(req.body); 

    if (!folderId) throw new FolderError("Folder ID is required.", 400); 
    // Ownership/access checked by middleware/service
    await bookmarkService.addBookmarkToFolder(userId, bookmarkId, folderId); 

    res.status(200).json({
      success: true,
      message: `Bookmark ${bookmarkId} added to folder ${folderId} successfully`
    });
  } catch (error) {
     logger.error(`Error adding bookmark to folder ${folderId}:`, error);
     next(error);
  }
};

/**
 * @openapi
 * /folders/{id}/bookmarks/{bookmarkId}:
 *   delete:
 *     tags: [Folders, Bookmarks]
 *     summary: Remove bookmark from folder
 *     description: Removes a bookmark from a specific folder. Requires edit permission on the folder.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the folder.
 *       - in: path
 *         name: bookmarkId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the bookmark to remove.
 *     responses:
 *       '200':
 *         description: Bookmark removed from folder successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *       '400':
 *         description: Bad Request - Invalid ID format.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden - Permission denied to modify folder.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Folder, Bookmark, or association not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const removeBookmarkFromFolder = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id: folderId, bookmarkId } = req.params;
  try {
    const userId = req.user!.id; 

    if (!folderId || !bookmarkId) {
        throw new FolderError('Folder ID and Bookmark ID are required in route parameters', 400);
    }
    // Ownership/access checked by middleware/service
    await bookmarkService.removeBookmarkFromFolder(userId, bookmarkId, folderId);

    res.status(200).json({ 
      success: true,
      message: `Bookmark ${bookmarkId} removed from folder ${folderId} successfully`
    });
  } catch (error) {
     logger.error(`Error removing bookmark ${bookmarkId} from folder ${folderId}:`, error);
     next(error);
  }
};


// --- Folder Collaboration ---

/**
 * @openapi
 * /folders/{id}/collaborators:
 *   post:
 *     tags: [Folders, Collaboration]
 *     summary: Add folder collaborator
 *     description: Adds another user as a collaborator to a folder owned by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the folder to add a collaborator to.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, permission]
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the user to add as a collaborator.
 *               permission:
 *                 type: string
 *                 enum: [VIEW, EDIT, ADMIN] # Use values from Role enum
 *                 description: The permission level to grant.
 *     responses:
 *       '201':
 *         description: Collaborator added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/FolderCollaboratorWithUser' # Define this schema
 *       '400':
 *         description: Bad Request - Invalid input, cannot add self as collaborator.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden - Only the folder owner can add collaborators.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Folder or collaborator user not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '409':
 *         description: Conflict - User is already a collaborator.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const addCollaboratorToFolder = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const folderId = req.params.id;
    try {
        const ownerId = req.user!.id;
        // Validate body
        const { userId: collaboratorUserId, permission }: AddFolderCollaboratorInput = req.body;
        
        if (!folderId) throw new FolderError("Folder ID is required.", 400); 
        // Ownership checked by middleware/service
        const collaborator = await folderService.addCollaborator(folderId, ownerId, collaboratorUserId, permission);
        logger.info(`Collaborator ${collaboratorUserId} added to folder ${folderId} by owner ${ownerId}`);
        res.status(201).json({ success: true, data: collaborator });
    } catch (error) {
        logger.error(`Error adding collaborator to folder ${folderId}:`, error);
        next(error);
    }
};

/**
 * @openapi
 * /folders/{id}/collaborators/{collaboratorId}:
 *   put:
 *     tags: [Folders, Collaboration]
 *     summary: Update folder collaborator permission
 *     description: Updates the permission level of an existing collaborator on a folder owned by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the folder.
 *       - in: path
 *         name: collaboratorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the collaborator whose permission is being updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [permission]
 *             properties:
 *               permission:
 *                 type: string
 *                 enum: [VIEW, EDIT, ADMIN]
 *                 description: The new permission level.
 *     responses:
 *       '200':
 *         description: Collaborator permission updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/FolderCollaboratorWithUser' 
 *       '400':
 *         description: Bad Request - Invalid input, cannot update owner's permission.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden - Only the folder owner can update permissions.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Folder or collaborator not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const updateFolderCollaborator = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id: folderId, collaboratorId } = req.params;
    try {
        const ownerId = req.user!.id;
        // Validate body
        const { permission }: UpdateFolderCollaboratorInput = req.body;

        if (!folderId || !collaboratorId) throw new FolderError('Folder ID and Collaborator ID are required in route parameters', 400);
        // Ownership checked by middleware/service
        const updatedCollaborator = await folderService.updateCollaboratorPermission(folderId, ownerId, collaboratorId, permission);
        logger.info(`Collaborator ${collaboratorId} permission updated in folder ${folderId} by owner ${ownerId}`);
        res.status(200).json({ success: true, data: updatedCollaborator });
    } catch (error) {
        logger.error(`Error updating collaborator ${collaboratorId} in folder ${folderId}:`, error);
        next(error);
    }
};

/**
 * @openapi
 * /folders/{id}/collaborators/{collaboratorId}:
 *   delete:
 *     tags: [Folders, Collaboration]
 *     summary: Remove folder collaborator
 *     description: Removes a collaborator from a folder owned by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the folder.
 *       - in: path
 *         name: collaboratorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the collaborator to remove.
 *     responses:
 *       '204':
 *         description: Collaborator removed successfully (No Content).
 *       '400':
 *         description: Bad Request - Invalid ID format, cannot remove self.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden - Only the folder owner can remove collaborators.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Folder or collaborator not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const removeFolderCollaborator = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id: folderId, collaboratorId } = req.params;
    try {
        const ownerId = req.user!.id;
        
         if (!folderId || !collaboratorId) throw new FolderError('Folder ID and Collaborator ID are required in route parameters', 400);
        // Ownership checked by middleware/service
        await folderService.removeCollaborator(folderId, ownerId, collaboratorId);
        logger.info(`Collaborator ${collaboratorId} removed from folder ${folderId} by owner ${ownerId}`);
        res.status(204).send(); // No Content
    } catch (error) {
        logger.error(`Error removing collaborator ${collaboratorId} from folder ${folderId}:`, error);
        next(error);
    }
};

// Define Folder schema component for OpenAPI references
/**
 * @openapi
 * components:
 *   schemas:
 *     Folder:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         icon:
 *           type: string
 *           nullable: true
 *         color:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         userId:
 *           type: string
 *           format: uuid
 *         parentId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         isDeleted:
 *           type: boolean
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     FolderWithCount:
 *       allOf:
 *         - $ref: '#/components/schemas/Folder'
 *         - type: object
 *           properties:
 *             bookmarkCount:
 *               type: integer
 *               description: Number of bookmarks directly in this folder.
 *     FolderTreeNode:
 *       type: object
 *       properties:
 *         # Include all properties from Folder schema
 *         id: { type: string, format: uuid }
 *         name: { type: string }
 *         description: { type: string, nullable: true }
 *         icon: { type: string, nullable: true }
 *         color: { type: string, nullable: true }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *         userId: { type: string, format: uuid }
 *         parentId: { type: string, format: uuid, nullable: true }
 *         isDeleted: { type: boolean }
 *         deletedAt: { type: string, format: date-time, nullable: true }
 *         bookmarkCount:
 *           type: integer
 *         children:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FolderTreeNode' # Recursive definition
 *     FolderCollaboratorWithUser:
 *       type: object
 *       properties:
 *         folderId: { type: string, format: uuid }
 *         userId: { type: string, format: uuid }
 *         permission: { $ref: '#/components/schemas/Role' }
 *         addedAt: { type: string, format: date-time }
 *         user: 
 *           type: object
 *           properties: 
 *             id: { type: string, format: uuid }
 *             username: { type: string }
 *             name: { type: string, nullable: true }
 *             profileImage: { type: string, nullable: true }
 *     Role: # Define Role enum
 *       type: string
 *       enum: [VIEW, EDIT, ADMIN]
 */
