import { getIO } from '../config/socket'; // Import getIO from config/socket
import logger from '../config/logger';
import { Server as SocketIOServer } from 'socket.io'; // Keep type import if needed elsewhere

/**
 * Emits an event to a specific user's room.
 * Assumes sockets join a room named after their userId upon authentication.
 * @param userId - The ID of the user to emit the event to.
 * @param eventName - The name of the event to emit (should be one of SOCKET_EVENTS).
 * @param data - The data payload for the event.
 */
export const emitToUser = (userId: string, eventName: string, data: any): void => {
    let ioInstance: SocketIOServer;
    try {
        ioInstance = getIO();
    } catch (error) {
        logger.error("[Socket Service]: Failed to get IO instance in emitToUser:", error);
        return;
    }
    if (!userId) {
        logger.warn(`[Socket Service]: Attempted to emit event '${eventName}' without a userId.`);
        return;
    }
    
    // Emit the event to the room named after the userId
    const roomName = userId; 
    const result = ioInstance.to(roomName).emit(eventName, data); 
    
    if (result) { // Check if emit was potentially successful (at least to the adapter)
        logger.info(`[Socket Service]: Emitted event '${eventName}' to user room '${roomName}'`);
    } else {
         logger.warn(`[Socket Service]: Failed to emit event '${eventName}' to user room '${roomName}' (adapter issue?).`);
    }
    // Avoid logging potentially sensitive data: logger.debug(`[Socket Service]: Data for event '${eventName}':`, data);
};

/**
 * Emits an event to all connected authenticated clients. Use with caution.
 * Consider using more targeted rooms for shared resources if possible.
 * @param eventName - The name of the event to emit (should be one of SOCKET_EVENTS).
 * @param data - The data payload for the event.
 */
export const broadcastEvent = (eventName: string, data: any): void => {
    let ioInstance: SocketIOServer;
    try {
        ioInstance = getIO();
    } catch (error) {
        logger.error("[Socket Service]: Failed to get IO instance in broadcastEvent:", error);
        return;
    }
    // Note: This emits to ALL connected clients. 
    ioInstance.emit(eventName, data); 
    logger.info(`[Socket Service]: Broadcasted event '${eventName}' to all clients.`);
};

/**
 * Defines constants for socket event names used throughout the application.
 * Helps ensure consistency and prevent typos.
 */
export const SOCKET_EVENTS = {
    // Bookmarks
    BOOKMARK_CREATED: 'bookmark:created',
    BOOKMARK_UPDATED: 'bookmark:updated',
    BOOKMARK_DELETED: 'bookmark:deleted',
    
    // Folders
    FOLDER_CREATED: 'folder:created',
    FOLDER_UPDATED: 'folder:updated',
    FOLDER_DELETED: 'folder:deleted',
    
    // Collections
    COLLECTION_CREATED: 'collection:created',
    COLLECTION_UPDATED: 'collection:updated',
    COLLECTION_DELETED: 'collection:deleted',
    
    // Tags
    TAG_CREATED: 'tag:created',
    TAG_UPDATED: 'tag:updated',
    TAG_DELETED: 'tag:deleted',
    
    // Add more events as needed (e.g., for user profile updates, notifications)
    // NOTIFICATION_NEW: 'notification:new',
};
