// src/controllers/importExport.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as importExportService from '../services/importExport.service'; // Import the service
import { AuthenticatedRequest } from '../types/express/index';
import logger from '../config/logger';
import { z } from 'zod'; // Import z from zod
import {
  ImportOptionsInput,
  ExportOptionsInput,
  exportOptionsSchema,
} from '../models/schemas';
import * as fs from 'fs'; // Import fs for file deletion on error
import validate from '../middleware/validation.middleware';
import { ImportExportError } from '../services/importExport.service'; // Import custom error if defined

// --- Import Controller ---

/**
 * @openapi
 * /import-export/import:
 *   post:
 *     tags: [Import/Export]
 *     summary: Import bookmarks from file
 *     description: Imports bookmarks from an uploaded file (HTML, JSON, or CSV). The file should be sent as multipart/form-data. Optionally specify a target folder ID.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The bookmark file (HTML, JSON, CSV).
 *               folderId:
 *                 type: string
 *                 format: uuid
 *                 description: Optional ID of the folder to import bookmarks into.
 *     responses:
 *       '200':
 *         description: Import successful. Returns statistics about the import.
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
 *                 stats:
 *                   type: object
 *                   properties:
 *                     imported:
 *                       type: integer
 *                     skipped:
 *                       type: integer
 *                     failed:
 *                       type: integer
 *       '400':
 *         description: Bad Request - No file uploaded, unsupported file type, invalid folderId, or error parsing file.
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
 *         description: Not Found - Target folder not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal Server Error during import process.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const importBookmarks = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const file = req.file;
  const userId = req.user!.id;
  // folderId validation should be handled by middleware using importRequestBodySchema
  const { folderId } = req.body;

  if (!file) {
    return res
      .status(400)
      .json({ success: false, message: 'No file uploaded' });
  }

  const filePath = file.path;
  let importData: any;
  let format: 'json' | 'html' | 'csv';

  try {
    logger.info(
      `[Import Controller] Processing uploaded file: ${file.originalname}, mimetype: ${file.mimetype}, path: ${filePath}`
    );
    if (
      file.mimetype === 'application/json' ||
      file.mimetype === 'application/x-chrome-bookmarks'
    ) {
      format = 'json';
      const jsonContent = fs.readFileSync(filePath, 'utf-8');
      importData = JSON.parse(jsonContent);
    } else if (file.mimetype === 'text/html') {
      format = 'html';
      importData = fs.readFileSync(filePath, 'utf-8');
    } else if (file.mimetype === 'text/csv') {
      format = 'csv';
      importData = fs.readFileSync(filePath, 'utf-8');
    } else {
      logger.error(
        `[Import Controller] Unsupported file type passed filter: ${file.mimetype}`
      );
      throw new ImportExportError('Unsupported file type.', 400);
    }

    const options: ImportOptionsInput = { format, folderId };

    const result = await importExportService.importBookmarks(
      userId,
      importData,
      options
    );
    logger.info(
      `[Import Controller] Import successful for user ${userId}. Stats: ${JSON.stringify(
        result.stats
      )}`
    );

    fs.unlink(filePath, (err) => {
      if (err)
        logger.error(
          `[Import Controller]: Failed to delete uploaded file ${filePath}:`,
          err
        );
      else
        logger.info(
          `[Import Controller]: Deleted uploaded file ${filePath}`
        );
    });

    res.status(200).json(result);
  } catch (error) {
    logger.error(
      '[Import Controller]: Error importing bookmarks:',
      error
    );
    if (filePath) {
      fs.unlink(filePath, (err) => {
        if (err)
          logger.error(
            `[Import Controller]: Failed to delete uploaded file ${filePath} after error:`,
            err
          );
        else
          logger.info(
            `[Import Controller]: Deleted uploaded file ${filePath} after error.`
          );
      });
    }
    next(error);
  }
};

// --- Export Controller ---

/**
 * @openapi
 * /import-export/export:
 *   get:
 *     tags: [Import/Export]
 *     summary: Export bookmarks
 *     description: Exports bookmarks for the authenticated user in the specified format (JSON, HTML, or CSV). Can optionally filter by folder.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         required: true
 *         schema:
 *           type: string
 *           enum: [html, csv, json]
 *         description: The desired export format.
 *       - in: query
 *         name: folderId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Optional ID of a folder to export bookmarks from (including subfolders if specified). If omitted, exports all bookmarks.
 *       - in: query
 *         name: includeSubfolders
 *         schema:
 *           type: boolean
 *           default: false
 *         description: If folderId is provided, whether to include bookmarks from its subfolders.
 *     responses:
 *       '200':
 *         description: Export successful. Returns the file content.
 *         content:
 *           application/json:
 *             schema: { type: string, format: binary }
 *             encoding: { contentType: 'application/json' }
 *           text/html:
 *             schema: { type: string, format: binary }
 *             encoding: { contentType: 'text/html' }
 *           text/csv:
 *             schema: { type: string, format: binary }
 *             encoding: { contentType: 'text/csv' }
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
 *       '404':
 *         description: Not Found - Specified folder not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal Server Error during export process.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const exportBookmarks = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user!.id;
  try {
    // Validate query parameters using Zod schema
    const validatedQueryParams = exportOptionsSchema.parse(req.query);
    const options: ExportOptionsInput = validatedQueryParams;
    logger.info(
      `[Export Controller] User ${userId} requested export with options: ${JSON.stringify(
        options
      )}`
    );

    // Call the service function
    const result = await importExportService.exportBookmarks(
      userId,
      options
    );

    // Add check to ensure result is defined before proceeding
    if (!result) {
      // This case might indicate an internal error in the service not throwing properly
      logger.error(
        `[Export Controller] Export service returned undefined result for user ${userId}`
      );
      throw new ImportExportError(
        'Export failed due to an unexpected server issue.',
        500
      );
    }

    // Set headers and send response for file download
    res.setHeader('Content-Type', result.contentType);
    if (result.filename) {
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${result.filename}"`
      );
      logger.info(
        `[Export Controller] Sending file ${result.filename} with type ${result.contentType}`
      );
    } else {
      logger.info(
        `[Export Controller] Sending data with type ${result.contentType}`
      );
    }
    res.status(200).send(result.data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Check if error is a ZodError
      logger.error('Export query validation error:', error.errors);
    } else {
      logger.error(
        `[Export Controller] Error exporting bookmarks for user ${userId}:`,
        error
      );
    }
    next(error); // Pass error to central handler
  }
};
