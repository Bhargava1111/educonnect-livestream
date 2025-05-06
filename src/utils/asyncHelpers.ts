
/**
 * Helper function to safely await any Promise and handle the result with types
 * @param promise The promise to await
 * @returns The resolved value or null if an error occurred
 */
export const tryCatchAsync = async <T>(promise: Promise<T>): Promise<T | null> => {
  try {
    return await promise;
  } catch (error) {
    console.error("Error in tryCatchAsync:", error);
    return null;
  }
};

/**
 * Helper function to safely await multiple promises and handle the results with types
 * @param promises The promises to await
 * @returns An array of resolved values or null if an error occurred
 */
export const tryCatchAsyncAll = async <T>(promises: Promise<T>[]): Promise<(T | null)[]> => {
  const results: (T | null)[] = [];
  
  for (const promise of promises) {
    try {
      const result = await promise;
      results.push(result);
    } catch (error) {
      console.error("Error in tryCatchAsyncAll:", error);
      results.push(null);
    }
  }
  
  return results;
};

/**
 * Helper function to ensure a value is awaited if it's a Promise
 * @param valueOrPromise The value or promise to ensure is resolved
 * @returns The resolved value
 */
export const ensureResolved = async <T>(valueOrPromise: T | Promise<T>): Promise<T> => {
  if (valueOrPromise instanceof Promise) {
    return await valueOrPromise;
  }
  return valueOrPromise;
};
