import { debugLogger } from './debugLogger';

interface ErrorOptions {
  silent?: boolean;
  retry?: boolean;
  maxRetries?: number;
}

export class AppError extends Error {
  public code: string;
  public metadata: any;

  constructor(message: string, code: string, metadata?: any) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.metadata = metadata;
  }
}

export const errorHandler = {
  async wrap<T>(
    operation: () => Promise<T>,
    options: ErrorOptions = {}
  ): Promise<T> {
    const { silent = false, retry = false, maxRetries = 3 } = options;
    let attempts = 0;

    const attempt = async (): Promise<T> => {
      try {
        attempts++;
        return await operation();
      } catch (error) {
        const isRetryable = retry && attempts < maxRetries;

        if (!silent) {
          debugLogger.error(`Operation failed (attempt ${attempts}/${maxRetries}):`, {
            error,
            isRetryable
          });
        }

        if (isRetryable) {
          const delay = Math.min(1000 * Math.pow(2, attempts - 1), 10000);
          await new Promise(resolve => setTimeout(resolve, delay));
          return attempt();
        }

        throw error;
      }
    };

    return attempt();
  },

  isAppError(error: any): error is AppError {
    return error instanceof AppError;
  },

  handleApiError(error: any) {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          throw new AppError('Invalid request', 'INVALID_REQUEST', data);
        case 401:
          throw new AppError('Unauthorized', 'UNAUTHORIZED', data);
        case 403:
          throw new AppError('Forbidden', 'FORBIDDEN', data);
        case 404:
          throw new AppError('Resource not found', 'NOT_FOUND', data);
        case 429:
          throw new AppError('Too many requests', 'RATE_LIMIT', data);
        case 500:
          throw new AppError('Server error', 'SERVER_ERROR', data);
        default:
          throw new AppError('Unknown error', 'UNKNOWN', data);
      }
    }
    throw new AppError('Network error', 'NETWORK_ERROR', error);
  }
};

export function createErrorBoundary(name: string) {
  return function componentErrorBoundary(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        debugLogger.error(`Error in ${name}:`, {
          component: name,
          method: propertyKey,
          error
        });
        throw error;
      }
    };

    return descriptor;
  };
}