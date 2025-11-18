// Example usage of the backend-compatible response types
import { ApiMessageResponse } from '.';
import { apiService, StructuredApiError } from './ApiService';
import { ResponseErrorType } from './MvcDtos';

/**
 * Example utility functions showing how to work with backend response types
 */

/**
 * Helper function to safely handle API responses that might be MessageResponse
 */
export function handleMessageResponse(response: ApiMessageResponse | any): string {
  if (apiService.isMessageResponse(response)) {
    return response.success ? response.message : `Error: ${response.message}`;
  }

  return apiService.extractMessage(response);
}

/**
 * Analyzes API errors and returns structured information for UI handling
 * Returns error details without throwing - useful for displaying user-friendly messages
 */
export function analyzeApiError(error: Error): { message: string; isRecoverable: boolean } {
  if (error instanceof StructuredApiError) {
    const errorResponse = error.apiErrorResponse;

    if (!errorResponse) {
      return { message: error.message, isRecoverable: false };
    }

    switch (errorResponse.errorType) {
      case ResponseErrorType.VALIDATION_ERROR:
        return {
          message: `Please check your input: ${error.getDetailedMessage()}`,
          isRecoverable: true
        };

      case ResponseErrorType.AUTHENTICATION_ERROR:
        return {
          message: 'Please log in again to continue',
          isRecoverable: true
        };

      case ResponseErrorType.AUTHORIZATION_ERROR:
        return {
          message: 'You do not have permission to perform this action',
          isRecoverable: false
        };

      case ResponseErrorType.RESOURCE_NOT_FOUND:
        return {
          message: 'The requested resource was not found',
          isRecoverable: false
        };

      case ResponseErrorType.BUSINESS_LOGIC_ERROR:
        return {
          message: `Business rule violation: ${error.message}`,
          isRecoverable: true
        };

      case ResponseErrorType.SYSTEM_ERROR:
      case ResponseErrorType.EXTERNAL_SERVICE_ERROR:
        return {
          message: 'A system error occurred. Please try again later.',
          isRecoverable: true
        };

      default:
        return {
          message: error.getDetailedMessage(),
          isRecoverable: false
        };
    }
  }

  return {
    message: error.message || 'An unexpected error occurred',
    isRecoverable: false
  };
}

/**
 * Example React hook for handling API errors with user-friendly messages
 */
export function useApiErrorHandler() {
  const handleError = (error: Error) => {
    const { message, isRecoverable } = analyzeApiError(error);

    // Here you could integrate with your notification system
    console.error('API Error:', message, { recoverable: isRecoverable });

    return { message, isRecoverable };
  };

  return { handleError };
}

/**
 * Example of type-safe API call with structured error handling
 */
export async function exampleApiCall(endpoint: string, token?: string): Promise<string> {
  try {
    const response = await apiService.get<ApiMessageResponse>(endpoint, token);

    if (apiService.isMessageResponse(response)) {
      if (!response.success) {
        throw new Error(`Operation failed: ${response.message}`);
      }
      return response.message;
    }

    return 'Operation completed successfully';

  } catch (error) {
    const { message } = analyzeApiError(error as Error);
    throw new Error(message);
  }
}

/**
 * Example of creating a resource and handling 201 CREATED response
 */
export async function exampleCreateResource(data: any, token?: string): Promise<{ created: boolean; message: string; status: number }> {
  try {
    // Use requestWithMetadata to get status information
    const { status } = await apiService.requestWithMetadata<any>(
      '/api/resource',
      {
        method: 'POST',
        body: JSON.stringify(data)
      },
      token
    );

    return {
      created: status === 201,
      message: status === 201 ? 'Resource created successfully' : 'Resource processed',
      status
    };

  } catch (error) {
    const { message } = analyzeApiError(error as Error);
    throw new Error(message);
  }
}

/**
 * Example using the create helper method
 */
export async function exampleCreateWithHelper<T>(endpoint: string, data: any, token?: string): Promise<T> {
  try {
    return await apiService.create<T>(endpoint, data, token);
  } catch (error) {
    const { message } = analyzeApiError(error as Error);
    throw new Error(message);
  }
}