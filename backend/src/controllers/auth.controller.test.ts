// src/controllers/auth.controller.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import * as authController from './auth.controller';
import * as authService from '../services/auth.service';
import { AuthError } from '../services/auth.service';
import logger from '../config/logger';
import { RequestUser, AuthenticatedRequest } from '../types/express'; // Import correct types

// --- Mocks ---

// Auth service is now auto-mocked by Vitest due to __mocks__ folder convention
vi.mock('../services/auth.service');
vi.mock('../config/logger', () => ({
  default: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
}));

// --- Tests ---

describe('Auth Controller', () => {
  let mockRequest: Partial<AuthenticatedRequest>; // Use imported AuthenticatedRequest
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction = vi.fn(); // Mock next function

  // Mock response methods
  const statusMock = vi.fn().mockReturnThis(); // Allows chaining .json()
  const jsonMock = vi.fn();
  const cookieMock = vi.fn();
  const clearCookieMock = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks(); // Reset mocks before each test

    // Reset request and response objects
    mockRequest = {
      body: {},
      cookies: {},
      params: {}, // Initialize params
      user: undefined,
    };
    mockResponse = {
      status: statusMock,
      json: jsonMock,
      cookie: cookieMock,
      clearCookie: clearCookieMock,
    };
    mockNext = vi.fn(); // Reset next function mock
  });

  // --- register Tests ---
  describe('register', () => {
    it('should register a user successfully and return tokens/user data', async () => {
      // Arrange
      const registerInput = { email: 'test@example.com', username: 'tester', password: 'password123', name: 'Test User' };
      const serviceResult = {
        token: 'fake-access-token',
        refreshToken: 'fake-refresh-token',
        user: { id: 'user-123', email: registerInput.email, username: registerInput.username, name: registerInput.name, isVerified: false }
      };
      mockRequest.body = registerInput;
      vi.mocked(authService.registerUser).mockResolvedValue(serviceResult);

      // Act
      await authController.register(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(authService.registerUser).toHaveBeenCalledWith(registerInput);
      expect(mockResponse.cookie).toHaveBeenCalledWith('refreshToken', serviceResult.refreshToken, expect.any(Object));
      expect(statusMock).toHaveBeenCalledWith(201);
      // Controller returns token and user object
      expect(jsonMock).toHaveBeenCalledWith({ token: serviceResult.token, user: serviceResult.user });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if registration service fails', async () => {
      // Arrange
      const registerInput = { email: 'test@example.com', username: 'tester', password: 'password123', name: 'Test User' };
      const serviceError = new AuthError('Email already in use', 409);
      mockRequest.body = registerInput;
      vi.mocked(authService.registerUser).mockRejectedValue(serviceError);

      // Act
      await authController.register(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(authService.registerUser).toHaveBeenCalledWith(registerInput);
      expect(mockNext).toHaveBeenCalledWith(serviceError);
      expect(statusMock).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });

  // --- login Tests ---
  describe('login', () => {
    it('should login a user successfully and return tokens/user data', async () => {
      // Arrange
      const loginInput = { email: 'test@example.com', password: 'password123' };
      const serviceResult = {
        token: 'fake-access-token',
        refreshToken: 'fake-refresh-token',
        user: { id: 'user-123', email: loginInput.email, username: 'tester', name: 'Test User', profileImage: null, isVerified: true }
      };
      mockRequest.body = loginInput;
      vi.mocked(authService.loginUser).mockResolvedValue(serviceResult);

      // Act
      await authController.login(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(authService.loginUser).toHaveBeenCalledWith(loginInput);
      expect(mockResponse.cookie).toHaveBeenCalledWith('refreshToken', serviceResult.refreshToken, expect.any(Object));
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ token: serviceResult.token, user: serviceResult.user });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if login service fails', async () => {
      // Arrange
      const loginInput = { email: 'test@example.com', password: 'wrongpassword' };
      const serviceError = new AuthError('Invalid credentials', 401);
      mockRequest.body = loginInput;
      vi.mocked(authService.loginUser).mockRejectedValue(serviceError);

      // Act
      await authController.login(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(authService.loginUser).toHaveBeenCalledWith(loginInput);
      expect(mockNext).toHaveBeenCalledWith(serviceError);
      expect(statusMock).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });

  // --- logout Tests ---
  describe('logout', () => {
    it('should logout user successfully, clear cookie and return success message', async () => {
      // Arrange
      const userId = 'user-123';
      // Ensure mockRequest.user is defined and matches RequestUser shape
      mockRequest.user = { id: userId, email: 'test@example.com', username: 'tester' };
      mockRequest.cookies = { refreshToken: 'some-refresh-token' };
      vi.mocked(authService.logoutUser).mockResolvedValue(undefined);

      // Act - Cast to AuthenticatedRequest where user is guaranteed
      await authController.logout(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      // Assert
      expect(authService.logoutUser).toHaveBeenCalledWith(userId);
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('refreshToken', expect.any(Object));
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Logged out successfully' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle logout even if service throws an error (e.g., DB issue)', async () => {
      // Arrange
      const userId = 'user-123';
      mockRequest.user = { id: userId, email: 'test@example.com', username: 'tester' };
      mockRequest.cookies = { refreshToken: 'some-refresh-token' };
      vi.mocked(authService.logoutUser).mockRejectedValue(new Error('DB connection failed'));

      // Act - Cast to AuthenticatedRequest where user is guaranteed
      await authController.logout(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      // Assert
      expect(authService.logoutUser).toHaveBeenCalledWith(userId);
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('refreshToken', expect.any(Object));
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Logged out successfully' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  // --- refreshToken Tests ---
  describe('refreshToken', () => {
    it('should refresh token successfully if valid refresh token cookie exists', async () => {
      // Arrange
      const oldRefreshToken = 'valid-old-token';
      const serviceResult = { accessToken: 'new-access-token', refreshToken: 'new-refresh-token' };
      mockRequest.cookies = { refreshToken: oldRefreshToken };
      vi.mocked(authService.refreshTokenService).mockResolvedValue(serviceResult);

      // Act
      await authController.refreshToken(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(authService.refreshTokenService).toHaveBeenCalledWith(oldRefreshToken);
      expect(mockResponse.cookie).toHaveBeenCalledWith('refreshToken', serviceResult.refreshToken, expect.any(Object));
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ token: serviceResult.accessToken });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if no refresh token cookie exists', async () => {
      // Arrange
      mockRequest.cookies = {}; // No refresh token

      // Act
      await authController.refreshToken(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(authService.refreshTokenService).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthError));
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ message: 'Refresh token not found', statusCode: 401 }));
    });

    it('should call next with error if refresh token service fails', async () => {
      // Arrange
      const oldRefreshToken = 'invalid-token';
      const serviceError = new AuthError('Invalid or expired refresh token', 401);
      mockRequest.cookies = { refreshToken: oldRefreshToken };
      vi.mocked(authService.refreshTokenService).mockRejectedValue(serviceError);

      // Act
      await authController.refreshToken(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(authService.refreshTokenService).toHaveBeenCalledWith(oldRefreshToken);
      expect(mockNext).toHaveBeenCalledWith(serviceError);
    });
  });

  // --- requestPasswordReset Tests ---
  describe('requestPasswordReset', () => {
    it('should call requestPasswordResetService and return success message', async () => {
      // Arrange
      const emailInput = { email: 'reset@example.com' };
      const serviceResult = { message: 'If an account with that email exists, a password reset link has been sent.' };
      mockRequest.body = emailInput;
      vi.mocked(authService.requestPasswordResetService).mockResolvedValue(serviceResult);

      // Act
      await authController.requestPasswordReset(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(authService.requestPasswordResetService).toHaveBeenCalledWith(emailInput);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(serviceResult);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if service fails', async () => {
      // Arrange
      const emailInput = { email: 'reset@example.com' };
      const serviceError = new Error('Email sending failed'); // Generic error
      mockRequest.body = emailInput;
      vi.mocked(authService.requestPasswordResetService).mockRejectedValue(serviceError);

      // Act
      await authController.requestPasswordReset(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(authService.requestPasswordResetService).toHaveBeenCalledWith(emailInput);
      expect(mockNext).toHaveBeenCalledWith(serviceError);
    });
  });

  // --- resetPassword Tests ---
  describe('resetPassword', () => {
    it('should call resetPasswordService and return success message', async () => {
      // Arrange
      const resetInput = { token: 'valid-token', newPassword: 'newPassword123' };
      const serviceResult = { message: 'Password reset successful. Please log in with your new password.' };
      mockRequest.body = resetInput;
      vi.mocked(authService.resetPasswordService).mockResolvedValue(serviceResult);

      // Act
      await authController.resetPassword(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(authService.resetPasswordService).toHaveBeenCalledWith(resetInput);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(serviceResult);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if service fails', async () => {
      // Arrange
      const resetInput = { token: 'invalid-token', newPassword: 'newPassword123' };
      const serviceError = new AuthError('Invalid or expired reset token', 400);
      mockRequest.body = resetInput;
      vi.mocked(authService.resetPasswordService).mockRejectedValue(serviceError);

      // Act
      await authController.resetPassword(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(authService.resetPasswordService).toHaveBeenCalledWith(resetInput);
      expect(mockNext).toHaveBeenCalledWith(serviceError);
    });
  });

  // --- verifyEmail Tests ---
  describe('verifyEmail', () => {
    it('should call verifyUserEmail and return success message', async () => {
      // Arrange
      const verificationToken = 'valid-verify-token';
      const serviceResult = { message: 'Email verified successfully. You can now log in.' };
      mockRequest.params = { token: verificationToken }; // Assuming token is in params
      vi.mocked(authService.verifyUserEmail).mockResolvedValue(serviceResult);

      // Act
      await authController.verifyEmail(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(authService.verifyUserEmail).toHaveBeenCalledWith(verificationToken);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(serviceResult);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if service fails', async () => {
      // Arrange
      const verificationToken = 'invalid-token';
      const serviceError = new AuthError('Invalid or expired verification token', 400);
      mockRequest.params = { token: verificationToken };
      vi.mocked(authService.verifyUserEmail).mockRejectedValue(serviceError);

      // Act
      await authController.verifyEmail(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(authService.verifyUserEmail).toHaveBeenCalledWith(verificationToken);
      expect(mockNext).toHaveBeenCalledWith(serviceError);
    });
  });

});
