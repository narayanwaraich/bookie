"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDeviceSchema = exports.exportOptionsSchema = exports.importOptionsSchema = exports.collaboratorSchema = exports.shareCollectionSchema = exports.updateCollectionSchema = exports.createCollectionSchema = exports.updateTagSchema = exports.createTagSchema = exports.updateFolderSchema = exports.createFolderSchema = exports.bulkActionSchema = exports.bookmarkSearchSchema = exports.updateBookmarkSchema = exports.createBookmarkSchema = exports.resetPasswordSchema = exports.resetPasswordRequestSchema = exports.changePasswordSchema = exports.updateUserSchema = exports.loginUserSchema = exports.registerUserSchema = void 0;
// src/models/schemas.ts
const zod_1 = require("zod");
// User validation schemas
exports.registerUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    username: zod_1.z.string().min(3, 'Username must be at least 3 characters').max(30),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    name: zod_1.z.string().optional(),
});
exports.loginUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string(),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    username: zod_1.z.string().min(3).max(30).optional(),
    profileImage: zod_1.z.string().optional(),
    currentPassword: zod_1.z.string().optional(),
    newPassword: zod_1.z.string().min(8).optional(),
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string(),
    newPassword: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
});
exports.resetPasswordRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string(),
    newPassword: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
});
// Bookmark validation schemas
exports.createBookmarkSchema = zod_1.z.object({
    url: zod_1.z.string().url('Invalid URL format'),
    title: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    folderId: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.updateBookmarkSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
});
exports.bookmarkSearchSchema = zod_1.z.object({
    query: zod_1.z.string().optional(),
    folderId: zod_1.z.string().optional(),
    tagIds: zod_1.z.array(zod_1.z.string()).optional(),
    limit: zod_1.z.number().int().positive().optional(),
    offset: zod_1.z.number().int().nonnegative().optional(),
    sortBy: zod_1.z.enum(['createdAt', 'updatedAt', 'lastVisited', 'visitCount', 'title']).optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
exports.bulkActionSchema = zod_1.z.object({
    bookmarkIds: zod_1.z.array(zod_1.z.string()),
    action: zod_1.z.enum(['move', 'delete', 'tag', 'untag']),
    targetFolderId: zod_1.z.string().optional(),
    tagIds: zod_1.z.array(zod_1.z.string()).optional(),
});
// Folder validation schemas
exports.createFolderSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Folder name is required'),
    description: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
    color: zod_1.z.string().optional(),
    parentId: zod_1.z.string().optional(),
});
exports.updateFolderSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
    color: zod_1.z.string().optional(),
    parentId: zod_1.z.string().optional(),
});
// Tag validation schemas
exports.createTagSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Tag name is required'),
    color: zod_1.z.string().optional(),
});
exports.updateTagSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    color: zod_1.z.string().optional(),
});
// Collection validation schemas
exports.createCollectionSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Collection name is required'),
    description: zod_1.z.string().optional(),
    isPublic: zod_1.z.boolean().optional(),
    bookmarkIds: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.updateCollectionSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
    isPublic: zod_1.z.boolean().optional(),
    thumbnail: zod_1.z.string().optional(),
});
exports.shareCollectionSchema = zod_1.z.object({
    collectionId: zod_1.z.string(),
    userIds: zod_1.z.array(zod_1.z.string()).optional(),
    emails: zod_1.z.array(zod_1.z.string().email()).optional(),
    permission: zod_1.z.enum(['view', 'edit', 'admin']).optional(),
});
// Collaborator validation schemas
exports.collaboratorSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    permission: zod_1.z.enum(['view', 'edit', 'admin']),
});
// Import/Export validation schemas
exports.importOptionsSchema = zod_1.z.object({
    format: zod_1.z.enum(['html', 'csv', 'json']),
    folderId: zod_1.z.string().optional(),
});
exports.exportOptionsSchema = zod_1.z.object({
    format: zod_1.z.enum(['html', 'csv', 'json']),
    folderId: zod_1.z.string().optional(),
    includeSubfolders: zod_1.z.boolean().optional(),
});
// Device validation schemas
exports.registerDeviceSchema = zod_1.z.object({
    deviceName: zod_1.z.string(),
    deviceType: zod_1.z.string(),
});
//# sourceMappingURL=schemas.js.map