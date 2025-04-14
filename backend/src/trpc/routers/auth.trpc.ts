// src/trpc/routers/auth.trpc.ts
import { router, protectedProcedure, publicProcedure } from '../trpc';
import * as authService from '../../services/auth.service';
import { 
    registerUserSchema, 
    loginUserSchema, 
    resetPasswordRequestSchema, 
    resetPasswordSchema 
} from '../../models/schemas'; 
import { z } from 'zod'; 
import { TRPCError } from '@trpc/server';
import { AuthError } from '../../services/auth.service'; 
import { config } from '../../config'; // For cookie options
import logger from '../../config/logger'; // Import logger
// Remove ms import
import { decode } from 'jsonwebtoken'; // Import decode function
import { parseDurationToMs } from '../../utils/durationParser'; // Import the utility

// Helper to set refresh token cookie
const setRefreshTokenCookie = (res: any, token: string) => {
    let maxAgeMs: number;
    try {
        maxAgeMs = parseDurationToMs(config.jwt.refreshExpiresIn); // Use imported utility
    } catch (e) {
        // Log error from parsing, default maxAge
        logger.error(`Invalid refreshExpiresIn format in config: "${config.jwt.refreshExpiresIn}". Defaulting cookie maxAge to 7 days.`);
        maxAgeMs = 7 * 24 * 60 * 60 * 1000; // Default to 7 days if parsing fails
    }

    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: config.nodeEnv === 'production', 
        sameSite: 'strict', 
        maxAge: maxAgeMs, 
        path: '/', 
    });
};

// Helper to clear refresh token cookie
const clearRefreshTokenCookie = (res: any) => {
     res.cookie('refreshToken', '', {
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        sameSite: 'strict',
        expires: new Date(0), 
        path: '/',
    });
};


export const authTrpcRouter = router({

  /** Register User */
  register: publicProcedure
    .input(registerUserSchema)
    .mutation(async ({ ctx, input }) => { 
      try {
        // Service returns token (access), refreshToken, and user
        const { token, refreshToken, user } = await authService.registerUser(input);
        setRefreshTokenCookie(ctx.res, refreshToken); 
        // Return access token and user info
        return { success: true, accessToken: token, user }; 
      } catch (error: any) {
        if (error instanceof AuthError && (error.statusCode === 409 || error.statusCode === 400)) {
             throw new TRPCError({ code: 'BAD_REQUEST', message: error.message, cause: error });
        }
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Registration failed', cause: error });
      }
    }),

  /** Login User */
  login: publicProcedure
    .input(loginUserSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Service returns accessToken (named 'token' in service), refreshToken, and user
        const { token: accessToken, refreshToken, user } = await authService.loginUser({email:input.email, password:input.password});
        setRefreshTokenCookie(ctx.res, refreshToken);
        return { success: true, accessToken, user }; 
      } catch (error: any) {
         if (error instanceof AuthError && (error.statusCode === 401 || error.statusCode === 400)) {
             throw new TRPCError({ code: 'UNAUTHORIZED', message: error.message, cause: error });
         }
         throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Login failed', cause: error });
      }
    }),
    
  /** Logout User */
  logout: protectedProcedure 
    .mutation(async ({ ctx }) => {
        try {
            // Correctly call logoutUser with only userId from context
            await authService.logoutUser(ctx.user.id); 
            clearRefreshTokenCookie(ctx.res);
            return { success: true, message: 'Logged out successfully' };
        } catch (error: any) {
             logger.error('Logout failed:', error); 
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Logout failed', cause: error });
        }
    }),

  /** Refresh Token */
  refreshToken: publicProcedure 
    .query(async ({ ctx }) => { 
        const incomingRefreshToken = ctx.req.cookies?.refreshToken;
        if (!incomingRefreshToken) {
            throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Refresh token not found' });
        }
        try {
            // Use correct service function name and expect correct return structure
            const { accessToken, refreshToken: newRefreshToken } = await authService.refreshTokenService(incomingRefreshToken); 
            
            // Decode new token to get user ID safely
            const decodedPayload = decode(accessToken) as { sub?: string; id?: string } | null; // Use imported decode, check for id or sub
            const userIdFromToken = decodedPayload?.id || decodedPayload?.sub; // Prefer id if present
            if (!userIdFromToken) {
                 throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to decode user ID from new access token' });
            }
            const user = await authService.getAuthenticatedUser(userIdFromToken); // Fetch user based on ID from token
            
            setRefreshTokenCookie(ctx.res, newRefreshToken);
            return { success: true, accessToken, user }; 
        } catch (error: any) {
             if (error instanceof AuthError && error.statusCode === 401) {
                 clearRefreshTokenCookie(ctx.res); 
                 throw new TRPCError({ code: 'UNAUTHORIZED', message: error.message, cause: error });
             }
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to refresh token', cause: error });
        }
    }),
    
  /** Request Password Reset */
  requestPasswordReset: publicProcedure
    .input(resetPasswordRequestSchema)
    .mutation(async ({ input }) => {
        try {
            // Use correct service function name
            const result = await authService.requestPasswordResetService(input); 
            return { success: true, message: result.message };
        } catch (error: any) {
             if (error instanceof AuthError) {
                 logger.warn(`Password reset request potentially failed for ${input.email}: ${error.message}`);
                 return { success: true, message: 'If an account with that email exists, a password reset link has been sent.' };
             }
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to request password reset', cause: error });
        }
    }),
    
  /** Reset Password */
  resetPassword: publicProcedure
    .input(resetPasswordSchema)
    .mutation(async ({ input }) => {
        try {
            // Use correct service function name
            const result = await authService.resetPasswordService(input); 
            return { success: true, message: result.message };
        } catch (error: any) {
             if (error instanceof AuthError && (error.statusCode === 400 || error.statusCode === 404)) {
                 throw new TRPCError({ code: 'BAD_REQUEST', message: error.message, cause: error });
             }
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to reset password', cause: error });
        }
    }),
    
  /** Verify Email */
  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() })) 
    .query(async ({ input }) => { 
        try {
            const result = await authService.verifyUserEmail(input.token);
            return { success: true, message: result.message }; 
        } catch (error: any) {
             if (error instanceof AuthError && (error.statusCode === 400 || error.statusCode === 404)) {
                 throw new TRPCError({ code: 'BAD_REQUEST', message: error.message, cause: error });
             }
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to verify email', cause: error });
        }
    }),
    
  /** Check Auth Status */
  checkAuth: protectedProcedure
    .query(async ({ ctx }) => { 
        try {
            const user = await authService.getAuthenticatedUser(ctx.user.id);
            return { success: true, user };
        } catch (error: any) {
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to check auth status', cause: error });
        }
    }),

});

export type AuthTrpcRouter = typeof authTrpcRouter;
