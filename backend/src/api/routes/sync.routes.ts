import { Router, RequestHandler } from 'express';
import { handleSync } from '../controllers/sync.controller';
import { protect } from '../middleware/auth.middleware';
import validate from '../middleware/validation.middleware'; // Import validation middleware
import { syncRequestBodySchema } from '../models/schemas'; // Import schema

const router = Router();

// Note: Authentication (protect middleware) is applied in src/routes/index.ts

// POST /api/sync - Handle synchronization requests
// Validates the request body structure (lastSyncTimestamp, clientChanges object)
router.post(
  '/',
  validate(syncRequestBodySchema), // Apply validation middleware
  handleSync as RequestHandler
);

export default router;
