// src/types/express/index.d.ts

import { Request } from 'express';
import { User as PrismaUser } from '@prisma/client'; // Import Prisma User type

// Define a type for the user object attached to the request
// This should match the properties attached in the 'protect' middleware
type RequestUser = Pick<PrismaUser, 'id' | 'email' | 'username'>; // Removed 'role' as it's not on the User model or attached by protect middleware

// Extend the Express Request interface
declare global {
  namespace Express {
    export interface Request {
      user?: RequestUser; // Add the optional user property
    }
  }
}

// Export a specific AuthenticatedRequest type for convenience
// This ensures the 'user' property is expected to be present
export interface AuthenticatedRequest extends Request {
  user: RequestUser; // Make user non-optional for routes protected by auth middleware
}
