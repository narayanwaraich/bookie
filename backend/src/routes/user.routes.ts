import { Router, RequestHandler } from 'express';
import * as userController from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';
import validate from '../middleware/validation.middleware';
import { updateUserSchema, changePasswordSchema, deleteAccountSchema } from '../models/schemas'; // Import deleteAccountSchema

const router = Router();

// Note: Authentication (protect middleware) is applied in src/routes/index.ts

// --- User Profile ---

// GET /api/users/profile - Get current user's profile
router.get(
    '/profile', 
    userController.getProfile as RequestHandler
);

// PUT /api/users/profile - Update current user's profile
router.put(
    '/profile', 
    validate(updateUserSchema), // Validate request body
    userController.updateProfile as RequestHandler
);

// --- Account Management ---

// POST /api/users/change-password - Change current user's password
router.post(
    '/change-password', 
    validate(changePasswordSchema), // Validate request body
    userController.changePassword as RequestHandler
);

// DELETE /api/users/account - Delete current user's account
router.delete(
    '/account', 
    validate(deleteAccountSchema), // Validate request body (requires password)
    userController.deleteAccount as RequestHandler 
);

// --- Admin Routes (Example) ---
// Example: Admin route to get specific user (if needed later)
// const authorizeAdmin = (req, res, next) => { /* ... admin check logic ... */ };
// router.get('/:id', authorizeAdmin, userController.getUserById as RequestHandler);

export default router;
