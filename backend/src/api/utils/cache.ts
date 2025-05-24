// src/utils/cache.ts
import redisClient from '../config/redis';
import logger from '../config/logger';

// Default TTL (Time To Live) in seconds for cache entries
const DEFAULT_TTL_SECONDS = 60 * 5; // 5 minutes

/**
 * Wraps an async function with caching logic using Redis.
 *
 * @param key - The unique key for this cache entry (e.g., `user:${userId}:folders`).
 * @param fn - The async function to call if data is not in cache (e.g., a service function).
 * @param ttlSeconds - Optional TTL for the cache entry in seconds. Defaults to DEFAULT_TTL_SECONDS.
 * @returns The result from the cache or the function `fn`. Returns null if `fn` fails and cache is empty.
 */
export const cacheWrap = async <T>(
  key: string,
  fn: () => Promise<T>,
  ttlSeconds: number = DEFAULT_TTL_SECONDS
): Promise<T | null> => {
  try {
    // 1. Check cache first
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      logger.debug(`[Cache]: HIT for key "${key}"`);
      try {
        // Attempt to parse cached data (assuming it's JSON)
        return JSON.parse(cachedData) as T;
      } catch (parseError) {
        logger.error(
          `[Cache]: Failed to parse cached data for key "${key}". Fetching fresh data.`,
          parseError
        );
        // Proceed to fetch fresh data if parsing fails
      }
    } else {
      logger.debug(`[Cache]: MISS for key "${key}"`);
    }

    // 2. If cache miss or parse error, call the original function
    const freshData = await fn();

    // 3. Store fresh data in cache (if not null/undefined)
    if (freshData !== null && freshData !== undefined) {
      try {
        // Use 'EX' for TTL in seconds
        await redisClient.set(
          key,
          JSON.stringify(freshData),
          'EX',
          ttlSeconds
        );
        logger.debug(
          `[Cache]: SET key "${key}" with TTL ${ttlSeconds}s`
        );
      } catch (cacheSetError) {
        // Log error but don't fail the overall operation if caching fails
        logger.error(
          `[Cache]: Failed to SET key "${key}".`,
          cacheSetError
        );
      }
    }

    return freshData;
  } catch (error) {
    // Log errors from both Redis connection issues and the wrapped function `fn`
    logger.error(
      `[CacheWrap]: Error during cache check or function execution for key "${key}":`,
      error
    );
    // Decide on fallback behavior: return null, throw, or try cache one last time?
    // Returning null indicates failure to get data either from cache or source.
    return null;
  }
};

/**
 * Invalidates (deletes) one or more cache keys from Redis.
 * Uses UNLINK for potentially non-blocking deletion.
 *
 * @param keys - A single key or an array of keys to invalidate.
 */
export const invalidateCache = async (
  keys: string | string[]
): Promise<void> => {
  const keysToDelete = Array.isArray(keys) ? keys : [keys];
  if (keysToDelete.length === 0) return;

  try {
    const count = await redisClient.unlink(...keysToDelete);
    logger.info(
      `[Cache]: Invalidated ${count} key(s): ${keysToDelete.join(
        ', '
      )}`
    );
  } catch (error) {
    logger.error(
      `[Cache]: Failed to invalidate keys: ${keysToDelete.join(
        ', '
      )}`,
      error
    );
    // Don't throw, as invalidation failure shouldn't break the main operation
  }
};

/**
 * Invalidates cache keys matching a pattern. Use with caution on production databases.
 * Uses SCAN and UNLINK for better performance than KEYS + DEL.
 *
 * @param pattern - The pattern to match keys against (e.g., "user:*:folders*").
 */
export const invalidateCachePattern = async (
  pattern: string
): Promise<void> => {
  logger.warn(
    `[Cache]: Starting pattern invalidation for pattern: "${pattern}". This can be slow.`
  );
  let cursor = '0';
  let keysFound = 0;
  try {
    do {
      const [nextCursor, keys] = await redisClient.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100
      );
      cursor = nextCursor;
      if (keys.length > 0) {
        keysFound += keys.length;
        await redisClient.unlink(...keys);
        logger.debug(
          `[Cache]: Unlinked ${keys.length} keys matching pattern "${pattern}".`
        );
      }
    } while (cursor !== '0');
    logger.info(
      `[Cache]: Pattern invalidation finished for "${pattern}". Found and unlinked ${keysFound} keys.`
    );
  } catch (error) {
    logger.error(
      `[Cache]: Error during pattern invalidation for "${pattern}":`,
      error
    );
  }
};
