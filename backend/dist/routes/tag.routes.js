"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/tag.routes.ts
const express_1 = require("express");
const tag_controller_1 = __importDefault(require("../controllers/tag.controller")); // Corrected import to default
// Removed incorrect import: import { apiLimiter } from '../config/rateLimiter';
const auth_middleware_1 = require("../middleware/auth.middleware"); // Corrected import name
const express_rate_limit_1 = __importDefault(require("express-rate-limit")); // Added import
const router = (0, express_1.Router)();
// Apply authentication middleware to all tag routes
router.use(auth_middleware_1.protect); // Corrected middleware usage
// Apply rate limiting
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
// Tag CRUD operations
router.get('/', tag_controller_1.default.getAllTags);
router.get('/:tagId', tag_controller_1.default.getTagById);
router.post('/', apiLimiter, tag_controller_1.default.createTag);
router.put('/:tagId', apiLimiter, tag_controller_1.default.updateTag);
router.delete('/:tagId', apiLimiter, tag_controller_1.default.deleteTag);
// Tag-bookmark relationship operations
router.get('/:tagId/bookmarks', tag_controller_1.default.getBookmarksByTag);
router.post('/:tagId/bookmarks/:bookmarkId', apiLimiter, tag_controller_1.default.assignTagToBookmark);
router.delete('/:tagId/bookmarks/:bookmarkId', tag_controller_1.default.removeTagFromBookmark);
// Bulk tag operations
router.post('/bulk', apiLimiter, tag_controller_1.default.bulkTagOperations);
exports.default = router;
//# sourceMappingURL=tag.routes.js.map