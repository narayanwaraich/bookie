// src/controllers/bookmark.controller.ts
import { Request, Response } from 'express';
import prisma from '../config/db';
import logger from '../config/logger';
import { CreateBookmarkInput, UpdateBookmarkInput, BookmarkSearchInput, BulkActionInput } from '../models/schemas';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

/**
 * Fetch metadata from a URL
 */
async function fetchUrlMetadata(url: string) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Extract metadata
      const title = $('title').text() || $('meta[property="og:title"]').attr('content') || '';
      const description = $('meta[name="description"]').attr('content') || 
                          $('meta[property="og:description"]').attr('content') || '';
      const favicon = $('link[rel="icon"]').attr('href') || 
                     $('link[rel="shortcut icon"]').attr('href') || '';
      const previewImage = $('meta[property="og:image"]').attr('content') || '';
      
      // Ensure favicon URL is absolute
      const faviconUrl = favicon ? new URL(favicon, url).toString() : '';
      
      return {
        title,
        description,
        favicon: faviconUrl,
        previewImage,
      };
    } catch (error) {
      console.error(`Error fetching metadata for ${url}:`, error);
      return {
        title: '',
        description: '',
        favicon: '',
        previewImage: '',
      };
    }
  }


// Create bookmark
export const createBookmark = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { url, title, description, notes, folderId, tags }: CreateBookmarkInput = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Fetch metadata if title or description not provided
    let metadata: { title?: string; description?: string; favicon?: string; previewImage?: string } = {};
    
    if (!title || !description) {
      try {
        metadata = await fetchMetadata(url);
      } catch (error) {
        logger.error(`Error fetching metadata for ${url}:`, error);
        // Continue without metadata if fetch fails
      }
    }

    // Create bookmark
    const bookmark = await prisma.bookmark.create({
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
      const folder = await prisma.folder.findFirst({
        where: {
          id: folderId,
          OR: [
            { userId },
            { collaborators: { some: { userId } } }
          ]
        }
      });

      if (folder) {
        await prisma.folderBookmark.create({
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
      const existingTags = await prisma.tag.findMany({
        where: {
          id: { in: tags },
          userId
        }
      });

      // Create tag-bookmark relationships
      for (const tag of existingTags) {
        await prisma.bookmarkTag.create({
          data: {
            tagId: tag.id,
            bookmarkId: bookmark.id
          }
        });
      }
    }

    // Fetch complete bookmark with relations
    const completeBookmark = await prisma.bookmark.findUnique({
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
  } catch (error) {
    logger.error('Error creating bookmark:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating bookmark'
    });
  }
};

// Get bookmark by ID
export const getBookmark = async (req: Request, res: Response) => {
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
    const bookmark = await prisma.bookmark.findFirst({
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
    await prisma.bookmark.update({
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
  } catch (error) {
    logger.error('Error getting bookmark:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookmark'
    });
  }
};

// Update bookmark
export const updateBookmark = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { title, description, notes }: UpdateBookmarkInput = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Check if bookmark exists and belongs to user
    const existingBookmark = await prisma.bookmark.findFirst({
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
    const bookmark = await prisma.bookmark.update({
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
  } catch (error) {
    logger.error('Error updating bookmark:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating bookmark'
    });
  }
};

// Delete bookmark
export const deleteBookmark = async (req: Request, res: Response) => {
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
    const bookmark = await prisma.bookmark.findFirst({
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
    await prisma.bookmark.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Bookmark deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting bookmark:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting bookmark'
    });
  }
};

// Search bookmarks
export const searchBookmarks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const {
      query,
      folderId,
      tagIds,
      limit = 20,
      offset = 0,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    }: BookmarkSearchInput = req.query as any;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Build where clause
    const where: any = {
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
    const totalCount = await prisma.bookmark.count({ where });

    // Get bookmarks with pagination and sorting
    const bookmarks = await prisma.bookmark.findMany({
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
  } catch (error) {
    logger.error('Error searching bookmarks:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching bookmarks'
    });
  }
};

// Add bookmark to folder
export const addBookmarkToFolder = async (req: Request, res: Response) => {
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
    const bookmark = await prisma.bookmark.findFirst({
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
    const folder = await prisma.folder.findFirst({
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
    const existing = await prisma.folderBookmark.findUnique({
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
    await prisma.folderBookmark.create({
      data: {
        folderId,
        bookmarkId
      }
    });

    res.status(200).json({
      success: true,
      message: 'Bookmark added to folder successfully'
    });
  } catch (error) {
    logger.error('Error adding bookmark to folder:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding bookmark to folder'
    });
  }
};

// Remove bookmark from folder
export const removeBookmarkFromFolder = async (req: Request, res: Response) => {
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
    const bookmark = await prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        OR: [
          { userId },
          { folders: { some: { folder: { collaborators: { some: { userId } } } } } }
        ]
      }
    });

    const folder = await prisma.folder.findFirst({
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
    await prisma.folderBookmark.delete({
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
  } catch (error) {
    logger.error('Error removing bookmark from folder:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing bookmark from folder'
    });
  }
};

// Add tag to bookmark
export const addTagToBookmark = async (req: Request, res: Response) => {
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
    const bookmark = await prisma.bookmark.findFirst({
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
    const tag = await prisma.tag.findFirst({
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
    const existing = await prisma.bookmarkTag.findUnique({
      where: {
        tagId_bookmarkId: {
          tagId,
          bookmarkId
        }
      }
    });

