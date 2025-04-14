"use strict";
// src/controllers/folderController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFolderPath = exports.deleteFolder = exports.updateFolder = exports.getFolder = exports.getFolderTree = exports.getFolders = exports.createFolder = void 0;
const client_1 = require("@prisma/client"); // Ensure Prisma namespace is imported
const zod_1 = require("zod");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
// Schema validation for folder creation
const createFolderSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    parentId: zod_1.z.string().uuid().optional().nullable(), // Allow null for root folders
    description: zod_1.z.string().max(500).optional(),
    icon: zod_1.z.string().max(50).optional(),
    color: zod_1.z.string().max(20).optional(),
});
// Schema validation for folder update
const updateFolderSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100).optional(),
    parentId: zod_1.z.string().uuid().nullable().optional(),
    description: zod_1.z.string().max(500).optional(),
    icon: zod_1.z.string().max(50).optional(),
    color: zod_1.z.string().max(20).optional(),
});
/**
 * Helper to get all descendant folder IDs (for deletion)
 */
async function getAllDescendantIds(folderId, userId) {
    const folders = await prisma.folder.findMany({
        where: {
            parentId: folderId,
            userId,
        },
        select: {
            id: true,
        },
    });
    const childIds = folders.map(folder => folder.id);
    if (childIds.length === 0) {
        return [];
    }
    const descendantIds = [...childIds];
    for (const childId of childIds) {
        const descendants = await getAllDescendantIds(childId, userId);
        descendantIds.push(...descendants);
    }
    return descendantIds;
}
/**
 * Check if creating a folder with the given parent would create a circular reference
 */
async function wouldCreateCircularReference(folderId, parentId, userId) {
    if (!parentId || !folderId) {
        return false;
    }
    if (folderId === parentId) {
        return true;
    }
    const descendantIds = await getAllDescendantIds(folderId, userId);
    return descendantIds.includes(parentId);
}
/**
 * Create a new folder
 */
const createFolder = async (req, res) => {
    try {
        const userId = req.user.id;
        const validatedData = createFolderSchema.parse(req.body);
        const existingFolder = await prisma.folder.findFirst({
            where: {
                name: validatedData.name,
                userId,
                parentId: validatedData.parentId || null,
            },
        });
        if (existingFolder) {
            return res.status(400).json({
                success: false,
                message: 'A folder with this name already exists at this level',
            });
        }
        if (validatedData.parentId) {
            const parentFolder = await prisma.folder.findFirst({
                where: {
                    id: validatedData.parentId,
                    userId,
                },
            });
            if (!parentFolder) {
                return res.status(404).json({
                    success: false,
                    message: 'Parent folder not found',
                });
            }
        }
        const parentIdValue = validatedData.parentId;
        const folder = await prisma.folder.create({
            data: {
                id: (0, uuid_1.v4)(),
                name: validatedData.name,
                description: validatedData.description,
                icon: validatedData.icon,
                color: validatedData.color,
                parentId: parentIdValue ?? null, // Use nullish coalescing on variable
                userId,
            },
        });
        res.status(201).json({
            success: true,
            data: folder,
        });
    }
    catch (error) {
        console.error('Error creating folder:', error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Invalid input data',
                errors: error.errors,
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to create folder',
        });
    }
};
exports.createFolder = createFolder;
/**
 * Get all folders for a user
 */
const getFolders = async (req, res) => {
    try {
        const userId = req.user.id;
        const includeBookmarkCount = req.query.includeBookmarkCount === 'true';
        const folders = await prisma.folder.findMany({
            where: { userId },
            orderBy: [
                { parentId: 'asc' },
                { name: 'asc' },
            ],
            include: {
                bookmarks: includeBookmarkCount ? {
                    select: {
                        bookmarkId: true,
                    }
                } : false,
                _count: includeBookmarkCount ? {
                    select: { bookmarks: true }
                } : false,
            },
        });
        const transformedFolders = folders.map(folder => {
            if (includeBookmarkCount) {
                const { bookmarks, _count, ...rest } = folder;
                return {
                    ...rest,
                    bookmarkCount: _count?.bookmarks || 0,
                };
            }
            return folder;
        });
        res.status(200).json({
            success: true,
            data: transformedFolders,
        });
    }
    catch (error) {
        console.error('Error fetching folders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch folders',
        });
    }
};
exports.getFolders = getFolders;
/**
 * Get folder structure as a tree
 */
const getFolderTree = async (req, res) => {
    try {
        const userId = req.user.id;
        const includeBookmarkCount = req.query.includeBookmarkCount === 'true';
        const folders = await prisma.folder.findMany({
            where: { userId },
            orderBy: { name: 'asc' },
            include: {
                _count: includeBookmarkCount ? {
                    select: { bookmarks: true }
                } : false,
            },
        });
        const folderMap = {};
        const rootFolders = [];
        folders.forEach(folder => {
            folderMap[folder.id] = {
                ...folder,
                children: [],
                bookmarkCount: includeBookmarkCount ? folder._count?.bookmarks || 0 : undefined,
            };
            if (includeBookmarkCount && folderMap[folder.id]._count) {
                delete folderMap[folder.id]._count;
            }
        });
        folders.forEach(folder => {
            if (folder.parentId && folderMap[folder.parentId]) {
                folderMap[folder.parentId].children.push(folderMap[folder.id]);
            }
            else {
                rootFolders.push(folderMap[folder.id]);
            }
        });
        res.status(200).json({
            success: true,
            data: rootFolders,
        });
    }
    catch (error) {
        console.error('Error fetching folder tree:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch folder tree',
        });
    }
};
exports.getFolderTree = getFolderTree;
/**
 * Get a single folder by ID with bookmarks
 */
const getFolder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const folder = await prisma.folder.findFirst({
            where: {
                id,
                userId,
            },
        });
        if (!folder) {
            return res.status(404).json({
                success: false,
                message: 'Folder not found',
            });
        }
        const folderBookmarkConnections = await prisma.folderBookmark.findMany({
            where: { folderId: id },
            select: { bookmarkId: true },
        });
        const bookmarkIds = folderBookmarkConnections.map(b => b.bookmarkId);
        const [bookmarks, total] = await Promise.all([
            prisma.bookmark.findMany({
                where: {
                    id: { in: bookmarkIds },
                    userId,
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    tags: {
                        include: {
                            tag: true,
                        },
                    },
                },
            }),
            prisma.bookmark.count({
                where: {
                    id: { in: bookmarkIds },
                    userId,
                },
            }),
        ]);
        const subfolders = await prisma.folder.findMany({
            where: {
                parentId: id,
                userId,
            },
            orderBy: { name: 'asc' },
        });
        const parentFolderPath = [];
        let currentFolderId = folder.parentId;
        while (currentFolderId) {
            const parentFolder = await prisma.folder.findFirst({
                where: {
                    id: currentFolderId,
                    userId,
                },
                select: {
                    id: true,
                    name: true,
                    parentId: true,
                },
            });
            if (!parentFolder)
                break;
            parentFolderPath.unshift(parentFolder);
            currentFolderId = parentFolder.parentId;
        }
        res.status(200).json({
            success: true,
            data: {
                folder,
                bookmarks,
                subfolders,
                parentPath: parentFolderPath,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    }
    catch (error) {
        console.error('Error fetching folder:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch folder',
        });
    }
};
exports.getFolder = getFolder;
/**
 * Update a folder
 */
const updateFolder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const validatedData = updateFolderSchema.parse(req.body);
        const folder = await prisma.folder.findFirst({
            where: { id, userId },
        });
        if (!folder) {
            return res.status(404).json({
                success: false,
                message: 'Folder not found or you do not have permission to update it',
            });
        }
        if (validatedData.parentId !== undefined &&
            validatedData.parentId !== folder.parentId) {
            const wouldCreateCircular = await wouldCreateCircularReference(id, validatedData.parentId || null, userId);
            if (wouldCreateCircular) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot move folder as it would create a circular reference',
                });
            }
            if (validatedData.parentId) {
                const parentFolder = await prisma.folder.findFirst({
                    where: {
                        id: validatedData.parentId,
                        userId,
                    },
                });
                if (!parentFolder) {
                    return res.status(404).json({
                        success: false,
                        message: 'Parent folder not found',
                    });
                }
            }
        }
        if (validatedData.name && validatedData.name !== folder.name) {
            const parentId = validatedData.parentId !== undefined ?
                validatedData.parentId : folder.parentId;
            const existingFolder = await prisma.folder.findFirst({
                where: {
                    name: validatedData.name,
                    userId,
                    parentId: parentId || null,
                    id: { not: id },
                },
            });
            if (existingFolder) {
                return res.status(400).json({
                    success: false,
                    message: 'A folder with this name already exists at this level',
                });
            }
        }
        const updatedFolder = await prisma.folder.update({
            where: { id },
            data: {
                ...(validatedData.name !== undefined && { name: validatedData.name }),
                ...(validatedData.description !== undefined && { description: validatedData.description }),
                ...(validatedData.icon !== undefined && { icon: validatedData.icon }),
                ...(validatedData.color !== undefined && { color: validatedData.color }),
                ...(validatedData.parentId !== undefined && { parentId: validatedData.parentId }),
            },
        });
        res.status(200).json({
            success: true,
            data: updatedFolder,
            message: 'Folder updated successfully',
        });
    }
    catch (error) {
        console.error('Error updating folder:', error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Invalid input data',
                errors: error.errors,
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to update folder',
        });
    }
};
exports.updateFolder = updateFolder;
/**
 * Delete a folder and all its contents
 */
const deleteFolder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { moveBookmarksTo } = req.query;
        const folder = await prisma.folder.findFirst({
            where: { id, userId },
        });
        if (!folder) {
            return res.status(404).json({
                success: false,
                message: 'Folder not found or you do not have permission to delete it',
            });
        }
        const descendantIds = await getAllDescendantIds(id, userId);
        const allFolderIds = [id, ...descendantIds].filter((folderId) => !!folderId);
        await prisma.$transaction(async (tx) => {
            if (moveBookmarksTo) {
                const targetFolderId = moveBookmarksTo; // Explicitly typed const
                const targetFolder = await tx.folder.findFirst({
                    where: {
                        id: targetFolderId, // Use explicitly typed const
                        userId,
                    },
                });
                if (!targetFolder) {
                    throw new Error('Target folder not found');
                }
                const bookmarkConnections = await tx.folderBookmark.findMany({
                    where: {
                        folderId: { in: allFolderIds },
                    },
                });
                for (const connection of bookmarkConnections) {
                    const existingConnection = await tx.folderBookmark.findFirst({
                        where: {
                            bookmarkId: connection.bookmarkId,
                            folderId: targetFolderId, // Use explicitly typed const
                        },
                    });
                    if (!existingConnection) {
                        await tx.folderBookmark.create({
                            data: {
                                bookmarkId: connection.bookmarkId,
                                folderId: targetFolderId, // Use explicitly typed const
                            },
                        });
                    }
                }
            }
            await tx.folderBookmark.deleteMany({
                where: {
                    folderId: { in: allFolderIds },
                },
            });
            if (descendantIds.length > 0) {
                await tx.folder.deleteMany({
                    where: {
                        id: { in: descendantIds },
                    },
                });
            }
            await tx.folder.delete({
                where: { id },
            });
        });
        res.status(200).json({
            success: true,
            message: 'Folder and all its contents deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting folder:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to delete folder',
        });
    }
};
exports.deleteFolder = deleteFolder;
/**
 * Get folder path from root to current folder
 */
const getFolderPath = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const folder = await prisma.folder.findFirst({
            where: {
                id,
                userId,
            },
        });
        if (!folder) {
            return res.status(404).json({
                success: false,
                message: 'Folder not found',
            });
        }
        const path = [folder];
        let currentFolderId = folder.parentId;
        while (currentFolderId) {
            const parentFolder = await prisma.folder.findFirst({
                where: {
                    id: currentFolderId,
                    userId,
                },
            });
            if (!parentFolder)
                break;
            path.unshift(parentFolder);
            currentFolderId = parentFolder.parentId;
        }
        res.status(200).json({
            success: true,
            data: path,
        });
    }
    catch (error) {
        console.error('Error fetching folder path:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch folder path',
        });
    }
};
exports.getFolderPath = getFolderPath;
exports.default = {
    createFolder: exports.createFolder,
    getFolders: exports.getFolders,
    getFolderTree: exports.getFolderTree,
    getFolder: exports.getFolder,
    updateFolder: exports.updateFolder,
    deleteFolder: exports.deleteFolder,
    getFolderPath: exports.getFolderPath,
};
//# sourceMappingURL=folder.controller.js.map