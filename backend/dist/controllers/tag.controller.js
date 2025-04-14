"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagController = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
// Validation schemas
const tagSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Tag name is required").max(50, "Tag name is too long"),
    color: zod_1.z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color").optional(),
    // Removed description: z.string().max(200, "Description is too long").optional(),
});
exports.TagController = {
    // Get all tags for the current user
    getAllTags: async (req, res) => {
        try {
            const userId = req.user.id; // Added non-null assertion
            const tags = await prisma.tag.findMany({
                where: {
                    userId,
                },
                include: {
                    _count: {
                        select: { bookmarks: true }
                    }
                },
                orderBy: {
                    name: 'asc'
                }
            });
            return res.status(200).json({
                success: true,
                data: tags
            });
        }
        catch (error) {
            console.error('Error fetching tags:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch tags'
            });
        }
    },
    // Get a specific tag by ID
    getTagById: async (req, res) => {
        try {
            const { tagId } = req.params;
            const userId = req.user.id; // Added non-null assertion
            const tag = await prisma.tag.findFirst({
                where: {
                    id: tagId,
                    userId,
                },
                include: {
                    bookmarks: {
                        include: {
                            tag: true, // Corrected include
                            // folder: true // Cannot include folder directly from BookmarkTag
                            bookmark: {
                                include: {
                                    folders: {
                                        include: {
                                            folder: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    _count: {
                        select: { bookmarks: true }
                    }
                }
            });
            if (!tag) {
                return res.status(404).json({
                    success: false,
                    message: 'Tag not found'
                });
            }
            return res.status(200).json({
                success: true,
                data: tag
            });
        }
        catch (error) {
            console.error('Error fetching tag:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch tag'
            });
        }
    },
    // Create a new tag
    createTag: async (req, res) => {
        try {
            const userId = req.user.id; // Added non-null assertion
            // Validate input
            const validatedData = tagSchema.safeParse(req.body);
            if (!validatedData.success) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid tag data',
                    errors: validatedData.error.errors
                });
            }
            const { name, color } = validatedData.data; // Removed description
            // Check if tag with the same name already exists for this user
            const existingTag = await prisma.tag.findFirst({
                where: {
                    name,
                    userId,
                }
            });
            if (existingTag) {
                return res.status(409).json({
                    success: false,
                    message: 'A tag with this name already exists'
                });
            }
            // Create the tag
            const tag = await prisma.tag.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    name,
                    color: color || '#808080', // Default color if not provided
                    // Removed description,
                    user: {
                        connect: { id: userId }
                    }
                }
            });
            return res.status(201).json({
                success: true,
                data: tag
            });
        }
        catch (error) {
            console.error('Error creating tag:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to create tag'
            });
        }
    },
    // Update an existing tag
    updateTag: async (req, res) => {
        try {
            const { tagId } = req.params;
            const userId = req.user.id; // Added non-null assertion
            // Validate input
            const validatedData = tagSchema.safeParse(req.body);
            if (!validatedData.success) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid tag data',
                    errors: validatedData.error.errors
                });
            }
            const { name, color } = validatedData.data; // Removed description
            // Check if tag exists and belongs to the user
            const existingTag = await prisma.tag.findFirst({
                where: {
                    id: tagId,
                    userId,
                }
            });
            if (!existingTag) {
                return res.status(404).json({
                    success: false,
                    message: 'Tag not found'
                });
            }
            // Check if another tag with the same name exists
            if (name !== existingTag.name) {
                const duplicateTag = await prisma.tag.findFirst({
                    where: {
                        name,
                        userId,
                        id: { not: tagId }
                    }
                });
                if (duplicateTag) {
                    return res.status(409).json({
                        success: false,
                        message: 'Another tag with this name already exists'
                    });
                }
            }
            // Update the tag
            const updatedTag = await prisma.tag.update({
                where: {
                    id: tagId
                },
                data: {
                    name,
                    color,
                    // Removed description
                }
            });
            return res.status(200).json({
                success: true,
                data: updatedTag
            });
        }
        catch (error) {
            console.error('Error updating tag:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update tag'
            });
        }
    },
    // Delete a tag
    deleteTag: async (req, res) => {
        try {
            const { tagId } = req.params;
            const userId = req.user.id; // Added non-null assertion
            // Check if tag exists and belongs to the user
            const tag = await prisma.tag.findFirst({
                where: {
                    id: tagId,
                    userId,
                }
            });
            if (!tag) {
                return res.status(404).json({
                    success: false,
                    message: 'Tag not found'
                });
            }
            // Delete tag-bookmark associations first
            await prisma.bookmarkTag.deleteMany({
                where: {
                    tagId
                }
            });
            // Delete the tag
            await prisma.tag.delete({
                where: {
                    id: tagId
                }
            });
            return res.status(200).json({
                success: true,
                message: 'Tag deleted successfully'
            });
        }
        catch (error) {
            console.error('Error deleting tag:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to delete tag'
            });
        }
    },
    // Get bookmarks by tag
    getBookmarksByTag: async (req, res) => {
        try {
            const { tagId } = req.params;
            const userId = req.user.id; // Added non-null assertion
            // Check if tag exists and belongs to the user
            const tag = await prisma.tag.findFirst({
                where: {
                    id: tagId,
                    userId,
                }
            });
            if (!tag) {
                return res.status(404).json({
                    success: false,
                    message: 'Tag not found'
                });
            }
            // Get bookmarks with this tag
            const bookmarks = await prisma.bookmark.findMany({
                where: {
                    userId,
                    tags: {
                        some: {
                            tagId
                        }
                    }
                },
                include: {
                    tags: {
                        include: {
                            tag: true
                        }
                    },
                    folders: true // Corrected include
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return res.status(200).json({
                success: true,
                data: bookmarks
            });
        }
        catch (error) {
            console.error('Error fetching bookmarks by tag:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch bookmarks by tag'
            });
        }
    },
    // Assign tag to bookmark
    assignTagToBookmark: async (req, res) => {
        try {
            const { tagId, bookmarkId } = req.params;
            const userId = req.user.id; // Added non-null assertion
            // Check if both tag and bookmark exist and belong to the user
            const tag = await prisma.tag.findFirst({
                where: {
                    id: tagId,
                    userId,
                }
            });
            if (!tag) {
                return res.status(404).json({
                    success: false,
                    message: 'Tag not found'
                });
            }
            const bookmark = await prisma.bookmark.findFirst({
                where: {
                    id: bookmarkId,
                    userId,
                }
            });
            if (!bookmark) {
                return res.status(404).json({
                    success: false,
                    message: 'Bookmark not found'
                });
            }
            // Check if association already exists
            const existing = await prisma.bookmarkTag.findUnique({
                where: {
                    tagId_bookmarkId: {
                        tagId: tagId, // Added non-null assertion
                        bookmarkId: bookmarkId // Added non-null assertion
                    }
                }
            });
            if (existing) {
                return res.status(409).json({
                    success: false,
                    message: 'This bookmark already has this tag'
                });
            }
            // Create the association
            await prisma.bookmarkTag.create({
                data: {
                    tagId: tagId, // Added non-null assertion
                    bookmarkId: bookmarkId // Added non-null assertion
                }
            });
            return res.status(200).json({
                success: true,
                message: 'Tag assigned to bookmark successfully'
            });
        }
        catch (error) {
            console.error('Error assigning tag to bookmark:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to assign tag to bookmark'
            });
        }
    },
    // Remove tag from bookmark
    removeTagFromBookmark: async (req, res) => {
        try {
            const { tagId, bookmarkId } = req.params;
            const userId = req.user.id; // Added non-null assertion
            // Check if both tag and bookmark exist and belong to the user
            const tag = await prisma.tag.findFirst({
                where: {
                    id: tagId,
                    userId,
                }
            });
            if (!tag) {
                return res.status(404).json({
                    success: false,
                    message: 'Tag not found'
                });
            }
            const bookmark = await prisma.bookmark.findFirst({
                where: {
                    id: bookmarkId,
                    userId,
                }
            });
            if (!bookmark) {
                return res.status(404).json({
                    success: false,
                    message: 'Bookmark not found'
                });
            }
            // Delete the association
            await prisma.bookmarkTag.delete({
                where: {
                    tagId_bookmarkId: {
                        tagId: tagId, // Added non-null assertion
                        bookmarkId: bookmarkId // Added non-null assertion
                    }
                }
            });
            return res.status(200).json({
                success: true,
                message: 'Tag removed from bookmark successfully'
            });
        }
        catch (error) {
            console.error('Error removing tag from bookmark:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to remove tag from bookmark'
            });
        }
    },
    // Bulk tag operations
    bulkTagOperations: async (req, res) => {
        try {
            const { operation, tagIds, bookmarkIds } = req.body;
            const userId = req.user.id; // Added non-null assertion
            if (!['add', 'remove'].includes(operation)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid operation. Must be "add" or "remove"'
                });
            }
            if (!Array.isArray(tagIds) || !Array.isArray(bookmarkIds) ||
                tagIds.length === 0 || bookmarkIds.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid request. Must provide tagIds and bookmarkIds arrays'
                });
            }
            // Verify all tags belong to the user
            const tags = await prisma.tag.findMany({
                where: {
                    id: { in: tagIds },
                    userId
                }
            });
            if (tags.length !== tagIds.length) {
                return res.status(404).json({
                    success: false,
                    message: 'One or more tags not found'
                });
            }
            // Verify all bookmarks belong to the user
            const bookmarks = await prisma.bookmark.findMany({
                where: {
                    id: { in: bookmarkIds },
                    userId
                }
            });
            if (bookmarks.length !== bookmarkIds.length) {
                return res.status(404).json({
                    success: false,
                    message: 'One or more bookmarks not found'
                });
            }
            // Perform the operation
            if (operation === 'add') {
                // Create records for all tag-bookmark combinations
                const tagBookmarkPairs = [];
                for (const tagId of tagIds) {
                    for (const bookmarkId of bookmarkIds) {
                        tagBookmarkPairs.push({
                            tagId,
                            bookmarkId
                        });
                    }
                }
                // Use createMany to add all combinations in one go, skipping duplicates
                await prisma.bookmarkTag.createMany({
                    data: tagBookmarkPairs,
                    skipDuplicates: true
                });
            }
            else {
                // For remove operation
                await prisma.bookmarkTag.deleteMany({
                    where: {
                        tagId: { in: tagIds },
                        bookmarkId: { in: bookmarkIds }
                    }
                });
            }
            return res.status(200).json({
                success: true,
                message: `Tags ${operation === 'add' ? 'assigned to' : 'removed from'} bookmarks successfully`
            });
        }
        catch (error) {
            console.error(`Error in bulk tag operation:`, error);
            return res.status(500).json({
                success: false,
                message: 'Failed to perform bulk tag operation'
            });
        }
    }
};
exports.default = exports.TagController;
//# sourceMappingURL=tag.controller.js.map