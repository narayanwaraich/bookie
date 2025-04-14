// src/services/sync.service.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'; // Added afterEach
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient, Prisma, Bookmark, Folder, Tag, Collection, Role } from '@prisma/client';
import prisma from '../config/db';
import * as syncService from './sync.service';
import { SyncError, ClientChangesPayload, SyncResponse, AnyClientChange, AnyServerRecord } from './sync.service'; // Import necessary types
import logger from '../config/logger';
import { emitToUser, SOCKET_EVENTS } from './socket.service';
import { FolderError } from './folder.service'; // Import FolderError for folder checks
import { TagError } from './tag.service'; // Import TagError
import { CollectionError } from './collection.service'; // Import CollectionError
import { v4 as uuidv4 } from 'uuid';

// --- Mocks ---

vi.mock('../config/db', async () => {
  const originalModule = await vi.importActual('../config/db');
  return {
    ...originalModule,
    default: mockDeep<PrismaClient>(),
  };
});

vi.mock('./socket.service', () => ({
  emitToUser: vi.fn(),
  SOCKET_EVENTS: {
    BOOKMARK_CREATED: 'bookmark:created', BOOKMARK_UPDATED: 'bookmark:updated', BOOKMARK_DELETED: 'bookmark:deleted',
    FOLDER_CREATED: 'folder:created', FOLDER_UPDATED: 'folder:updated', FOLDER_DELETED: 'folder:deleted',
    TAG_CREATED: 'tag:created', TAG_UPDATED: 'tag:updated', TAG_DELETED: 'tag:deleted',
    COLLECTION_CREATED: 'collection:created', COLLECTION_UPDATED: 'collection:updated', COLLECTION_DELETED: 'collection:deleted',
  }
}));

vi.mock('../config/logger', () => ({
  default: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
}));

vi.mock('uuid', () => ({ v4: vi.fn() }));

// --- Tests ---

describe('Sync Service', () => {
  let mockPrisma: DeepMockProxy<PrismaClient>;
  const mockEmitToUser = vi.mocked(emitToUser);
  const mockLogger = vi.mocked(logger);
  const mockUuidv4 = vi.mocked(uuidv4);

  const userId = 'user-sync-test';
  const now = new Date();
  const lastSyncTimestamp = new Date(now.getTime() - 10000).toISOString(); // 10 seconds ago

  // Helper to create mock data
  // Updated to include relations for type safety with includes
  const createMockBookmark = (id: string, userId: string, updatedAt: Date, overrides = {}): Bookmark & { tags: any[], folders: any[] } => ({
    id, userId, url: `http://test.com/${id}`, title: `Bookmark ${id}`, description: null, favicon: null, previewImage: null, createdAt: new Date(updatedAt.getTime() - 5000), updatedAt, lastVisited: null, visitCount: 0, notes: null, isDeleted: false, deletedAt: null,
    tags: [], // Add default empty relations
    folders: [], // Add default empty relations
    ...overrides
  });
  const createMockFolder = (id: string, userId: string, updatedAt: Date, overrides = {}): Folder => ({
    id, userId, parentId: null, name: `Folder ${id}`, description: null, icon: null, color: null, createdAt: new Date(updatedAt.getTime() - 5000), updatedAt, isDeleted: false, deletedAt: null, ...overrides
  });
  const createMockTag = (id: string, userId: string, updatedAt: Date, overrides = {}): Tag => ({
    id, userId, name: `Tag ${id}`, color: null, createdAt: new Date(updatedAt.getTime() - 5000), updatedAt, isDeleted: false, deletedAt: null, ...overrides
  });
  const createMockCollection = (id: string, userId: string, updatedAt: Date, overrides = {}): Collection => ({
    id, userId, ownerId: userId, name: `Collection ${id}`, description: null, isPublic: false, publicLink: null, thumbnail: null, createdAt: new Date(updatedAt.getTime() - 5000), updatedAt, isDeleted: false, deletedAt: null, ...overrides
  });

  beforeEach(() => {
    vi.resetAllMocks();
    mockPrisma = prisma as unknown as DeepMockProxy<PrismaClient>;
    mockPrisma.$transaction.mockImplementation(async (callback) => callback(mockPrisma));
    vi.useFakeTimers(); // Use fake timers
    vi.setSystemTime(now); // Set system time to 'now'
  });

  afterEach(() => { // Added afterEach
    vi.useRealTimers(); // Restore real timers
  });

  it('should fetch server changes since last sync', async () => {
    const serverBookmark = createMockBookmark('bm-server', userId, new Date(now.getTime() - 5000));
    const serverFolder = createMockFolder('f-server', userId, new Date(now.getTime() - 4000));
    const serverTag = createMockTag('t-server', userId, new Date(now.getTime() - 3000));
    const serverCollection = createMockCollection('c-server', userId, new Date(now.getTime() - 2000));
    const deletedBookmarkId = 'bm-deleted';
    const deletedFolderId = 'f-deleted';

    // Mock findMany to return arrays with the correct structure including relations
    mockPrisma.bookmark.findMany
      .mockResolvedValueOnce([serverBookmark]) // Updated bookmarks
      .mockResolvedValueOnce([{ id: deletedBookmarkId } as Bookmark]); // Deleted bookmarks
    mockPrisma.folder.findMany
      .mockResolvedValueOnce([serverFolder]) // Updated folders
      .mockResolvedValueOnce([{ id: deletedFolderId } as Folder]); // Deleted folders
    mockPrisma.tag.findMany.mockResolvedValueOnce([serverTag]).mockResolvedValueOnce([]);
    mockPrisma.collection.findMany.mockResolvedValueOnce([serverCollection]).mockResolvedValueOnce([]);

    const clientChanges: ClientChangesPayload = {}; // No client changes in this test

    const result = await syncService.syncData(userId, lastSyncTimestamp, clientChanges);

    expect(result.success).toBe(true);
    // Assert against the structure including the 'type' property added by the service
    expect(result.serverChanges).toEqual([
      expect.objectContaining({ type: 'bookmark', id: serverBookmark.id }),
      expect.objectContaining({ type: 'folder', id: serverFolder.id }),
      expect.objectContaining({ type: 'tag', id: serverTag.id }),
      expect.objectContaining({ type: 'collection', id: serverCollection.id }),
    ]);
    expect(result.deletedIds).toEqual({
      bookmarks: [deletedBookmarkId], folders: [deletedFolderId], tags: [], collections: []
    });
    expect(result.conflicts).toEqual([]);
    expect(result.newSyncTimestamp).toBe(now.toISOString());
  });

  it('should process client creations', async () => {
    const newBookmarkId = 'bm-client-new';
    const newFolderId = 'f-client-new';
    const clientChanges: ClientChangesPayload = {
      bookmarks: [{ id: newBookmarkId, url: 'http://new.client', title: 'New Client BM', updatedAt: now.toISOString() }],
      folders: [{ id: newFolderId, name: 'New Client Folder', updatedAt: now.toISOString() }]
    };
    const createdBookmark = createMockBookmark(newBookmarkId, userId, now);
    const createdFolder = createMockFolder(newFolderId, userId, now);

    // Mock finds for server changes (return empty)
    mockPrisma.bookmark.findMany.mockResolvedValue([]);
    mockPrisma.folder.findMany.mockResolvedValue([]);
    mockPrisma.tag.findMany.mockResolvedValue([]);
    mockPrisma.collection.findMany.mockResolvedValue([]);
    // Mock finds for existing check (return null)
    mockPrisma.bookmark.findUnique.mockResolvedValue(null);
    mockPrisma.folder.findUnique.mockResolvedValue(null);
    // Mock create calls
    mockPrisma.bookmark.create.mockResolvedValue(createdBookmark);
    mockPrisma.folder.create.mockResolvedValue(createdFolder);
    // Mock findUnique after create for includes
    mockPrisma.bookmark.findUnique.mockResolvedValue(createdBookmark); // Already includes empty relations

    const result = await syncService.syncData(userId, lastSyncTimestamp, clientChanges);

    expect(result.success).toBe(true);
    expect(mockPrisma.$transaction).toHaveBeenCalledTimes(2); // Once per entity type with changes
    expect(mockPrisma.bookmark.create).toHaveBeenCalledWith({ data: expect.objectContaining({ id: newBookmarkId, userId }) });
    expect(mockPrisma.folder.create).toHaveBeenCalledWith({ data: expect.objectContaining({ id: newFolderId, userId }) });
    expect(mockEmitToUser).toHaveBeenCalledWith(userId, SOCKET_EVENTS.BOOKMARK_CREATED, expect.objectContaining({ id: newBookmarkId })); // Use objectContaining
    expect(mockEmitToUser).toHaveBeenCalledWith(userId, SOCKET_EVENTS.FOLDER_CREATED, createdFolder);
    expect(result.conflicts).toEqual([]);
    expect(result.serverChanges).toEqual([]);
  });

  it('should process client updates', async () => {
    const bookmarkId = 'bm-client-update';
    const existingBookmark = createMockBookmark(bookmarkId, userId, new Date(now.getTime() - 20000)); // Older than last sync
    const clientChange = { id: bookmarkId, title: 'Updated Client Title', updatedAt: now.toISOString(), lastServerUpdatedAt: existingBookmark.updatedAt.toISOString() };
    const clientChanges: ClientChangesPayload = { bookmarks: [clientChange] };
    const updatedBookmark = { ...existingBookmark, title: clientChange.title, updatedAt: now };

    // Mock finds for server changes (return empty)
    mockPrisma.bookmark.findMany.mockResolvedValue([]);
    mockPrisma.folder.findMany.mockResolvedValue([]);
    mockPrisma.tag.findMany.mockResolvedValue([]);
    mockPrisma.collection.findMany.mockResolvedValue([]);
    // Mock find for existing check
    mockPrisma.bookmark.findUnique.mockResolvedValue(existingBookmark);
    // Mock update call
    mockPrisma.bookmark.update.mockResolvedValue(updatedBookmark);
    // Mock findUnique after update for includes
    mockPrisma.bookmark.findUnique.mockResolvedValue(updatedBookmark); // Already includes empty relations


    const result = await syncService.syncData(userId, lastSyncTimestamp, clientChanges);

    expect(result.success).toBe(true);
    expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
    expect(mockPrisma.bookmark.findUnique).toHaveBeenCalledWith({ where: { id: bookmarkId } });
    expect(mockPrisma.bookmark.update).toHaveBeenCalledWith({ where: { id: bookmarkId }, data: expect.objectContaining({ title: clientChange.title, updatedAt: now }) });
    expect(mockEmitToUser).toHaveBeenCalledWith(userId, SOCKET_EVENTS.BOOKMARK_UPDATED, expect.objectContaining({ id: bookmarkId })); // Use objectContaining
    expect(result.conflicts).toEqual([]);
  });

  it('should detect update conflict (server newer)', async () => {
    const bookmarkId = 'bm-conflict';
    const serverUpdatedAt = new Date(now.getTime() - 1000); // Newer than client's last known
    const existingBookmark = createMockBookmark(bookmarkId, userId, serverUpdatedAt);
    const clientChange = { id: bookmarkId, title: 'Client Conflict Title', updatedAt: now.toISOString(), lastServerUpdatedAt: new Date(now.getTime() - 5000).toISOString() }; // Client based on older version
    const clientChanges: ClientChangesPayload = { bookmarks: [clientChange] };

    // Mock finds for server changes (return empty)
    mockPrisma.bookmark.findMany.mockResolvedValue([]);
    mockPrisma.folder.findMany.mockResolvedValue([]);
    mockPrisma.tag.findMany.mockResolvedValue([]);
    mockPrisma.collection.findMany.mockResolvedValue([]);
    // Mock find for existing check
    mockPrisma.bookmark.findUnique.mockResolvedValue(existingBookmark);

    const result = await syncService.syncData(userId, lastSyncTimestamp, clientChanges);

    expect(result.success).toBe(true);
    expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
    expect(mockPrisma.bookmark.findUnique).toHaveBeenCalledWith({ where: { id: bookmarkId } });
    expect(mockPrisma.bookmark.update).not.toHaveBeenCalled(); // Update should NOT happen
    expect(result.conflicts).toHaveLength(1);
    expect(result.conflicts[0]).toEqual({ type: 'bookmark', clientChange, serverRecord: existingBookmark });
    expect(mockEmitToUser).not.toHaveBeenCalled(); // No emit on conflict
  });

  it('should process client deletions', async () => {
    const bookmarkIdToDelete = 'bm-client-delete';
    const existingBookmark = createMockBookmark(bookmarkIdToDelete, userId, new Date(now.getTime() - 20000));
    const clientChange = { id: bookmarkIdToDelete, isDeleted: true, updatedAt: now.toISOString(), lastServerUpdatedAt: existingBookmark.updatedAt.toISOString() };
    const clientChanges: ClientChangesPayload = { bookmarks: [clientChange] };

    // Mock finds for server changes (return empty)
    mockPrisma.bookmark.findMany.mockResolvedValue([]);
    mockPrisma.folder.findMany.mockResolvedValue([]);
    mockPrisma.tag.findMany.mockResolvedValue([]);
    mockPrisma.collection.findMany.mockResolvedValue([]);
    // Mock find for existing check
    mockPrisma.bookmark.findUnique.mockResolvedValue(existingBookmark);
    // Mock update for soft delete
    mockPrisma.bookmark.update.mockResolvedValue({ ...existingBookmark, isDeleted: true, deletedAt: now });

    const result = await syncService.syncData(userId, lastSyncTimestamp, clientChanges);

    expect(result.success).toBe(true);
    expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
    expect(mockPrisma.bookmark.findUnique).toHaveBeenCalledWith({ where: { id: bookmarkIdToDelete } });
    expect(mockPrisma.bookmark.update).toHaveBeenCalledWith({ where: { id: bookmarkIdToDelete }, data: { isDeleted: true, deletedAt: now } });
    expect(mockEmitToUser).toHaveBeenCalledWith(userId, SOCKET_EVENTS.BOOKMARK_DELETED, { id: bookmarkIdToDelete });
    expect(result.conflicts).toEqual([]);
  });

  // TODO: Add more tests covering edge cases, different entity types, relation syncing, error handling within transactions.
});
