"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const bookmarkRoutes_1 = __importDefault(require("./bookmarkRoutes"));
const folderRoutes_1 = __importDefault(require("./folderRoutes"));
const tag_routes_1 = __importDefault(require("./tag.routes"));
const collectionRoutes_1 = __importDefault(require("./collectionRoutes"));
const importExport_routes_1 = __importDefault(require("./importExport.routes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});
// API version route
router.get('/version', (req, res) => {
    res.status(200).json({ version: '1.0.0' });
});
// Auth routes (no authentication required)
router.use('/auth', auth_routes_1.default);
// Protected routes (authentication required)
router.use('/bookmarks', authMiddleware_1.authenticate, bookmarkRoutes_1.default);
router.use('/folders', authMiddleware_1.authenticate, folderRoutes_1.default);
router.use('/tags', authMiddleware_1.authenticate, tag_routes_1.default);
router.use('/collections', authMiddleware_1.authenticate, collectionRoutes_1.default);
router.use('/import-export', authMiddleware_1.authenticate, importExport_routes_1.default);
router.use('/users', authMiddleware_1.authenticate, userRoutes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map