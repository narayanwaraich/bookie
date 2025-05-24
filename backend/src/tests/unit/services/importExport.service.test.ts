// src/services/importExport.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockReset } from 'vitest-mock-extended'; // Import mockReset
import prisma from '../config/db';
import * as importExportService from './importExport.service';
import { ImportExportError } from './importExport.service';
import logger from '../config/logger';
import Papa, { ParseConfig, ParseResult } from 'papaparse'; // Import types
import { createObjectCsvWriter } from 'csv-writer';
import cheerio from 'cheerio';
import { Readable } from 'stream';
import { Role, Folder, Bookmark, Tag, Prisma } from '@prisma/client'; // Import necessary types

// --- Mocks ---

// Prisma client is mocked globally in src/tests/setup.ts

// Simplify PapaParse mock - specific implementations will be in tests
vi.mock('papaparse', () => ({
  default: {
    parse: vi.fn(),
  }
}));


// Mock csv-writer
const mockCsvWriterInstance = { writeRecords: vi.fn().mockResolvedValue(undefined) };
vi.mock('csv-writer', () => ({
  createObjectCsvWriter: vi.fn(() => mockCsvWriterInstance),
}));

// Mock cheerio - More robust structure
const mockCheerioElementAPI = {
    attr: vi.fn(),
    text: vi.fn(),
    next: vi.fn().mockReturnThis(),
    children: vi.fn().mockReturnThis(),
    each: vi.fn(function(this: any, callback: (index: number, element: any) => void) {
        (this._elements || []).forEach((el: any, index: number) => callback(index, el));
        return this;
    }),
    first: vi.fn().mockReturnThis(),
    nextAll: vi.fn().mockReturnThis(),
    is: vi.fn(),
    get: vi.fn(() => undefined),
    length: 0,
    _elements: [] as any[],
    find: vi.fn().mockReturnThis(),
};

// Ensure the object returned by load() also has the find method
const mockRootAPI = {
    ...mockCheerioElementAPI,
    find: vi.fn().mockReturnThis() // Explicitly add find here too
};
// Define the mock load function directly inside the factory
vi.mock('cheerio', () => {
  const mockRootAPI = {
    attr: vi.fn(),
    text: vi.fn(),
    next: vi.fn().mockReturnThis(),
    children: vi.fn().mockReturnThis(),
    each: vi.fn(function(this: any, callback: (index: number, element: any) => void) {
        (this._elements || []).forEach((el: any, index: number) => callback(index, el));
        return this;
    }),
    first: vi.fn().mockReturnThis(),
    nextAll: vi.fn().mockReturnThis(),
    is: vi.fn(),
    get: vi.fn(() => undefined),
    length: 0,
    _elements: [] as any[],
    find: vi.fn().mockReturnThis(),
  };
  return {
    default: {
      load: vi.fn(() => mockRootAPI), // Define the mock function here
    }
  };
});


vi.mock('../config/logger', () => ({
  default: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
}));

// --- Tests ---

describe('Import/Export Service', () => {
  const mockPrismaBookmark = vi.mocked(prisma.bookmark);
  const mockPrismaTag = vi.mocked(prisma.tag);
  const mockPrismaBookmarkTag = vi.mocked(prisma.bookmarkTag);
  const mockPrismaFolder = vi.mocked(prisma.folder);
  const mockPrismaFolderBookmark = vi.mocked(prisma.folderBookmark);
  const mockPapaParse = vi.mocked(Papa.parse);
  const mockCreateCsvWriter = vi.mocked(createObjectCsvWriter);
  const mockLogger = vi.mocked(logger);

  const userId = 'user-import-export-test';
  const folderId = 'target-folder-id';

  // Helper to create mock tag with all fields
  const createMockTag = (id: string, name: string, userId: string): Tag => ({
      id, name, userId,
      color: '#808080', createdAt: new Date(), updatedAt: new Date(),
      isDeleted: false, deletedAt: null
  });

  // Helper to create mock folder (needed locally)
  const createMockFolder = (id: string, userId: string, parentId: string | null = null, overrides = {}): Folder => ({
      id, userId, parentId,
      name: `Folder ${id}`,
      description: null, icon: null, color: null,
      createdAt: new Date(), updatedAt: new Date(),
      isDeleted: false, deletedAt: null,
      ...overrides
  });


  beforeEach(() => {
    // vi.resetAllMocks(); // Rely on specific resets below and in setup.ts
    // Reset specific mocks used in this file
    mockReset(mockPapaParse);
    mockReset(mockCreateCsvWriter);
    mockReset(mockCsvWriterInstance.writeRecords);
    mockReset(vi.mocked(cheerio.load)); // Reset cheerio.load itself
    mockReset(prisma.$transaction); // Reset transaction mock

    // Reset cheerio mocks
     Object.values(mockCheerioElementAPI).forEach(mockFn => {
        if (typeof mockFn === 'function' && 'mockClear' in mockFn) {
            mockFn.mockClear();
        }
     });
     mockCheerioElementAPI.length = 0;
     mockCheerioElementAPI._elements = [];
     // Reset specific chained calls if necessary
     mockCheerioElementAPI.next.mockReturnThis();
     mockCheerioElementAPI.children.mockReturnThis();
     mockCheerioElementAPI.first.mockReturnThis();
     mockCheerioElementAPI.nextAll.mockReturnThis();
     mockCheerioElementAPI.each.mockReturnThis();
     mockCheerioElementAPI.find.mockReturnThis();
     // mockRootAPI.find.mockClear().mockReturnThis(); // Reset root find as well - mockRootAPI is defined inside vi.mock now
  });

  // --- importBookmarks Tests ---
  describe('importBookmarks', () => {

    beforeEach(() => {
      // Mock the initial folder check (outside transaction) - assume no target folder provided
      mockPrismaFolder.findFirst.mockResolvedValue(null);
    });
    // Mock the internal parsing functions
    const parseHtmlSpy = vi.spyOn(importExportService as any, 'parseHtmlBookmarks').mockReturnValue([{ url: 'http://html.com', title: 'HTML BM' }]);
    const parseCsvSpy = vi.spyOn(importExportService as any, 'parseCsvBookmarks').mockReturnValue([]);
    const parseJsonSpy = vi.spyOn(importExportService as any, 'parseJsonBookmarks').mockReturnValue([]);

    it('should successfully parse and import bookmarks from HTML', async () => {
      // Arrange
      const htmlContent = `... valid html ...`;
      const options = { format: 'html' as const };
      // No need for complex cheerio mock setup now

      // Mock Prisma calls expected *after* parsing
      mockPrismaFolder.findFirst.mockResolvedValue(null); // No target folder, no existing folders found by path
      mockPrismaFolder.create.mockResolvedValue(createMockFolder('html-folder-id', userId, null)); // Mock folder creation if needed by path logic
      mockPrismaBookmark.create.mockResolvedValue({ id: 'bm-html-id' } as any);
      mockPrismaBookmarkTag.create.mockResolvedValue({} as any);
      mockPrismaFolderBookmark.create.mockResolvedValue({} as any);
      mockPrismaTag.findFirst.mockResolvedValue(null); // Assume tags don't exist
      mockPrismaTag.create.mockResolvedValue(createMockTag('tag-html-id', 'tag-html', userId)); // Mock tag creation

      // Act
      const result = await importExportService.importBookmarks(userId, htmlContent, options);

      // Assert
      expect(parseHtmlSpy).toHaveBeenCalledWith(htmlContent); // Check if the correct parser was called
      expect(parseCsvSpy).not.toHaveBeenCalled();
      expect(parseJsonSpy).not.toHaveBeenCalled();
      expect(prisma.$transaction).toHaveBeenCalledTimes(1); // Called once for the single parsed bookmark
      expect(mockPrismaBookmark.create).toHaveBeenCalledTimes(1);
      // Add more specific assertions for Prisma calls based on the simplified parsed data if needed
      expect(result.stats).toEqual({ total: 1, imported: 1, failed: 0 }); // Adjusted stats based on spy mock
    });

    it('should successfully parse and import bookmarks from CSV', async () => {
        const csvContent = `URL,Title,Tags\nhttp://csv1.com,CSV One,"tag1;tag3"\nhttp://csv2.com,CSV Two,tag2`;
        const options = { format: 'csv' as const };
        // Mock the internal CSV parser to return specific data
        parseHtmlSpy.mockReturnValue([]);
        parseCsvSpy.mockReturnValue([
            { url: 'http://csv1.com', title: 'CSV One', tags: ['tag1', 'tag3'] },
            { url: 'http://csv2.com', title: 'CSV Two', tags: ['tag2'] },
        ]);
        parseJsonSpy.mockReturnValue([]);

        // Mock Prisma
        const mockTag1 = createMockTag('tag1-id', 'tag1', userId);
        const mockTag2 = createMockTag('tag2-id', 'tag2', userId);
        const mockTag3 = createMockTag('tag3-id', 'tag3', userId);
        mockPrismaTag.findFirst
            .mockResolvedValueOnce(mockTag1)
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(mockTag2);
        mockPrismaTag.create.mockResolvedValue(mockTag3);
        mockPrismaBookmark.create.mockResolvedValue({ id: 'bm-csv1' } as any).mockResolvedValue({ id: 'bm-csv2' } as any);
        mockPrismaBookmarkTag.create.mockResolvedValue({} as any);

        const result = await importExportService.importBookmarks(userId, csvContent, options);

        expect(parseHtmlSpy).not.toHaveBeenCalled();
        expect(parseCsvSpy).toHaveBeenCalledWith(csvContent); // Check if the correct parser was called
        expect(parseJsonSpy).not.toHaveBeenCalled();
        expect(prisma.$transaction).toHaveBeenCalledTimes(2); // Called once per bookmark
        expect(mockPrismaBookmark.create).toHaveBeenCalledTimes(2);
        expect(mockPrismaTag.findFirst).toHaveBeenCalledTimes(3);
        expect(mockPrismaTag.create).toHaveBeenCalledTimes(1);
        expect(mockPrismaBookmarkTag.create).toHaveBeenCalledTimes(3);
        expect(result.stats).toEqual({ total: 2, imported: 2, failed: 0 }); // Adjusted stats
    });

    it('should successfully parse and import bookmarks from JSON', async () => {
        const jsonData = { roots: { bookmarks_bar: { children: [] } } }; // Simple valid structure
        const options = { format: 'json' as const };
        // Mock the internal JSON parser
        parseHtmlSpy.mockReturnValue([]);
        parseCsvSpy.mockReturnValue([]);
        parseJsonSpy.mockReturnValue([
            { url: 'http://json1.com', name: 'JSON BM 1', tags: ['tag1'], folderPath: [] },
            { url: 'http://json2.com', name: 'JSON BM 2', folderPath: ['Folder A'] }
        ]);

        // Mocks...
        const mockTag1 = createMockTag('tag1-id', 'tag1', userId);
        mockPrismaTag.findFirst.mockResolvedValue(mockTag1); // For tag check on BM1
        mockPrismaFolder.findFirst.mockResolvedValue(null); // Folder 'Folder A' doesn't exist initially
        mockPrismaFolder.create.mockResolvedValue(createMockFolder('folderA-id', userId, null)); // Mock folder creation
        // Mock bookmark creation for both bookmarks
        mockPrismaBookmark.create
            .mockResolvedValueOnce({ id: 'bm-json1' } as any)
            .mockResolvedValueOnce({ id: 'bm-json2' } as any);
        mockPrismaFolderBookmark.create.mockResolvedValue({} as any); // For BM2 in Folder A
        mockPrismaBookmarkTag.create.mockResolvedValue({} as any); // For BM1 tag

        const result = await importExportService.importBookmarks(userId, jsonData, options);

        expect(parseHtmlSpy).not.toHaveBeenCalled();
        expect(parseCsvSpy).not.toHaveBeenCalled();
        expect(parseJsonSpy).toHaveBeenCalledWith(jsonData); // Check if the correct parser was called
        // Expect transaction to be called once per bookmark
        expect(prisma.$transaction).toHaveBeenCalledTimes(2);
        attr: vi.fn((attr: string) => ({ href: 'http://example.com/in-folder', add_date: '1678886400', tags: 'tag1' }[attr])),
        text: vi.fn(() => 'Example Folder'),
        next: vi.fn(() => ({ is: vi.fn(() => true), text: vi.fn(() => 'Desc Folder') }))
      };
       const mockAnchor2 = {
        attr: vi.fn((attr: string) => ({ href: 'http://test.com', add_date: '1678886401', tags: 'tag2' }[attr])),
        text: vi.fn(() => 'Test Root'),
        next: vi.fn(() => ({ is: vi.fn(() => false) }))
      };
      const mockHeader1 = { text: vi.fn(() => 'Folder1') };

      const mockDt1 = { children: vi.fn(() => ({ first: vi.fn(() => mockHeader1) })), next: vi.fn(() => ({ first: vi.fn(() => mockDl2), length: 1, get: vi.fn(() => mockDl2Element) })) };
      const mockDt2 = { children: vi.fn(() => ({ first: vi.fn(() => mockAnchor1) })) };
      const mockDt3 = { children: vi.fn(() => ({ first: vi.fn(() => mockAnchor2) })) };

      const mockDl2Element = { type: 'tag', name: 'dl', children: [mockDt2] };
      const mockDl2 = {
          children: vi.fn(() => ({ ...mockCheerioElementAPI, _elements: [mockDt2] })),
          get: vi.fn(() => mockDl2Element)
      };
      const mockDl1Element = { type: 'tag', name: 'dl', children: [mockDt1, mockDt3] };
      const mockDl1 = {
          children: vi.fn(() => ({ ...mockCheerioElementAPI, _elements: [mockDt1, mockDt3] })),
          get: vi.fn(() => mockDl1Element)
      };

      mockRootAPI.find.mockImplementation((selector: string) => {
          if (selector === 'h1') return { first: vi.fn(() => ({ nextAll: vi.fn(() => ({ first: vi.fn(() => mockDl1) })) })) };
          return { ...mockCheerioElementAPI };
      });
      // --- End Cheerio Mock Setup ---

      // Mock Prisma
      const mockTag1 = createMockTag('tag1-id', 'tag1', userId);
      const mockTag2 = createMockTag('tag2-id', 'tag2', userId);
      mockPrismaTag.findFirst.mockResolvedValueOnce(mockTag1).mockResolvedValueOnce(mockTag2);
      mockPrismaFolder.findFirst.mockResolvedValue(null);
      mockPrismaFolder.create.mockResolvedValue(createMockFolder('folder1-id', userId, null));
      mockPrismaBookmark.create.mockResolvedValue({ id: 'bm1-id' } as any).mockResolvedValue({ id: 'bm2-id' } as any);
      mockPrismaFolderBookmark.create.mockResolvedValue({} as any);
      mockPrismaBookmarkTag.create.mockResolvedValue({} as any);

      // Act
      const result = await importExportService.importBookmarks(userId, htmlContent, options);

      // Assert
      expect(vi.mocked(cheerio.load)).toHaveBeenCalledWith(htmlContent); // Check cheerio.load call
      expect(prisma.$transaction).toHaveBeenCalledTimes(2);
      // Check the folder find/create calls *within* the transaction
      expect(mockPrismaFolder.findFirst).toHaveBeenCalledWith({ where: { name: 'Folder1', userId: userId, parentId: null } });
      expect(mockPrismaFolder.create).toHaveBeenCalledWith({ data: { name: 'Folder1', userId: userId, parentId: null } });
      expect(mockPrismaBookmark.create).toHaveBeenCalledTimes(2);
      expect(mockPrismaFolderBookmark.create).toHaveBeenCalledTimes(1);
      expect(mockPrismaTag.findFirst).toHaveBeenCalledTimes(2);
      expect(mockPrismaTag.create).not.toHaveBeenCalled();
      expect(mockPrismaBookmarkTag.create).toHaveBeenCalledTimes(2);
      expect(result.stats).toEqual({ total: 2, imported: 2, failed: 0 });
    });

    it('should successfully parse and import bookmarks from CSV', async () => {
        const csvContent = `URL,Title,Tags\nhttp://csv1.com,CSV One,"tag1;tag3"\nhttp://csv2.com,CSV Two,tag2`;
        const options = { format: 'csv' as const };
        const parsedData = {
            data: [
                { URL: 'http://csv1.com', Title: 'CSV One', Tags: 'tag1;tag3' },
                { URL: 'http://csv2.com', Title: 'CSV Two', Tags: 'tag2' },
            ], errors: [], meta: {}
        };
        mockPapaParse.mockReturnValue(parsedData as any);

        // Mock Prisma
        const mockTag1 = createMockTag('tag1-id', 'tag1', userId);
        const mockTag2 = createMockTag('tag2-id', 'tag2', userId);
        const mockTag3 = createMockTag('tag3-id', 'tag3', userId);
        mockPrismaTag.findFirst
            .mockResolvedValueOnce(mockTag1)
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(mockTag2);
        mockPrismaTag.create.mockResolvedValue(mockTag3);
        mockPrismaBookmark.create.mockResolvedValue({ id: 'bm-csv1' } as any).mockResolvedValue({ id: 'bm-csv2' } as any);
        mockPrismaBookmarkTag.create.mockResolvedValue({} as any);

        const result = await importExportService.importBookmarks(userId, csvContent, options);

        expect(mockPapaParse).toHaveBeenCalledWith(csvContent, expect.any(Object));
        expect(prisma.$transaction).toHaveBeenCalledTimes(2);
        expect(mockPrismaBookmark.create).toHaveBeenCalledTimes(2);
        expect(mockPrismaTag.findFirst).toHaveBeenCalledTimes(3);
        expect(mockPrismaTag.create).toHaveBeenCalledTimes(1);
        expect(mockPrismaBookmarkTag.create).toHaveBeenCalledTimes(3);
        expect(result.stats).toEqual({ total: 2, imported: 2, failed: 0 });
    });

    it('should successfully parse and import bookmarks from JSON', async () => {
        // Use a valid simple JSON structure (simulating Chrome format)
        const jsonData = {
          roots: {
            bookmarks_bar: {
              children: [
                { type: 'url', url: 'http://json1.com', name: 'JSON BM 1', tags: ['tag1'] },
                { type: 'folder', name: 'Folder A', children: [
                  { type: 'url', url: 'http://json2.com', name: 'JSON BM 2' }
                ]}
              ]
            }
          }
        };
        const options = { format: 'json' as const };

        // Mocks...
        const mockTag1 = createMockTag('tag1-id', 'tag1', userId);
        mockPrismaTag.findFirst.mockResolvedValue(mockTag1); // For tag check on BM1
        mockPrismaFolder.findFirst.mockResolvedValue(null); // Folder 'Folder A' doesn't exist initially
        mockPrismaFolder.create.mockResolvedValue(createMockFolder('folderA-id', userId, null)); // Mock folder creation
        // Mock bookmark creation for both bookmarks
        mockPrismaBookmark.create
            .mockResolvedValueOnce({ id: 'bm-json1' } as any)
            .mockResolvedValueOnce({ id: 'bm-json2' } as any);
        mockPrismaFolderBookmark.create.mockResolvedValue({} as any); // For BM2 in Folder A
        mockPrismaBookmarkTag.create.mockResolvedValue({} as any); // For BM1 tag

        const result = await importExportService.importBookmarks(userId, jsonData, options);

        // Expect transaction to be called once per bookmark
        expect(prisma.$transaction).toHaveBeenCalledTimes(2);
        expect(mockPrismaFolder.findFirst).toHaveBeenCalledWith({ where: { name: 'Folder A', userId: userId, parentId: null } });
        expect(mockPrismaFolder.create).toHaveBeenCalledWith({ data: { name: 'Folder A', userId: userId, parentId: null } });
        expect(mockPrismaBookmark.create).toHaveBeenCalledTimes(2);
        expect(mockPrismaFolderBookmark.create).toHaveBeenCalledTimes(1);
        expect(mockPrismaTag.findFirst).toHaveBeenCalledTimes(1);
        expect(mockPrismaTag.create).not.toHaveBeenCalled();
        expect(mockPrismaBookmarkTag.create).toHaveBeenCalledTimes(1);
        expect(result.stats).toEqual({ total: 2, imported: 2, failed: 0 });
    });

    // TODO: Add tests for importing into target folder, error handling, empty files etc.
  });

  // --- exportBookmarks Tests ---
  describe('exportBookmarks', () => {

    it('should export all bookmarks to CSV format', async () => {
        const options = { format: 'csv' as const };
        const mockBookmarks: Bookmark[] = [ /* ... mock data ... */ ];
        mockPrismaBookmark.findMany.mockResolvedValue(mockBookmarks as any);
        mockPrismaFolder.findMany.mockResolvedValue([{ id: 'f1', name: 'Folder1' }] as any);

        const result = await importExportService.exportBookmarks(userId, options);

        expect(mockPrismaBookmark.findMany).toHaveBeenCalled();
        expect(mockPrismaFolder.findMany).toHaveBeenCalled();
        expect(result).toBeDefined();
        if (result) {
            expect(result.contentType).toBe('text/csv');
            expect(result.filename).toBe('bookmarks.csv');
            expect(result.data).toContain('URL,Title,Description,Notes,CreatedDate,Tags,Folders');
        }
    });

    it('should export all bookmarks to JSON format', async () => {
        const options = { format: 'json' as const };
        const mockBookmarks: Bookmark[] = [ /* ... mock data ... */ ];
        const mockFolders: Folder[] = [ /* ... mock data ... */ ];
        mockPrismaBookmark.findMany.mockResolvedValue(mockBookmarks as any);
        mockPrismaFolder.findMany.mockResolvedValue(mockFolders as any);

        const result = await importExportService.exportBookmarks(userId, options);

        expect(mockPrismaBookmark.findMany).toHaveBeenCalled();
        expect(mockPrismaFolder.findMany).toHaveBeenCalled();
        expect(result).toBeDefined();
        if (result) {
            expect(result.contentType).toBe('application/json');
            expect(result.filename).toBe('bookmarks.json');
            const parsedData = JSON.parse(result.data);
            expect(parsedData.roots.bookmarks_bar).toBeDefined();
        }
    });

    it('should export all bookmarks to HTML format', async () => {
        const options = { format: 'html' as const };
        const mockBookmarks: Bookmark[] = [ /* ... mock data ... */ ];
        const mockFolders: Folder[] = [ /* ... mock data ... */ ];
        mockPrismaBookmark.findMany.mockResolvedValue(mockBookmarks as any);
        mockPrismaFolder.findMany.mockResolvedValue(mockFolders as any);

        const result = await importExportService.exportBookmarks(userId, options);

        expect(mockPrismaBookmark.findMany).toHaveBeenCalled();
        expect(mockPrismaFolder.findMany).toHaveBeenCalled();
        expect(result).toBeDefined();
        if (result) {
            expect(result.contentType).toBe('text/html');
            expect(result.filename).toBe('bookmarks.html');
            expect(result.data).toContain('<TITLE>Bookmarks</TITLE>');
        }
    });

    // TODO: Add tests for exporting specific folder, including subfolders, error handling
  });

});
