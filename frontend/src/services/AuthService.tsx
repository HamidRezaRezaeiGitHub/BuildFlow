import { config } from '@/config/environment';
import {
    createMockUser,
    generateMockAuthResponse,
    generateMockCreateUserResponse,
    getUserFromMockToken,
    isValidMockToken,
    validateMockCredentials,
} from '@/mocks/authMocks';
import { apiService } from './ApiService';
import type {
    AuthResponse,
    CreateUserResponse,
    LoginCredentials,
    SignUpData,
    User,
    UserSummary,
    ValidationResponse
} from './dtos';

/**
 * Authentication Service class that handles all auth-related API operations
 * Uses the generic ApiService for HTTP communications while focusing on auth business logic
 * 
 * Environment-aware: Uses mock data when config.enableMockAuth is true (standalone mode)
 */
class AuthService {

    /**
     * Login user with credentials
     * @param credentials - User login credentials
     * @returns Promise with JWT authentication response
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        // Use mock authentication in standalone mode
        if (config.enableMockAuth) {
            if (config.enableConsoleLogs) {
                console.log('[AuthService] Using mock authentication');
            }

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const user = validateMockCredentials(credentials.username, credentials.password);

                    if (user) {
                        resolve(generateMockAuthResponse(user));
                    } else {
                        reject(new Error('Invalid username or password'));
                    }
                }, 500); // Simulate network delay
            });
        }

        // Real API call in integrated mode
        return await apiService.post<AuthResponse>('/auth/login', credentials);
    }

    /**
     * Register new user
     * @param signUpData - User registration data with contact information
     * @returns Promise with CreateUserResponse containing the created user data
     */
    async register(signUpData: SignUpData): Promise<CreateUserResponse> {
        // Use mock registration in standalone mode
        if (config.enableMockAuth) {
            if (config.enableConsoleLogs) {
                console.log('[AuthService] Using mock registration');
            }

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        const { username, password, contactRequestDto } = signUpData;
                        const newUser = createMockUser(contactRequestDto, username, password);
                        resolve(generateMockCreateUserResponse(newUser));
                    } catch (error) {
                        reject(new Error('Registration failed'));
                    }
                }, 500); // Simulate network delay
            });
        }

        // Real API call in integrated mode
        return await apiService.create<CreateUserResponse>('/auth/register', signUpData);
    }

    /**
     * Get current authenticated user information
     * @param token - JWT authentication token
     * @returns Promise with current user summary data
     */
    async getCurrentUser(token: string): Promise<UserSummary> {
        // Use mock user in standalone mode
        if (config.enableMockAuth) {
            if (config.enableConsoleLogs) {
                console.log('[AuthService] Getting mock user from token');
            }

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const userSummary = getUserFromMockToken(token);
                    if (userSummary) {
                        resolve(userSummary);
                    } else {
                        reject(new Error('Invalid token'));
                    }
                }, 300); // Simulate network delay
            });
        }

        // Real API call in integrated mode
        return await apiService.get<UserSummary>('/auth/current', token);
    }

    /**
     * Refresh JWT token
     * @param token - Current JWT token
     * @returns Promise with new JWT authentication response
     */
    async refreshToken(token: string): Promise<AuthResponse> {
        // Use mock token refresh in standalone mode
        if (config.enableMockAuth) {
            if (config.enableConsoleLogs) {
                console.log('[AuthService] Refreshing mock token');
            }

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const user = getUserFromMockToken(token);
                    if (user) {
                        resolve(generateMockAuthResponse(user));
                    } else {
                        reject(new Error('Invalid token'));
                    }
                }, 300); // Simulate network delay
            });
        }

        // Real API call in integrated mode
        return await apiService.post<AuthResponse>('/auth/refresh', undefined, token);
    }

    /**
     * Logout user (server-side session cleanup)
     * @param token - JWT authentication token
     * @returns Promise that resolves when logout is complete
     */
    async logout(token: string): Promise<void> {
        // In standalone mode, just simulate logout
        if (config.enableMockAuth) {
            if (config.enableConsoleLogs) {
                console.log('[AuthService] Mock logout');
            }
            return Promise.resolve();
        }

        // Real API call in integrated mode
        try {
            await apiService.post<void>('/auth/logout', undefined, token);
        } catch (error) {
            // For logout, we handle errors gracefully since client-side cleanup should proceed
            // even if server-side logout fails (network issues, server down, etc.)
            console.warn('Logout warning:', error instanceof Error ? error.message : 'Unknown error');
        }
    }

    /**
     * Validate JWT token
     * @param token - JWT token to validate
     * @returns Promise with validation response
     */
    async validateToken(token: string): Promise<ValidationResponse> {
        // Use mock validation in standalone mode
        if (config.enableMockAuth) {
            if (config.enableConsoleLogs) {
                console.log('[AuthService] Validating mock token');
            }

            return new Promise((resolve) => {
                setTimeout(() => {
                    const isValid = isValidMockToken(token);
                    resolve({
                        message: isValid ? 'Token is valid' : 'Token is invalid',
                    });
                }, 200); // Simulate network delay
            });
        }

        // Real API call in integrated mode
        return await apiService.get<ValidationResponse>('/auth/validate', token);
    }

    /**
     * Create admin user (requires admin privileges)
     * @param signUpData - Admin user registration data
     * @param token - JWT token with admin privileges (ignored in mock mode)
     * @returns Promise with admin user creation response
     */
    async createAdminUser(signUpData: SignUpData, token: string): Promise<User> {
        // Use mock admin creation in standalone mode
        if (config.enableMockAuth) {
            if (config.enableConsoleLogs) {
                console.log('[AuthService] Using mock admin creation');
            }

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        const { username, password, contactRequestDto } = signUpData;

                        // Ensure admin label is present
                        const adminContactDto = {
                            ...contactRequestDto,
                            labels: [...(contactRequestDto.labels || []), 'Administrator']
                        };

                        const newAdminUser = createMockUser(adminContactDto, username, password);
                        resolve(newAdminUser);
                    } catch (error) {
                        reject(new Error('Admin creation failed'));
                    }
                }, 500); // Simulate network delay
            });
        }

        // Real API call in integrated mode
        return await apiService.post<User>('/auth/admin', signUpData, token);
    }

    /**
     * Check if a token appears to be valid format (basic validation)
     * This is a client-side check and should not replace server-side validation
     * @param token - JWT token to check
     * @returns boolean indicating if token format appears valid
     */
    isTokenFormatValid(token: string | null): boolean {
        if (!token) return false;

        // Basic JWT format check (3 parts separated by dots)
        const parts = token.split('.');
        return parts.length === 3 && parts.every(part => part.length > 0);
    }

    /**
     * Extract token expiration time (if available)
     * This is a client-side utility and should not replace server-side validation
     * @param token - JWT token
     * @returns Date object representing expiration time or null if cannot be determined
     */
    getTokenExpiration(token: string | null): Date | null {
        if (!this.isTokenFormatValid(token)) return null;

        try {
            const payload = JSON.parse(atob(token!.split('.')[1]));
            if (payload.exp) {
                return new Date(payload.exp * 1000); // Convert from seconds to milliseconds
            }
        } catch (error) {
            console.warn('Failed to parse token expiration:', error);
        }

        return null;
    }

    /**
     * Check if token is expired (client-side check)
     * This is a client-side utility and should not replace server-side validation
     * @param token - JWT token
     * @returns boolean indicating if token appears to be expired
     */
    isTokenExpired(token: string | null): boolean {
        const expiration = this.getTokenExpiration(token);
        if (!expiration) return true; // If we can't determine expiration, consider it expired

        return new Date() >= expiration;
    }
}

// Create and export a singleton instance
export const authService = new AuthService();

// Also export the class for testing or custom instances
export default AuthService;