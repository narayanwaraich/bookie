// src/routes/importExport.routes.ts
import { Router, RequestHandler } from 'express'; // Import RequestHandler
import { 
    importBookmarks, 
    exportBookmarks 
    // Removed upload import from controller
} from '../controllers/importExport.controller';
import { protect } from '../middleware/auth.middleware'; 
import rateLimit from 'express-rate-limit'; 
import multer from 'multer'; // Import multer
import path from 'path'; // Import path
import * as fs from 'fs'; // Import fs
// Import validation schemas
import { exportOptionsSchema, importRequestBodySchema } from '../models/schemas'; 
import validate from '../middleware/validation.middleware';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use an 'uploads' directory relative to the project root (adjust if needed)
    const uploadPath = path.resolve(__dirname, '../../../uploads'); // Go up from routes/src/backend
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Buffer.from(file.originalname, 'latin1').toString('utf8')}`); // Handle potential encoding issues
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['text/html', 'application/json', 'text/csv', 'application/x-chrome-bookmarks'];
     // Add check for specific file extensions if needed, e.g., .html, .json, .csv
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Please upload HTML, JSON, or CSV.'));
    }
  }
});


// Apply rate limiting (optional, adjust limits as needed)
const importExportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit import/export requests more strictly
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many import/export requests from this IP, please try again after 15 minutes',
});

// Apply limiter to all routes in this file
router.use(importExportLimiter);
// Note: Authentication (protect middleware) is applied in src/routes/index.ts

// Import route - handles HTML, JSON, CSV via multer and service logic
router.post(
    '/import', 
    upload.single('file'), // Use multer to handle file upload first
    validate(importRequestBodySchema), // Then validate the rest of the body (e.g., folderId)
    importBookmarks as RequestHandler // Controller handles format detection and calls service
);

// Export route - handles HTML, JSON, CSV formats via query parameter
router.get(
    '/export',
    validate(exportOptionsSchema),
    exportBookmarks as RequestHandler // Controller handles format and calls service
);

export default router;
