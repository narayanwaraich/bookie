// src/controllers/collection.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as collectionService from '../services/collection.service';
import { z } from 'zod'; // Import Zod
import { 
    CreateCollectionInput, 
    UpdateCollectionInput,
    AddBookmarkToCollectionInput,
    AddCollectionCollaboratorInput,
    UpdateCollectionCollaboratorInput,
    getCollectionsQuerySchema, // Import query schema for listing collections
    getBookmarksInContainerQuerySchema // Import query schema for bookmarks within collection
} from '../models/schemas';
import { AuthenticatedRequest } from '../types/express/index';
import logger from '../config/logger';
import { CollectionError } from '../services/collection.service'; // Import custom error

/**
 * @openapi
 * /collections:
 *   post:
 *     tags: [Collections]
 *     summary: Create a new collection
 *     description: Creates a new collection for the authenticated user.
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
 *                 description: Name of the new collection (must be unique for the user).
 *               description:
 *                 type: string
 *                 nullable: true
 *               isPublic:
 *                 type: boolean
 *                 default: false
 *                 description: Whether the collection should be publicly accessible via a link.
 *               bookmarkIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: Optional array of Bookmark IDs to initially add to the collection.
 *     responses:
 *       '201':
 *         description: Collection created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Collection' # Assuming a Collection schema exists
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
 *       '409':
 *         description: Conflict - Collection with the same name already exists.
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
export const createCollection = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const collectionData: CreateCollectionInput = req.body;
        const newCollection = await collectionService.createCollection({ ...collectionData, userId, ownerId: userId });
        logger.info(`Collection created: ${newCollection.id} by user ${userId}`);
        res.status(201).json({ success: true, data: newCollection });
    } catch (error) {
        logger.error('Error creating collection:', error);
        next(error);
    }
};

/**
 * @openapi
 * /collections:
 *   get:
 *     tags: [Collections]
 *     summary: Get user collections
 *     description: Retrieves a paginated and sorted list of collections owned by or collaborated on by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *           enum: [name, createdAt, updatedAt]
 *           default: updatedAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       '200':
 *         description: Collections retrieved successfully.
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
 *                     $ref: '#/components/schemas/CollectionWithDetails' # Define this schema
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
export const getUserCollections = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    try {
        // Validate query parameters
        const queryParams = getCollectionsQuerySchema.parse(req.query);
        const result = await collectionService.getUserCollections(userId, queryParams);
        res.status(200).json({ success: true, ...result }); // Spread results (data, totalCount, etc.)
    } catch (error) {
         if (error instanceof z.ZodError) { 
            logger.error('Get collections query validation error:', error.errors);
         } else {
            logger.error(`Error fetching collections for user ${userId}:`, error);
         }
        next(error);
    }
};

/**
 * @openapi
 * /collections/{id}:
 *   get:
 *     tags: [Collections]
 *     summary: Get collection by ID
 *     description: Retrieves details for a specific collection, including a paginated list of its bookmarks. Requires ownership or view/edit/admin collaboration permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the collection to retrieve.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Max number of bookmarks to return.
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of bookmarks to skip.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, title, visitCount]
 *           default: createdAt
 *         description: Field to sort bookmarks by.
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order for bookmarks.
 *     responses:
 *       '200':
 *         description: Collection details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/CollectionWithPaginatedBookmarks' # Define this schema
 *       '400':
 *         description: Bad Request - Invalid ID or query parameters.
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
 *         description: Forbidden - Permission denied.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Collection not found.
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
export const getCollectionById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const collectionId = req.params.id;
    try {
        const userId = req.user!.id; 
        // Validate query parameters for bookmark pagination/sorting
        const queryParams = getBookmarksInContainerQuerySchema.parse(req.query);

        if (!collectionId) throw new CollectionError("Collection ID is required.", 400);
        // Ownership/access checked by middleware/service
        const collection = await collectionService.getCollectionById(collectionId, userId, queryParams);
        res.status(200).json({ success: true, data: collection });
    } catch (error) {
         if (error instanceof z.ZodError) { 
            logger.error(`Get collection by ID query validation error for collection ${collectionId}:`, error.errors);
         } else {
            logger.error(`Error fetching collection ${collectionId}:`, error);
         }
        next(error);
    }
};

/**
 * @openapi
 * /collections/public/{link}:
 *   get:
 *     tags: [Collections]
 *     summary: Get public collection by link
 *     description: Retrieves a publicly shared collection using its unique link. Does not require authentication.
 *     parameters:
 *       - in: path
 *         name: link
 *         required: true
 *         schema:
 *           type: string
 *         description: The public shareable link of the collection.
 *     responses:
 *       '200':
 *         description: Public collection retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/CollectionWithPaginatedBookmarks' # Or a simplified public version
 *       '404':
 *         description: Not Found - Public collection not found or link is invalid.
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
export const getPublicCollectionByLink = async (req: Request, res: Response, next: NextFunction) => {
    const publicLink = req.params.link;
    try {
        if (!publicLink) throw new CollectionError("Public link is required.", 400);
        // TODO: Consider adding pagination/sorting query params for bookmarks here too?
        const collection = await collectionService.getPublicCollectionByLink(publicLink);
        res.status(200).json({ success: true, data: collection });
    } catch (error) {
        logger.error(`Error fetching public collection by link ${publicLink}:`, error);
        next(error);
    }
};

/**
 * @openapi
 * /collections/{id}:
 *   put:
 *     tags: [Collections]
 *     summary: Update a collection
 *     description: Updates the properties of a specific collection. Requires ownership or edit/admin permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the collection to update.
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
 *               isPublic:
 *                 type: boolean
 *               thumbnail:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       '200':
 *         description: Collection updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Collection' 
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
 *       '403':
 *         description: Forbidden - Permission denied.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Collection not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '409':
 *         description: Conflict - Collection name already exists.
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
export const updateCollection = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const collectionId = req.params.id;
    try {
        const userId = req.user!.id;
        const updateData: UpdateCollectionInput = req.body;

        if (!collectionId) throw new CollectionError("Collection ID is required.", 400);
        // Ownership/access checked by middleware/service
        const updatedCollection = await collectionService.updateCollection(collectionId, userId, updateData);
        logger.info(`Collection updated: ${collectionId} by user ${userId}`);
        res.status(200).json({ success: true, data: updatedCollection });
    } catch (error) {
        logger.error(`Error updating collection ${collectionId}:`, error);
        next(error);
    }
};

/**
 * @openapi
 * /collections/{id}:
 *   delete:
 *     tags: [Collections]
 *     summary: Delete a collection
 *     description: Soft deletes a specific collection. Only the owner can delete.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the collection to delete.
 *     responses:
 *       '204':
 *         description: Collection deleted successfully (No Content).
 *       '400':
 *         description: Bad Request - Invalid Collection ID format.
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
 *         description: Forbidden - Only the owner can delete.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Collection not found.
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
export const deleteCollection = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const collectionId = req.params.id;
    try {
        const userId = req.user!.id;
        
        if (!collectionId) throw new CollectionError("Collection ID is required.", 400);
        // Ownership checked by middleware/service
        await collectionService.deleteCollection(collectionId, userId);
        logger.info(`Collection deleted: ${collectionId} by user ${userId}`);
        res.status(204).send(); // No Content
    } catch (error) {
        logger.error(`Error deleting collection ${collectionId}:`, error);
        next(error);
    }
};

// --- Bookmarks within Collection ---

/**
 * @openapi
 * /collections/{id}/bookmarks:
 *   post:
 *     tags: [Collections, Bookmarks]
 *     summary: Add bookmark to collection
 *     description: Adds an existing bookmark to a specific collection. Requires edit permission on the collection.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the collection.
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
 *       '201':
 *         description: Bookmark added to collection successfully. Returns the relation object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/BookmarkCollection' # Define this schema
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
 *         description: Forbidden - Permission denied.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Collection or Bookmark not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '409':
 *         description: Conflict - Bookmark already in this collection.
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
export const addBookmarkToCollection = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const collectionId = req.params.id;
    try {
        const userId = req.user!.id;
        // Validate body
        const { bookmarkId }: AddBookmarkToCollectionInput = req.body;

        if (!collectionId) throw new CollectionError("Collection ID is required.", 400);
        // Ownership/edit permission checked by middleware/service
        const result = await collectionService.addBookmarkToCollection(collectionId, bookmarkId, userId);
        res.status(201).json({ success: true, data: result }); // Return the created relation
    } catch (error) {
        logger.error(`Error adding bookmark to collection ${collectionId}:`, error);
        next(error);
    }
};

/**
 * @openapi
 * /collections/{id}/bookmarks/{bookmarkId}:
 *   delete:
 *     tags: [Collections, Bookmarks]
 *     summary: Remove bookmark from collection
 *     description: Removes a bookmark from a specific collection. Requires edit permission on the collection.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the collection.
 *       - in: path
 *         name: bookmarkId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the bookmark to remove.
 *     responses:
 *       '204':
 *         description: Bookmark removed from collection successfully (No Content).
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
 *         description: Forbidden - Permission denied.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Collection, Bookmark, or association not found.
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
export const removeBookmarkFromCollection = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id: collectionId, bookmarkId } = req.params;
    try {
        const userId = req.user!.id;

        if (!collectionId || !bookmarkId) throw new CollectionError('Collection ID and Bookmark ID are required', 400);
        // Ownership/edit permission checked by middleware/service
        await collectionService.removeBookmarkFromCollection(collectionId, bookmarkId, userId);
        res.status(204).send(); // No Content
    } catch (error) {
        logger.error(`Error removing bookmark ${bookmarkId} from collection ${collectionId}:`, error);
        next(error);
    }
};

// --- Collection Collaboration ---

/**
 * @openapi
 * /collections/{id}/collaborators:
 *   post:
 *     tags: [Collections, Collaboration]
 *     summary: Add collection collaborator
 *     description: Adds another user as a collaborator to a collection owned by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the collection.
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
 *                 description: The ID of the user to add.
 *               permission:
 *                 type: string
 *                 enum: [VIEW, EDIT, ADMIN]
 *                 description: Permission level.
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
 *                   $ref: '#/components/schemas/CollectionCollaboratorWithUser' # Define this
 *       '400':
 *         description: Bad Request - Invalid input, cannot add self.
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
 *         description: Forbidden - Only owner can add collaborators.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Collection or User not found.
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
export const addCollaboratorToCollection = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const collectionId = req.params.id;
    try {
        const ownerId = req.user!.id;
        // Validate body
        const { userId: collaboratorUserId, permission }: AddCollectionCollaboratorInput = req.body;

        if (!collectionId) throw new CollectionError("Collection ID is required.", 400);
        // Ownership checked by middleware/service
        const collaborator = await collectionService.addCollaborator(collectionId, ownerId, collaboratorUserId, permission);
        logger.info(`Collaborator ${collaboratorUserId} added to collection ${collectionId} by owner ${ownerId}`);
        res.status(201).json({ success: true, data: collaborator });
    } catch (error) {
        logger.error(`Error adding collaborator to collection ${collectionId}:`, error);
        next(error);
    }
};

/**
 * @openapi
 * /collections/{id}/collaborators/{collaboratorId}:
 *   put:
 *     tags: [Collections, Collaboration]
 *     summary: Update collection collaborator permission
 *     description: Updates the permission level of an existing collaborator on a collection owned by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the collection.
 *       - in: path
 *         name: collaboratorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the collaborator.
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
 *         description: Permission updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/CollectionCollaboratorWithUser' 
 *       '400':
 *         description: Bad Request - Invalid input, cannot update owner.
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
 *         description: Forbidden - Only owner can update permissions.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Collection or Collaborator not found.
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
export const updateCollaboratorPermission = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id: collectionId, collaboratorId } = req.params;
    try {
        const ownerId = req.user!.id;
        // Validate body
        const { permission }: UpdateCollectionCollaboratorInput = req.body;

        if (!collectionId || !collaboratorId) throw new CollectionError('Collection ID and Collaborator ID are required', 400);
        // Ownership checked by middleware/service
        const updatedCollaborator = await collectionService.updateCollaboratorPermission(collectionId, ownerId, collaboratorId, permission);
        logger.info(`Collaborator ${collaboratorId} permission updated in collection ${collectionId} by owner ${ownerId}`);
        res.status(200).json({ success: true, data: updatedCollaborator });
    } catch (error) {
        logger.error(`Error updating collaborator ${collaboratorId} in collection ${collectionId}:`, error);
        next(error);
    }
};

/**
 * @openapi
 * /collections/{id}/collaborators/{collaboratorId}:
 *   delete:
 *     tags: [Collections, Collaboration]
 *     summary: Remove collection collaborator
 *     description: Removes a collaborator from a collection owned by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the collection.
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
 *         description: Forbidden - Only owner can remove collaborators.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Collection or Collaborator not found.
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
export const removeCollaboratorFromCollection = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id: collectionId, collaboratorId } = req.params;
    try {
        const ownerId = req.user!.id;

        if (!collectionId || !collaboratorId) throw new CollectionError('Collection ID and Collaborator ID are required', 400);
        // Ownership checked by middleware/service
        await collectionService.removeCollaborator(collectionId, ownerId, collaboratorId);
        logger.info(`Collaborator ${collaboratorId} removed from collection ${collectionId} by owner ${ownerId}`);
        res.status(204).send(); // No Content
    } catch (error) {
        logger.error(`Error removing collaborator ${collaboratorId} from collection ${collectionId}:`, error);
        next(error);
    }
};

// Define Collection schema components for OpenAPI references
/**
 * @openapi
 * components:
 *   schemas:
 *     Collection:
 *       type: object
 *       properties:
 *         id: { type: string, format: uuid }
 *         name: { type: string }
 *         description: { type: string, nullable: true }
 *         isPublic: { type: boolean }
 *         publicLink: { type: string, nullable: true }
 *         thumbnail: { type: string, nullable: true }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *         userId: { type: string, format: uuid }
 *         ownerId: { type: string, format: uuid }
 *         isDeleted: { type: boolean }
 *         deletedAt: { type: string, format: date-time, nullable: true }
 *     CollectionWithDetails: # Example for GET /collections list
 *       allOf:
 *         - $ref: '#/components/schemas/Collection'
 *         - type: object
 *           properties:
 *             _count:
 *               type: object
 *               properties:
 *                 bookmarks:
 *                   type: integer
 *             owner:
 *               type: object
 *               properties:
 *                 id: { type: string, format: uuid }
 *                 username: { type: string }
 *                 name: { type: string, nullable: true }
 *             collaborators:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CollectionCollaboratorWithUser'
 *     CollectionWithPaginatedBookmarks:
 *       allOf:
 *         - $ref: '#/components/schemas/Collection'
 *         - type: object
 *           properties:
 *             owner: # Same as above
 *               type: object
 *               properties:
 *                 id: { type: string, format: uuid }
 *                 username: { type: string }
 *                 name: { type: string, nullable: true }
 *                 profileImage: { type: string, nullable: true }
 *             collaborators: # Same as above
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CollectionCollaboratorWithUser'
 *             bookmarks: # Nested paginated bookmarks
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BookmarkWithRelations'
 *                 totalCount: { type: integer }
 *                 page: { type: integer }
 *                 limit: { type: integer }
 *                 hasMore: { type: boolean }
 *     BookmarkCollection: # Relation object
 *       type: object
 *       properties:
 *         collectionId: { type: string, format: uuid }
 *         bookmarkId: { type: string, format: uuid }
 *         addedAt: { type: string, format: date-time }
 *         order: { type: integer }
 *     CollectionCollaboratorWithUser:
 *       type: object
 *       properties:
 *         collectionId: { type: string, format: uuid }
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
 */
