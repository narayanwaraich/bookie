// src/controllers/user.controller.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended'; // Keep for type usage if needed elsewhere
import { PrismaClient } from '@prisma/client'; // Keep for type usage if needed elsewhere
import prisma from '../config/db'; // Import the actual prisma instance path (Vitest will auto-mock)
import * as userController from './user.controller';
import * as userService from '../services/user.service';
import { UserServiceError } from '../services/user.service';
import logger from '../config/logger';
import { RequestUser, AuthenticatedRequest } from '../types/express'; // Import correct types

// --- Mocks ---
// User service is now auto-mocked by Vitest due to __mocks__ folder convention
vi.mock('../services/user.service');
vi.mock('../config/logger', () => ({
  default: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

// --- Tests ---

describe('User Controller', () => {
  // No need for mockPrisma variable here as we mock the service directly

  // Keep mocks for other dependencies/response objects
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction = vi.fn();

  // Mock response methods
  const statusMock = vi.fn().mockReturnThis();
  const jsonMock = vi.fn();
  const sendStatusMock = vi.fn();
  const clearCookieMock = vi.fn(); // Added clearCookie mock

  const userId = 'user-test-id';

  beforeEach(() => {
    vi.resetAllMocks();

    mockRequest = {
      body: {},
      params: {},
      query: {},
      user: {
        id: userId,
        email: 'test@test.com',
        username: 'tester',
      }, // Assume authenticated user
    };
    mockResponse = {
      status: statusMock,
      json: jsonMock,
      sendStatus: sendStatusMock,
      clearCookie: clearCookieMock, // Assign mock
    };
    mockNext = vi.fn();
  });

  // --- getProfile Tests ---
  describe('getProfile', () => {
    it('should get user profile successfully', async () => {
      // Arrange
      const userProfile = {
        id: userId,
        email: 'test@test.com',
        username: 'tester',
        name: 'Test User',
      };
      vi.mocked(userService.getUserProfile).mockResolvedValue(
        userProfile as any
      );

      // Act
      await userController.getProfile(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(userService.getUserProfile).toHaveBeenCalledWith(userId);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        user: userProfile,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if service fails', async () => {
      // Arrange
      const serviceError = new UserServiceError(
        'User not found',
        404
      );
      vi.mocked(userService.getUserProfile).mockRejectedValue(
        serviceError
      );

      // Act
      await userController.getProfile(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(userService.getUserProfile).toHaveBeenCalledWith(userId);
      expect(mockNext).toHaveBeenCalledWith(serviceError);
    });
  });

  // --- updateProfile Tests ---
  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      // Arrange
      const updateInput = {
        name: 'Updated Name',
        profileImage: 'new.jpg',
      };
      const updatedProfile = {
        id: userId,
        email: 'test@test.com',
        username: 'tester',
        name: updateInput.name,
        profileImage: updateInput.profileImage,
      };
      mockRequest.body = updateInput;
      vi.mocked(userService.updateUserProfile).mockResolvedValue(
        updatedProfile as any
      );

      // Act
      await userController.updateProfile(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(userService.updateUserProfile).toHaveBeenCalledWith(
        userId,
        updateInput
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Profile updated successfully',
        user: updatedProfile,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });

  // --- changePassword Tests ---
  describe('changePassword', () => {
    it('should change password successfully', async () => {
      // Arrange
      const passwordInput = {
        currentPassword: 'old',
        newPassword: 'new',
      };
      mockRequest.body = passwordInput;
      // Mock service to resolve with a simple object to satisfy TS
      vi.mocked(userService.changeUserPassword).mockResolvedValue(
        {} as any
      );
      const expectedResponse = {
        success: true,
        message: 'Password changed successfully',
      }; // Define expected object

      // Act
      await userController.changePassword(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(userService.changeUserPassword).toHaveBeenCalledWith(
        userId,
        passwordInput
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      // Use the explicitly defined object in the assertion
      expect(jsonMock).toHaveBeenCalledWith(expectedResponse);
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });

  // --- deleteAccount Tests ---
  describe('deleteAccount', () => {
    it('should delete account successfully', async () => {
      // Arrange
      const passwordInput = { password: 'correct-password' };
      mockRequest.body = passwordInput;
      // Mock service to resolve with a simple object to satisfy TS
      vi.mocked(userService.deleteUserAccount).mockResolvedValue(
        {} as any
      );
      const expectedResponse = {
        success: true,
        message: 'Account deleted successfully',
      }; // Define expected object

      // Act
      await userController.deleteAccount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(userService.deleteUserAccount).toHaveBeenCalledWith(
        userId,
        passwordInput.password
      );
      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        'refreshToken',
        expect.any(Object)
      ); // Check cookie cleared
      expect(statusMock).toHaveBeenCalledWith(200);
      // Use the explicitly defined object in the assertion
      expect(jsonMock).toHaveBeenCalledWith(expectedResponse);
      expect(mockNext).not.toHaveBeenCalled();
    });
    // TODO: Add test for service error
  });
});
