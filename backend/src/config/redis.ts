// src/config/redis.ts
import Redis from 'ioredis';
import logger from './logger';
import { config } from './index'; // Assuming Redis URL might be in main config later

// TODO: Move Redis connection details to environment variables/config
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'; 

const redisClient = new Redis(redisUrl, {
    // Optional: Add more configuration options here
    // maxRetriesPerRequest: 3, 
    // enableReadyCheck: true,
    // lazyConnect: true, // Connect only when needed?
});

redisClient.on('connect', () => {
    logger.info('[Redis]: Connected successfully.');
});

redisClient.on('error', (err) => {
    logger.error('[Redis]: Connection error:', err);
    // Optional: Implement reconnection logic or graceful shutdown if connection fails critically
});

// Optional: Graceful shutdown
process.on('SIGINT', async () => {
    logger.info('[Redis]: Disconnecting...');
    await redisClient.quit();
    logger.info('[Redis]: Disconnected.');
    process.exit(0);
});

export default redisClient;
