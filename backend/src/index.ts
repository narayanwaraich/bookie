import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import http from 'http'; // Import http
import { Server as SocketIOServer } from 'socket.io'; // Import Socket.IO Server
import { config } from './api/config';
import logger from './api/config/logger';
import rateLimiter from './api/config/rateLimiter';
import apiRouter from './api/routes'; // Your existing REST API router
import errorHandler from './api/middleware/errorHandler'; // Import the error handler
import * as trpcExpress from '@trpc/server/adapters/express'; // Import tRPC adapter
import { appRouter } from './api/trpc/router'; // Import your main tRPC router
import { createContext } from './api/trpc/context'; // Import your context creation function
import { initSocketIO } from './api/config/socket'; // Import the Socket.IO initializer

const app: Express = express();
const port = config.port;

// --- Core Middleware ---

// Security headers
app.use(helmet());

// Enable CORS
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = config.cors.origin;
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies
  })
);

// JSON body parsing
app.use(express.json());

// URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));

// Cookie parsing
app.use(cookieParser());

// Request logging (using Winston logger stream)
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Apply rate limiting to all requests
app.use(rateLimiter as express.RequestHandler); // Explicitly cast type

// --- Routes ---

// Simple base route
app.get('/', (req: Request, res: Response) => {
  res.send('Bookmark Manager API is running!');
});

// API routes
// Mount REST API Router (already versioned inside index.ts)
app.use('/api/routes/', apiRouter);

// Mount tRPC Router
app.use(
  '/api/trpc', // Define the path for tRPC requests
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
    onError: ({ path, error }) => {
      // Optional: Add logging for tRPC errors
      logger.error(
        `[tRPC Error] Path: ${path}, Error: ${error.message}`,
        { code: error.code, stack: error.stack }
      );
    },
  })
);

// --- Error Handling ---

// Catch 404 for routes not found
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Not Found' });
});

// Central error handler - MUST be the last middleware
app.use(errorHandler);

// --- Server Setup ---

const httpServer = http.createServer(app); // Create HTTP server from Express app

// Initialize Socket.IO Server using the new function
const io = initSocketIO(httpServer);

// --- Server Startup ---

// Only listen if not in test environment
if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(port, () => {
    // Listen on the HTTP server
    logger.info(
      `[Server]: Server is running at http://localhost:${port}`
    );
  });
} else {
  logger.info(
    '[Server]: Skipping httpServer.listen() in test environment.'
  );
}

// Optional: Handle unhandled promise rejections and uncaught exceptions
process.on(
  'unhandledRejection',
  (reason: Error | any, promise: Promise<any>) => {
    logger.error(
      `Unhandled Rejection at: ${promise}, reason: ${
        reason.stack || reason
      }`
    );
    // Consider exiting process: process.exit(1);
  }
);

process.on('uncaughtException', (error: Error) => {
  logger.error(`Uncaught Exception: ${error.stack}`);
  // Consider exiting process: process.exit(1);
});

// Remove direct export of io instance
// export { io };

// Export app for potential testing (optional, httpServer might be more relevant now)
export default app;
