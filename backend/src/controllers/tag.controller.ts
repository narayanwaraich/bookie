// src/controllers/tag.controller.ts
import { Response, NextFunction } from 'express';
import * as tagService from '../services/tag.service'; // Import the service
import { z } from 'zod'; // Import Zod
import { 
    CreateTagInput, 
    UpdateTagInput, 
    getTagsQuerySchema, // Import query schema for listing tags
    getBookmarksByTagQuerySchema // Import query schema for bookmarks by tag
} from '../models/schemas';
import { AuthenticatedRequest } from '../types/express/index';
import logger from '../config/logger';
import { TagError } from '../services/tag.service'; // Import custom error if defined

/**
 * @openapi
 * /tags:
 *   get:
 *     tags: [Tags]
 *     summary: Get user tags
 *     description: Retrieves a paginated and sorted list of tags created by the authenticated user.
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
 *         description: Tags retrieved successfully.
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
 *                     $ref: '#/components/schemas/TagWithCount' # Assuming schema includes bookmark count
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
export const getAllTags = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user!.id; 
    try {
        // Validate query parameters
        const queryParams = getTagsQuerySchema.parse(req.query);
        const result = await tagService.getAllUserTags(userId, queryParams);
        res.status(200).json({ success: true, ...result }); // Spread results (data, totalCount, etc.)
    } catch (error) {
         if (error instanceof z.ZodError) { 
            logger.error('Get tags query validation error:', error.errors);
         } else {
            logger.error(`Error fetching tags for user ${userId}:`, error);
         }
        next(error);
    }
};
  
/**
 * @openapi
 * /tags/{tagId}:
 *   get:
 *     tags: [Tags]
 *     summary: Get tag by ID
 *     description: Retrieves details for a specific tag owned by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the tag to retrieve.
 *     responses:
 *       '200':
 *         description: Tag details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/TagWithCount' 
 *       '400':
 *         description: Bad Request - Invalid Tag ID format.
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
 *         description: Not Found - Tag not found or not owned by user.
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
export const getTagById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const tagId = req.params.tagId;
    try {
        const userId = req.user!.id; 
        
        if (!tagId) throw new TagError("Tag ID is required.", 400); 
        // Ownership checked by middleware/service
        const tag = await tagService.getTagById(tagId, userId);
        res.status(200).json({ success: true, data: tag });
    } catch (error) {
        logger.error(`Error fetching tag ${tagId}:`, error);
        next(error);
    }
};
  
/**
 * @openapi
 * /tags:
 *   post:
 *     tags: [Tags]
 *     summary: Create a new tag
 *     description: Creates a new tag for the authenticated user.
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
 *                 description: Name of the new tag (must be unique for the user).
 *               color:
 *                 type: string
 *                 nullable: true
 *                 description: Optional color code (e.g., hex).
 *     responses:
 *       '201':
 *         description: Tag created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Tag' # Assuming a Tag schema exists
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
 *         description: Conflict - Tag with the same name already exists.
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
export const createTag = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id; 
        const tagData: CreateTagInput = req.body;
        const newTag = await tagService.createTag(userId, tagData);
        logger.info(`Tag created: ${newTag.id} by user ${userId}`);
        res.status(201).json({ success: true, data: newTag });
    } catch (error) {
        logger.error('Error creating tag:', error);
        next(error);
    }
};
  
/**
 * @openapi
 * /tags/{tagId}:
 *   put:
 *     tags: [Tags]
 *     summary: Update a tag
 *     description: Updates the name or color of a specific tag owned by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the tag to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name for the tag (must be unique).
 *               color:
 *                 type: string
 *                 nullable: true
 *                 description: New color code.
 *     responses:
 *       '200':
 *         description: Tag updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Tag' 
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
 *         description: Not Found - Tag not found or not owned by user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '409':
 *         description: Conflict - Another tag with the same name already exists.
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
export const updateTag = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const tagId = req.params.tagId;
    try {
        const userId = req.user!.id; 
        const updateData: UpdateTagInput = req.body;

        if (!tagId) throw new TagError("Tag ID is required.", 400); 
        // Ownership checked by middleware/service
        const updatedTag = await tagService.updateTag(tagId, userId, updateData);
        logger.info(`Tag updated: ${tagId} by user ${userId}`);
        res.status(200).json({ success: true, data: updatedTag });
    } catch (error) {
        logger.error(`Error updating tag ${tagId}:`, error);
        next(error);
    }
};
  
/**
 * @openapi
 * /tags/{tagId}:
 *   delete:
 *     tags: [Tags]
 *     summary: Delete a tag
 *     description: Soft deletes a specific tag owned by the authenticated user. Bookmarks associated with this tag will lose the association.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the tag to delete.
 *     responses:
 *       '204':
 *         description: Tag deleted successfully (No Content).
 *       '400':
 *         description: Bad Request - Invalid Tag ID format.
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
 *         description: Not Found - Tag not found or not owned by user.
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
export const deleteTag = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const tagId = req.params.tagId;
    try {
        const userId = req.user!.id; 
        
        if (!tagId) throw new TagError("Tag ID is required.", 400); 
        // Ownership checked by middleware/service
        await tagService.deleteTag(tagId, userId);
        logger.info(`Tag deleted: ${tagId} by user ${userId}`);
        res.status(204).send(); // No Content
    } catch (error) {
        logger.error(`Error deleting tag ${tagId}:`, error);
        next(error);
    }
};
  
/**
 * @openapi
 * /tags/{tagId}/bookmarks:
 *   get:
 *     tags: [Tags, Bookmarks]
 *     summary: Get bookmarks by tag
 *     description: Retrieves a paginated and sorted list of bookmarks associated with a specific tag owned by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the tag.
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
 *                 data: 
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
 *         description: Bad Request - Invalid Tag ID or query parameters.
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
 *         description: Not Found - Tag not found or not owned by user.
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
export const getBookmarksByTag = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const tagId = req.params.tagId;
    try {
        const userId = req.user!.id; 
        
        if (!tagId) throw new TagError("Tag ID is required.", 400); 
        // Validate query parameters for pagination/sorting
        const queryParams = getBookmarksByTagQuerySchema.parse(req.query);

        // Ownership checked by middleware before calling service
        const result = await tagService.getBookmarksByTag(tagId, userId, queryParams);
        res.status(200).json({ success: true, ...result }); // Spread results (data, totalCount, etc.)
    } catch (error) {
         if (error instanceof z.ZodError) { 
            logger.error(`Get bookmarks by tag query validation error for tag ${tagId}:`, error.errors);
         } else {
            logger.error(`Error fetching bookmarks by tag ${tagId}:`, error);
         }
        next(error);
    }
};
  
// Note: Assign/Remove/Bulk tag operations are handled via bookmark controller/service for now

// Define Tag schema component for OpenAPI references
/**
 * @openapi
 * components:
 *   schemas:
 *     Tag:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
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
 *         isDeleted:
 *           type: boolean
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     TagWithCount:
 *       allOf:
 *         - $ref: '#/components/schemas/Tag'
 *         - type: object
 *           properties:
 *             bookmarkCount:
 *               type: integer
 *               description: Number of bookmarks associated with this tag.
 */
