
/**
 * A utility function to safely await promises in components
 * This helps fix the common pattern of trying to use promise values directly in components
 */
export const useAsyncData = async <T>(
  promiseFunction: () => Promise<T>,
  defaultValue: T
): Promise<T> => {
  try {
    const result = await promiseFunction();
    return result || defaultValue;
  } catch (error) {
    console.error("Error in async operation:", error);
    return defaultValue;
  }
};

/**
 * Helper function to safely call async functions that are expected in a synchronous context
 * For components that haven't been updated to use async/await or useEffect
 */
export const safelyGetData = async <T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  ...args: any[]
): Promise<T | null> => {
  try {
    return await asyncFunction(...args);
  } catch (error) {
    console.error("Error safely getting data:", error);
    return null;
  }
};

/**
 * Helper function to wrap an async call with try/catch and provide typed response
 * Useful for API calls that need error handling
 */
export const tryCatchAsync = async <T>(
  asyncFunction: () => Promise<T>,
  errorHandler?: (error: any) => void
): Promise<T | null> => {
  try {
    return await asyncFunction();
  } catch (error) {
    if (errorHandler) {
      errorHandler(error);
    } else {
      console.error("Error in async operation:", error);
    }
    return null;
  }
};
