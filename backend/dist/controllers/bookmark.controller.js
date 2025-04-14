"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncBookmarks = exports.exportBookmarks = exports.importBookmarks = exports.performBulkAction = exports.getPopularBookmarks = exports.getRecentBookmarks = exports.removeBookmarkFromCollection = exports.addBookmarkToCollection = exports.removeTagFromBookmark = exports.addTagToBookmark = exports.removeBookmarkFromFolder = exports.addBookmarkToFolder = exports.searchBookmarks = exports.deleteBookmark = exports.updateBookmark = exports.getBookmark = exports.createBookmark = void 0;
const db_1 = __importDefault(require("../config/db"));
const logger_1 = __importDefault(require("../config/logger"));
const metadata_1 = require("../utils/metadata");
// Create bookmark
const createBookmark = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { url, title, description, notes, folderId, tags } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }
        // Fetch metadata if title or description not provided
        let metadata = {};
        if (!title || !description) {
            try {
                metadata = await (0, metadata_1.fetchUrlMetadata)(url); // Corrected function call
            }
            catch (error) {
                logger_1.default.error(`Error fetching metadata for ${url}:`, error);
                // Continue without metadata if fetch fails
            }
        }
        // Create bookmark
        const bookmark = await db_1.default.bookmark.create({
            data: {
                url,
                title: title || metadata.title || 'Untitled',
                description: description || metadata.description || '',
                favicon: metadata.favicon || null,
                previewImage: metadata.previewImage || null,
                notes: notes || null,
                userId,
            }
        });
        // Add to folder if provided
        if (folderId) {
            // Check if folder exists and belongs to user
            const folder = await db_1.default.folder.findFirst({
                where: {
                    id: folderId,
                    OR: [
                        { userId },
                        { collaborators: { some: { userId } } }
                    ]
                }
            });
            if (folder) {
                await db_1.default.folderBookmark.create({
                    data: {
                        folderId,
                        bookmarkId: bookmark.id
                    }
                });
            }
        }
        // Add tags if provided
        if (tags && tags.length > 0) {
            // Get existing tags that belong to the user
            const existingTags = await db_1.default.tag.findMany({
                where: {
                    id: { in: tags },
                    userId
                }
            });
            // Create tag-bookmark relationships
            for (const tag of existingTags) {
                await db_1.default.bookmarkTag.create({
                    data: {
                        tagId: tag.id,
                        bookmarkId: bookmark.id
                    }
                });
            }
        }
        // Fetch complete bookmark with relations
        const completeBookmark = await db_1.default.bookmark.findUnique({
            where: { id: bookmark.id },
            include: {
                folders: {
                    include: {
                        folder: {
                            select: {
                                id: true,
                                name: true,
                                icon: true,
                                color: true
                            }
                        }
                    }
                },
                tags: {
                    include: {
                        tag: {
                            select: {
                                id: true,
                                name: true,
                                color: true
                            }
                        }
                    }
                }
            }
        });
        res.status(201).json({
            success: true,
            message: 'Bookmark created successfully',
            bookmark: completeBookmark
        });
    }
    catch (error) {
        logger_1.default.error('Error creating bookmark:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating bookmark'
        });
    }
};
exports.createBookmark = createBookmark;
// Get bookmark by ID
const getBookmark = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }
        // Check if bookmark belongs to user or is in a shared collection/folder
        const bookmark = await db_1.default.bookmark.findFirst({
            where: {
                id,
                OR: [
                    { userId },
                    { collections: { some: { collection: { collaborators: { some: { userId } } } } } },
                    { folders: { some: { folder: { collaborators: { some: { userId } } } } } }
                ]
            },
            include: {
                folders: {
                    include: {
                        folder: {
                            select: {
                                id: true,
                                name: true,
                                icon: true,
                                color: true
                            }
                        }
                    }
                },
                tags: {
                    include: {
                        tag: {
                            select: {
                                id: true,
                                name: true,
                                color: true
                            }
                        }
                    }
                },
                collections: {
                    include: {
                        collection: {
                            select: {
                                id: true,
                                name: true,
                                isPublic: true
                            }
                        }
                    }
                }
            }
        });
        if (!bookmark) {
            return res.status(404).json({
                success: false,
                message: 'Bookmark not found'
            });
        }
        // Increment visit count
        await db_1.default.bookmark.update({
            where: { id },
            data: {
                visitCount: { increment: 1 },
                lastVisited: new Date()
            }
        });
        res.status(200).json({
            success: true,
            bookmark
        });
    }
    catch (error) {
        logger_1.default.error('Error getting bookmark:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching bookmark'
        });
    }
};
exports.getBookmark = getBookmark;
// Update bookmark
const updateBookmark = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const { title, description, notes } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }
        // Check if bookmark exists and belongs to user
        const existingBookmark = await db_1.default.bookmark.findFirst({
            where: {
                id,
                OR: [
                    { userId },
                    { folders: { some: { folder: { collaborators: { some: { userId, permission: { in: ['edit', 'admin'] } } } } } } },
                    { collections: { some: { collection: { collaborators: { some: { userId, permission: { in: ['edit', 'admin'] } } } } } } }
                ]
            }
        });
        if (!existingBookmark) {
            return res.status(404).json({
                success: false,
                message: 'Bookmark not found or you do not have permission to edit it'
            });
        }
        // Update bookmark
        const bookmark = await db_1.default.bookmark.update({
            where: { id },
            data: {
                title: title ?? existingBookmark.title,
                description: description ?? existingBookmark.description,
                notes: notes ?? existingBookmark.notes
            },
            include: {
                folders: {
                    include: {
                        folder: {
                            select: {
                                id: true,
                                name: true,
                                icon: true,
                                color: true
                            }
                        }
                    }
                },
                tags: {
                    include: {
                        tag: {
                            select: {
                                id: true,
                                name: true,
                                color: true
                            }
                        }
                    }
                }
            }
        });
        res.status(200).json({
            success: true,
            message: 'Bookmark updated successfully',
            bookmark
        });
    }
    catch (error) {
        logger_1.default.error('Error updating bookmark:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating bookmark'
        });
    }
};
exports.updateBookmark = updateBookmark;
// Delete bookmark
const deleteBookmark = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }
        // Check if bookmark exists and belongs to user
        const bookmark = await db_1.default.bookmark.findFirst({
            where: {
                id,
                OR: [
                    { userId },
                    { folders: { some: { folder: { collaborators: { some: { userId, permission: { in: ['admin'] } } } } } } },
                    { collections: { some: { collection: { collaborators: { some: { userId, permission: { in: ['admin'] } } } } } } }
                ]
            }
        });
        if (!bookmark) {
            return res.status(404).json({
                success: false,
                message: 'Bookmark not found or you do not have permission to delete it'
            });
        }
        // Delete bookmark
        await db_1.default.bookmark.delete({
            where: { id }
        });
        res.status(200).json({
            success: true,
            message: 'Bookmark deleted successfully'
        });
    }
    catch (error) {
        logger_1.default.error('Error deleting bookmark:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting bookmark'
        });
    }
};
exports.deleteBookmark = deleteBookmark;
// Search bookmarks
const searchBookmarks = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { query, folderId, tagIds, limit = 20, offset = 0, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }
        // Build where clause
        const where = {
            OR: [
                { userId },
                { folders: { some: { folder: { collaborators: { some: { userId } } } } } },
                { collections: { some: { collection: { collaborators: { some: { userId } } } } } }
            ]
        };
        // Add text search if query provided
        if (query) {
            where.OR = [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { url: { contains: query, mode: 'insensitive' } },
                { notes: { contains: query, mode: 'insensitive' } }
            ];
        }
        // Filter by folder if provided
        if (folderId) {
            where.folders = {
                some: {
                    folderId
                }
            };
        }
        // Filter by tags if provided
        if (tagIds && tagIds.length > 0) {
            where.tags = {
                some: {
                    tagId: {
                        in: tagIds
                    }
                }
            };
        }
        // Count total bookmarks matching criteria
        const totalCount = await db_1.default.bookmark.count({ where });
        // Get bookmarks with pagination and sorting
        const bookmarks = await db_1.default.bookmark.findMany({
            where,
            include: {
                folders: {
                    include: {
                        folder: {
                            select: {
                                id: true,
                                name: true,
                                icon: true,
                                color: true
                            }
                        }
                    }
                },
                tags: {
                    include: {
                        tag: {
                            select: {
                                id: true,
                                name: true,
                                color: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                [sortBy]: sortOrder
            },
            skip: offset,
            take: limit
        });
        res.status(200).json({
            success: true,
            bookmarks,
            pagination: {
                total: totalCount,
                limit,
                offset,
                hasMore: offset + bookmarks.length < totalCount
            }
        });
    }
    catch (error) {
        logger_1.default.error('Error searching bookmarks:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while searching bookmarks'
        });
    }
};
exports.searchBookmarks = searchBookmarks;
// Add bookmark to folder
const addBookmarkToFolder = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { bookmarkId, folderId } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }
        // Check if bookmark exists and belongs to user
        const bookmark = await db_1.default.bookmark.findFirst({
            where: {
                id: bookmarkId,
                OR: [
                    { userId },
                    { folders: { some: { folder: { collaborators: { some: { userId } } } } } },
                    { collections: { some: { collection: { collaborators: { some: { userId } } } } } }
                ]
            }
        });
        if (!bookmark) {
            return res.status(404).json({
                success: false,
                message: 'Bookmark not found'
            });
        }
        // Check if folder exists and belongs to user
        const folder = await db_1.default.folder.findFirst({
            where: {
                id: folderId,
                OR: [
                    { userId },
                    { collaborators: { some: { userId, permission: { in: ['edit', 'admin'] } } } }
                ]
            }
        });
        if (!folder) {
            return res.status(404).json({
                success: false,
                message: 'Folder not found or you do not have permission to add to it'
            });
        }
        // Check if bookmark is already in folder
        const existing = await db_1.default.folderBookmark.findUnique({
            where: {
                folderId_bookmarkId: {
                    folderId,
                    bookmarkId
                }
            }
        });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Bookmark is already in this folder'
            });
        }
        // Add bookmark to folder
        await db_1.default.folderBookmark.create({
            data: {
                folderId,
                bookmarkId
            }
        });
        res.status(200).json({
            success: true,
            message: 'Bookmark added to folder successfully'
        });
    }
    catch (error) {
        logger_1.default.error('Error adding bookmark to folder:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while adding bookmark to folder'
        });
    }
};
exports.addBookmarkToFolder = addBookmarkToFolder;
// Remove bookmark from folder
const removeBookmarkFromFolder = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { bookmarkId, folderId } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }
        // Check if bookmark and folder exist and user has access
        const bookmark = await db_1.default.bookmark.findFirst({
            where: {
                id: bookmarkId,
                OR: [
                    { userId },
                    { folders: { some: { folder: { collaborators: { some: { userId } } } } } }
                ]
            }
        });
        const folder = await db_1.default.folder.findFirst({
            where: {
                id: folderId,
                OR: [
                    { userId },
                    { collaborators: { some: { userId, permission: { in: ['edit', 'admin'] } } } }
                ]
            }
        });
        if (!bookmark || !folder) {
            return res.status(404).json({
                success: false,
                message: 'Bookmark or folder not found or you do not have permission'
            });
        }
        // Remove bookmark from folder
        await db_1.default.folderBookmark.delete({
            where: {
                folderId_bookmarkId: {
                    folderId,
                    bookmarkId
                }
            }
        });
        res.status(200).json({
            success: true,
            message: 'Bookmark removed from folder successfully'
        });
    }
    catch (error) {
        logger_1.default.error('Error removing bookmark from folder:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while removing bookmark from folder'
        });
    }
};
exports.removeBookmarkFromFolder = removeBookmarkFromFolder;
// Add tag to bookmark
const addTagToBookmark = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { bookmarkId, tagId } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }
        // Check if bookmark exists and belongs to user
        const bookmark = await db_1.default.bookmark.findFirst({
            where: {
                id: bookmarkId,
                OR: [
                    { userId },
                    { folders: { some: { folder: { collaborators: { some: { userId, permission: { in: ['edit', 'admin'] } } } } } } }
                ]
            }
        });
        if (!bookmark) {
            return res.status(404).json({
                success: false,
                message: 'Bookmark not found or you do not have permission to edit it'
            });
        }
        // Check if tag exists and belongs to user
        const tag = await db_1.default.tag.findFirst({
            where: {
                id: tagId,
                userId
            }
        });
        if (!tag) {
            return res.status(404).json({
                success: false,
                message: 'Tag not found'
            });
        }
        // Check if tag is already applied
        const existing = await db_1.default.bookmarkTag.findUnique({
            where: {
                tagId_bookmarkId: {
                    tagId,
                    bookmarkId
                }
            }
        });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Tag is already applied to this bookmark'
            });
        }
        // Add tag to bookmark
        await db_1.default.bookmarkTag.create({
            data: {
                tagId,
                bookmarkId
            }
        });
        res.status(200).json({
            success: true,
            message: 'Tag added to bookmark successfully'
        });
    }
    catch (error) {
        logger_1.default.error('Error adding tag to bookmark:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while adding tag to bookmark'
        });
    }
};
exports.addTagToBookmark = addTagToBookmark;
// Remove tag from bookmark
const removeTagFromBookmark = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { bookmarkId, tagId } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }
        // Check if bookmark exists and belongs to user
        const bookmark = await db_1.default.bookmark.findFirst({
            where: {
                id: bookmarkId,
                OR: [
                    { userId },
                    { folders: { some: { folder: { collaborators: { some: { userId, permission: { in: ['edit', 'admin'] } } } } } } }
                ]
            }
        });
        if (!bookmark) {
            return res.status(404).json({
                success: false,
                message: 'Bookmark not found or you do not have permission to edit it'
            });
        }
        // Check if tag exists and belongs to user
        const tag = await db_1.default.tag.findFirst({
            where: {
                id: tagId,
                userId
            }
        });
        if (!tag) {
            return res.status(404).json({
                success: false,
                message: 'Tag not found'
            });
        }
        // Remove tag from bookmark
        await db_1.default.bookmarkTag.delete({
            where: {
                tagId_bookmarkId: {
                    tagId,
                    bookmarkId
                }
            }
        });
        res.status(200).json({
            success: true,
            message: 'Tag removed from bookmark successfully'
        });
    }
    catch (error) {
        logger_1.default.error('Error removing tag from bookmark:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while removing tag from bookmark'
        });
    }
};
exports.removeTagFromBookmark = removeTagFromBookmark;
// Add bookmark to collection
const addBookmarkToCollection = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { bookmarkId, collectionId } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }
        // Check if bookmark exists and belongs to user
        const bookmark = await db_1.default.bookmark.findFirst({
            where: {
                id: bookmarkId,
                OR: [
                    { userId },
                    { folders: { some: { folder: { collaborators: { some: { userId } } } } } }
                ]
            }
        });
        if (!bookmark) {
            return res.status(404).json({
                success: false,
                message: 'Bookmark not found'
            });
        }
        // Check if collection exists and user has permission
        const collection = await db_1.default.collection.findFirst({
            where: {
                id: collectionId,
                OR: [
                    { userId },
                    { collaborators: { some: { userId, permission: { in: ['edit', 'admin'] } } } }
                ]
            }
        });
        if (!collection) {
            return res.status(404).json({
                success: false,
                message: 'Collection not found or you do not have permission'
            });
        }
        // Check if bookmark is already in collection
        const existing = await db_1.default.bookmarkCollection.findUnique({
            where: {
                collectionId_bookmarkId: {
                    collectionId,
                    bookmarkId
                }
            }
        });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Bookmark is already in this collection'
            });
        }
        // Add bookmark to collection
        await db_1.default.bookmarkCollection.create({
            data: {
                collectionId,
                bookmarkId
            }
        });
        res.status(200).json({
            success: true,
            message: 'Bookmark added to collection successfully'
        });
    }
    catch (error) {
        logger_1.default.error('Error adding bookmark to collection:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while adding bookmark to collection'
        });
    }
};
exports.addBookmarkToCollection = addBookmarkToCollection;
// Remove bookmark from collection
const removeBookmarkFromCollection = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { bookmarkId, collectionId } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }
        // Check if collection exists and user has permission
        const collection = await db_1.default.collection.findFirst({
            where: {
                id: collectionId,
                OR: [
                    { userId },
                    { collaborators: { some: { userId, permission: { in: ['edit', 'admin'] } } } }
                ]
            }
        });
        if (!collection) {
            return res.status(404).json({
                success: false,
                message: 'Collection not found or you do not have permission'
            });
        }
        // Remove bookmark from collection
        await db_1.default.bookmarkCollection.delete({
            where: {
                collectionId_bookmarkId: {
                    collectionId,
                    bookmarkId
                }
            }
        });
        res.status(200).json({
            success: true,
            message: 'Bookmark removed from collection successfully'
        });
    }
    catch (error) {
        logger_1.default.error('Error removing bookmark from collection:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while removing bookmark from collection'
        });
    }
};
exports.removeBookmarkFromCollection = removeBookmarkFromCollection;
// Get recent bookmarks
const getRecentBookmarks = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { limit = 10 } = req.query;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }
        const bookmarks = await db_1.default.bookmark.findMany({
            where: {
                OR: [
                    { userId },
                    { folders: { some: { folder: { collaborators: { some: { userId } } } } } },
                    { collections: { some: { collection: { collaborators: { some: { userId } } } } } }
                ]
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: Number(limit),
            include: {
                folders: {
                    include: {
                        folder: {
                            select: {
                                id: true,
                                name: true,
                                icon: true,
                                color: true
                            }
                        }
                    }
                },
                tags: {
                    include: {
                        tag: {
                            select: {
                                id: true,
                                name: true,
                                color: true
                            }
                        }
                    }
                }
            }
        });
        res.status(200).json({
            success: true,
            bookmarks
        });
    }
    catch (error) {
        logger_1.default.error('Error getting recent bookmarks:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching recent bookmarks'
        });
    }
};
exports.getRecentBookmarks = getRecentBookmarks;
// Get popular bookmarks
const getPopularBookmarks = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { limit = 10 } = req.query;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }
        const bookmarks = await db_1.default.bookmark.findMany({
            where: {
                OR: [
                    { userId },
                    { folders: { some: { folder: { collaborators: { some: { userId } } } } } },
                    { collections: { some: { collection: { collaborators: { some: { userId } } } } } }
                ]
            },
            orderBy: {
                visitCount: 'desc'
            },
            take: Number(limit),
            include: {
                folders: {
                    include: {
                        folder: {
                            select: {
                                id: true,
                                name: true,
                                icon: true,
                                color: true
                            }
                        }
                    }
                },
                tags: {
                    include: {
                        tag: {
                            select: {
                                id: true,
                                name: true,
                                color: true
                            }
                        }
                    }
                }
            }
        });
        res.status(200).json({
            success: true,
            bookmarks
        });
    }
    catch (error) {
        logger_1.default.error('Error getting popular bookmarks:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching popular bookmarks'
        });
    }
};
exports.getPopularBookmarks = getPopularBookmarks;
// Perform bulk action on bookmarks
const performBulkAction = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { bookmarkIds, action, targetId } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }
        if (!bookmarkIds || bookmarkIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No bookmarks specified'
            });
        }
        // Verify user has access to all bookmarks
        const accessibleBookmarks = await db_1.default.bookmark.findMany({
            where: {
                id: { in: bookmarkIds },
                OR: [
                    { userId },
                    { folders: { some: { folder: { collaborators: { some: { userId } } } } } },
                    { collections: { some: { collection: { collaborators: { some: { userId } } } } } }
                ]
            }
        });
        if (accessibleBookmarks.length !== bookmarkIds.length) {
            return res.status(403).json({
                success: false,
                message: 'You do not have access to one or more of the specified bookmarks'
            });
        }
        // Process based on action type
        switch (action) {
            case 'delete':
                // Delete all specified bookmarks
                await db_1.default.bookmark.deleteMany({
                    where: {
                        id: { in: bookmarkIds },
                        userId // Only delete bookmarks owned by user
                    }
                });
                break;
            case 'addToFolder':
                // Verify folder exists and user has access
                if (!targetId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Target folder ID is required'
                    });
                }
                const folder = await db_1.default.folder.findFirst({
                    where: {
                        id: targetId,
                        OR: [
                            { userId },
                            { collaborators: { some: { userId, permission: { in: ['edit', 'admin'] } } } }
                        ]
                    }
                });
                if (!folder) {
                    return res.status(404).json({
                        success: false,
                        message: 'Target folder not found or you do not have permission'
                    });
                }
                // Add bookmarks to folder
                for (const bookmarkId of bookmarkIds) {
                    // Check if already in folder
                    const existingFolderRelation = await db_1.default.folderBookmark.findUnique({
                        where: {
                            folderId_bookmarkId: {
                                folderId: targetId,
                                bookmarkId
                            }
                        }
                    });
                    if (!existingFolderRelation) {
                        await db_1.default.folderBookmark.create({
                            data: {
                                folderId: targetId,
                                bookmarkId
                            }
                        });
                    }
                }
                break;
            case 'removeFromFolder':
                // Verify folder exists and user has access
                if (!targetId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Target folder ID is required'
                    });
                }
                const folderToRemoveFrom = await db_1.default.folder.findFirst({
                    where: {
                        id: targetId,
                        OR: [
                            { userId },
                            { collaborators: { some: { userId, permission: { in: ['edit', 'admin'] } } } }
                        ]
                    }
                });
                if (!folderToRemoveFrom) {
                    return res.status(404).json({
                        success: false,
                        message: 'Target folder not found or you do not have permission'
                    });
                }
                // Remove bookmarks from folder
                await db_1.default.folderBookmark.deleteMany({
                    where: {
                        folderId: targetId,
                        bookmarkId: { in: bookmarkIds }
                    }
                });
                break;
            case 'addTag':
                // Verify tag exists and user has access
                if (!targetId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Target tag ID is required'
                    });
                }
                const tag = await db_1.default.tag.findFirst({
                    where: {
                        id: targetId,
                        userId
                    }
                });
                if (!tag) {
                    return res.status(404).json({
                        success: false,
                        message: 'Tag not found'
                    });
                }
                // Add tag to bookmarks
                for (const bookmarkId of bookmarkIds) {
                    // Check if tag is already applied
                    const existingTagRelation = await db_1.default.bookmarkTag.findUnique({
                        where: {
                            tagId_bookmarkId: {
                                tagId: targetId,
                                bookmarkId
                            }
                        }
                    });
                    if (!existingTagRelation) {
                        await db_1.default.bookmarkTag.create({
                            data: {
                                tagId: targetId,
                                bookmarkId
                            }
                        });
                    }
                }
                break;
            case 'removeTag':
                // Verify tag exists and user has access
                if (!targetId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Target tag ID is required'
                    });
                }
                const tagToRemove = await db_1.default.tag.findFirst({
                    where: {
                        id: targetId,
                        userId
                    }
                });
                if (!tagToRemove) {
                    return res.status(404).json({
                        success: false,
                        message: 'Tag not found'
                    });
                }
                // Remove tag from bookmarks
                await db_1.default.bookmarkTag.deleteMany({
                    where: {
                        tagId: targetId,
                        bookmarkId: { in: bookmarkIds }
                    }
                });
                break;
            case 'addToCollection':
                // Verify collection exists and user has access
                if (!targetId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Target collection ID is required'
                    });
                }
                const collection = await db_1.default.collection.findFirst({
                    where: {
                        id: targetId,
                        OR: [
                            { userId },
                            { collaborators: { some: { userId, permission: { in: ['edit', 'admin'] } } } }
                        ]
                    }
                });
                if (!collection) {
                    return res.status(404).json({
                        success: false,
                        message: 'Collection not found or you do not have permission'
                    });
                }
                // Add bookmarks to collection
                for (const bookmarkId of bookmarkIds) {
                    // Check if already in collection
                    const existingCollectionRelation = await db_1.default.bookmarkCollection.findUnique({
                        where: {
                            collectionId_bookmarkId: {
                                collectionId: targetId,
                                bookmarkId
                            }
                        }
                    });
                    if (!existingCollectionRelation) {
                        await db_1.default.bookmarkCollection.create({
                            data: {
                                collectionId: targetId,
                                bookmarkId
                            }
                        });
                    }
                }
                break;
            case 'removeFromCollection':
                // Verify collection exists and user has access
                if (!targetId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Target collection ID is required'
                    });
                }
                const collectionToRemoveFrom = await db_1.default.collection.findFirst({
                    where: {
                        id: targetId,
                        OR: [
                            { userId },
                            { collaborators: { some: { userId, permission: { in: ['edit', 'admin'] } } } }
                        ]
                    }
                });
                if (!collectionToRemoveFrom) {
                    return res.status(404).json({
                        success: false,
                        message: 'Collection not found or you do not have permission'
                    });
                }
                // Remove bookmarks from collection
                await db_1.default.bookmarkCollection.deleteMany({
                    where: {
                        collectionId: targetId,
                        bookmarkId: { in: bookmarkIds }
                    }
                });
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: `Unsupported action: ${action}`
                });
        }
        res.status(200).json({
            success: true,
            message: 'Bulk action completed successfully'
        });
    }
    catch (error) {
        logger_1.default.error('Error performing bulk action:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while performing bulk action'
        });
    }
};
exports.performBulkAction = performBulkAction;
// Import bookmarks
const importBookmarks = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { bookmarks, folderId } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }
        if (!Array.isArray(bookmarks) || bookmarks.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No bookmarks provided for import'
            });
        }
        // Check if folder exists and user has access (if provided)
        let folder;
        if (folderId) {
            folder = await db_1.default.folder.findFirst({
                where: {
                    id: folderId,
                    OR: [
                        { userId },
                        { collaborators: { some: { userId, permission: { in: ['edit', 'admin'] } } } }
                    ]
                }
            });
            if (!folder) {
                return res.status(404).json({
                    success: false,
                    message: 'Target folder not found or you do not have permission'
                });
            }
        }
        // Import count stats
        const stats = {
            total: bookmarks.length,
            imported: 0,
            failed: 0
        };
        // Process bookmarks
        for (const bookmark of bookmarks) {
            try {
                const { url, title, description, tags } = bookmark;
                if (!url) {
                    stats.failed++;
                    continue;
                }
                // Fetch metadata if needed
                let metadata = {};
                if (!title || !description) {
                    try {
                        metadata = await (0, metadata_1.fetchUrlMetadata)(url); // Corrected function call
                    }
                    catch (error) {
                        logger_1.default.error(`Error fetching metadata for ${url}:`, error);
                        // Continue without metadata
                    }
                }
                // Create the bookmark
                const newBookmark = await db_1.default.bookmark.create({
                    data: {
                        url,
                        title: title || metadata.title || 'Untitled',
                        description: description || metadata.description || '',
                        favicon: metadata.favicon || null,
                        previewImage: metadata.previewImage || null,
                        userId
                    }
                });
                // Add to folder if specified
                if (folder) {
                    await db_1.default.folderBookmark.create({
                        data: {
                            folderId: folder.id,
                            bookmarkId: newBookmark.id
                        }
                    });
                }
                // Process tags if provided
                if (tags && Array.isArray(tags) && tags.length > 0) {
                    for (const tagName of tags) {
                        // Find or create tag
                        let tag = await db_1.default.tag.findFirst({
                            where: {
                                name: tagName,
                                userId
                            }
                        });
                        if (!tag) {
                            tag = await db_1.default.tag.create({
                                data: {
                                    name: tagName,
                                    userId,
                                    color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}` // Random color
                                }
                            });
                        }
                        // Add tag to bookmark
                        await db_1.default.bookmarkTag.create({
                            data: {
                                tagId: tag.id,
                                bookmarkId: newBookmark.id
                            }
                        });
                    }
                }
                stats.imported++;
            }
            catch (error) {
                logger_1.default.error('Error importing bookmark:', error);
                stats.failed++;
            }
        }
        res.status(200).json({
            success: true,
            message: 'Import completed',
            stats
        });
    }
    catch (error) {
        logger_1.default.error('Error importing bookmarks:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while importing bookmarks'
        });
    }
};
exports.importBookmarks = importBookmarks;
// Export bookmarks
const exportBookmarks = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { format = 'json', folderId } = req.query;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }
        // Build where clause for bookmarks
        const where = {
            OR: [
                { userId },
                { folders: { some: { folder: { collaborators: { some: { userId } } } } } },
                { collections: { some: { collection: { collaborators: { some: { userId } } } } } }
            ]
        };
        // Filter by folder if provided
        if (folderId) {
            where.folders = {
                some: {
                    folderId: folderId
                }
            };
        }
        // Get bookmarks with tags and folders
        const bookmarks = await db_1.default.bookmark.findMany({
            where,
            include: {
                folders: {
                    include: {
                        folder: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                tags: {
                    include: {
                        tag: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });
        // Process export format
        switch (format) {
            case 'json':
                // Transform to a clean export structure
                const jsonExport = bookmarks.map(bookmark => ({
                    url: bookmark.url,
                    title: bookmark.title,
                    description: bookmark.description,
                    notes: bookmark.notes,
                    createdAt: bookmark.createdAt,
                    tags: bookmark.tags.map(t => t.tag.name),
                    folders: bookmark.folders.map(f => f.folder.name)
                }));
                res.status(200).json({
                    success: true,
                    bookmarks: jsonExport
                });
                break;
            case 'html':
                // Generate HTML export (for browser import compatibility)
                let html = '<!DOCTYPE NETSCAPE-Bookmark-file-1>\n';
                html += '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n';
                html += '<TITLE>Bookmarks</TITLE>\n';
                html += '<H1>Bookmarks</H1>\n';
                html += '<DL><p>\n';
                // Group by folders
                const folderMap = new Map();
                // Add bookmarks without folders first
                bookmarks.forEach(bookmark => {
                    if (bookmark.folders.length === 0) {
                        html += `    <DT><A HREF="${bookmark.url}" ADD_DATE="${Math.floor(bookmark.createdAt.getTime() / 1000)}">${bookmark.title}</A>\n`;
                        if (bookmark.description) {
                            html += `    <DD>${bookmark.description}\n`;
                        }
                    }
                    else {
                        // Group by folders
                        bookmark.folders.forEach(folderRel => {
                            const folderName = folderRel.folder.name;
                            if (!folderMap.has(folderName)) {
                                folderMap.set(folderName, []);
                            }
                            folderMap.get(folderName).push(bookmark);
                        });
                    }
                });
                // Add folders with their bookmarks
                folderMap.forEach((folderBookmarks, folderName) => {
                    html += `    <DT><H3>${folderName}</H3>\n`;
                    html += '    <DL><p>\n';
                    folderBookmarks.forEach(bookmark => {
                        html += `        <DT><A HREF="${bookmark.url}" ADD_DATE="${Math.floor(bookmark.createdAt.getTime() / 1000)}">${bookmark.title}</A>\n`;
                        if (bookmark.description) {
                            html += `        <DD>${bookmark.description}\n`;
                        }
                    });
                    html += '    </DL><p>\n';
                });
                html += '</DL><p>';
                res.setHeader('Content-Type', 'text/html');
                res.setHeader('Content-Disposition', 'attachment; filename="bookmarks.html"');
                res.status(200).send(html);
                break;
            case 'csv':
                // Generate CSV content
                let csv = 'URL,Title,Description,Notes,Created Date,Tags,Folders\n';
                bookmarks.forEach(bookmark => {
                    const tags = bookmark.tags.map(t => t.tag.name).join('; ');
                    const folders = bookmark.folders.map(f => f.folder.name).join('; ');
                    // Escape fields for CSV
                    const escapeCsv = (field) => {
                        if (field === null)
                            return '';
                        return `"${field.replace(/"/g, '""')}"`;
                    };
                    csv += [
                        escapeCsv(bookmark.url),
                        escapeCsv(bookmark.title),
                        escapeCsv(bookmark.description),
                        escapeCsv(bookmark.notes),
                        bookmark.createdAt.toISOString(),
                        escapeCsv(tags),
                        escapeCsv(folders)
                    ].join(',') + '\n';
                });
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename="bookmarks.csv"');
                res.status(200).send(csv);
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: `Unsupported export format: ${format}`
                });
        }
    }
    catch (error) {
        logger_1.default.error('Error exporting bookmarks:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while exporting bookmarks'
        });
    }
};
exports.exportBookmarks = exportBookmarks;
// Sync bookmarks
const syncBookmarks = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { lastSyncTimestamp, bookmarks } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }
        const lastSync = lastSyncTimestamp ? new Date(lastSyncTimestamp) : new Date(0);
        // Get server-side changes since last sync
        const serverChanges = await db_1.default.bookmark.findMany({
            where: {
                userId,
                OR: [
                    { updatedAt: { gt: lastSync } },
                    { createdAt: { gt: lastSync } }
                ]
            },
            include: {
                folders: {
                    include: {
                        folder: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                tags: {
                    include: {
                        tag: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });
        // Get deleted bookmarks since last sync
        const deletedBookmarks = await db_1.default.deletedBookmark.findMany({
            where: {
                userId,
                deletedAt: { gt: lastSync }
            }
        });
        // Process client-side changes
        const clientChanges = {
            processed: 0,
            conflicts: 0
        };
        if (bookmarks && Array.isArray(bookmarks)) {
            for (const bookmark of bookmarks) {
                try {
                    const { id, url, title, description, notes, updatedAt, deleted, folderId, tagIds } = bookmark;
                    // Check if already exists
                    const existing = id ? await db_1.default.bookmark.findFirst({
                        where: { id, userId }
                    }) : null;
                    // Handle deletion
                    if (deleted) {
                        if (existing) {
                            await db_1.default.bookmark.delete({
                                where: { id }
                            });
                            // Record deletion for future syncs
                            await db_1.default.deletedBookmark.create({
                                data: {
                                    bookmarkId: id,
                                    userId
                                }
                            });
                        }
                        clientChanges.processed++;
                        continue;
                    }
                    if (existing) {
                        // Check for conflicts
                        const clientTimestamp = new Date(updatedAt);
                        const serverTimestamp = existing.updatedAt;
                        if (clientTimestamp > serverTimestamp) {
                            // Client version is newer, update server
                            await db_1.default.bookmark.update({
                                where: { id },
                                data: {
                                    title,
                                    description,
                                    notes,
                                    url,
                                    updatedAt: new Date()
                                }
                            });
                            // Handle folder assignment
                            if (folderId) {
                                // Remove from current folders and add to new folder
                                await db_1.default.folderBookmark.deleteMany({
                                    where: { bookmarkId: id }
                                });
                                await db_1.default.folderBookmark.create({
                                    data: {
                                        bookmarkId: id,
                                        folderId
                                    }
                                });
                            }
                            // Handle tags assignment
                            if (tagIds && Array.isArray(tagIds)) {
                                // Remove current tags
                                await db_1.default.bookmarkTag.deleteMany({
                                    where: { bookmarkId: id }
                                });
                                // Add new tags
                                for (const tagId of tagIds) {
                                    await db_1.default.bookmarkTag.create({
                                        data: {
                                            bookmarkId: id,
                                            tagId
                                        }
                                    });
                                }
                            }
                        }
                        else if (clientTimestamp < serverTimestamp) {
                            // Server version is newer, mark as conflict
                            clientChanges.conflicts++;
                        }
                    }
                    else {
                        // Create new bookmark
                        const newBookmark = await db_1.default.bookmark.create({
                            data: {
                                id, // Use client ID if provided
                                url,
                                title,
                                description: description || '',
                                notes: notes || null,
                                userId
                            }
                        });
                        // Handle folder assignment
                        if (folderId) {
                            await db_1.default.folderBookmark.create({
                                data: {
                                    bookmarkId: newBookmark.id,
                                    folderId
                                }
                            });
                        }
                        // Handle tags assignment
                        if (tagIds && Array.isArray(tagIds)) {
                            for (const tagId of tagIds) {
                                await db_1.default.bookmarkTag.create({
                                    data: {
                                        bookmarkId: newBookmark.id,
                                        tagId
                                    }
                                });
                            }
                        }
                    }
                    clientChanges.processed++;
                }
                catch (error) {
                    logger_1.default.error('Error processing client bookmark:', error);
                }
            }
        }
        res.status(200).json({
            success: true,
            serverChanges,
            deletedBookmarks: deletedBookmarks.map(d => d.bookmarkId),
            clientChangesProcessed: clientChanges.processed,
            conflicts: clientChanges.conflicts,
            syncTimestamp: new Date().toISOString()
        });
    }
    catch (error) {
        logger_1.default.error('Error syncing bookmarks:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while syncing bookmarks'
        });
    }
};
exports.syncBookmarks = syncBookmarks;
//# sourceMappingURL=bookmark.controller.js.map