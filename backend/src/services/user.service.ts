import prisma from '../config/db';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UpdateUserInput, ChangePasswordInput } from '../models/schemas';
import logger from '../config/logger';

/**
 * Custom error class for user-related service errors.
 */
export class UserServiceError extends Error {
    public statusCode: number;
    constructor(message: string, statusCode: number = 400) {
        super(message);
        this.name = 'UserServiceError';
        this.statusCode = statusCode;
    }
}

/**
 * Retrieves the profile data for a specific user, including counts of related items.
 * @param userId - The ID of the user whose profile is being fetched.
 * @returns {Promise<object>} User profile data including counts.
 * @throws {UserServiceError} If the user is not found or fetching fails.
 */
export const getUserProfile = async (userId: string) => {
    logger.debug(`Fetching profile for user ${userId}`);
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                profileImage: true,
                createdAt: true,
                lastLogin: true,
                isVerified: true, // Include verification status
                _count: {
                    select: { // Select counts of related items
                        bookmarks: { where: { isDeleted: false } }, // Count non-deleted bookmarks
                        folders: true,
                        tags: true,
                        collections: true 
                    }
                }
            }
        });

        if (!user) {
            logger.warn(`Get profile failed: User ${userId} not found.`);
            throw new UserServiceError('User not found', 404);
        }
        
        // Rename _count for clarity
        const { _count, ...userData } = user;
        const profileData = {
            ...userData,
            counts: {
                bookmarks: _count?.bookmarks ?? 0,
                folders: _count?.folders ?? 0,
                tags: _count?.tags ?? 0,
                collections: _count?.collections ?? 0,
            }
        };
        logger.info(`Profile fetched successfully for user ${userId}`);
        return profileData;
    } catch (error) {
        logger.error(`Error fetching profile for user ${userId}:`, error);
        if (error instanceof UserServiceError) throw error;
        throw new UserServiceError('Failed to fetch user profile', 500);
    }
};

/**
 * Updates a user's profile information (name, username, profileImage).
 * Optionally calls changeUserPassword if password fields are provided.
 * @param userId - The ID of the user whose profile is being updated.
 * @param data - The update data.
 * @returns {Promise<object>} Updated user profile data including counts.
 * @throws {UserServiceError} If user not found, username conflict, password validation fails, or update fails.
 */
export const updateUserProfile = async (userId: string, data: UpdateUserInput) => {
    const { name, username, profileImage, currentPassword, newPassword } = data;
    logger.debug(`User ${userId} attempting to update profile.`);

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
             logger.warn(`Update profile failed: User ${userId} not found.`);
            throw new UserServiceError('User not found', 404);
        }

        const updateData: Prisma.UserUpdateInput = {};

        // Handle password change by calling the dedicated function
        if (currentPassword && newPassword) {
            logger.info(`User ${userId} requested password change during profile update.`);
            // This will throw UserServiceError if current password is wrong
            await changeUserPassword(userId, { currentPassword, newPassword }); 
            // Note: changeUserPassword already invalidates tokens
        } else if (currentPassword || newPassword) {
             // If only one password field is provided, it's an error
             logger.warn(`Update profile failed for user ${userId}: Incomplete password change data provided.`);
             throw new UserServiceError('Both current and new password are required to change password', 400);
        }

        // Handle username change
        if (username && username !== user.username) {
             logger.debug(`User ${userId} attempting to change username to ${username}. Checking availability.`);
            const existingUser = await prisma.user.findUnique({ where: { username } });
            if (existingUser) {
                 logger.warn(`Update profile failed for user ${userId}: Username ${username} already taken.`);
                throw new UserServiceError('Username already taken', 409); // Conflict
            }
            updateData.username = username;
             logger.info(`Username for user ${userId} will be updated to ${username}.`);
        }

        // Add other fields to update if they are provided and different
        if (name !== undefined && name !== user.name) updateData.name = name;
        if (profileImage !== undefined && profileImage !== user.profileImage) updateData.profileImage = profileImage;

        // Perform the update only if there are non-password changes
        if (Object.keys(updateData).length > 0) {
             logger.debug(`Updating profile fields for user ${userId}: ${Object.keys(updateData).join(', ')}`);
            await prisma.user.update({
                where: { id: userId },
                data: updateData,
            });
             logger.info(`Profile fields updated for user ${userId}.`);
        } else if (!currentPassword && !newPassword) {
             logger.info(`No profile changes provided for user ${userId}.`);
        }

        // Fetch and return the full updated profile data including counts
        return getUserProfile(userId); 

    } catch (error) {
        logger.error(`Error updating profile for user ${userId}:`, error);
        if (error instanceof UserServiceError) throw error; // Re-throw specific errors
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
             // Handle potential unique constraint errors not caught earlier (e.g., race condition on username)
             logger.warn(`Update profile failed for user ${userId} due to unique constraint.`);
             throw new UserServiceError('Username already taken', 409);
        }
        throw new UserServiceError('Failed to update user profile', 500); // Generic for others
    }
};

/**
 * Changes a user's password after verifying the current password.
 * Invalidates existing sessions by clearing the refresh token.
 * @param userId - The ID of the user changing their password.
 * @param data - Object containing currentPassword and newPassword.
 * @returns {Promise<object>} Success message.
 * @throws {UserServiceError} If user not found, current password incorrect, or update fails.
 */
export const changeUserPassword = async (userId: string, data: ChangePasswordInput) => {
     const { currentPassword, newPassword } = data;
     logger.debug(`User ${userId} attempting to change password.`);
     
     try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
             logger.warn(`Change password failed: User ${userId} not found.`);
            throw new UserServiceError('User not found', 404);
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
             logger.warn(`Change password failed for user ${userId}: Current password incorrect.`);
            throw new UserServiceError('Current password is incorrect', 400);
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and invalidate refresh token
        await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                refreshToken: null // Invalidate all sessions
            }
        });
        
        logger.info(`Password changed successfully for user ${userId}. Refresh token invalidated.`);
        return { success: true, message: 'Password changed successfully. Please log in again.' };

     } catch (error) {
        logger.error(`Error changing password for user ${userId}:`, error);
        if (error instanceof UserServiceError) throw error; // Re-throw specific errors
        throw new UserServiceError('Failed to change password', 500); // Generic for others
     }
};

/**
 * Deletes a user's account after verifying their password.
 * Relies on Prisma schema's onDelete: Cascade to remove related data.
 * @param userId - The ID of the user whose account is being deleted.
 * @param currentPassword - The user's current password for verification.
 * @returns {Promise<object>} Success message.
 * @throws {UserServiceError} If user not found, password incorrect, or deletion fails.
 */
export const deleteUserAccount = async (userId: string, currentPassword?: string) => {
    logger.debug(`User ${userId} attempting to delete account.`);
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
             logger.warn(`Delete account failed: User ${userId} not found.`);
            throw new UserServiceError('User not found', 404);
        }

        // Verify password - essential for user-initiated deletion
        if (!currentPassword) {
             logger.warn(`Delete account failed for user ${userId}: Password verification missing.`);
             throw new UserServiceError('Password is required to delete account.', 400);
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            logger.warn(`Delete account failed for user ${userId}: Password incorrect.`);
            throw new UserServiceError('Password is incorrect', 400);
        }
        
        logger.info(`Password verified for account deletion of user ${userId}. Proceeding with deletion.`);
        // Perform deletion (Prisma handles cascading deletes based on schema relations)
        // Note: Ensure onDelete: Cascade is set correctly in schema for related models (Bookmark, Folder, Tag, Collection, etc.)
        // Refresh tokens might need explicit handling if not directly related via schema cascade.
        // The user record deletion should cascade to FolderCollaborator, CollectionCollaborator, Device etc.
        await prisma.user.delete({
            where: { id: userId }
        });

        logger.info(`Account deleted successfully for user ${userId}.`);
        // No need to clear cookie here, controller handles it after successful service call.
        return { success: true, message: 'Account deleted successfully' };

    } catch (error) {
        logger.error(`Error deleting account for user ${userId}:`, error);
        if (error instanceof UserServiceError) throw error; // Re-throw specific errors
        throw new UserServiceError('Failed to delete account', 500); // Generic for others
    }
};
