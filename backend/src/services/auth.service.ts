// src/services/authService.ts
import * as bcrypt from 'bcrypt';
import jwt, { SignOptions , sign, verify } from 'jsonwebtoken'; // Import sign directly
import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/db';
import { config } from '../config';
import logger from '../config/logger';
import { 
  RegisterUserInput, 
  LoginUserInput, 
  ResetPasswordRequestInput,
  ResetPasswordInput
} from '../models/schemas';
import { sendEmail } from '../utils/email';
import { User } from '@prisma/client'; // Import User type for clarity

// --- Custom Error ---

/**
 * Custom error class for authentication specific errors.
 */
export class AuthError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

// --- Token Generation ---

/**
 * Generates a JWT access token.
 * @param id - User ID.
 * @param email - User email.
 * @param username - User username.
 * @returns {string} The generated JWT access token.
 */

const generateToken = (id: string, email: string, username: string): string => {
  const payload = { id, email, username };
  const options: SignOptions = { // Define options with explicit type
      expiresIn: config.jwt.expiresIn,
      algorithm: 'HS256' 
  };
  logger.debug(`Generating access token for user ID: ${id}`);
  return jwt.sign( 
    payload,
    config.jwt.secret, // Keep Secret cast for clarity
    options 
  );
};

/**
 * Generates a JWT refresh token.
 * @param id - User ID.
 * @returns {string} The generated JWT refresh token.
 */
const generateRefreshToken = (id: string): string => {
  const payload = { id };
  const options: SignOptions = { // Define options with explicit type
      expiresIn: config.jwt.refreshExpiresIn,
      algorithm: 'HS256' 
  };
   logger.debug(`Generating refresh token for user ID: ${id}`);
  return sign( 
    payload,
    config.jwt.refreshSecret, // Keep Secret cast for clarity
    options 
  );
};

// --- Service Functions ---

/**
 * Registers a new user, creates a default folder, sends verification email, and generates tokens.
 * @param userData - User registration data.
 * @returns {Promise<object>} Object containing tokens and user info (excluding password).
 * @throws {AuthError} If email or username is already taken.
 */
export const registerUser = async (userData: RegisterUserInput) => {
  const { email, username, password, name } = userData;
  logger.info(`Attempting registration for username: ${username}, email: ${email}`);

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username }
      ]
    }
  });

  if (existingUser) {
    const message = existingUser.email === email 
        ? 'Email already in use' 
        : 'Username already taken';
    logger.warn(`Registration failed for ${username}: ${message}`);
    throw new AuthError(message, 400); // Bad Request
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate verification token
  const verificationToken = uuidv4();
  logger.debug(`Generated verification token for ${username}`);

  // Create user and default folder in a transaction
  const user = await prisma.$transaction(async (tx) => { 
    const newUser = await tx.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        name,
        verificationToken, // Save the token
        isVerified: false, // Explicitly set to false initially
      }
    });
    logger.info(`User created with ID: ${newUser.id}`);

    await tx.folder.create({
      data: {
        name: 'Favorites', // Default folder name
        userId: newUser.id
      }
    });
     logger.info(`Default 'Favorites' folder created for user ID: ${newUser.id}`);

    return newUser;
  });

  // Send verification email (async, don't block response)
  const verificationUrl = `${config.cors.origin}/verify-email/${verificationToken}`;
  logger.info(`Sending verification email to ${user.email}`);
  sendEmail({
    to: user.email,
    subject: 'Verify Your Email Address',
    text: `Please verify your email address by clicking this link: ${verificationUrl}`,
    html: `
      <div>
        <h1>Welcome to Bookie!</h1>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Verify Email</a>
        <p>If you did not sign up for an account, please ignore this email.</p>
      </div>
    `
  }).catch(err => {
    // Log error if email sending fails, but don't fail the registration
    logger.error(`Failed to send verification email to ${user.email}:`, err);
  });


  // Generate tokens (User is registered but not verified yet)
  const token = generateToken(user.id, user.email, user.username);
  const refreshToken = generateRefreshToken(user.id);

  // Update user with refresh token
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken }
  });
  logger.debug(`Stored refresh token for user ID: ${user.id}`);

  // Return necessary data (indicate verification pending)
  return {
    token, 
    refreshToken,
    user: { // Exclude sensitive fields
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      isVerified: user.isVerified
    }
  };
};

/**
 * Logs in a user, verifies credentials, and generates tokens.
 * @param credentials - User login credentials (email, password).
 * @returns {Promise<object>} Object containing tokens and user info (excluding password).
 * @throws {AuthError} If credentials are invalid or user is inactive.
 */
export const loginUser = async (credentials: LoginUserInput) => {
  const { email, password } = credentials;
  logger.info(`Login attempt for email: ${email}`);

  // Find user
  const user = await prisma.user.findUnique({
    where: { email }
  });

  // Use AuthError for invalid credentials or inactive user
  if (!user || !user.isActive) {
     logger.warn(`Login failed for ${email}: User not found or inactive.`);
    throw new AuthError('Invalid credentials or user inactive', 401); // Unauthorized
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    logger.warn(`Login failed for ${email}: Invalid password.`);
    throw new AuthError('Invalid credentials', 401); // Unauthorized
  }

  // Generate tokens
  const token = generateToken(user.id, user.email, user.username);
  const refreshToken = generateRefreshToken(user.id);

  // Update user with refresh token and last login
  await prisma.user.update({
    where: { id: user.id },
    data: { 
      refreshToken,
      lastLogin: new Date()
    }
  });
  logger.info(`User ${user.username} logged in successfully. Updated refresh token and last login.`);

  // Return necessary data
  return {
    token,
    refreshToken,
    user: { // Exclude sensitive fields
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      profileImage: user.profileImage,
      isVerified: user.isVerified
    }
  };
};

/**
 * Logs out a user by clearing their refresh token from the database.
 * @param userId - The ID of the user logging out.
 */
export const logoutUser = async (userId: string | undefined) => {
  if (userId) {
    logger.info(`Logout attempt for user ID: ${userId}`);
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null } // Clear the stored refresh token
      });
       logger.info(`Cleared refresh token for user ID: ${userId}`);
    } catch (error) {
      // Log the error but don't necessarily throw, as logout should generally succeed client-side
      logger.error(`Error clearing refresh token for user ${userId} during logout:`, error);
    }
  } else {
     logger.warn('Logout called without user ID (likely already unauthenticated).');
  }
};

/**
 * Initiates the password reset process by generating a token and sending an email.
 * @param emailInput - Object containing the user's email.
 * @returns {Promise<object>} Object with a success message.
 */
export const requestPasswordResetService = async (emailInput: ResetPasswordRequestInput) => {
  const { email } = emailInput;
  logger.info(`Password reset requested for email: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email }
  });

  // If user exists, proceed with token generation and email sending
  if (user) {
    try {
      // Generate reset token
      const resetToken = uuidv4();
      const resetExpires = new Date(Date.now() + 3600000); // 1 hour expiry
      logger.debug(`Generated password reset token for user ${user.id}`);

      // Save token to database
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: resetToken,
          passwordResetExpires: resetExpires
        }
      });

      // Create reset URL
      const resetUrl = `${config.cors.origin}/reset-password/${resetToken}`;
      logger.info(`Sending password reset email to ${email}`);

      // Send email
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Please go to this link to reset your password (link expires in 1 hour): ${resetUrl}`,
        html: `
          <div>
            <h1>Password Reset Request</h1>
            <p>You requested a password reset for your Bookie account.</p>
            <p>Please click the button below to reset your password (link expires in 1 hour):</p>
            <a href="${resetUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Reset Password</a>
            <p>If you did not request a password reset, please ignore this email.</p>
          </div>
        `
      });
    } catch (error) {
      // Log error but don't throw to the controller, maintain security posture
      logger.error(`Error processing password reset request for ${email}:`, error);
    }
  } else {
    // Log if user not found, but don't indicate this to the client
    logger.info(`Password reset requested for non-existent email: ${email}`);
  }

  // Always return success message for security (don't reveal if email exists)
  return { message: 'If an account with that email exists, a password reset link has been sent.' };
};

/**
 * Resets a user's password using a valid reset token.
 * @param resetInput - Object containing the reset token and new password.
 * @returns {Promise<object>} Object with a success message.
 * @throws {AuthError} If the token is invalid or expired.
 */
export const resetPasswordService = async (resetInput: ResetPasswordInput) => {
  const { token, newPassword } = resetInput;
  logger.info(`Attempting password reset with token: ${token}`);

  // Find user with valid token
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetExpires: {
        gt: new Date() // Check if token is not expired
      }
    }
  });

  // If no user found or token expired, throw error
  if (!user) {
    logger.warn(`Password reset failed: Invalid or expired token provided.`);
    throw new AuthError('Invalid or expired reset token', 400); // Bad Request
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update password and clear token fields, also invalidate existing sessions by clearing refresh token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
      refreshToken: null // Invalidate refresh tokens for all sessions
    }
  });
  logger.info(`Password reset successful for user ${user.id}. Refresh tokens invalidated.`);

  // Return success message
  return { message: 'Password reset successful. Please log in with your new password.' };
};

/**
 * Refreshes an access token using a valid refresh token.
 * @param incomingRefreshToken - The refresh token provided by the client (usually via cookie).
 * @returns {Promise<object>} Object containing the new access token and refresh token.
 * @throws {AuthError} If the refresh token is invalid, expired, or doesn't match the stored token.
 */
export const refreshTokenService = async (incomingRefreshToken: string) => {
  logger.debug('Attempting to refresh token.');
  try {
    // Verify refresh token signature and expiry
    const decoded = verify(incomingRefreshToken, config.jwt.refreshSecret as string) as { id: string };
    logger.debug(`Refresh token verified for user ID: ${decoded.id}`);

    // Check if user exists and token matches the one stored in DB
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.id,
        refreshToken: incomingRefreshToken // Ensure the provided token is the one stored
      }
    });

    // If user not found or token doesn't match (e.g., user logged out elsewhere), throw error
    if (!user) {
      logger.warn(`Refresh token validation failed: User ${decoded.id} not found or token mismatch.`);
      throw new AuthError('Invalid refresh token', 401); // Unauthorized
    }

    // Generate new tokens
    const newAccessToken = generateToken(user.id, user.email, user.username);
    const newRefreshToken = generateRefreshToken(user.id);
    logger.info(`Generated new tokens for user ${user.id} during refresh.`);

    // Update refresh token in database (rotation)
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken }
    });
    logger.debug(`Stored new refresh token for user ${user.id}.`);

    // Return new tokens
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };

  } catch (error) {
    // Handle JWT errors (like expiration) or other issues
    logger.error('Error verifying or refreshing token:', error);
    // Throw a specific error for invalid/expired tokens
    throw new AuthError('Invalid or expired refresh token', 401); // Unauthorized
  }
};

/**
 * Verifies a user's email address using a verification token.
 * @param token - The email verification token.
 * @returns {Promise<object>} Object with a success message.
 * @throws {AuthError} If the token is invalid, expired, or the email is already verified.
 */
export const verifyUserEmail = async (token: string) => {
  logger.info(`Attempting email verification with token: ${token}`);
  // Find user by the verification token
  const user = await prisma.user.findUnique({
    where: { verificationToken: token }
  });

  // If no user found with this token, throw error
  if (!user) {
    logger.warn(`Email verification failed: Invalid token provided.`);
    throw new AuthError('Invalid or expired verification token', 400); // Bad Request
  }
  // If already verified, inform the user (or could silently succeed)
  if (user.isVerified) {
    logger.info(`Email verification attempt for already verified user: ${user.id}`);
    // Optional: Could just return success if already verified
    throw new AuthError('Email already verified', 400); 
  }

  // Update user: set isVerified to true and clear the token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null // Clear the token once used
    }
  });
  logger.info(`Email verified successfully for user ${user.id}.`);

  // Return success message
  return { message: 'Email verified successfully. You can now log in.' };
};

/**
 * Retrieves non-sensitive profile information for an authenticated user.
 * @param userId - The ID of the authenticated user.
 * @returns {Promise<object>} User profile data (excluding password, tokens).
 * @throws {AuthError} If the user is not found.
 */
export const getAuthenticatedUser = async (userId: string) => {
    logger.debug(`Fetching authenticated user profile for ID: ${userId}`);
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { // Select only necessary, non-sensitive fields
                id: true,
                email: true,
                username: true,
                name: true,
                profileImage: true,
                isVerified: true, 
                createdAt: true, // Include createdAt for context if needed
                updatedAt: true, // Include updatedAt for context if needed
            }
        });

        if (!user) {
            // This case should ideally not happen if protect middleware ran successfully
            logger.error(`Authenticated user check failed: User not found for ID ${userId}`);
            throw new AuthError('User not found', 404); 
        }
        return user;
    } catch (error) {
         logger.error(`Error fetching authenticated user ${userId}:`, error);
         // Don't expose detailed errors, rely on AuthError or throw generic
         if (error instanceof AuthError) throw error;
         throw new AuthError('Failed to retrieve user data', 500);
    }
};

// Export token functions only if they need to be used directly elsewhere (unlikely)
// export { generateToken, generateRefreshToken };
