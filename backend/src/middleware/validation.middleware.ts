import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import logger from '../config/logger'; // Import logger

/**
 * Middleware factory function that creates an Express middleware for validating 
 * request body, query parameters, and route parameters against a provided Zod schema.
 * 
 * It validates `req.body`, `req.query`, and `req.params` combined against the schema.
 * If validation fails, it sends a 400 Bad Request response with formatted errors.
 * If validation succeeds, it calls `next()` to pass control to the next middleware/handler.
 * 
 * @param {AnyZodObject} schema - The Zod schema to validate against.
 * @returns {Function} An Express middleware function.
 */
const validate = (schema: AnyZodObject) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body, query, and params against the schema
      // Zod will ignore extra fields not defined in the schema by default
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      // If validation succeeds, proceed
      return next();
    } catch (error) {
      // If validation fails (ZodError)
      if (error instanceof ZodError) {
        // Format Zod errors for a user-friendly response
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.').replace(/^body\.|^query\.|^params\./, ''), // Remove prefix for clarity
          message: err.message,
        }));
        logger.warn(`[Validation Middleware] Input validation failed for ${req.method} ${req.originalUrl}: ${JSON.stringify(errorMessages)}`);
        // Send a 400 Bad Request response with validation errors
        return res.status(400).json({ 
          success: false, 
          message: 'Input validation failed', 
          errors: errorMessages 
        });
      }
      // Handle unexpected errors during validation itself
      logger.error("[Validation Middleware] Unexpected error during validation:", error); 
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error during validation' 
      });
    }
  };

export default validate;
