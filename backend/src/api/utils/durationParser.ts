// src/utils/durationParser.ts
import ms from 'ms'; // Standard import
import logger from '../config/logger';

// Helper to check if a string is a valid ms.StringValue
function isValidDurationString(str: string): str is ms.StringValue {
  const regex = /^(\d+)(?:\s*([a-zA-Z]+))?$/;
  return regex.test(str);
}

/**
 * Helper to parse duration string to milliseconds.
 * Throws error on invalid input.
 * @param durationStr - The duration string (e.g., '7d', '1h', '30m').
 * @returns Duration in milliseconds.
 */
export const parseDurationToMs = (durationStr: string): number => {
  try {
    if (!isValidDurationString(durationStr)) {
      throw new Error(`Invalid duration format: ${durationStr}`);
    }
    const milliseconds = ms(durationStr);
    if (
      milliseconds === undefined ||
      typeof milliseconds !== 'number'
    ) {
      throw new Error(
        `Invalid duration string or conversion failed: ${durationStr}`
      );
    }
    return milliseconds;
  } catch (e) {
    logger.error(
      `Failed to parse duration string "${durationStr}".`,
      e
    );
    // Re-throw or handle as appropriate for the application context
    // Throwing ensures the caller knows parsing failed.
    throw new Error(`Invalid duration format: ${durationStr}`);
  }
};
