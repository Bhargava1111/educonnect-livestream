
import { tryCatchAsync } from './asyncHelpers';

/**
 * Helper function that handles async authentication operations
 * and returns properly typed results
 */
export const handleAuthAsync = async <T>(
  asyncAuthFunction: (...args: any[]) => Promise<T>,
  ...args: any[]
): Promise<T> => {
  try {
    const result = await asyncAuthFunction(...args);
    return result;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};

/**
 * Helper function that properly awaits authentication operations
 * and handles common patterns for success/error responses
 */
export const awaitAuthResult = async <T extends { success: boolean; error?: string }>(
  asyncFunction: (...args: any[]) => Promise<T>,
  ...args: any[]
): Promise<T> => {
  try {
    const result = await asyncFunction(...args);
    return result;
  } catch (error: any) {
    console.error("Authentication error:", error);
    return {
      success: false,
      error: error.message || "Authentication operation failed"
    } as T;
  }
};
