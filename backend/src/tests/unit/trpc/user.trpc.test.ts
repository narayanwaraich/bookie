// src/trpc/routers/user.trpc.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appRouter } from '../router';
import { createContext } from '../context';
import * as userService from '../../api/services/user.service';
import { UserServiceError } from '../../api/services/user.service';
import { inferProcedureInput } from '@trpc/server';

// --- Mocks ---
vi.mock('../../services/user.service');
vi.mock('../context');

// --- Tests ---

describe('User TRPC Router', () => {
  const mockUserService = vi.mocked(userService);
  const mockCreateContext = vi.mocked(createContext);

  const userId = 'user-trpc-user-test';

  // Mock context value
  const mockContext = {
    user: {
      id: userId,
      email: 'test@trpc.com',
      username: 'trpctester',
    }, // Assume authenticated
    req: { headers: {}, cookies: {} },
    res: { cookie: vi.fn(), clearCookie: vi.fn() },
    prisma: {},
    session: null,
  };

  beforeEach(() => {
    vi.resetAllMocks();
    mockCreateContext.mockResolvedValue(mockContext as any);
  });

  // Helper to create caller
  const createCaller = async () => {
    const context = await createContext({} as any);
    return appRouter.createCaller(context);
  };

  // --- getProfile Procedure ---
  describe('getProfile', () => {
    it('should call userService.getUserProfile and return the profile', async () => {
      const serviceResult = {
        id: userId,
        name: 'TRPC User',
        email: 'test@trpc.com' /* ... other profile fields */,
      };
      mockUserService.getUserProfile.mockResolvedValue(
        serviceResult as any
      );
      const caller = await createCaller();

      const result = await caller.user.getProfile();

      expect(userService.getUserProfile).toHaveBeenCalledWith(userId);
      expect(result).toEqual(serviceResult);
    });
    // TODO: Add error test
  });

  // --- updateProfile Procedure ---
  describe('updateProfile', () => {
    it('should call userService.updateUserProfile and return the updated profile', async () => {
      const input: inferProcedureInput<
        typeof appRouter.user.updateProfile
      > = { name: 'Updated TRPC User' };
      const serviceResult = {
        id: userId,
        name: input.name,
        email: 'test@trpc.com' /* ... */,
      };
      mockUserService.updateUserProfile.mockResolvedValue(
        serviceResult as any
      );
      const caller = await createCaller();

      const result = await caller.user.updateProfile(input);

      expect(userService.updateUserProfile).toHaveBeenCalledWith(
        userId,
        input
      );
      expect(result).toEqual(serviceResult);
    });
    // TODO: Add error test
  });

  // --- changePassword Procedure ---
  describe('changePassword', () => {
    it('should call userService.changeUserPassword', async () => {
      const input: inferProcedureInput<
        typeof appRouter.user.changePassword
      > = { currentPassword: 'old', newPassword: 'new' };
      mockUserService.changeUserPassword.mockResolvedValue(undefined); // Service returns void
      const caller = await createCaller();

      const result = await caller.user.changePassword(input);

      expect(userService.changeUserPassword).toHaveBeenCalledWith(
        userId,
        input
      );
      // Explicitly type the expected object
      const expectedResult: { success: boolean } = { success: true };
      expect(result).toEqual(expectedResult);
    });
    // TODO: Add error test
  });

  // --- deleteAccount Procedure ---
  describe('deleteAccount', () => {
    it('should call userService.deleteUserAccount', async () => {
      const input: inferProcedureInput<
        typeof appRouter.user.deleteAccount
      > = { password: 'password' };
      mockUserService.deleteUserAccount.mockResolvedValue(undefined); // Service returns void
      const caller = await createCaller();

      const result = await caller.user.deleteAccount(input);

      expect(userService.deleteUserAccount).toHaveBeenCalledWith(
        userId,
        input.password
      );
      // Explicitly type the expected object
      const expectedResult: { success: boolean } = { success: true };
      expect(result).toEqual(expectedResult);
    });
    // TODO: Add error test
  });
});
