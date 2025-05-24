// src/models/schemas.ts
import { z } from 'zod';
import { Role } from '@prisma/client'; // Import Role enum

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
  fullTextSearch: z.string().optional()
});

export const updateBookmarkSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  fullTextSearch: z.string().optional()
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
  bookmarkIds: z.array(z.string().uuid()).min(1, "At least one bookmark ID is required"),
  action: z.enum([
    'delete', 
    'addToFolder', 
    'removeFromFolder', 
    'addTag', // Changed from 'tag' for clarity
    'removeTag', // Changed from 'untag' for clarity
    'addToCollection', 
    'removeFromCollection'
  ]),
  targetFolderId: z.string().uuid().optional(), // Used for addToFolder, removeFromFolder
  tagId: z.string().uuid().optional(), // Used for addTag, removeTag (assuming one tag at a time for simplicity now)
  // tagIds: z.array(z.string().uuid()).optional(), // Could use this for adding/removing multiple tags
  targetCollectionId: z.string().uuid().optional(), // Used for addToCollection, removeFromCollection
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

// Schemas for managing folder collaborators
export const addFolderCollaboratorSchema = z.object({
  userId: z.string().uuid('Invalid User ID format'), // The user ID of the collaborator to add
  permission: z.nativeEnum(Role), // Use the Role enum from Prisma
});

export const updateFolderCollaboratorSchema = z.object({
  permission: z.nativeEnum(Role), // Use the Role enum from Prisma
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

// Schemas for managing bookmarks within collections
export const addBookmarkToCollectionSchema = z.object({
  bookmarkId: z.string().uuid('Invalid Bookmark ID format'),
  // order: z.number().int().optional(), // Optional: Add if implementing ordering
});

// No schema needed for removeBookmarkFromCollection if IDs are in URL params

// Schemas for managing collection collaborators
export const addCollectionCollaboratorSchema = z.object({
  userId: z.string().uuid('Invalid User ID format'), // The user ID of the collaborator to add
  permission: z.nativeEnum(Role), // Use the Role enum from Prisma
});

export const updateCollectionCollaboratorSchema = z.object({
  permission: z.nativeEnum(Role), // Use the Role enum from Prisma
});

// No schema needed for removeCollectionCollaborator if IDs are in URL params

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

// Sync validation schemas
const clientBookmarkChangeSchema = z.object({
  id: z.string().uuid(),
  url: z.string().url().optional(),
  title: z.string().max(255).optional(), // Add max length  
  description: z.string().max(1000).optional(), // Remove nullable() to match service type
  notes: z.string().optional(), // Remove nullable() to match service type
  updatedAt: z.string().datetime({ offset: true }), // Client timestamp
  lastServerUpdatedAt: z.string().datetime({ offset: true }).optional(), // Needed for updates
  isDeleted: z.boolean().optional(),
  folderIds: z.array(z.string().uuid()).optional(), // Full list of folder IDs
  tagIds: z.array(z.string().uuid()).optional(),    // Full list of tag IDs
  // collectionIds: z.array(z.string().uuid()).optional(), // Placeholder for future collection sync
});

// Schema for Folder changes from client
const clientFolderChangeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  parentId: z.string().uuid().optional().nullable(), // Allow null for root
  updatedAt: z.string().datetime({ offset: true }), 
  lastServerUpdatedAt: z.string().datetime({ offset: true }).optional(), 
  isDeleted: z.boolean().optional(), 
});

// Schema for Tag changes from client
const clientTagChangeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  color: z.string().optional().nullable(),
  updatedAt: z.string().datetime({ offset: true }), 
  lastServerUpdatedAt: z.string().datetime({ offset: true }).optional(), 
  isDeleted: z.boolean().optional(), 
});

// Schema for Collection changes from client
const clientCollectionChangeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  isPublic: z.boolean().optional(),
  thumbnail: z.string().optional().nullable(), 
  updatedAt: z.string().datetime({ offset: true }), 
  lastServerUpdatedAt: z.string().datetime({ offset: true }).optional(), 
  isDeleted: z.boolean().optional(), 
});


export const syncRequestBodySchema = z.object({
    lastSyncTimestamp: z.string().datetime({ offset: true }).nullable(), // ISO 8601 format, allow null for first sync
    // Explicitly define structures for all expected change types
    clientChanges: z.object({ 
        bookmarks: z.array(clientBookmarkChangeSchema).optional(),
        folders: z.array(clientFolderChangeSchema).optional(),
        tags: z.array(clientTagChangeSchema).optional(),
        collections: z.array(clientCollectionChangeSchema).optional(),
    }) // Removed .passthrough()
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
export type AddFolderCollaboratorInput = z.infer<typeof addFolderCollaboratorSchema>;
export type UpdateFolderCollaboratorInput = z.infer<typeof updateFolderCollaboratorSchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>;
export type AddBookmarkToCollectionInput = z.infer<typeof addBookmarkToCollectionSchema>;
export type AddCollectionCollaboratorInput = z.infer<typeof addCollectionCollaboratorSchema>;
export type UpdateCollectionCollaboratorInput = z.infer<typeof updateCollectionCollaboratorSchema>;
export type ImportOptionsInput = z.infer<typeof importOptionsSchema>;
export type ExportOptionsInput = z.infer<typeof exportOptionsSchema>;
export type RegisterDeviceInput = z.infer<typeof registerDeviceSchema>;
export type ClientBookmarkChangeInput = z.infer<typeof clientBookmarkChangeSchema>; // Export type
export type SyncRequestBodyInput = z.infer<typeof syncRequestBodySchema>; // Export type
export type ClientFolderChangeInput = z.infer<typeof clientFolderChangeSchema>; // Export type
export type ClientTagChangeInput = z.infer<typeof clientTagChangeSchema>; // Export type
export type ClientCollectionChangeInput = z.infer<typeof clientCollectionChangeSchema>; // Export type

// Schema for adding a bookmark to a folder (used in folder routes)
export const addBookmarkToFolderBodySchema = z.object({
  bookmarkId: z.string().uuid("Invalid Bookmark ID format"),
});

// Schema for removing a bookmark from a folder (validates route params)
export const deleteBookmarkFromFolderParamsSchema = z.object({
  id: z.string().uuid("Invalid Folder ID format"), // Folder ID from route
  bookmarkId: z.string().uuid("Invalid Bookmark ID format"), // Bookmark ID from route
});

// Schemas for bookmark tag relationship management (used in bookmark routes)
export const addTagToBookmarkBodySchema = z.object({
  tagId: z.string().uuid("Invalid Tag ID format"), // Tag ID in body
});

export const deleteTagFromBookmarkParamsSchema = z.object({
  bookmarkId: z.string().uuid("Invalid Bookmark ID format"), // Bookmark ID from route
  tagId: z.string().uuid("Invalid Tag ID format"), // Tag ID from route
});

// Schemas for query params in bookmark controller
export const getRecentBookmarksQuerySchema = z.object({
  limit: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number().int().positive().optional().default(10)
  ),
});

// Schema for checking if a URL exists
export const checkUrlExistsQuerySchema = z.object({
  url: z.string().url("Invalid URL format"), // Require a valid URL
});

// Schema for delete folder query params
export const deleteFolderQuerySchema = z.object({
  moveBookmarksTo: z.string().uuid().optional(), // Optional target folder ID
});

// Schema for delete account request body
export const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required'), // Require password
});

// Schema for import request body (excluding file)
export const importRequestBodySchema = z.object({
  folderId: z.string().uuid().optional(), // Optional target folder ID
});

// --- Reusable Pagination/Sorting Schemas ---

const paginationQuerySchema = z.object({
  limit: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : undefined),
    z.number().int().positive().optional().default(20) // Default limit 20
  ),
  offset: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : undefined),
    z.number().int().nonnegative().optional().default(0) // Default offset 0
  ),
});

// Base sorting schema - allow extending with specific fields
const baseSortQuerySchema = z.object({
  sortBy: z.string().optional(), // Specific fields validated in merged schemas
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// --- Combined Schemas for List Endpoints ---

// GET /folders
export const getFoldersQuerySchema = paginationQuerySchema.merge(baseSortQuerySchema.extend({
  sortBy: z.enum(['name', 'createdAt', 'updatedAt']).optional().default('name'),
  // Add specific filters like parentId if needed
  // parentId: z.string().uuid().optional(), 
}));

// GET /tags
export const getTagsQuerySchema = paginationQuerySchema.merge(baseSortQuerySchema.extend({
  sortBy: z.enum(['name', 'createdAt', 'updatedAt']).optional().default('name'),
}));

// GET /collections
export const getCollectionsQuerySchema = paginationQuerySchema.merge(baseSortQuerySchema.extend({
  sortBy: z.enum(['name', 'createdAt', 'updatedAt']).optional().default('updatedAt'),
  // Add specific filters like public/private if needed
  // isPublic: z.boolean().optional(), 
}));

// GET /tags/:tagId/bookmarks
export const getBookmarksByTagQuerySchema = paginationQuerySchema.merge(baseSortQuerySchema.extend({
   sortBy: z.enum(['createdAt', 'updatedAt', 'title', 'visitCount']).optional().default('createdAt'),
}));

// GET /collections/:id (for nested bookmarks) & /folders/:id/bookmarks
export const getBookmarksInContainerQuerySchema = paginationQuerySchema.merge(baseSortQuerySchema.extend({
   sortBy: z.enum(['createdAt', 'updatedAt', 'title', 'visitCount']).optional().default('createdAt'),
   // Add specific filters if needed (e.g., search within container)
   // query: z.string().optional(), 
}));


export const getPopularBookmarksQuerySchema = z.object({
  limit: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number().int().positive().optional().default(10)
  ),
});
