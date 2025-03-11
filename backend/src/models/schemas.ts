// src/models/schemas.ts
import { z } from 'zod';

// User validation schemas
export const registerUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().optional(),
});

export const loginUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string(),
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  username: z.string().min(3).max(30).optional(),
  profileImage: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export const resetPasswordRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

// Bookmark validation schemas
export const createBookmarkSchema = z.object({
  url: z.string().url('Invalid URL format'),
  title: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  folderId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const updateBookmarkSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
});

export const bookmarkSearchSchema = z.object({
  query: z.string().optional(),
  folderId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'lastVisited', 'visitCount', 'title']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const bulkActionSchema = z.object({
  bookmarkIds: z.array(z.string()),
  action: z.enum(['move', 'delete', 'tag', 'untag']),
  targetFolderId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
});

// Folder validation schemas
export const createFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required'),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  parentId: z.string().optional(),
});

export const updateFolderSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  parentId: z.string().optional(),
});

// Tag validation schemas
export const createTagSchema = z.object({
  name: z.string().min(1, 'Tag name is required'),
  color: z.string().optional(),
});

export const updateTagSchema = z.object({
  name: z.string().min(1).optional(),
  color: z.string().optional(),
});

// Collection validation schemas
export const createCollectionSchema = z.object({
  name: z.string().min(1, 'Collection name is required'),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
  bookmarkIds: z.array(z.string()).optional(),
});

export const updateCollectionSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
  thumbnail: z.string().optional(),
});

export const shareCollectionSchema = z.object({
  collectionId: z.string(),
  userIds: z.array(z.string()).optional(),
  emails: z.array(z.string().email()).optional(),
  permission: z.enum(['view', 'edit', 'admin']).optional(),
});

// Collaborator validation schemas
export const collaboratorSchema = z.object({
  userId: z.string(),
  permission: z.enum(['view', 'edit', 'admin']),
});

// Import/Export validation schemas
export const importOptionsSchema = z.object({
  format: z.enum(['html', 'csv', 'json']),
  folderId: z.string().optional(),
});

export const exportOptionsSchema = z.object({
  format: z.enum(['html', 'csv', 'json']),
  folderId: z.string().optional(),
  includeSubfolders: z.boolean().optional(),
});

// Device validation schemas
export const registerDeviceSchema = z.object({
  deviceName: z.string(),
  deviceType: z.string(),
});

// Types based on Zod schemas
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ResetPasswordRequestInput = z.infer<typeof resetPasswordRequestSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>;
export type UpdateBookmarkInput = z.infer<typeof updateBookmarkSchema>;
export type BookmarkSearchInput = z.infer<typeof bookmarkSearchSchema>;
export type BulkActionInput = z.infer<typeof bulkActionSchema>;
export type CreateFolderInput = z.infer<typeof createFolderSchema>;
export type UpdateFolderInput = z.infer<typeof updateFolderSchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>;
export type ShareCollectionInput = z.infer<typeof shareCollectionSchema>;
export type CollaboratorInput = z.infer<typeof collaboratorSchema>;
export type ImportOptionsInput = z.infer<typeof importOptionsSchema>;
export type ExportOptionsInput = z.infer<typeof exportOptionsSchema>;
export type RegisterDeviceInput = z.infer<typeof registerDeviceSchema>;