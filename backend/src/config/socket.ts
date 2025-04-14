import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import logger from './logger';
import { config } from './index';
import { socketAuthMiddleware, AuthenticatedSocket } from '../middleware/socketAuth.middleware';

let io: SocketIOServer | null = null;

/**
 * Initializes the Socket.IO server instance.
 * @param httpServer - The HTTP server instance to attach Socket.IO to.
 * @returns The initialized Socket.IO server instance.
 */
export const initSocketIO = (httpServer: HttpServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: config.cors.origin, // Use configured origin
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  logger.info('[Socket.IO]: Server initialized and middleware applied.');

  // Apply socket authentication middleware
  io.use(socketAuthMiddleware);

  // Handle authenticated connections
  io.on('connection', (socket: Socket) => { // Use base Socket type here, cast later
    const authenticatedSocket = socket as AuthenticatedSocket; // Cast after middleware

    // At this point, socket.user should be populated if authentication succeeded
    if (!authenticatedSocket.user) {
      logger.error(`[Socket.IO]: Connection event for unauthenticated socket ${authenticatedSocket.id}. Disconnecting.`);
      authenticatedSocket.disconnect(true);
      return;
    }

    logger.info(`[Socket.IO]: Authenticated client connected: ${authenticatedSocket.id}, User: ${authenticatedSocket.user.id}`);

    // Join a room specific to the user
    authenticatedSocket.join(authenticatedSocket.user.id);
    logger.info(`[Socket.IO]: Socket ${authenticatedSocket.id} joined room ${authenticatedSocket.user.id}`);

    authenticatedSocket.on('disconnect', () => {
      logger.info(`[Socket.IO]: Client disconnected: ${authenticatedSocket.id}`);
    });

    // Add any other general connection-level event listeners here if needed
  });

  return io;
};

/**
 * Gets the initialized Socket.IO server instance.
 * Throws an error if the server has not been initialized.
 * @returns The Socket.IO server instance.
 */
export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.IO has not been initialized. Call initSocketIO first.');
  }
  return io;
};
