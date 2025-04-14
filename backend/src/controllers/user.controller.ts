// src/controllers/user.controller.ts
import { Response, NextFunction } from 'express'; 
import logger from '../config/logger';
import * as userService from '../services/user.service'; 
import * as authService from '../services/auth.service'; // Keep for potential use or error types
import { 
  UpdateUserInput, 
  ChangePasswordInput,
  // Import deleteAccountSchema if needed, though validation is usually in routes
} from '../models/schemas';
import { AuthenticatedRequest } from '../types/express/index'; 

// Note: Register, Login, Logout, RequestPasswordReset, ResetPassword, RefreshToken 
// are handled by auth.controller.ts calling authService.ts.

/**
 * @openapi
 * /users/profile:
 *   get:
 *     tags: [User]
 *     summary: Get user profile
 *     description: Retrieves the profile information for the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved user profile.
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
 *                     profileImage:
 *                       type: string
 *                       nullable: true
 *                     isVerified:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       '401':
 *         description: Unauthorized - User not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - User associated with token not found.
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
export const getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user!.id; // Guaranteed by protect middleware
  try {
    const userProfile = await userService.getUserProfile(userId);
    res.status(200).json({ success: true, user: userProfile });
  } catch (error) {
    logger.error(`Error getting profile for user ${userId}:`, error);
    next(error); // Pass error to central handler
  }
};

/**
 * @openapi
 * /users/profile:
 *   put:
 *     tags: [User]
 *     summary: Update user profile
 *     description: Updates the profile information (name, username, profile image) for the currently authenticated user. Password changes should use the dedicated endpoint.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New display name.
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 description: New username (must be unique).
 *               profileImage:
 *                 type: string
 *                 description: URL to the new profile image.
 *     responses:
 *       '200':
 *         description: Profile updated successfully. Returns the updated user profile.
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
 *                   example: Profile updated successfully
 *                 user:
 *                   # Reference the same user profile structure as GET /profile
 *                   type: object 
 *                   properties:
 *                     # ... (user properties as in GET /profile)
 *       '400':
 *         description: Bad Request - Invalid input data (e.g., username format) or username already taken.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Unauthorized - User not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - User not found.
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
export const updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user!.id; 
  try {
    // Note: UpdateUserInput schema might include password fields, but service handles them separately
    const updateData: UpdateUserInput = req.body; 
    
    // Call service function
    const updatedProfile = await userService.updateUserProfile(userId, updateData);
    logger.info(`Profile updated for user ${userId}`);
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedProfile // Return the updated profile from service
    });
  } catch (error) {
    logger.error(`Error updating profile for user ${userId}:`, error);
    next(error);
  }
};

/**
 * @openapi
 * /users/change-password:
 *   post:
 *     tags: [User]
 *     summary: Change user password
 *     description: Allows the authenticated user to change their password by providing their current password. Clears refresh token cookie on success.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: The user's current password.
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: The desired new password.
 *     responses:
 *       '200':
 *         description: Password changed successfully.
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
 *                   example: Password changed successfully
 *       '400':
 *         description: Bad Request - Incorrect current password or invalid new password.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Unauthorized - User not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - User not found.
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
export const changePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user!.id; 
  try {
    const passwordData: ChangePasswordInput = req.body;

    const result = await userService.changeUserPassword(userId, passwordData);

    // Clear cookie if password change was successful (forces re-login)
    if (result.success) {
        logger.info(`Password changed successfully for user ${userId}. Clearing refresh token.`);
        res.clearCookie('refreshToken'); 
    }

    res.status(200).json(result);
  } catch (error) {
    logger.error(`Error changing password for user ${userId}:`, error);
    next(error);
  }
};

/**
 * @openapi
 * /users/delete-account:
 *   delete:
 *     tags: [User]
 *     summary: Delete user account
 *     description: Permanently deletes the authenticated user's account after verifying their current password. Clears refresh token cookie on success.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's current password for confirmation.
 *     responses:
 *       '200':
 *         description: Account deleted successfully.
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
 *                   example: Account deleted successfully
 *       '400':
 *         description: Bad Request - Incorrect password.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Unauthorized - User not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - User not found.
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
export const deleteAccount = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user!.id; 
  try {
    // Password validation is handled by middleware using deleteAccountSchema
    const { password } = req.body; 

    const result = await userService.deleteUserAccount(userId, password);

    // Clear cookie if deletion was successful
    if (result.success) {
        logger.info(`Account deleted successfully for user ${userId}. Clearing refresh token.`);
        res.clearCookie('refreshToken');
    }

    res.status(200).json(result);
  } catch (error) {
    logger.error(`Error deleting account for user ${userId}:`, error);
    next(error);
  }
};
