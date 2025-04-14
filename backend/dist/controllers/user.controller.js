"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.refreshToken = exports.resetPassword = exports.requestPasswordReset = exports.changePassword = exports.updateProfile = exports.getProfile = exports.logout = exports.login = exports.register = void 0;
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const db_1 = __importDefault(require("../config/db"));
const config_1 = require("../config");
const logger_1 = __importDefault(require("../config/logger"));
const email_1 = require("../utils/email");
// Generate JWT token
const generateToken = (id, email, username) => {
    return jwt.sign({ id, email, username }, config_1.config.jwt.secret, { expiresIn: config_1.config.jwt.expiresIn });
};
// Generate refresh token
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, config_1.config.jwt.refreshSecret, { expiresIn: config_1.config.jwt.refreshExpiresIn });
};
// Register user
const register = async (req, res) => {
    try {
        const { email, username, password, name } = req.body;
        // Check if user already exists
        const existingUser = await db_1.default.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === email
                    ? 'Email already in use'
                    : 'Username already taken'
            });
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create user
        const user = await db_1.default.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                name,
            }
        });
        // Create default folder
        await db_1.default.folder.create({
            data: {
                name: 'Favorites',
                userId: user.id
            }
        });
        // Generate tokens
        const token = generateToken(user.id, user.email, user.username);
        const refreshToken = generateRefreshToken(user.id);
        // Update user with refresh token
        await db_1.default.user.update({
            where: { id: user.id },
            data: { refreshToken }
        });
        // Set refresh token in cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config_1.config.nodeEnv === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                name: user.name
            }
        });
    }
    catch (error) {
        logger_1.default.error('Error registering user:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};
exports.register = register;
// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user
        const user = await db_1.default.user.findUnique({
            where: { email }
        });
        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        // Generate tokens
        const token = generateToken(user.id, user.email, user.username);
        const refreshToken = generateRefreshToken(user.id);
        // Update user with refresh token and last login
        await db_1.default.user.update({
            where: { id: user.id },
            data: {
                refreshToken,
                lastLogin: new Date()
            }
        });
        // Set refresh token in cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config_1.config.nodeEnv === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                name: user.name,
                profileImage: user.profileImage
            }
        });
    }
    catch (error) {
        logger_1.default.error('Error logging in user:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};
exports.login = login;
// Logout user
const logout = async (req, res) => {
    try {
        const userId = req.user?.id;
        // Clear refresh token in database
        if (userId) {
            await db_1.default.user.update({
                where: { id: userId },
                data: { refreshToken: null }
            });
        }
        // Clear cookie
        res.clearCookie('refreshToken');
        res.status(200).json({
            success: true,
            message: 'User logged out successfully'
        });
    }
    catch (error) {
        logger_1.default.error('Error logging out user:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during logout'
        });
    }
};
exports.logout = logout;
// Get current user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }
        const user = await db_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                profileImage: true,
                createdAt: true,
                lastLogin: true,
                _count: {
                    select: {
                        bookmarks: true,
                        folders: true,
                        tags: true,
                        collections: true
                    }
                }
            }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        logger_1.default.error('Error getting user profile:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching profile'
        });
    }
};
exports.getProfile = getProfile;
// Update user profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { name, username, profileImage, currentPassword, newPassword } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }
        const user = await db_1.default.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Check if changing password
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            const updatedUser = await db_1.default.user.update({
                where: { id: userId },
                data: {
                    password: hashedPassword,
                    name: name ?? user.name,
                    username: username ?? user.username,
                    profileImage: profileImage ?? user.profileImage
                },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    name: true,
                    profileImage: true
                }
            });
            return res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                user: updatedUser
            });
        }
        // Check if username is being changed and if it's already taken
        if (username && username !== user.username) {
            const existingUser = await db_1.default.user.findUnique({
                where: { username }
            });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Username already taken'
                });
            }
        }
        // Update profile without changing password
        const updatedUser = await db_1.default.user.update({
            where: { id: userId },
            data: {
                name: name ?? user.name,
                username: username ?? user.username,
                profileImage: profileImage ?? user.profileImage
            },
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                profileImage: true
            }
        });
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    }
    catch (error) {
        logger_1.default.error('Error updating user profile:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating profile'
        });
    }
};
exports.updateProfile = updateProfile;
// Change password
const changePassword = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { currentPassword, newPassword } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }
        const user = await db_1.default.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Check if current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        // Update password
        await db_1.default.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                refreshToken: null // Invalidate all sessions
            }
        });
        // Clear cookie
        res.clearCookie('refreshToken');
        res.status(200).json({
            success: true,
            message: 'Password changed successfully. Please log in again.'
        });
    }
    catch (error) {
        logger_1.default.error('Error changing password:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while changing password'
        });
    }
};
exports.changePassword = changePassword;
// Request password reset
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await db_1.default.user.findUnique({
            where: { email }
        });
        // Always return success even if user not found for security
        if (!user) {
            return res.status(200).json({
                success: true,
                message: 'If the email exists, a password reset link will be sent'
            });
        }
        // Generate reset token
        const resetToken = (0, uuid_1.v4)();
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour
        // Save token to database
        await db_1.default.user.update({
            where: { id: user.id },
            data: {
                passwordResetToken: resetToken,
                passwordResetExpires: resetExpires
            }
        });
        // Create reset URL
        const resetUrl = `${config_1.config.cors.origin}/reset-password/${resetToken}`;
        // Send email
        await (0, email_1.sendEmail)({
            to: user.email,
            subject: 'Password Reset',
            text: `You requested a password reset. Please go to this link to reset your password: ${resetUrl}`,
            html: `
        <div>
          <h1>Password Reset Request</h1>
          <p>You requested a password reset for your Bookmark Manager account.</p>
          <p>Please click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
        </div>
      `
        });
        res.status(200).json({
            success: true,
            message: 'If the email exists, a password reset link will be sent'
        });
    }
    catch (error) {
        logger_1.default.error('Error requesting password reset:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during password reset request'
        });
    }
};
exports.requestPasswordReset = requestPasswordReset;
// Reset password
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        // Find user with valid token
        const user = await db_1.default.user.findFirst({
            where: {
                passwordResetToken: token,
                passwordResetExpires: {
                    gt: new Date()
                }
            }
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        // Update password and clear token
        await db_1.default.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpires: null,
                refreshToken: null // Invalidate all sessions
            }
        });
        res.status(200).json({
            success: true,
            message: 'Password reset successful. Please log in with your new password.'
        });
    }
    catch (error) {
        logger_1.default.error('Error resetting password:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during password reset'
        });
    }
};
exports.resetPassword = resetPassword;
// Refresh token
const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'No refresh token provided'
            });
        }
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, config_1.config.jwt.refreshSecret);
        // Check if user exists and token matches
        const user = await db_1.default.user.findFirst({
            where: {
                id: decoded.id,
                refreshToken
            }
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }
        // Generate new tokens
        const token = generateToken(user.id, user.email, user.username);
        const newRefreshToken = generateRefreshToken(user.id);
        // Update refresh token in database
        await db_1.default.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken }
        });
        // Set new refresh token in cookie
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: config_1.config.nodeEnv === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(200).json({
            success: true,
            token
        });
    }
    catch (error) {
        logger_1.default.error('Error refreshing token:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid refresh token'
        });
    }
};
exports.refreshToken = refreshToken;
// Delete account
const deleteAccount = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { password } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }
        const user = await db_1.default.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Password is incorrect'
            });
        }
        // Delete user (cascading delete will remove all related data)
        await db_1.default.user.delete({
            where: { id: userId }
        });
        // Clear cookie
        res.clearCookie('refreshToken');
        res.status(200).json({
            success: true,
            message: 'Account deleted successfully'
        });
    }
    catch (error) {
        logger_1.default.error('Error deleting account:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during account deletion'
        });
    }
};
exports.deleteAccount = deleteAccount;
//# sourceMappingURL=user.controller.js.map