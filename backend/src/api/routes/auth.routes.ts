// src/routes/auth.routes.ts
import { Router, RequestHandler } from 'express'; // Import RequestHandler
import * as authController from '../controllers/auth.controller';
import validate from '../middleware/validation.middleware'; // Import the validation middleware
import { protect } from '../middleware/auth.middleware'; // Import protect middleware
import {
  registerUserSchema,
  loginUserSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
} from '../models/schemas'; // Import Zod schemas

const router = Router();

// --- Public Authentication Routes ---

// POST /api/auth/register - Register a new user
router.post(
  '/register',
  validate(registerUserSchema),
  authController.register as RequestHandler
);

// POST /api/auth/login - Log in an existing user
router.post(
  '/login',
  validate(loginUserSchema),
  authController.login as RequestHandler
);

// POST /api/auth/refresh-token - Refresh access token using refresh token cookie
router.post(
  '/refresh-token',
  authController.refreshToken as RequestHandler
);

// POST /api/auth/request-password-reset - Request a password reset email
router.post(
  '/request-password-reset',
  validate(resetPasswordRequestSchema),
  authController.requestPasswordReset as RequestHandler
);

// POST /api/auth/reset-password - Reset password using token from email
router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  authController.resetPassword as RequestHandler
);

// GET /api/auth/verify-email/:token - Verify email address using token from email
router.get(
  '/verify-email/:token',
  authController.verifyEmail as RequestHandler
);

// --- Protected Authentication Routes ---

// POST /api/auth/logout - Log out the current user
router.post(
  '/logout',
  protect, // Requires user to be logged in to logout server-side session/token
  authController.logout as RequestHandler
);

// GET /api/auth/check - Check authentication status and get user info
router.get(
  '/check',
  protect, // Requires user to be logged in
  authController.checkAuth as RequestHandler // Assuming checkAuth exists and is used
);

export default router;
