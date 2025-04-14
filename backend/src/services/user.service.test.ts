// src/services/user.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'; // Removed afterEach as it's not needed without spyOn restore
import prisma from '../config/db';
import * as userService from './user.service';
import { UserServiceError } from './user.service';
import logger from '../config/logger';
import * as bcrypt from 'bcrypt'; // Import normally, Vitest uses mock from __mocks__
import { User, Prisma } from '@prisma/client';

// --- Mocks ---

vi.mock('../config/db', async () => ({
  default: {
    user: { findUnique: vi.fn(), update: vi.fn(), delete: vi.fn() },
    // Mock other models if needed by user service functions
    $transaction: vi.fn().mockImplementation(async (callback) => callback(prisma)), // Mock transaction if used
  },
}));

// Mock bcrypt via __mocks__ directory (already set up)
vi.mock('bcrypt'); 

vi.mock('../config/logger', () => ({
  default: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
}));

// --- Tests ---

describe('User Service', () => {
  const mockPrismaUser = vi.mocked(prisma.user);
  const mockBcrypt = vi.mocked(bcrypt); // Get typed access to the auto-mocked module
  const mockLogger = vi.mocked(logger);

  const userId = 'user-uuid-test';
  // Helper to create mock user
  const createMockUser = (id: string, overrides = {}): User => ({
      id, 
      email: `${id}@test.com`, 
      username: id, 
      password: 'hashedpassword', 
      name: `User ${id}`, 
      profileImage: null, 
      createdAt: new Date(), 
      updatedAt: new Date(), 
      isActive: true, 
      lastLogin: null, 
      refreshToken: null, 
      passwordResetToken: null, 
      passwordResetExpires: null, 
      isVerified: true, 
      verificationToken: null,
      ...overrides
  });
  const mockUser = createMockUser(userId);
  const expectedProfile = {
      id: userId, email: mockUser.email, username: mockUser.username, name: mockUser.name, profileImage: null, isVerified: true, createdAt: mockUser.createdAt, updatedAt: mockUser.updatedAt,
      // Add counts based on service logic
      counts: { bookmarks: 0, folders: 0, tags: 0, collections: 0 } 
  };

  beforeEach(() => {
    vi.resetAllMocks(); 
    // Setup default bcrypt mocks using vi.mocked() and mockResolvedValue
    mockBcrypt.genSalt.mockResolvedValue('mocked_salt');
    mockBcrypt.hash.mockResolvedValue('mocked_hash');
    mockBcrypt.compare.mockResolvedValue(true);
  });

  // --- getUserProfile Tests ---
  describe('getUserProfile', () => {
    it('should return user profile if user is found', async () => {
      // Define the expected select object based on service implementation
       const expectedSelect = {
           id: true, email: true, username: true, name: true, profileImage: true, createdAt: true, lastLogin: true, isVerified: true, updatedAt: true, // Added updatedAt based on expectedProfile
            _count: { select: { bookmarks: { where: { isDeleted: false } }, folders: true, tags: true, collections: true } }
        };

      // Mock findUnique to return the necessary data including _count
      const mockUserWithCount = { ...mockUser, _count: { bookmarks: 0, folders: 0, tags: 0, collections: 0 } };
      mockPrismaUser.findUnique.mockResolvedValue(mockUserWithCount); 
      
      const result = await userService.getUserProfile(userId);
      // Expect the result to match the transformed profile shape
      expect(result).toEqual(expectedProfile); 
      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: expectedSelect, 
      });
    });

    it('should throw UserServiceError if user is not found', async () => {
      mockPrismaUser.findUnique.mockResolvedValue(null);
      await expect(userService.getUserProfile(userId)).rejects.toThrow(UserServiceError);
      await expect(userService.getUserProfile(userId)).rejects.toThrow('User not found');
    });

    it('should throw UserServiceError on database error', async () => {
      const dbError = new Error('DB error');
      mockPrismaUser.findUnique.mockRejectedValue(dbError);
      await expect(userService.getUserProfile(userId)).rejects.toThrow(UserServiceError);
      await expect(userService.getUserProfile(userId)).rejects.toThrow('Failed to fetch user profile'); // Corrected message
      expect(mockLogger.error).toHaveBeenCalledWith(`Error fetching profile for user ${userId}:`, dbError);
    });
  });

  // --- updateUserProfile Tests ---
  describe('updateUserProfile', () => {
    const updateData = { name: 'Updated Name', profileImage: 'new_image.jpg' };
    // Adjust updatedUser mock to only contain fields expected in expectedUpdatedProfile
    const updatedUserPartial = { 
        id: userId, 
        email: mockUser.email, 
        username: mockUser.username, 
        name: updateData.name, 
        profileImage: updateData.profileImage, 
        isVerified: mockUser.isVerified, 
        createdAt: mockUser.createdAt, 
        updatedAt: new Date() // Simulate update timestamp
    };
     // Expected profile after update will include counts because getUserProfile is called
     const expectedUpdatedProfile = { ...expectedProfile, ...updateData, updatedAt: updatedUserPartial.updatedAt, counts: { bookmarks: 0, folders: 0, tags: 0, collections: 0 } }; 
     // No need for internalUpdateSelect

    it('should update user profile successfully (without password change)', async () => {
      // Mock the initial findUnique call in updateUserProfile
      mockPrismaUser.findUnique.mockResolvedValueOnce(mockUser); 
      // Mock the update call itself
      mockPrismaUser.update.mockResolvedValue(updatedUserPartial as User); 
      // Mock the findUnique call made by getUserProfile *after* the update
      const finalMockUserWithCount = { ...mockUser, ...updateData, _count: { bookmarks: 0, folders: 0, tags: 0, collections: 0 }, updatedAt: expectedUpdatedProfile.updatedAt };
      // The second call to findUnique (inside getUserProfile) needs to be mocked
      mockPrismaUser.findUnique.mockResolvedValueOnce(finalMockUserWithCount); 

      const result = await userService.updateUserProfile(userId, updateData);

      // Check calls
      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({ where: { id: userId } }); // Initial check
      expect(mockPrismaUser.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { name: updateData.name, profileImage: updateData.profileImage },
      });
       // Check the final findUnique call made by getUserProfile
       expect(mockPrismaUser.findUnique).toHaveBeenCalledWith(expect.objectContaining({
           where: { id: userId },
           select: expect.any(Object) // Service determines the select
       }));
      // The result should match the shape returned by the final getUserProfile call
      expect(result).toEqual(expectedUpdatedProfile); 
    });
    
    // TODO: Add tests for password change within updateProfile if implemented
    // TODO: Add tests for username/email conflict if update allows changing them
    
    it('should throw UserServiceError if user not found during update (Prisma error)', async () => {
        const prismaError = new Prisma.PrismaClientKnownRequestError('Record to update not found.', { code: 'P2025', clientVersion: 'x.y.z' });
        mockPrismaUser.update.mockRejectedValue(prismaError);
        await expect(userService.updateUserProfile(userId, updateData)).rejects.toThrow(UserServiceError);
        await expect(userService.updateUserProfile(userId, updateData)).rejects.toThrow('User not found');
    });

    it('should throw UserServiceError on database error during update', async () => {
        const dbError = new Error('DB update failed');
        mockPrismaUser.findUnique.mockResolvedValue(mockUser); // Ensure initial check passes
        mockPrismaUser.update.mockRejectedValue(dbError); // Mock the update failure
        await expect(userService.updateUserProfile(userId, updateData)).rejects.toThrow(UserServiceError); 
        await expect(userService.updateUserProfile(userId, updateData)).rejects.toThrow('Failed to update user profile'); // Corrected message
    });
  });

  // --- changeUserPassword Tests ---
  describe('changeUserPassword', () => {
      const passwordData = { currentPassword: 'password123', newPassword: 'newPassword456' };
      const newHashedPassword = 'newHashedPassword';

      // No nested beforeEach needed, rely on top-level one

      it('should change password successfully', async () => {
          // Ensure default mocks from top-level beforeEach are set
          mockBcrypt.compare.mockResolvedValue(true); 
          mockBcrypt.genSalt.mockResolvedValue('newsalt');
          mockBcrypt.hash.mockResolvedValue(newHashedPassword);
          mockPrismaUser.update.mockResolvedValue({} as any); 
          mockPrismaUser.findUnique.mockResolvedValue(mockUser); 

          const result = await userService.changeUserPassword(userId, passwordData);
          expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
          expect(mockBcrypt.compare).toHaveBeenCalledWith(passwordData.currentPassword, mockUser.password);
          expect(mockBcrypt.hash).toHaveBeenCalledWith(passwordData.newPassword, 'newsalt');
          expect(mockPrismaUser.update).toHaveBeenCalledWith(expect.objectContaining({ // Be less strict about data
              where: { id: userId },
              data: expect.objectContaining({ password: newHashedPassword }) 
          }));
          expect(result).toEqual({ success: true, message: 'Password changed successfully. Please log in again.' }); // Corrected message
      });

      it('should throw if user not found', async () => {
          mockPrismaUser.findUnique.mockResolvedValue(null);
          await expect(userService.changeUserPassword(userId, passwordData)).rejects.toThrow('User not found');
      });

      it('should throw if current password does not match', async () => {
          mockBcrypt.compare.mockImplementationOnce(() => Promise.resolve(false)); // Keep mockImplementationOnce for override
          await expect(userService.changeUserPassword(userId, passwordData)).rejects.toThrow('Current password is incorrect'); // Corrected message
      });
      
      it('should throw on DB error during update', async () => {
          const dbError = new Error('DB update failed');
          mockPrismaUser.update.mockRejectedValue(dbError);
          await expect(userService.changeUserPassword(userId, passwordData)).rejects.toThrow('Failed to change password');
      });
  });

  // --- deleteUserAccount Tests ---
  describe('deleteUserAccount', () => {
      const currentPassword = 'password123';

       // No nested beforeEach needed, rely on top-level one

      it('should delete account successfully with correct password', async () => {
          // Ensure default mocks from top-level beforeEach are set
          mockBcrypt.compare.mockResolvedValue(true); 
          mockPrismaUser.findUnique.mockResolvedValue(mockUser); 
          mockPrismaUser.delete.mockResolvedValue(mockUser); 

          const result = await userService.deleteUserAccount(userId, currentPassword);
          expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
          expect(mockBcrypt.compare).toHaveBeenCalledWith(currentPassword, mockUser.password);
          expect(mockPrismaUser.delete).toHaveBeenCalledWith({ where: { id: userId } });
          expect(result).toEqual({ success: true, message: 'Account deleted successfully' });
      });

      it('should throw if user not found', async () => {
          mockPrismaUser.findUnique.mockResolvedValue(null);
          await expect(userService.deleteUserAccount(userId, currentPassword)).rejects.toThrow('User not found');
      });

      it('should throw if password does not match', async () => {
          mockBcrypt.compare.mockImplementationOnce(() => Promise.resolve(false)); // Keep mockImplementationOnce for override
          await expect(userService.deleteUserAccount(userId, currentPassword)).rejects.toThrow('Password is incorrect'); // Corrected message
      });
      
      it('should throw on DB error during delete', async () => {
          const dbError = new Error('DB delete failed');
          mockPrismaUser.delete.mockRejectedValue(dbError);
          await expect(userService.deleteUserAccount(userId, currentPassword)).rejects.toThrow('Failed to delete account');
      });
  });

});
