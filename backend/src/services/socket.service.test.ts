// backend/src/services/socket.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { emitToUser, broadcastEvent, SOCKET_EVENTS } from './socket.service';
import logger from '../config/logger';
// Import the mocked 'io' object - This import relies on the vi.mock below
import { io } from '../index';

// --- Mocks ---
vi.mock('../config/logger', () => ({
  default: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
}));

// Mock the io object exported from ../index
// This factory function will be executed *before* the test file code runs.
vi.mock('../index', () => {
  // Create the mock functions needed for the io object
  const mockEmitFn = vi.fn().mockReturnValue(true); // Mock emit function
  const mockToFn = vi.fn(() => ({ emit: mockEmitFn })); // Mock 'to' function to return object with emit

  // Create the mock io instance with the mocked methods
  const mockIoInstance = {
    to: mockToFn,
    emit: mockEmitFn, // Add mock for direct emit used by broadcastEvent
    // Add other methods like .use(), .on() if they were directly used by socket.service,
    // but they seem to be used only in index.ts setup, not the service functions.
  };

  // Return the structure expected by the import in socket.service.ts
  return { io: mockIoInstance };
});


// --- Tests ---

describe('Socket Service', () => {
  const mockLogger = vi.mocked(logger);
  // Get a typed reference to the mocked io object *after* vi.mock has run
  const mockedIo = vi.mocked(io);

  beforeEach(() => {
    // Reset mocks before each test to clear call history etc.
    vi.resetAllMocks();
  });

  // --- emitToUser Tests ---
  describe('emitToUser', () => {
    it('should emit event to the correct user room via io.to().emit()', () => {
      // Arrange
      const userId = 'user-to-emit-to';
      const event = SOCKET_EVENTS.FOLDER_UPDATED;
      const data = { folderId: 'f123', name: 'Updated Name' };

      // Act
      // Call the original service function, which now uses the mocked 'io'
      emitToUser(userId, event, data);

      // Assert
      // Check that io.to was called with the userId
      expect(mockedIo.to).toHaveBeenCalledWith(userId);
      // Check that the emit function returned by io.to() was called correctly
      // We access the mock function returned by the specific call to 'to(userId)'
      expect(mockedIo.to(userId).emit).toHaveBeenCalledWith(event, data);
      // Check logger call
      expect(mockLogger.info).toHaveBeenCalledWith(`[Socket Service]: Emitted event '${event}' to user room '${userId}'`);
      expect(mockLogger.error).not.toHaveBeenCalled();
      expect(mockLogger.warn).not.toHaveBeenCalled();
    });

    it('should log warning if userId is empty', () => {
        // Arrange
        const userId = ''; // Empty userId
        const event = SOCKET_EVENTS.BOOKMARK_CREATED;
        const data = { id: 'b1' };

        // Act
        emitToUser(userId, event, data);

        // Assert
        expect(mockedIo.to).not.toHaveBeenCalled(); // Should not attempt to get room
        expect(mockLogger.warn).toHaveBeenCalledWith(`[Socket Service]: Attempted to emit event '${event}' without a userId.`);
        expect(mockLogger.info).not.toHaveBeenCalled();
        expect(mockLogger.error).not.toHaveBeenCalled();
    });

     it('should log warning if emit fails', () => {
        // Arrange
        const userId = 'user-fail-emit';
        const event = SOCKET_EVENTS.TAG_DELETED;
        const data = { id: 't1' };
        // Configure the mock emit (returned by .to()) to return false for this test
        mockedIo.to.mockReturnValueOnce({ emit: vi.fn().mockReturnValue(false) });

        // Act
        emitToUser(userId, event, data);

        // Assert
        expect(mockedIo.to).toHaveBeenCalledWith(userId);
        expect(mockedIo.to(userId).emit).toHaveBeenCalledWith(event, data);
        expect(mockLogger.warn).toHaveBeenCalledWith(`[Socket Service]: Failed to emit event '${event}' to user room '${userId}' (adapter issue?).`);
        expect(mockLogger.info).not.toHaveBeenCalled();
        expect(mockLogger.error).not.toHaveBeenCalled();
    });

    // Note: Testing the '!io' condition is hard without dependency injection,
    // as 'io' is directly imported and mocked statically.
  });

  // --- broadcastEvent Tests ---
  describe('broadcastEvent', () => {
    it('should emit event directly via io.emit()', () => {
        // Arrange
        const event = SOCKET_EVENTS.COLLECTION_CREATED;
        const data = { id: 'c1', name: 'New Collection' };

        // Act
        broadcastEvent(event, data);

        // Assert
        expect(mockedIo.emit).toHaveBeenCalledWith(event, data);
        expect(mockLogger.info).toHaveBeenCalledWith(`[Socket Service]: Broadcasted event '${event}' to all clients.`);
        expect(mockedIo.to).not.toHaveBeenCalled(); // Ensure .to was not called
        expect(mockLogger.error).not.toHaveBeenCalled();
    });

     // Note: Testing the '!io' condition is hard here too.
  });
});
