"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/importExport.routes.ts
const express_1 = require("express");
const importExport_controller_1 = require("../controllers/importExport.controller");
// Removed incorrect import: import { apiLimiter } from '../config/rateLimiter';
const auth_middleware_1 = require("../middleware/auth.middleware"); // Corrected import name
const express_rate_limit_1 = __importDefault(require("express-rate-limit")); // Added import
const router = (0, express_1.Router)();
// Apply authentication middleware to all import/export routes
router.use(auth_middleware_1.protect); // Corrected middleware usage
// Apply rate limiting
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
// Import routes
router.post('/import/html', apiLimiter, importExport_controller_1.upload.single('file'), importExport_controller_1.ImportExportController.importFromHTML);
router.post('/import/json', apiLimiter, importExport_controller_1.upload.single('file'), importExport_controller_1.ImportExportController.importFromJSON);
router.post('/import/csv', apiLimiter, importExport_controller_1.upload.single('file'), importExport_controller_1.ImportExportController.importFromCSV);
// Export route - handles HTML, JSON and CSV formats via query parameter
router.get('/export', importExport_controller_1.ImportExportController.exportBookmarks);
exports.default = router;
//# sourceMappingURL=importExport.routes.js.map