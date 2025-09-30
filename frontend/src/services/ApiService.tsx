import { ApiMessageResponse, ApiErrorResponse } from './dtos';
import { ResponseErrorType } from './dtos/MvcDtos';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
    constructor(message: string, public status?: number) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Enhanced ApiError that can contain structured error information
 */
export class StructuredApiError extends ApiError {
    constructor(
        message: string,
        public status?: number,
        public apiErrorResponse?: ApiErrorResponse
    ) {
        super(message, status);
        this.name = 'StructuredApiError';
    }

    /**
     * Get all error details as a formatted string
     */
    getDetailedMessage(): string {
        if (!this.apiErrorResponse?.errors?.length) {
            return this.message;
        }

        return `${this.message}\nDetails: ${this.apiErrorResponse.errors.join(', ')}`;
    }

    /**
     * Check if this is a specific type of error
     */
    isErrorType(type: ResponseErrorType): boolean {
        return this.apiErrorResponse?.errorType === type;
    }

    getErrorType(): ResponseErrorType | undefined {
        return this.apiErrorResponse?.errorType;
    }
}

/**
 * Generic API Service class for handling all HTTP communications
 * Provides a centralized place for HTTP requests, error handling, and request configuration
 * Can be used by any domain-specific service (AuthService, ProjectService, etc.)
 */
class ApiService {
    private readonly baseUrl: string;

    constructor() {
        // Support both Vite (import.meta.env) and Jest (process.env)
        let baseUrl = 'http://localhost:8080/api';
        
        // Check for environment variables in different environments
        if (typeof process !== 'undefined' && process.env && process.env.VITE_API_BASE_URL) {
            // Node.js environment (including Jest)
            baseUrl = process.env.VITE_API_BASE_URL;
        } else if (typeof window !== 'undefined' && typeof globalThis !== 'undefined') {
            // Browser environment - safely access Vite variables
            try {
                // Only access import.meta if we're not in a test environment
                const isTestEnv = typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test';
                if (!isTestEnv && typeof eval === 'function') {
                    // Use eval to avoid TypeScript compilation issues with import.meta in Jest
                    const viteEnv = eval('import.meta').env;
                    if (viteEnv && viteEnv.VITE_API_BASE_URL) {
                        baseUrl = viteEnv.VITE_API_BASE_URL;
                    }
                }
            } catch (e) {
                // Ignore error if import.meta is not available
                console.debug('Vite environment variables not available:', e);
            }
        }
        this.baseUrl = baseUrl;
    }

    /**
     * Convert a failed response to appropriate ApiError or StructuredApiError
     * @param response - The failed HTTP response
     * @returns Never (always throws an error)
     */
    private async handleErrorResponse(response: Response): Promise<never> {
        let errorMessage = `HTTP ${response.status}`;
        let structuredError: ApiErrorResponse | undefined;

        try {
            const errorData = await response.json();

            // Check if response matches our ErrorResponse structure
            if (errorData.timestamp && errorData.status && errorData.message) {
                structuredError = errorData as ApiErrorResponse;
                errorMessage = structuredError.message;

                // Throw enhanced error with structured information
                throw new StructuredApiError(errorMessage, response.status, structuredError);
            } else {
                // Fallback to simple message extraction
                errorMessage = errorData.message || errorMessage;
            }
        } catch (parseError) {
            // If we can't parse error response, use status message
            if (!(parseError instanceof StructuredApiError)) {
                errorMessage = response.statusText || errorMessage;
            } else {
                throw parseError; // Re-throw if it's already our structured error
            }
        }

        throw new ApiError(errorMessage, response.status);
    }

    /**
     * Parse successful response data based on status code and content type
     * @param response - The successful HTTP response
     * @returns Promise with parsed data of type T
     */
    private async parseResponseData<T>(response: Response): Promise<T> {
        const contentType = response.headers.get('content-type');
        const hasJsonContent = contentType && contentType.includes('application/json');

        // Handle specific success status codes
        switch (response.status) {
            case 200: // OK - Standard success response
            case 201: // Created - Resource successfully created
            case 202: // Accepted - Request accepted for processing
                if (hasJsonContent) {
                    return await response.json();
                }
                return {} as T;

            case 204: // No Content - Success with no response body
            case 205: // Reset Content - Success, reset the document view
                return {} as T;

            default:
                // Other 2xx success codes
                if (response.status >= 200 && response.status < 300) {
                    if (hasJsonContent) {
                        return await response.json();
                    }
                    return {} as T;
                }

                // This shouldn't happen since !response.ok should catch non-2xx
                throw new ApiError(`Unexpected status code: ${response.status}`, response.status);
        }
    }

    /**
     * Generic fetch wrapper with comprehensive error handling
     * @param endpoint - API endpoint (relative to baseUrl)
     * @param options - Standard fetch options
     * @param token - Optional JWT token for authentication
     * @returns Promise with typed response
     */
    async request<T>(
        endpoint: string,
        options: RequestInit = {},
        token?: string | null
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const headers = new Headers(options.headers);
        headers.set('Content-Type', 'application/json');

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            // !response.ok means status is not in the range 200-299
            if (!response.ok) {
                await this.handleErrorResponse(response);
            }

            // Parse and return the response data
            return await this.parseResponseData<T>(response);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            // Network or other errors
            throw new ApiError(
                error instanceof Error ? error.message : 'Network error occurred'
            );
        }
    }

    /**
     * Make a request and return both the data and response metadata
     * Useful when you need access to status codes, headers, etc.
     */
    async requestWithMetadata<T>(
        endpoint: string,
        options: RequestInit = {},
        token?: string | null
    ): Promise<{ data: T; status: number; headers: Headers; statusText: string }> {
        const url = `${this.baseUrl}${endpoint}`;

        const headers = new Headers(options.headers);
        headers.set('Content-Type', 'application/json');

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            // Use the same error handling as the main request method
            if (!response.ok) {
                await this.handleErrorResponse(response);
            }

            // Parse response data using the same logic as request method
            const data = await this.parseResponseData<T>(response);

            return {
                data,
                status: response.status,
                headers: response.headers,
                statusText: response.statusText
            };

        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            throw new ApiError(
                error instanceof Error ? error.message : 'Network error occurred'
            );
        }
    }

    /**
     * GET request helper
     */
    async get<T>(endpoint: string, token?: string | null): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' }, token);
    }

    /**
     * POST request helper
     */
    async post<T>(endpoint: string, data?: any, token?: string | null): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        }, token);
    }

    /**
     * POST request helper specifically for creating resources (expects 201 CREATED)
     */
    async create<T>(endpoint: string, data: any, token?: string | null): Promise<T> {
        const response = await this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        }, token);

        // Note: We could add specific handling for 201 status here if needed
        return response;
    }

    /**
     * PUT request helper
     */
    async put<T>(endpoint: string, data?: any, token?: string | null): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        }, token);
    }

    /**
     * DELETE request helper
     */
    async delete<T>(endpoint: string, token?: string | null): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' }, token);
    }

    /**
     * PATCH request helper
     */
    async patch<T>(endpoint: string, data?: any, token?: string | null): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        }, token);
    }

    /**
     * Get the base URL for the API
     */
    getBaseUrl(): string {
        return this.baseUrl;
    }

    /**
     * Helper method to check if a response is a MessageResponse
     */
    isMessageResponse(response: any): response is ApiMessageResponse {
        return response &&
            typeof response.timestamp === 'string' &&
            typeof response.success === 'boolean' &&
            typeof response.status === 'string' &&
            typeof response.message === 'string';
    }

    /**
     * Helper method to check if a response is an ErrorResponse
     */
    isErrorResponse(response: any): response is ApiErrorResponse {
        return response &&
            typeof response.timestamp === 'string' &&
            typeof response.status === 'string' &&
            typeof response.message === 'string' &&
            Array.isArray(response.errors) &&
            typeof response.path === 'string' &&
            typeof response.method === 'string' &&
            Object.values(ResponseErrorType).includes(response.errorType);
    }

    /**
     * Utility to extract message from either MessageResponse or plain object
     */
    extractMessage(response: any): string {
        if (this.isMessageResponse(response)) {
            return response.message;
        }
        if (response && typeof response.message === 'string') {
            return response.message;
        }
        return 'Operation completed';
    }

    /**
     * Centralized error handler for API errors - converts to standard Error
     * Converts ApiError and StructuredApiError instances to user-friendly Error messages
     * @param error - The caught error (unknown type)
     * @param fallbackMessage - Message to use if error type is not recognized
     * @returns Never (always throws an Error)
     */
    static handleApiError(error: unknown, fallbackMessage: string): never {
        if (error instanceof StructuredApiError) {
            throw new Error(error.getDetailedMessage());
        }
        if (error instanceof ApiError) {
            throw new Error(error.message);
        }
        throw new Error(fallbackMessage);
    }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export the static error handler for convenience
export const handleApiError = ApiService.handleApiError;

// Also export the class for testing or custom instances
export default ApiService;