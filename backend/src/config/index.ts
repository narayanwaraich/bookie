import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || '7fee43caa6a731eeb1217a36ada91055f0a22dc6b01f432b5780b307b7563b7b',
    refreshSecret: process.env.JWT_REFRESH_SECRET || '37f8e55d18edb20ca79becfa0a33a2fd97f7e48c7e1257ffde852299929a4ebe',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.example.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER || 'user@example.com',
    password: process.env.EMAIL_PASSWORD || 'password',
    fromName: process.env.EMAIL_FROM_NAME || 'Bookmark Manager',
    fromEmail: process.env.EMAIL_FROM_EMAIL || 'noreply@bookmarkmanager.com',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};
