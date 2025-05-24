// src/utils/cache.test.ts
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from 'vitest';
import redisClient from '../config/redis'; // Correct: Use default import
import logger from '../config/logger';
import {
  cacheWrap,
  invalidateCache,
  invalidateCachePattern,
} from './cache';

// --- Mocks ---
// Mock the default export from '../config/redis'
vi.mock('../config/redis', () => ({
  default: {
    // Mock the default export object
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
    scan: vi.fn(),
    pipeline: vi.fn(() => ({
      del: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    })),
    on: vi.fn(), // Mock the 'on' method used in redis.ts
    quit: vi.fn(), // Mock the 'quit' method used in redis.ts
  },
}));

vi.mock('../config/logger', () => ({
  default: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

// --- Tests ---

describe('Cache Utils', () => {
  // Use the imported default export directly for mocking methods
  const mockRedisGet = vi.mocked(redisClient.get);
  const mockRedisSet = vi.mocked(redisClient.set);
  const mockRedisDel = vi.mocked(redisClient.del);
  const mockRedisScan = vi.mocked(redisClient.scan);
  const mockRedisPipeline = vi.mocked(redisClient.pipeline);
  const mockLogger = vi.mocked(logger);

  const testKey = 'test:key:123';
  const testValue = { data: 'some data', value: 1 };
  const testTtl = 3600; // 1 hour

  beforeEach(() => {
    vi.resetAllMocks();
  });

  // --- cacheWrap Tests ---
  describe('cacheWrap', () => {
    it('should return cached data if found', async () => {
      // Arrange
      mockRedisGet.mockResolvedValue(JSON.stringify(testValue));
      const dbFetchFn = vi.fn().mockResolvedValue(null); // Should not be called

      // Act
      const result = await cacheWrap(testKey, dbFetchFn, testTtl);

      // Assert
      expect(mockRedisGet).toHaveBeenCalledWith(testKey);
      expect(dbFetchFn).not.toHaveBeenCalled();
      expect(mockRedisSet).not.toHaveBeenCalled();
      expect(result).toEqual(testValue);
    });

    it('should fetch from DB, cache, and return data if cache miss', async () => {
      // Arrange
      mockRedisGet.mockResolvedValue(null); // Cache miss
      const dbValue = { data: 'fetched from db' };
      const dbFetchFn = vi.fn().mockResolvedValue(dbValue);
      mockRedisSet.mockResolvedValue('OK');

      // Act
      const result = await cacheWrap(testKey, dbFetchFn, testTtl);

      // Assert
      expect(mockRedisGet).toHaveBeenCalledWith(testKey);
      expect(dbFetchFn).toHaveBeenCalledTimes(1);
      expect(mockRedisSet).toHaveBeenCalledWith(
        testKey,
        JSON.stringify(dbValue),
        'EX',
        testTtl
      );
      expect(result).toEqual(dbValue);
    });

    it('should return null if DB fetch function returns null', async () => {
      // Arrange
      mockRedisGet.mockResolvedValue(null); // Cache miss
      const dbFetchFn = vi.fn().mockResolvedValue(null); // DB returns null

      // Act
      const result = await cacheWrap(testKey, dbFetchFn, testTtl);

      // Assert
      expect(mockRedisGet).toHaveBeenCalledWith(testKey);
      expect(dbFetchFn).toHaveBeenCalledTimes(1);
      expect(mockRedisSet).not.toHaveBeenCalled(); // Should not cache null
      expect(result).toBeNull();
    });

    it('should handle Redis get error and fetch from DB', async () => {
      // Arrange
      const redisError = new Error('Redis GET failed');
      mockRedisGet.mockRejectedValue(redisError);
      const dbValue = { data: 'fetched after redis error' };
      const dbFetchFn = vi.fn().mockResolvedValue(dbValue);
      mockRedisSet.mockResolvedValue('OK');

      // Act
      const result = await cacheWrap(testKey, dbFetchFn, testTtl);

      // Assert
      expect(mockRedisGet).toHaveBeenCalledWith(testKey);
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Redis GET error for key ${testKey}:`,
        redisError
      );
      expect(dbFetchFn).toHaveBeenCalledTimes(1);
      expect(mockRedisSet).toHaveBeenCalledWith(
        testKey,
        JSON.stringify(dbValue),
        'EX',
        testTtl
      );
      expect(result).toEqual(dbValue);
    });

    it('should handle Redis set error after fetching from DB', async () => {
      // Arrange
      mockRedisGet.mockResolvedValue(null); // Cache miss
      const dbValue = { data: 'fetched value' };
      const dbFetchFn = vi.fn().mockResolvedValue(dbValue);
      const redisSetError = new Error('Redis SET failed');
      mockRedisSet.mockRejectedValue(redisSetError);

      // Act
      const result = await cacheWrap(testKey, dbFetchFn, testTtl);

      // Assert
      expect(mockRedisGet).toHaveBeenCalledWith(testKey);
      expect(dbFetchFn).toHaveBeenCalledTimes(1);
      expect(mockRedisSet).toHaveBeenCalledWith(
        testKey,
        JSON.stringify(dbValue),
        'EX',
        testTtl
      );
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Redis SET error for key ${testKey}:`,
        redisSetError
      );
      expect(result).toEqual(dbValue); // Should still return DB value
    });

    it('should handle DB fetch error', async () => {
      // Arrange
      mockRedisGet.mockResolvedValue(null); // Cache miss
      const dbError = new Error('DB fetch failed');
      const dbFetchFn = vi.fn().mockRejectedValue(dbError);

      // Act & Assert
      await expect(
        cacheWrap(testKey, dbFetchFn, testTtl)
      ).rejects.toThrow(dbError);
      expect(mockRedisGet).toHaveBeenCalledWith(testKey);
      expect(dbFetchFn).toHaveBeenCalledTimes(1);
      expect(mockRedisSet).not.toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Error executing dbFetchFn for key ${testKey}:`,
        dbError
      );
    });
  });

  // --- invalidateCache Tests ---
  describe('invalidateCache', () => {
    it('should call redis.del with the provided key', async () => {
      // Arrange
      mockRedisDel.mockResolvedValue(1); // Simulate 1 key deleted

      // Act
      await invalidateCache(testKey);

      // Assert
      expect(mockRedisDel).toHaveBeenCalledWith(testKey);
      expect(mockLogger.debug).toHaveBeenCalledWith(
        `Cache invalidated for key: ${testKey}`
      );
    });

    it('should handle Redis del error', async () => {
      // Arrange
      const redisError = new Error('Redis DEL failed');
      mockRedisDel.mockRejectedValue(redisError);

      // Act
      await invalidateCache(testKey); // Should not throw, just log

      // Assert
      expect(mockRedisDel).toHaveBeenCalledWith(testKey);
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Redis DEL error for key ${testKey}:`,
        redisError
      );
    });
  });

  // --- invalidateCachePattern Tests ---
  describe('invalidateCachePattern', () => {
    it('should scan for keys and delete them using pipeline', async () => {
      // Arrange
      const pattern = 'user:*:folders';
      const keysToDelete = ['user:1:folders', 'user:2:folders'];
      // Mock scan to return keys in batches
      mockRedisScan
        .mockResolvedValueOnce(['10', keysToDelete.slice(0, 1)]) // First call, cursor 10, one key
        .mockResolvedValueOnce(['0', keysToDelete.slice(1)]); // Second call, cursor 0, last key

      const pipelineDelMock = vi.fn().mockReturnThis();
      const pipelineExecMock = vi.fn().mockResolvedValue([]); // Simulate successful exec
      mockRedisPipeline.mockReturnValue({
        del: pipelineDelMock,
        exec: pipelineExecMock,
      } as any);

      // Act
      await invalidateCachePattern(pattern);

      // Assert
      expect(mockRedisScan).toHaveBeenCalledTimes(2);
      expect(mockRedisScan).toHaveBeenCalledWith(
        0,
        'MATCH',
        pattern,
        'COUNT',
        100
      );
      expect(mockRedisScan).toHaveBeenCalledWith(
        '10',
        'MATCH',
        pattern,
        'COUNT',
        100
      );
      expect(mockRedisPipeline).toHaveBeenCalledTimes(1); // Pipeline called once
      expect(pipelineDelMock).toHaveBeenCalledTimes(
        keysToDelete.length
      );
      expect(pipelineDelMock).toHaveBeenCalledWith(keysToDelete[0]);
      expect(pipelineDelMock).toHaveBeenCalledWith(keysToDelete[1]);
      expect(pipelineExecMock).toHaveBeenCalledTimes(1);
      expect(mockLogger.debug).toHaveBeenCalledWith(
        `Invalidating cache for pattern: ${pattern}. Found ${keysToDelete.length} keys.`
      );
    });

    it('should handle empty scan results', async () => {
      // Arrange
      const pattern = 'nonexistent:*';
      mockRedisScan.mockResolvedValue(['0', []]); // No keys found

      // Act
      await invalidateCachePattern(pattern);

      // Assert
      expect(mockRedisScan).toHaveBeenCalledWith(
        0,
        'MATCH',
        pattern,
        'COUNT',
        100
      );
      expect(mockRedisPipeline).not.toHaveBeenCalled(); // Pipeline should not be called if no keys
      expect(mockLogger.debug).toHaveBeenCalledWith(
        `Invalidating cache for pattern: ${pattern}. Found 0 keys.`
      );
    });

    it('should handle Redis scan error', async () => {
      // Arrange
      const pattern = 'error:pattern:*';
      const redisError = new Error('Redis SCAN failed');
      mockRedisScan.mockRejectedValue(redisError);

      // Act
      await invalidateCachePattern(pattern); // Should not throw, just log

      // Assert
      expect(mockRedisScan).toHaveBeenCalledWith(
        0,
        'MATCH',
        pattern,
        'COUNT',
        100
      );
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Redis SCAN error for pattern ${pattern}:`,
        redisError
      );
      expect(mockRedisPipeline).not.toHaveBeenCalled();
    });

    it('should handle Redis pipeline exec error', async () => {
      // Arrange
      const pattern = 'pipeline:error:*';
      const keysToDelete = ['pipeline:error:1'];
      mockRedisScan.mockResolvedValueOnce(['0', keysToDelete]);
      const pipelineError = new Error('Pipeline EXEC failed');
      const pipelineDelMock = vi.fn().mockReturnThis();
      const pipelineExecMock = vi
        .fn()
        .mockRejectedValue(pipelineError);
      mockRedisPipeline.mockReturnValue({
        del: pipelineDelMock,
        exec: pipelineExecMock,
      } as any);

      // Act
      await invalidateCachePattern(pattern); // Should not throw, just log

      // Assert
      expect(mockRedisScan).toHaveBeenCalledTimes(1);
      expect(mockRedisPipeline).toHaveBeenCalledTimes(1);
      expect(pipelineDelMock).toHaveBeenCalledWith(keysToDelete[0]);
      expect(pipelineExecMock).toHaveBeenCalledTimes(1);
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Redis pipeline EXEC error for pattern ${pattern}:`,
        pipelineError
      );
    });
  });
});
