// src/controllers/bookmark.controller.ts
import { Response, NextFunction } from 'express'; 
import * as bookmarkService from '../services/bookmark.service'; 
import { z } from 'zod'; // Import z from zod
import { 
    CreateBookmarkInput, 
    UpdateBookmarkInput, 
    BookmarkSearchInput, 
    BulkActionInput, 
    bookmarkSearchSchema,
    addTagToBookmarkBodySchema, 
    getRecentBookmarksQuerySchema, 
    getPopularBookmarksQuerySchema,
    checkUrlExistsQuerySchema 
} from '../models/schemas';
import { AuthenticatedRequest } from '../types/express/index'; 
import logger from '../config/logger';
import validate from '../middleware/validation.middleware'; 
import { BookmarkError } from '../services/bookmark.service'; 

/**
 * @openapi
 * /bookmarks:
 *   post:
 *     tags: [Bookmarks]
 *     summary: Create a new bookmark
 *     description: Adds a new bookmark for the authenticated user, optionally fetching metadata and adding to folders/tags.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [url]
 *             properties:
 *               url:
 *                 type: string
 *                 format: url
 *                 description: The URL of the bookmark.
 *               title:
 *                 type: string
 *                 description: Optional title (if not provided, fetched from URL metadata).
 *               description:
 *                 type: string
 *                 description: Optional description (if not provided, fetched from URL metadata).
 *               notes:
 *                 type: string
 *                 description: User's notes for the bookmark.
 *               folderId:
 *                 type: string
 *                 format: uuid
 *                 description: Optional ID of the folder to add the bookmark to.
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: Optional array of Tag IDs to associate with the bookmark.
 *     responses:
 *       '201':
 *         description: Bookmark created successfully.
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
 *                 bookmark:
 *                   $ref: '#/components/schemas/BookmarkWithRelations' # Assuming a schema for bookmark with folders/tags
 *       '400':
 *         description: Bad Request - Invalid input data (e.g., URL format).
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
 *         description: Not Found - Specified folder or tag not found or not owned by user.
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
export const createBookmark = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id; 
    const bookmarkData: CreateBookmarkInput = req.body; 
    
    const newBookmark = await bookmarkService.createBookmark(userId, bookmarkData);
    
    res.status(201).json({
      success: true,
      message: 'Bookmark created successfully',
      bookmark: newBookmark 
    });
  } catch (error) {
     logger.error('Error in createBookmark controller:', error); 
     next(error); 
  }
};

/**
 * @openapi
 * /bookmarks/{id}:
 *   get:
 *     tags: [Bookmarks]
 *     summary: Get a bookmark by ID
 *     description: Retrieves details for a specific bookmark, checking ownership or collaboration access. Increments visit count.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the bookmark to retrieve.
 *     responses:
 *       '200':
 *         description: Bookmark details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 bookmark:
 *                   $ref: '#/components/schemas/BookmarkWithRelations' 
 *       '400':
 *         description: Bad Request - Invalid Bookmark ID format.
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
 *         description: Forbidden - User does not have permission to view this bookmark.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Bookmark not found.
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
export const getBookmark = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const bookmarkId = req.params.id; 
  try {
    const userId = req.user!.id; 

    if (!bookmarkId) throw new BookmarkError("Bookmark ID is required.", 400);

    const bookmark = await bookmarkService.getBookmarkById(bookmarkId, userId);
    
    res.status(200).json({
      success: true,
      bookmark
    });
  } catch (error) {
     logger.error(`Error in getBookmark controller for ID ${bookmarkId}:`, error); 
     next(error);
  }
};

/**
 * @openapi
 * /bookmarks/{id}:
 *   put:
 *     tags: [Bookmarks]
 *     summary: Update a bookmark
 *     description: Updates the title, description, or notes of a specific bookmark. Checks ownership or edit permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the bookmark to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Bookmark updated successfully.
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
 *                 bookmark:
 *                   $ref: '#/components/schemas/BookmarkWithRelations' 
 *       '400':
 *         description: Bad Request - Invalid Bookmark ID format or invalid input data.
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
 *         description: Forbidden - User does not have permission to edit this bookmark.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Bookmark not found.
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
export const updateBookmark = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const bookmarkId = req.params.id;
  try {
    const userId = req.user!.id; 
    const updateData: UpdateBookmarkInput = req.body; 

     if (!bookmarkId) throw new BookmarkError("Bookmark ID is required.", 400);

    const updatedBookmark = await bookmarkService.updateBookmark(bookmarkId, userId, updateData);

    res.status(200).json({
      success: true,
      message: 'Bookmark updated successfully',
      bookmark: updatedBookmark
    });
  } catch (error) {
     logger.error(`Error in updateBookmark controller for ID ${bookmarkId}:`, error); 
     next(error);
  }
};

/**
 * @openapi
 * /bookmarks/{id}:
 *   delete:
 *     tags: [Bookmarks]
 *     summary: Delete a bookmark
 *     description: Soft deletes a specific bookmark. Checks ownership or admin permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the bookmark to delete.
 *     responses:
 *       '204':
 *         description: Bookmark deleted successfully (No Content).
 *       '400':
 *         description: Bad Request - Invalid Bookmark ID format.
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
 *         description: Forbidden - User does not have permission to delete this bookmark.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Bookmark not found.
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
export const deleteBookmark = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const bookmarkId = req.params.id;
  try {
    const userId = req.user!.id; 

     if (!bookmarkId) throw new BookmarkError("Bookmark ID is required.", 400);

    await bookmarkService.deleteBookmark(bookmarkId, userId);

    res.status(204).send(); 
  } catch (error) {
     logger.error(`Error in deleteBookmark controller for ID ${bookmarkId}:`, error); 
     next(error);
  }
};

/**
 * @openapi
 * /bookmarks/search:
 *   get:
 *     tags: [Bookmarks]
 *     summary: Search bookmarks
 *     description: Searches bookmarks based on a query string (full-text search) or filters by folder/tags. Supports pagination and sorting.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search term for full-text search across title, description, notes, url.
 *       - in: query
 *         name: folderId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter bookmarks belonging to a specific folder.
 *       - in: query
 *         name: tagIds
 *         style: form
 *         explode: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *         description: Filter bookmarks having ALL of the specified tag IDs.
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
 *           enum: [createdAt, updatedAt, lastVisited, visitCount, title]
 *           default: createdAt
 *         description: Field to sort by. If 'query' is present, defaults to relevance rank first.
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order.
 *     responses:
 *       '200':
 *         description: Search results retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 bookmarks:
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
export const searchBookmarks = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id; 
    // Validate query parameters using the Zod schema
    const validatedQueryParams = bookmarkSearchSchema.parse(req.query);
    const searchParams: BookmarkSearchInput = validatedQueryParams;

    const results = await bookmarkService.searchBookmarks(userId, searchParams);

    res.status(200).json({
      success: true,
      ...results // Spread the results object { bookmarks, totalCount, page, limit, hasMore }
    });
  } catch (error) {
     if (error instanceof z.ZodError) { 
        logger.error('Search query validation error:', error.errors);
     } else {
        logger.error('Error in searchBookmarks controller:', error);
     }
     next(error);
  }
};

/**
 * @openapi
 * /bookmarks/check-url:
 *   get:
 *     tags: [Bookmarks]
 *     summary: Check if URL exists
 *     description: Checks if a bookmark with the given URL already exists for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *           format: url
 *         description: The URL to check.
 *     responses:
 *       '200':
 *         description: Check completed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 exists:
 *                   type: boolean
 *                   description: Whether a bookmark with this URL exists for the user.
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   nullable: true
 *                   description: The ID of the existing bookmark, if it exists.
 *       '400':
 *         description: Bad Request - Invalid URL format.
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
export const checkBookmarkUrlExists = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        // Validate the 'url' query parameter
        const { url } = checkUrlExistsQuerySchema.parse(req.query);
        
        logger.debug(`Checking existence for URL: ${url} for user ${userId}`);
        const result = await bookmarkService.checkBookmarkUrlExists(userId, url);
        
        res.status(200).json({ success: true, ...result }); // { exists: boolean, id: string | null }
    } catch (error) {
        if (error instanceof z.ZodError) { 
            logger.error('Check URL query validation error:', error.errors);
        } else {
            logger.error('Error in checkBookmarkUrlExists controller:', error);
        }
        next(error);
    }
};


// --- Relationship Management ---

/**
 * @openapi
 * /bookmarks/{bookmarkId}/tags:
 *   post:
 *     tags: [Bookmarks, Tags]
 *     summary: Add tag to bookmark
 *     description: Associates an existing tag with a specific bookmark. Checks ownership/edit permission for the bookmark and ownership of the tag.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookmarkId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the bookmark.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tagId]
 *             properties:
 *               tagId:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the tag to add.
 *     responses:
 *       '200':
 *         description: Tag added successfully.
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
 *         description: Forbidden - Permission denied to modify bookmark.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Bookmark or Tag not found / not owned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '409':
 *         description: Conflict - Tag already applied to this bookmark.
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
export const addTagToBookmark = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const bookmarkId = req.params.bookmarkId; 
  try {
    const userId = req.user!.id; 
    // Validate body using Zod schema
    const { tagId } = addTagToBookmarkBodySchema.parse(req.body); 

    if (!bookmarkId) throw new BookmarkError("Bookmark ID is required in route parameters.", 400);

    await bookmarkService.addTagToBookmark(userId, bookmarkId, tagId);

    res.status(200).json({
      success: true,
      message: `Tag ${tagId} added to bookmark ${bookmarkId} successfully`
    });
  } catch (error) {
     logger.error(`Error adding tag to bookmark ${bookmarkId}:`, error);
     next(error);
  }
};

/**
 * @openapi
 * /bookmarks/{bookmarkId}/tags/{tagId}:
 *   delete:
 *     tags: [Bookmarks, Tags]
 *     summary: Remove tag from bookmark
 *     description: Disassociates a tag from a specific bookmark. Checks ownership/edit permission for the bookmark and ownership of the tag.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookmarkId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the bookmark.
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the tag to remove.
 *     responses:
 *       '200':
 *         description: Tag removed successfully.
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
 *         description: Forbidden - Permission denied to modify bookmark.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Bookmark, Tag, or association not found.
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
export const removeTagFromBookmark = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { bookmarkId, tagId } = req.params; 
  try {
    const userId = req.user!.id; 

    if (!bookmarkId || !tagId) {
        throw new BookmarkError('Bookmark ID and Tag ID are required in route parameters', 400);
    }

    await bookmarkService.removeTagFromBookmark(userId, bookmarkId, tagId);

    res.status(200).json({ // Send 200 OK with message
      success: true,
      message: `Tag ${tagId} removed from bookmark ${bookmarkId} successfully`
    });
  } catch (error) {
     logger.error(`Error removing tag ${tagId} from bookmark ${bookmarkId}:`, error);
     next(error);
  }
};

// --- Other Actions ---

/**
 * @openapi
 * /bookmarks/recent:
 *   get:
 *     tags: [Bookmarks]
 *     summary: Get recent bookmarks
 *     description: Retrieves a list of the most recently created bookmarks for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of results to return.
 *     responses:
 *       '200':
 *         description: Recent bookmarks retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 bookmarks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BookmarkWithRelations' 
 *       '400':
 *         description: Bad Request - Invalid limit parameter.
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
export const getRecentBookmarks = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id; 
    const { limit } = getRecentBookmarksQuerySchema.parse(req.query);
    const bookmarks = await bookmarkService.getRecentBookmarks(userId, limit); 
    res.status(200).json({ success: true, bookmarks });
  } catch (error) {
     if (error instanceof z.ZodError) { 
        logger.error('Recent bookmarks query validation error:', error.errors);
     } else {
        logger.error('Error in getRecentBookmarks controller:', error);
     }
     next(error);
  }
};

/**
 * @openapi
 * /bookmarks/popular:
 *   get:
 *     tags: [Bookmarks]
 *     summary: Get popular bookmarks
 *     description: Retrieves a list of the most visited bookmarks for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of results to return.
 *     responses:
 *       '200':
 *         description: Popular bookmarks retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 bookmarks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BookmarkWithRelations' 
 *       '400':
 *         description: Bad Request - Invalid limit parameter.
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
export const getPopularBookmarks = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id; 
    const { limit } = getPopularBookmarksQuerySchema.parse(req.query);
     const bookmarks = await bookmarkService.getPopularBookmarks(userId, limit);
    res.status(200).json({ success: true, bookmarks });
  } catch (error) {
     if (error instanceof z.ZodError) { 
        logger.error('Popular bookmarks query validation error:', error.errors);
     } else {
        logger.error('Error in getPopularBookmarks controller:', error);
     }
     next(error);
  }
};

/**
 * @openapi
 * /bookmarks/bulk:
 *   post:
 *     tags: [Bookmarks]
 *     summary: Perform bulk actions on bookmarks
 *     description: Allows deleting, moving between folders, adding/removing tags, or adding/removing from collections for multiple bookmarks at once.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [action, bookmarkIds]
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [delete, addToFolder, removeFromFolder, addTag, removeTag, addToCollection, removeFromCollection]
 *               bookmarkIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 minItems: 1
 *               targetFolderId:
 *                 type: string
 *                 format: uuid
 *                 description: Required for 'addToFolder', 'removeFromFolder'.
 *               tagId:
 *                 type: string
 *                 format: uuid
 *                 description: Required for 'addTag', 'removeTag'.
 *               targetCollectionId:
 *                 type: string
 *                 format: uuid
 *                 description: Required for 'addToCollection', 'removeFromCollection'.
 *     responses:
 *       '200':
 *         description: Bulk action completed successfully.
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
 *                   example: Bulk action 'delete' completed successfully. Affected items: 5
 *       '400':
 *         description: Bad Request - Invalid input data (e.g., missing target ID for relevant action).
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
 *         description: Forbidden - Access denied to one or more bookmarks.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Target folder, tag, or collection not found or permission denied.
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
export const performBulkAction = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id; 
    const bulkActionData: BulkActionInput = req.body; 
    const result = await bookmarkService.performBulkAction(userId, bulkActionData);
    res.status(200).json(result); 
  } catch (error) {
     logger.error('Error in performBulkAction controller:', error);
     next(error);
  }
};

// Define BookmarkWithRelations schema component for OpenAPI references
/**
 * @openapi
 * components:
 *   schemas:
 *     Bookmark:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         url:
 *           type: string
 *           format: url
 *         title:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         favicon:
 *           type: string
 *           nullable: true
 *         previewImage:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         lastVisited:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         visitCount:
 *           type: integer
 *         notes:
 *           type: string
 *           nullable: true
 *         userId:
 *           type: string
 *           format: uuid
 *         isDeleted:
 *           type: boolean
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     BookmarkWithRelations:
 *       allOf:
 *         - $ref: '#/components/schemas/Bookmark'
 *         - type: object
 *           properties:
 *             tags:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tag:
 *                     $ref: '#/components/schemas/TagInfo' # Assuming a TagInfo schema exists
 *             folders:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   folder:
 *                     $ref: '#/components/schemas/FolderInfo' # Assuming a FolderInfo schema exists
 *             collections:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   collection:
 *                     $ref: '#/components/schemas/CollectionInfo' # Assuming a CollectionInfo schema exists
 *     # Define simplified info schemas used in relations
 *     TagInfo:
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
 *     FolderInfo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         icon:
 *           type: string
 *           nullable: true
 *         color:
 *           type: string
 *           nullable: true
 *     CollectionInfo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         isPublic:
 *           type: boolean
 */
