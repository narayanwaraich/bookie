// src/trpc/routers/auth.trpc.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appRouter } from '../router'; // Import the main router
import { createContext } from '../context'; // Corrected import name
import * as authService from '../../api/services/auth.service'; // Import the service to mock
import { AuthError } from '../../api/services/auth.service';
import { inferProcedureInput } from '@trpc/server'; // Helper type

// --- Mocks ---
vi.mock('../../services/auth.service');
vi.mock('../context'); // Mock the context module

// --- Tests ---

describe('Auth TRPC Router', () => {
  const mockAuthService = vi.mocked(authService);
  const mockCreateContext = vi.mocked(createContext); // Corrected mock name

  // Mock context value
  const mockContextBase = {
    // Base context structure without user initially
    req: { headers: {}, cookies: {} }, // Mock req with headers and cookies
    res: { cookie: vi.fn(), clearCookie: vi.fn() }, // Mock res with cookie methods
    prisma: {},
    session: null,
  };

  beforeEach(() => {
    vi.resetAllMocks();
    // Setup mock context before each test
    mockCreateContext.mockResolvedValue({
      ...mockContextBase,
      user: null,
    } as any);
  });

  // Helper to create a caller instance
  const createCaller = async (
    user: {
      id: string;
      email: string;
      username: string;
    } | null = null
  ) => {
    const context = await createContext({
      req: { headers: {}, cookies: {} }, // Provide minimal req/res for context creation
      res: { cookie: vi.fn(), clearCookie: vi.fn() },
    } as any);
    // Manually set user in the resolved context for authenticated tests
    context.user = user;
    return appRouter.createCaller(context);
  };

  // --- Register Procedure Tests ---
  describe('register', () => {
    it('should call authService.registerUser and return tokens/user', async () => {
      // Arrange
      const registerInput: inferProcedureInput<
        typeof appRouter.auth.register
      > = {
        email: 'trpc@test.com',
        username: 'trpctest',
        password: 'password',
        name: 'TRPC User',
      };
      const serviceResult = {
        token: 'trpc-access-token',
        refreshToken: 'trpc-refresh-token',
        // Ensure name matches expected type (string | null)
        user: {
          id: 'trpc-user-1',
          email: registerInput.email,
          username: registerInput.username,
          name: registerInput.name || null,
          isVerified: false,
        },
      };
      mockAuthService.registerUser.mockResolvedValue(
        serviceResult as any
      ); // Cast if needed due to complex type
      const caller = await createCaller(); // Unauthenticated caller

      // Act
      const result = await caller.auth.register(registerInput);

      // Assert
      expect(authService.registerUser).toHaveBeenCalledWith(
        registerInput
      );
      // TRPC router returns success, accessToken, and user
      expect(result).toEqual({
        success: true,
        accessToken: serviceResult.token,
        user: serviceResult.user,
      });
    });

    it('should throw TRPCError if authService throws AuthError', async () => {
      // Arrange
      const registerInput: inferProcedureInput<
        typeof appRouter.auth.register
      > = {
        email: 'trpc@test.com',
        username: 'trpctest',
        password: 'password',
        name: 'TRPC User',
      };
      const serviceError = new AuthError('Email exists', 409);
      mockAuthService.registerUser.mockRejectedValue(serviceError);
      const caller = await createCaller();

      // Act & Assert
      await expect(
        caller.auth.register(registerInput)
      ).rejects.toThrowError(/Email exists/);
      // Check for TRPCError properties if needed (might require importing TRPCError)
      // await expect(caller.auth.register(registerInput))
      //     .rejects.toHaveProperty('cause.statusCode', 409);
    });
  });

  // --- Login Procedure Tests ---
  describe('login', () => {
    it('should call authService.loginUser and return tokens/user', async () => {
      // Arrange
      const loginInput: inferProcedureInput<
        typeof appRouter.auth.login
      > = {
        email: 'trpc@test.com',
        password: 'password',
      };
      const serviceResult = {
        token: 'trpc-access-token',
        refreshToken: 'trpc-refresh-token',
        user: {
          id: 'trpc-user-1',
          email: loginInput.email,
          username: 'trpctest',
          name: 'TRPC User',
          isVerified: true,
        },
      };
      mockAuthService.loginUser.mockResolvedValue(
        serviceResult as any
      );
      const caller = await createCaller();

      // Act
      const result = await caller.auth.login(loginInput);

      // Assert
      expect(authService.loginUser).toHaveBeenCalledWith(loginInput);
      expect(result).toEqual({
        success: true,
        accessToken: serviceResult.token,
        user: serviceResult.user,
      });
    });
    // TODO: Add error handling test
  });

  // --- Logout Procedure Tests --- (Requires authenticated context)
  describe('logout', () => {
    it('should call authService.logoutUser', async () => {
      // Arrange
      const mockUser = {
        id: 'logged-in-user',
        email: 'in@test.com',
        username: 'loggedin',
      };
      mockAuthService.logoutUser.mockResolvedValue(undefined);
      const caller = await createCaller(mockUser);

      // Act
      const result = await caller.auth.logout();

      // Assert
      expect(authService.logoutUser).toHaveBeenCalledWith(
        mockUser.id
      );
      expect(result).toEqual({
        success: true,
        message: 'Logged out successfully',
      });
    });
  });

  // --- Refresh Token Procedure Tests ---
  describe('refreshToken', () => {
    it('should call authService.refreshTokenService and return new token/user', async () => {
      // Arrange
      const oldRefreshToken = 'old-refresh-token';
      const serviceResult = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };
      const refreshedUser = {
        id: 'refreshed-user',
        email: 'refresh@test.com',
        username: 'refresher',
        name: 'Refreshed User',
      };

      // Mock context to include the old refresh token in cookies
      const contextWithToken = await createContext({
        req: {
          headers: {},
          cookies: { refreshToken: oldRefreshToken },
        },
        res: { cookie: vi.fn(), clearCookie: vi.fn() },
      } as any);
      contextWithToken.user = null; // Start unauthenticated for refresh
      mockCreateContext.mockResolvedValue(contextWithToken); // Ensure this mock is used

      mockAuthService.refreshTokenService.mockResolvedValue(
        serviceResult
      );
      // Mock the subsequent getAuthenticatedUser call made within the procedure
      mockAuthService.getAuthenticatedUser.mockResolvedValue(
        refreshedUser as any
      );

      const caller = appRouter.createCaller(contextWithToken); // Create caller with this specific context

      // Act
      const result = await caller.auth.refreshToken();

      // Assert
      expect(authService.refreshTokenService).toHaveBeenCalledWith(
        oldRefreshToken
      );
      expect(authService.getAuthenticatedUser).toHaveBeenCalled(); // Check user fetch after refresh
      expect(result).toEqual({
        success: true,
        accessToken: serviceResult.accessToken,
        user: refreshedUser,
      });
    });
    // TODO: Add error handling test (no token, invalid token)
  });

  // --- checkAuth Procedure Tests --- Corrected name (Requires authenticated context)
  describe('checkAuth', () => {
    it('should call authService.getAuthenticatedUser and return user data', async () => {
      // Arrange
      const mockUser = {
        id: 'logged-in-user',
        email: 'in@test.com',
        username: 'loggedin',
      };
      const serviceResult = { ...mockUser, name: 'Logged In User' };
      mockAuthService.getAuthenticatedUser.mockResolvedValue(
        serviceResult as any
      );
      const caller = await createCaller(mockUser);

      // Act
      const result = await caller.auth.checkAuth(); // Use correct procedure name

      // Assert
      expect(authService.getAuthenticatedUser).toHaveBeenCalledWith(
        mockUser.id
      );
      expect(result).toEqual({ success: true, user: serviceResult });
    });
    // TODO: Add error handling test (user not found in service)
  });

  // Add tests for other auth procedures (requestPasswordReset, resetPassword, verifyEmail) similarly
});
