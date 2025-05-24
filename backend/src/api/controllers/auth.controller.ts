// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import {
  RegisterUserInput,
  LoginUserInput,
  ResetPasswordRequestInput,
  ResetPasswordInput,
} from '../models/schemas';
import { AuthenticatedRequest } from '../types/express/index'; // For logout
import logger from '../config/logger';
import { config } from '../config'; // For cookie settings
import { AuthError } from '../services/auth.service'; // Import custom error
import { decode } from 'jsonwebtoken'; // Import decode function

// Helper to set refresh token cookie (copied from auth.trpc.ts for consistency)
const setRefreshTokenCookie = (res: Response, token: string) => {
  // Simple duration parsing for cookie (consider using 'ms' library if installed)
  let maxAgeMs = 7 * 24 * 60 * 60 * 1000; // Default 7 days
  if (config.jwt.refreshExpiresIn) {
    // Basic parsing, assumes format like '7d', '1h' - enhance if needed
    const unit = config.jwt.refreshExpiresIn.slice(-1);
    const value = parseInt(
      config.jwt.refreshExpiresIn.slice(0, -1),
      10
    );
    if (!isNaN(value)) {
      if (unit === 'd') maxAgeMs = value * 24 * 60 * 60 * 1000;
      else if (unit === 'h') maxAgeMs = value * 60 * 60 * 1000;
      else if (unit === 'm') maxAgeMs = value * 60 * 1000;
      // Add other units if necessary
    }
  }

  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: maxAgeMs,
    path: '/',
  });
};

// Helper to clear refresh token cookie (copied from auth.trpc.ts)
const clearRefreshTokenCookie = (res: Response) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  });
};

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     description: Creates a new user account, sends a verification email, and returns initial tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, username, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address (must be unique).
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 description: User's username (must be unique).
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: User's password.
 *               name:
 *                 type: string
 *                 description: User's optional display name.
 *     responses:
 *       '201':
 *         description: User registered successfully (verification email sent). Returns access token and user info. Refresh token is set as an HTTP-only cookie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     email:
 *                       type: string
 *                       format: email
 *                     username:
 *                       type: string
 *                     name:
 *                       type: string
 *                       nullable: true
 *                     isVerified:
 *                       type: boolean
 *       '400':
 *         description: Bad Request - Invalid input data (e.g., email format, password length) or email/username already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData: RegisterUserInput = req.body;
    // Service returns { token, refreshToken, user } now
    const { token, refreshToken, user } =
      await authService.registerUser(userData);

    setRefreshTokenCookie(res, refreshToken); // Set cookie

    // Return access token and user info in body
    res.status(201).json({
      success: true,
      accessToken: token, // Renamed from 'token' for clarity
      user,
    });
  } catch (error) {
    logger.error('Registration error:', error);
    next(error);
  }
};

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in a user
 *     description: Authenticates a user with email and password, returns tokens and user info.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       '200':
 *         description: Login successful. Returns access token and user info. Refresh token is set as an HTTP-only cookie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 accessToken:
 *                   type: string
 *                 user:
 *                   type: object
 *                   # Define user properties similar to register response
 *       '401':
 *         description: Unauthorized - Invalid credentials or inactive user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const credentials: LoginUserInput = req.body;
    // Service returns { token (accessToken), refreshToken, user }
    const {
      token: accessToken,
      refreshToken,
      user,
    } = await authService.loginUser(credentials);

    setRefreshTokenCookie(res, refreshToken); // Set cookie

    res.status(200).json({
      success: true,
      accessToken,
      user,
    });
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Log out a user
 *     description: Clears the user's refresh token from the database and clears the refresh token cookie. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Logout successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       '401':
 *         description: Unauthorized - User not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const logout = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id; // Get user ID from authenticated request
    await authService.logoutUser(userId);
    clearRefreshTokenCookie(res); // Clear cookie
    res
      .status(200)
      .json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Logout error:', error);
    next(error);
  }
};

/**
 * @openapi
 * /auth/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     description: Uses the HTTP-only refresh token cookie to generate a new access token and potentially a new refresh token (rotation).
 *     responses:
 *       '200':
 *         description: Token refresh successful. Returns new access token and user info. New refresh token is set as an HTTP-only cookie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 accessToken:
 *                   type: string
 *                 user:
 *                   type: object
 *                   # Define user properties
 *       '401':
 *         description: Unauthorized - Invalid or missing refresh token cookie.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken;
    if (!incomingRefreshToken) {
      throw new AuthError('Refresh token not found', 401);
    }
    // Service returns { accessToken, refreshToken }
    const { accessToken, refreshToken: newRefreshToken } =
      await authService.refreshTokenService(incomingRefreshToken);

    // Fetch user associated with the new access token
    const decodedPayload = decode(accessToken) as {
      sub?: string;
      id?: string;
    } | null;
    const userIdFromToken = decodedPayload?.id || decodedPayload?.sub;
    if (!userIdFromToken) {
      throw new AuthError(
        'Invalid access token payload after refresh',
        500
      );
    }
    const user = await authService.getAuthenticatedUser(
      userIdFromToken
    );

    setRefreshTokenCookie(res, newRefreshToken); // Set the new refresh token cookie

    res.status(200).json({
      success: true,
      accessToken,
      user, // Include user info
    });
  } catch (error) {
    logger.error('Refresh token error:', error);
    // Clear cookie on specific auth errors during refresh
    if (error instanceof AuthError && error.statusCode === 401) {
      clearRefreshTokenCookie(res);
    }
    next(error);
  }
};

/**
 * @openapi
 * /auth/request-password-reset:
 *   post:
 *     tags: [Auth]
 *     summary: Request password reset
 *     description: Sends a password reset link to the user's email address if the account exists.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       '200':
 *         description: Request received. An email will be sent if the account exists (response is the same regardless of account existence for security).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *       '400':
 *         description: Bad Request - Invalid email format.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const requestPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const emailInput: ResetPasswordRequestInput = req.body;
    const result = await authService.requestPasswordResetService(
      emailInput
    );
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    // Service handles logging/not throwing for non-existent users
    logger.error('Request password reset error:', error);
    next(error); // Handle unexpected internal errors
  }
};

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password using token
 *     description: Sets a new password for the user using a valid password reset token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, newPassword]
 *             properties:
 *               token:
 *                 type: string
 *                 description: The password reset token received via email.
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: The new password for the user.
 *     responses:
 *       '200':
 *         description: Password reset successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *       '400':
 *         description: Bad Request - Invalid/expired token or invalid new password.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resetInput: ResetPasswordInput = req.body;
    const result = await authService.resetPasswordService(resetInput);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    logger.error('Reset password error:', error);
    next(error);
  }
};

/**
 * @openapi
 * /auth/verify-email/{token}:
 *   get:
 *     tags: [Auth]
 *     summary: Verify user email address
 *     description: Verifies a user's email using the token sent during registration.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The email verification token.
 *     responses:
 *       '200':
 *         description: Email verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *       '400':
 *         description: Bad Request - Invalid/expired token or email already verified.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;
    if (!token) {
      throw new AuthError('Verification token is required', 400);
    }
    const result = await authService.verifyUserEmail(token);
    // Optional: Redirect user to a success page on the frontend instead of JSON response
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    logger.error('Email verification error:', error);
    next(error);
  }
};

/**
 * @openapi
 * /auth/check:
 *   get:
 *     tags: [Auth]
 *     summary: Check authentication status
 *     description: Verifies if the user is authenticated (via valid JWT) and returns the user's information. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User is authenticated. Returns user information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   # Define user properties similar to register/login response
 *       '401':
 *         description: Unauthorized - User not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const checkAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // The 'protect' middleware already verified the token and attached user to req.user
    if (!req.user) {
      // This case should technically not be reached if 'protect' middleware is working
      throw new AuthError(
        'User not found after authentication check',
        401
      );
    }
    // Return the user information attached by the middleware
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    logger.error('Auth check error:', error);
    next(error);
  }
};

// Define a basic ErrorResponse schema component for OpenAPI references
/**
 * @openapi
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           description: A description of the error.
 *   securitySchemes:
 *      bearerAuth: # arbitrary name for the security scheme
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT    # optional, arbitrary value for documentation purposes
 */
