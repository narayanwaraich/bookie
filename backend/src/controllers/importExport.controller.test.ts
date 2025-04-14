// src/controllers/importExport.controller.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import * as importExportController from './importExport.controller';
import * as importExportService from '../services/importExport.service';
import { ImportExportError } from '../services/importExport.service';
import logger from '../config/logger';
import Papa, { ParseConfig, ParseResult } from 'papaparse'; // Import types
import { createObjectCsvWriter } from 'csv-writer';
import cheerio from 'cheerio';
import { Readable } from 'stream';
import { Role, Folder, Bookmark, Tag, Prisma } from '@prisma/client'; // Import necessary types
import { RequestUser, AuthenticatedRequest } from '../types/express'; 
import * as fs from 'fs'; // Import fs

// --- Mocks ---
vi.mock('../services/importExport.service'); 
vi.mock('../config/logger', () => ({
  default: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
}));
// Mock fs if needed for file deletion tests
vi.mock('fs', () => ({
    readFileSync: vi.fn(),
    unlink: vi.fn((_path, callback) => callback(null)), // Mock unlink to succeed by default
}));

// Mock papaparse
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

// Mock cheerio
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
const mockRootAPI = { 
    ...mockCheerioElementAPI, 
    find: vi.fn().mockReturnThis()
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


// --- Tests ---

describe('Import/Export Controller', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction = vi.fn(); 

  // Mock response methods
  const statusMock = vi.fn().mockReturnThis(); 
  const jsonMock = vi.fn();
  const setHeaderMock = vi.fn();
  const sendMock = vi.fn();

  const userId = 'user-ie-test';

  beforeEach(() => {
    vi.resetAllMocks(); 

    mockRequest = {
      body: {},
      params: {},
      query: {},
      file: undefined, 
      user: { id: userId, email: 'test@test.com', username: 'tester' }, 
    };
    mockResponse = {
      status: statusMock,
      json: jsonMock,
      setHeader: setHeaderMock,
      send: sendMock,
    };
    mockNext = vi.fn(); 
  });

  // --- importBookmarks Tests --- Corrected name
  describe('importBookmarks', () => {
    it('should handle HTML import successfully', async () => {
      // Arrange
      const mockFile = {
          buffer: Buffer.from('<HTML>...</HTML>'), 
          mimetype: 'text/html',
          originalname: 'bookmarks.html',
          path: '/tmp/testfile123.html' // Mock path for deletion
      } as Express.Multer.File;
      const importOptions = { format: 'html' as const }; // Format might be inferred or passed differently
      const serviceResult = { success: true, stats: { total: 10, imported: 8, failed: 2 }, message: 'Import complete' };
      
      mockRequest.file = mockFile;
      // Assuming format is determined by mimetype, options might just contain folderId
      mockRequest.body = { folderId: null }; 
      vi.mocked(importExportService.importBookmarks).mockResolvedValue(serviceResult);
      vi.mocked(fs.readFileSync).mockReturnValue(mockFile.buffer.toString('utf-8'));

      // Act
      await importExportController.importBookmarks(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext); // Use correct controller name

      // Assert
      expect(fs.readFileSync).toHaveBeenCalledWith(mockFile.path, 'utf-8');
      expect(importExportService.importBookmarks).toHaveBeenCalledWith(userId, mockFile.buffer.toString('utf-8'), { format: 'html', folderId: null });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(serviceResult);
      expect(fs.unlink).toHaveBeenCalledWith(mockFile.path, expect.any(Function));
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle CSV import successfully', async () => {
      // Arrange
      const csvContent = 'URL,Title\nhttp://a.com,A';
      const mockFile = {
          buffer: Buffer.from(csvContent), 
          mimetype: 'text/csv',
          originalname: 'bookmarks.csv',
          path: '/tmp/testfile456.csv'
      } as Express.Multer.File;
      const importOptions = { format: 'csv' as const };
      const serviceResult = { success: true, stats: { total: 1, imported: 1, failed: 0 }, message: 'Import complete' };
      
      mockRequest.file = mockFile;
      mockRequest.body = { folderId: 'folder-xyz' }; 
      vi.mocked(importExportService.importBookmarks).mockResolvedValue(serviceResult);
      vi.mocked(fs.readFileSync).mockReturnValue(csvContent);

      // Act
      await importExportController.importBookmarks(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext); // Use correct controller name

      // Assert
      expect(fs.readFileSync).toHaveBeenCalledWith(mockFile.path, 'utf-8');
      expect(importExportService.importBookmarks).toHaveBeenCalledWith(userId, csvContent, { format: 'csv', folderId: 'folder-xyz' });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(serviceResult);
      expect(fs.unlink).toHaveBeenCalledWith(mockFile.path, expect.any(Function));
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('should handle JSON import successfully', async () => {
      // Arrange
      const jsonObject = { roots: {} };
      const jsonContent = JSON.stringify(jsonObject);
      const mockFile = {
          buffer: Buffer.from(jsonContent), 
          mimetype: 'application/json',
          originalname: 'bookmarks.json',
          path: '/tmp/testfile789.json'
      } as Express.Multer.File;
      const importOptions = { format: 'json' as const };
      const serviceResult = { success: true, stats: { total: 0, imported: 0, failed: 0 }, message: 'Import complete' };
      
      mockRequest.file = mockFile;
      mockRequest.body = {}; // No folderId
      vi.mocked(importExportService.importBookmarks).mockResolvedValue(serviceResult);
      vi.mocked(fs.readFileSync).mockReturnValue(jsonContent);

      // Act
      await importExportController.importBookmarks(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext); // Use correct controller name

      // Assert
      expect(fs.readFileSync).toHaveBeenCalledWith(mockFile.path, 'utf-8');
      expect(importExportService.importBookmarks).toHaveBeenCalledWith(userId, jsonObject, { format: 'json', folderId: undefined }); 
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(serviceResult);
      expect(fs.unlink).toHaveBeenCalledWith(mockFile.path, expect.any(Function));
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 400 if no file is uploaded', async () => {
      // Arrange
      mockRequest.file = undefined;
      mockRequest.body = { folderId: null };

      // Act
      await importExportController.importBookmarks(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext); // Use correct controller name

      // Assert
      expect(importExportService.importBookmarks).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400); // Controller handles this directly
      expect(jsonMock).toHaveBeenCalledWith({ success: false, message: 'No file uploaded' });
      expect(mockNext).not.toHaveBeenCalled(); 
    });

    it('should call next with error if service fails', async () => {
      // Arrange
       const mockFile = { buffer: Buffer.from(''), mimetype: 'text/html', path: '/tmp/error.html' } as any;
       const importOptions = { format: 'html' as const };
       const serviceError = new ImportExportError('Import failed', 500);
       mockRequest.file = mockFile;
       mockRequest.body = {};
       vi.mocked(fs.readFileSync).mockReturnValue('');
       vi.mocked(importExportService.importBookmarks).mockRejectedValue(serviceError);

      // Act
      await importExportController.importBookmarks(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext); // Use correct controller name

      // Assert
      expect(importExportService.importBookmarks).toHaveBeenCalled();
      expect(fs.unlink).toHaveBeenCalledWith(mockFile.path, expect.any(Function)); // Ensure file is deleted on error too
      expect(mockNext).toHaveBeenCalledWith(serviceError);
    });
  });

  // --- exportBookmarks Tests --- Corrected name
  describe('exportBookmarks', () => {
    it('should handle CSV export successfully', async () => {
      // Arrange
      const exportOptions = { format: 'csv' as const };
      const serviceResult = { 
          contentType: 'text/csv', 
          data: 'URL,Title\nhttp://a.com,A', 
          filename: 'bookmarks.csv' 
      };
      mockRequest.query = exportOptions; 
      vi.mocked(importExportService.exportBookmarks).mockResolvedValue(serviceResult);

      // Act
      await importExportController.exportBookmarks(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext); // Use correct controller name

      // Assert
      expect(importExportService.exportBookmarks).toHaveBeenCalledWith(userId, exportOptions);
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Disposition', `attachment; filename="${serviceResult.filename}"`);
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', serviceResult.contentType);
      expect(mockResponse.send).toHaveBeenCalledWith(serviceResult.data);
      expect(mockNext).not.toHaveBeenCalled();
    });
    
     it('should handle JSON export successfully', async () => {
      // Arrange
      const exportOptions = { format: 'json' as const };
      const serviceResult = { 
          contentType: 'application/json', 
          data: '{}', 
          filename: 'bookmarks.json' 
      };
      mockRequest.query = exportOptions; 
      vi.mocked(importExportService.exportBookmarks).mockResolvedValue(serviceResult);

      // Act
      await importExportController.exportBookmarks(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext); // Use correct controller name

      // Assert
      expect(importExportService.exportBookmarks).toHaveBeenCalledWith(userId, exportOptions);
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Disposition', `attachment; filename="${serviceResult.filename}"`);
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', serviceResult.contentType);
      expect(mockResponse.send).toHaveBeenCalledWith(serviceResult.data);
      expect(mockNext).not.toHaveBeenCalled();
    });
    
     it('should handle HTML export successfully', async () => {
      // Arrange
      const exportOptions = { format: 'html' as const };
      const serviceResult = { 
          contentType: 'text/html', 
          data: '<!DOCTYPE ...>', 
          filename: 'bookmarks.html' 
      };
      mockRequest.query = exportOptions; 
      vi.mocked(importExportService.exportBookmarks).mockResolvedValue(serviceResult);

      // Act
      await importExportController.exportBookmarks(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext); // Use correct controller name

      // Assert
      expect(importExportService.exportBookmarks).toHaveBeenCalledWith(userId, exportOptions);
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Disposition', `attachment; filename="${serviceResult.filename}"`);
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', serviceResult.contentType);
      expect(mockResponse.send).toHaveBeenCalledWith(serviceResult.data);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if service fails', async () => {
      // Arrange
      const exportOptions = { format: 'csv' as const };
      const serviceError = new ImportExportError('Export failed', 500);
      mockRequest.query = exportOptions;
      vi.mocked(importExportService.exportBookmarks).mockRejectedValue(serviceError);

      // Act
      await importExportController.exportBookmarks(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext); // Use correct controller name

      // Assert
      expect(importExportService.exportBookmarks).toHaveBeenCalledWith(userId, exportOptions);
      expect(mockNext).toHaveBeenCalledWith(serviceError);
      expect(mockResponse.setHeader).not.toHaveBeenCalled();
      expect(mockResponse.send).not.toHaveBeenCalled();
    });
  });

});
