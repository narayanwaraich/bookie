import fetch from 'node-fetch'; // Keep fetch for potential fallback or direct use if needed
import { parse } from 'html-metadata-parser';
import logger from '../config/logger';
import AbortController from 'abort-controller'; // Import AbortController

/**
 * Fetches metadata (title, description, favicon, preview image) from a URL
 * using html-metadata-parser.
 *
 * @param url The URL to fetch metadata from.
 * @returns An object containing metadata, or null if fetching/parsing fails.
 */
export const fetchUrlMetadata = async (
  url: string
): Promise<{
  title?: string;
  description?: string;
  favicon?: string;
  previewImage?: string;
} | null> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 5000); // 5 second timeout

  try {
    logger.debug(
      `Fetching metadata for URL: ${url} using html-metadata-parser`
    );

    // Let html-metadata-parser handle the fetch internally
    const metadata = await parse(url); // Pass only URL

    // Extract desired fields, preferring OG tags then regular meta tags
    const title = metadata.og?.title || metadata.meta?.title;
    const description =
      metadata.og?.description || metadata.meta?.description;
    const previewImage = metadata.og?.image; // Prefer og:image

    // Simplified Favicon logic: Use og:image as a fallback, or meta.image
    // The parser might provide a better icon source, but this is a safe default
    let favicon = metadata.og?.image || metadata.meta?.image;

    // Ensure favicon URL is absolute (parser might already do this)
    if (favicon && !favicon.startsWith('http')) {
      try {
        favicon = new URL(favicon, url).toString();
      } catch (urlError) {
        logger.warn(
          `Could not construct absolute favicon URL for ${favicon} relative to ${url}`
        );
        favicon = undefined; // Reset if construction fails
      }
    }

    logger.debug(`Successfully parsed metadata for ${url}`);
    return {
      title: title || undefined,
      description: description || undefined,
      favicon: favicon || undefined,
      previewImage: previewImage || undefined,
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      logger.warn(`Metadata fetch timed out for ${url}`);
    } else {
      logger.error(
        `Error fetching or parsing metadata for ${url}:`,
        error
      );
    }
    return null; // Return null on any error or timeout
  } finally {
    clearTimeout(timeout); // Clear the timeout always
  }
};
