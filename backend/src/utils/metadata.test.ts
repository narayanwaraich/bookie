// src/utils/metadata.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import fetch from 'node-fetch'; // Assuming node-fetch is used
import { parse } from 'html-metadata-parser'; // Assuming this parser is used
import { fetchUrlMetadata } from './metadata'; // Assuming default export
import logger from '../config/logger';

// --- Mocks ---
vi.mock('node-fetch');
vi.mock('html-metadata-parser');
vi.mock('../config/logger', () => ({
  default: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
}));

// --- Tests ---

describe('Metadata Utility', () => {
  const mockFetch = vi.mocked(fetch);
  const mockParse = vi.mocked(parse);
  const mockLoggerError = vi.mocked(logger.error);
  const mockLoggerWarn = vi.mocked(logger.warn);

  const testUrl = 'http://example.com';

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch and parse metadata successfully', async () => {
    // Arrange
    const mockHtml = '<html><head><title>Example Title</title><meta name="description" content="Example Desc"></head></html>';
    const mockResponse = {
      ok: true,
      text: vi.fn().mockResolvedValue(mockHtml),
      headers: new Map([['content-type', 'text/html']]), // Use Map for headers
    };
    mockFetch.mockResolvedValue(mockResponse as any);

    const mockParsedMetadata = {
      meta: { title: 'Example Title', description: 'Example Desc', image: undefined, icon: undefined },
      og: {}, // Add other potential fields if needed
      images: [],
      links: [],
    };
    mockParse.mockResolvedValue(mockParsedMetadata);

    // Act
    const result = await fetchUrlMetadata(testUrl);

    // Assert
    expect(mockFetch).toHaveBeenCalledWith(testUrl, expect.any(Object)); // Check fetch called
    expect(mockResponse.text).toHaveBeenCalled();
    expect(mockParse).toHaveBeenCalledWith(testUrl, { html: mockHtml }); // Check parser called
    expect(result).toEqual({
      title: 'Example Title',
      description: 'Example Desc',
      image: undefined,
      favicon: undefined,
    });
    expect(mockLoggerError).not.toHaveBeenCalled();
  });

  it('should return null if fetch response is not ok', async () => {
    // Arrange
    const mockResponse = { ok: false, status: 404 };
    mockFetch.mockResolvedValue(mockResponse as any);

    // Act
    const result = await fetchUrlMetadata(testUrl);

    // Assert
    expect(mockFetch).toHaveBeenCalledWith(testUrl, expect.any(Object));
    expect(mockParse).not.toHaveBeenCalled();
    expect(result).toBeNull();
    expect(mockLoggerWarn).toHaveBeenCalledWith(`Failed to fetch metadata for ${testUrl}: Status ${404}`);
  });

  it('should return null if content-type is not HTML', async () => {
     // Arrange
     const mockResponse = {
      ok: true,
      text: vi.fn().mockResolvedValue('{}'), // Some non-html content
      headers: new Map([['content-type', 'application/json']]), 
    };
    mockFetch.mockResolvedValue(mockResponse as any);

    // Act
    const result = await fetchUrlMetadata(testUrl);

    // Assert
    expect(mockFetch).toHaveBeenCalledWith(testUrl, expect.any(Object));
    expect(mockResponse.text).not.toHaveBeenCalled(); // Should not read text if not HTML
    expect(mockParse).not.toHaveBeenCalled();
    expect(result).toBeNull();
    expect(mockLoggerWarn).toHaveBeenCalledWith(`Skipping metadata fetch for non-HTML content type: application/json for URL: ${testUrl}`);
  });

  it('should handle fetch error', async () => {
    // Arrange
    const fetchError = new Error('Network error');
    mockFetch.mockRejectedValue(fetchError);

    // Act
    const result = await fetchUrlMetadata(testUrl);

    // Assert
    expect(mockFetch).toHaveBeenCalledWith(testUrl, expect.any(Object));
    expect(mockParse).not.toHaveBeenCalled();
    expect(result).toBeNull();
    expect(mockLoggerError).toHaveBeenCalledWith(`Error fetching URL ${testUrl} for metadata:`, fetchError);
  });

  it('should handle metadata parsing error', async () => {
     // Arrange
    const mockHtml = '<html>...</html>';
    const mockResponse = {
      ok: true,
      text: vi.fn().mockResolvedValue(mockHtml),
      headers: new Map([['content-type', 'text/html; charset=utf-8']]), 
    };
    mockFetch.mockResolvedValue(mockResponse as any);
    const parseError = new Error('Parsing failed');
    mockParse.mockRejectedValue(parseError);

    // Act
    const result = await fetchUrlMetadata(testUrl);

    // Assert
    expect(mockFetch).toHaveBeenCalledWith(testUrl, expect.any(Object));
    expect(mockResponse.text).toHaveBeenCalled();
    expect(mockParse).toHaveBeenCalledWith(testUrl, { html: mockHtml });
    expect(result).toBeNull();
    expect(mockLoggerError).toHaveBeenCalledWith(`Error parsing metadata for ${testUrl}:`, parseError);
  });
  
  it('should extract favicon from parsed metadata if available', async () => {
     // Arrange
    const mockHtml = '<html><head><title>Title</title><link rel="icon" href="/favicon.ico"></head></html>';
    const mockResponse = { ok: true, text: vi.fn().mockResolvedValue(mockHtml), headers: new Map([['content-type', 'text/html']]) };
    mockFetch.mockResolvedValue(mockResponse as any);
    const mockParsedMetadata = {
      meta: { title: 'Title', description: undefined, image: undefined, icon: 'http://example.com/favicon.ico' }, // Parser provides absolute URL
      og: {}, images: [], links: [],
    };
    mockParse.mockResolvedValue(mockParsedMetadata);

    // Act
    const result = await fetchUrlMetadata(testUrl);

    // Assert
     expect(result).toEqual({
      title: 'Title',
      description: undefined,
      image: undefined,
      favicon: 'http://example.com/favicon.ico', // Expect absolute URL
    });
  });

});
