import { config } from '@/config/environment';
import {
    createMockUser,
    generateMockAuthResponse,
    generateMockCreateUserResponse,
    getUserFromMockToken,
    isValidMockToken,
    validateMockCredentials,
} from '@/mocks/MockUsers';
import type {
    AuthResponse,
    CreateUserResponse,
    LoginRequest,
    SignUpRequest,
    User,
    UserSummary,
    ValidationResponse
} from '..';
import type { IAuthService } from './IAuthService';

/**
 * Authentication Mock Service
 * 
 * Provides mock authentication functionality for standalone frontend development.
 * This implementation contains NO real API calls - it's pure mock logic using local data.
 * 
 * Uses mock data generators from @/mocks/MockUsers to simulate backend responses.
 * All methods include simulated network delays for realistic development experience.
 * 
 * Enabled when config.enableMockAuth is true (standalone mode).
 */
export class AuthMockService implements IAuthService {

    /**
     * Login user with credentials using mock data
     * @param credentials - User login credentials
     * @returns Promise with mock JWT authentication response
     */
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        if (config.enableConsoleLogs) {
            console.log('[AuthMockService] Mock login for:', credentials.username);
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

    /**
     * Register new user using mock data
     * @param signUpData - User registration data with contact information
     * @returns Promise with mock CreateUserResponse
     */
    async register(signUpData: SignUpRequest): Promise<CreateUserResponse> {
        if (config.enableConsoleLogs) {
            console.log('[AuthMockService] Mock registration for:', signUpData.username);
        }

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const { username, password, contact } = signUpData;
                    const newUser = createMockUser(contact, username, password);
                    resolve(generateMockCreateUserResponse(newUser));
                } catch (error) {
                    reject(new Error('Registration failed'));
                }
            }, 500); // Simulate network delay
        });
    }

    /**
     * Get current authenticated user information from mock token
     * @param token - Mock JWT authentication token
     * @returns Promise with mock user summary data
     */
    async getCurrentUser(token: string): Promise<UserSummary> {
        if (config.enableConsoleLogs) {
            console.log('[AuthMockService] Getting mock user from token');
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

    /**
     * Refresh JWT token using mock data
     * @param token - Current mock JWT token
     * @returns Promise with new mock JWT authentication response
     */
    async refreshToken(token: string): Promise<AuthResponse> {
        if (config.enableConsoleLogs) {
            console.log('[AuthMockService] Refreshing mock token');
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

    /**
     * Logout user (mock - just simulates cleanup)
     * @param _token - Mock JWT authentication token (unused in mock)
     * @returns Promise that resolves when mock logout is complete
     */
    async logout(_token: string): Promise<void> {
        if (config.enableConsoleLogs) {
            console.log('[AuthMockService] Mock logout');
        }

        // In standalone mode, just simulate logout
        return Promise.resolve();
    }

    /**
     * Validate JWT token using mock validation
     * @param token - Mock JWT token to validate
     * @returns Promise with mock validation response
     */
    async validateToken(token: string): Promise<ValidationResponse> {
        if (config.enableConsoleLogs) {
            console.log('[AuthMockService] Validating mock token');
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

    /**
     * Create admin user using mock data
     * @param signUpData - Admin user registration data
     * @param _token - Mock JWT token (ignored in mock mode)
     * @returns Promise with mock admin user creation response
     */
    async createAdminUser(signUpData: SignUpRequest, _token: string): Promise<User> {
        if (config.enableConsoleLogs) {
            console.log('[AuthMockService] Mock admin creation for:', signUpData.username);
        }

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const { username, password, contact } = signUpData;

                    // Ensure admin label is present
                    const adminContactDto = {
                        ...contact,
                        labels: [...(contact.labels || []), 'Administrator']
                    };

                    const newAdminUser = createMockUser(adminContactDto, username, password);
                    resolve(newAdminUser);
                } catch (error) {
                    reject(new Error('Admin creation failed'));
                }
            }, 500); // Simulate network delay
        });
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
