import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express/index';
import * as syncService from '../services/sync.service';
import logger from '../config/logger';
import { z } from 'zod'; // Import z from zod
import { SyncRequestBodyInput, syncRequestBodySchema } from '../models/schemas'; // Import schema and type
import validate from '../middleware/validation.middleware'; // Import validation middleware (though applied in routes)

/**
 * @openapi
 * /sync:
 *   post:
 *     tags: [Sync]
 *     summary: Synchronize client data with server
 *     description: |
 *       Handles two-way synchronization between a client and the server.
 *       The client sends its changes (creations, updates, deletions) since the last sync timestamp.
 *       The server processes these changes, resolves conflicts (currently using last-write-wins based on client's `lastServerUpdatedAt`), 
 *       and returns changes made on the server since the client's last sync, lists of deleted item IDs, any conflicts encountered, and a new sync timestamp.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SyncRequestBody' # Reference the main sync body schema
 *     responses:
 *       '200':
 *         description: Sync completed successfully. May include server changes, deletions, and conflicts.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SyncResponse' # Reference the sync response schema
 *       '400':
 *         description: Bad Request - Invalid request body structure or data types.
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
 *         description: Internal Server Error - Sync process failed partially or completely. The response body might still contain partial sync results or an error message.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SyncResponse' # Even errors might use this structure
 */
export const handleSync = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user!.id; // Guaranteed by protect middleware
    try {
        // Request body is validated by middleware using syncRequestBodySchema
        const { lastSyncTimestamp, clientChanges }: SyncRequestBodyInput = req.body; 

        // Log counts for received changes
        const bookmarkCount = clientChanges.bookmarks?.length || 0;
        const folderCount = clientChanges.folders?.length || 0;
        const tagCount = clientChanges.tags?.length || 0;
        const collectionCount = clientChanges.collections?.length || 0;
        logger.info(`[Sync Controller]: Received sync request from user ${userId}, last sync: ${lastSyncTimestamp || 'Never'}. Client changes - Bookmarks: ${bookmarkCount}, Folders: ${folderCount}, Tags: ${tagCount}, Collections: ${collectionCount}`);
        
        // Pass the full clientChangesPayload to the service
        const syncResult = await syncService.syncData(userId, lastSyncTimestamp, clientChanges); 

        if (!syncResult.success) {
            // Handle potential service-level errors gracefully (e.g., partial failure)
            // The service layer logs the specific internal error.
            logger.warn(`[Sync Controller]: Sync service reported failure for user ${userId}. Message: ${syncResult.message}`);
            // Return 500 for server-side sync issues, but include the result payload
            return res.status(500).json(syncResult); 
        }

        logger.info(`[Sync Controller]: Sync completed successfully for user ${userId}. Sending response.`);
        res.status(200).json(syncResult);

    } catch (error) {
         // Log Zod validation errors specifically if they occur
         if (error instanceof z.ZodError) { 
            logger.error(`[Sync Controller] Sync request body validation error for user ${userId}:`, error.errors);
         } else {
            logger.error(`[Sync Controller]: Unhandled error during sync for user ${userId}:`, error); 
         }
        next(error); // Pass error to central error handler
    }
};

// Define Sync schema components for OpenAPI references
/**
 * @openapi
 * components:
 *   schemas:
 *     ClientBookmarkChange:
 *       type: object
 *       properties:
 *         id: { type: string, format: uuid }
 *         url: { type: string, format: url }
 *         title: { type: string }
 *         description: { type: string, nullable: true }
 *         notes: { type: string, nullable: true }
 *         updatedAt: { type: string, format: date-time, description: "Client's timestamp for the change" }
 *         lastServerUpdatedAt: { type: string, format: date-time, nullable: true, description: "Timestamp of the server version this change is based on (for conflict detection)" }
 *         isDeleted: { type: boolean, description: "Flag indicating deletion" }
 *         folderIds: { type: array, items: { type: string, format: uuid }, description: "Full list of folder IDs this bookmark belongs to" }
 *         tagIds: { type: array, items: { type: string, format: uuid }, description: "Full list of tag IDs for this bookmark" }
 *     ClientFolderChange:
 *       type: object
 *       properties:
 *         id: { type: string, format: uuid }
 *         name: { type: string }
 *         description: { type: string, nullable: true }
 *         icon: { type: string, nullable: true }
 *         color: { type: string, nullable: true }
 *         parentId: { type: string, format: uuid, nullable: true }
 *         updatedAt: { type: string, format: date-time }
 *         lastServerUpdatedAt: { type: string, format: date-time, nullable: true }
 *         isDeleted: { type: boolean }
 *     ClientTagChange:
 *       type: object
 *       properties:
 *         id: { type: string, format: uuid }
 *         name: { type: string }
 *         color: { type: string, nullable: true }
 *         updatedAt: { type: string, format: date-time }
 *         lastServerUpdatedAt: { type: string, format: date-time, nullable: true }
 *         isDeleted: { type: boolean }
 *     ClientCollectionChange:
 *       type: object
 *       properties:
 *         id: { type: string, format: uuid }
 *         name: { type: string }
 *         description: { type: string, nullable: true }
 *         isPublic: { type: boolean }
 *         thumbnail: { type: string, nullable: true }
 *         updatedAt: { type: string, format: date-time }
 *         lastServerUpdatedAt: { type: string, format: date-time, nullable: true }
 *         isDeleted: { type: boolean }
 *     ClientChangesPayload:
 *       type: object
 *       properties:
 *         bookmarks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ClientBookmarkChange'
 *         folders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ClientFolderChange'
 *         tags:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ClientTagChange'
 *         collections:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ClientCollectionChange'
 *     SyncRequestBody:
 *       type: object
 *       properties:
 *         lastSyncTimestamp:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: ISO 8601 timestamp of the last successful sync (null for first sync).
 *         clientChanges:
 *           $ref: '#/components/schemas/ClientChangesPayload'
 *     SyncServerChange: # Generic structure for items in serverChanges array
 *       type: object
 *       properties:
 *         type: 
 *           type: string
 *           enum: [bookmark, folder, tag, collection]
 *         # ... properties from Bookmark, Folder, Tag, or Collection schemas
 *     SyncDeletedIds:
 *       type: object
 *       properties:
 *         bookmarks: { type: array, items: { type: string, format: uuid } }
 *         folders: { type: array, items: { type: string, format: uuid } }
 *         tags: { type: array, items: { type: string, format: uuid } }
 *         collections: { type: array, items: { type: string, format: uuid } }
 *     SyncConflict:
 *       type: object
 *       properties:
 *         type: { type: string, enum: [bookmark, folder, tag, collection] }
 *         clientChange: { $ref: '#/components/schemas/AnyClientChange' } # Define AnyClientChange if needed or list specific types
 *         serverRecord: { $ref: '#/components/schemas/AnyServerRecord' } # Define AnyServerRecord if needed or list specific types
 *     SyncResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         serverChanges:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SyncServerChange'
 *         deletedIds:
 *           $ref: '#/components/schemas/SyncDeletedIds'
 *         conflicts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SyncConflict'
 *         newSyncTimestamp:
 *           type: string
 *           format: date-time
 *         message:
 *           type: string
 *           description: Optional message, especially on failure.
 *     # Define AnyClientChange and AnyServerRecord (or use oneOf) if needed for precise conflict schema
 *     AnyClientChange:
 *       oneOf:
 *         - $ref: '#/components/schemas/ClientBookmarkChange'
 *         - $ref: '#/components/schemas/ClientFolderChange'
 *         - $ref: '#/components/schemas/ClientTagChange'
 *         - $ref: '#/components/schemas/ClientCollectionChange'
 *     AnyServerRecord:
 *       oneOf:
 *         - $ref: '#/components/schemas/Bookmark'
 *         - $ref: '#/components/schemas/Folder'
 *         - $ref: '#/components/schemas/Tag'
 *         - $ref: '#/components/schemas/Collection'
 */
