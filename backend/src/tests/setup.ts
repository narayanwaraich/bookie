// backend/src/tests/setup.ts
import { vi, beforeEach } from 'vitest'; // Import beforeEach
import http from 'http'; // Import the http module
import { mockDeep, mockReset } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';

// --- Prisma Mocking ---
// Mock the singleton instance module path.
// The mock instance is created *inside* the factory to avoid hoisting issues.
vi.mock('../config/db', () => ({
  default: mockDeep<PrismaClient>(),
}));
// --- End Prisma Mocking ---


// --- Socket.IO Mocking ---
const mockRoom = { emit: vi.fn() }; // Mock object for rooms
const mockIoInstance = {
  to: vi.fn().mockReturnValue(mockRoom), // Ensure .to() returns the object with .emit()
  emit: vi.fn(),               // Mock top-level .emit()
  use: vi.fn(),                // Mock .use() for middleware
  on: vi.fn(),                 // Mock .on() for connection events
  // Add other methods if needed by tests
};
// Mock the Socket.IO getter to return the mock instance
// Use the path relative to the files importing it (e.g., services)
vi.mock('../config/socket', () => ({
  initSocketIO: vi.fn(() => mockIoInstance), // Mock init to return the mock instance
  getIO: vi.fn(() => mockIoInstance),       // Mock getIO to return the mock instance
}));
// --- End Socket.IO Mocking ---

// Reset mocks before each test
beforeEach(async () => { // Make beforeEach async to allow import
  // Import the mocked prisma instance here to reset it
  // const prisma = (await import('../config/db')).default; // No longer needed to import here
  // mockReset(prisma); // Removed reset for prisma mock, handled by resetting individual methods in tests
  mockReset(mockIoInstance.to);
  mockReset(mockIoInstance.emit);
  mockReset(mockRoom.emit);
  // Reset other ioInstance mocks if needed (use, on)
  // Reset Socket.IO mocks
  mockReset(mockIoInstance.to);
  mockReset(mockIoInstance.emit);
  mockReset(mockIoInstance.use); // Added reset
  mockReset(mockIoInstance.on);  // Added reset
  mockReset(mockRoom.emit);

  // Reset ioredis mocks (see below where mockRedisInstance is defined)
  if (mockRedisInstance) {
    mockReset(mockRedisInstance.get);
    mockReset(mockRedisInstance.set);
    mockReset(mockRedisInstance.del);
    mockReset(mockRedisInstance.scan);
    mockReset(mockRedisInstance.pipeline);
    mockReset(mockRedisInstance.quit);
    // Reset pipeline methods if they were accessed
    if (mockRedisInstance.pipeline()?.del) {
       mockReset(mockRedisInstance.pipeline().del);
    }
     if (mockRedisInstance.pipeline()?.exec) {
       mockReset(mockRedisInstance.pipeline().exec);
    }
  }
});


// Mock the http server's listen method to prevent EADDRINUSE errors
vi.mock('http', async (importOriginal) => {
  const actualHttp = await importOriginal<typeof http>(); // Import actual http module
  return {
    ...actualHttp, // Keep all other exports intact
    createServer: vi.fn(() => ({ // Mock createServer
      listen: vi.fn(), // Mock the listen method to do nothing
      on: vi.fn(),     // Add mock for 'on' if needed by socket.io/tests
      close: vi.fn((cb) => cb && cb()), // Mock close for graceful shutdown in tests
      // Add other methods if your tests interact with the server instance directly
    })),
  };
});


// Mock the ioredis library
// Store the instance for resetting
let mockRedisInstance: any;
vi.mock('ioredis', () => {
  const pipelineMock = {
      del: vi.fn().mockReturnThis(),       // Chainable del within pipeline
      exec: vi.fn().mockResolvedValue([]), // Default mock for pipeline exec
  };
  const instance = {
    get: vi.fn().mockResolvedValue(null), // Default mock for get
    set: vi.fn().mockResolvedValue('OK'),  // Default mock for set
    del: vi.fn().mockResolvedValue(1),     // Default mock for del
    scan: vi.fn().mockResolvedValue(['0', []]), // Default mock for scan (cursor '0', empty keys)
    pipeline: vi.fn(() => pipelineMock),   // Mock pipeline returns the same mock object
    on: vi.fn(),                           // Mock event listener registration
    quit: vi.fn().mockResolvedValue('OK'), // Mock quit
    // Add mocks for any other ioredis methods used in your application
    // e.g., incr: vi.fn().mockResolvedValue(1),
  };
  mockRedisInstance = instance; // Store the instance

  // Create a mock Redis client class constructor
  const MockRedis = vi.fn(() => instance);

  // Return the default export as the mocked class
  return {
    default: MockRedis,
  };
});


// You can add other global setup configurations here if needed
// For example, mocking environment variables:
// vi.stubEnv('NODE_ENV', 'test');

console.log('[Vitest Setup]: http.createServer and ioredis mocked globally.');
