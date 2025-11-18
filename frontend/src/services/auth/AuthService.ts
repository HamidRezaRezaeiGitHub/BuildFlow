import type {
    AuthResponse,
    CreateUserResponse,
    LoginRequest,
    SignUpRequest,
    User,
    UserSummary,
    ValidationResponse
} from '..';
import { apiService } from '../ApiService';
import type { IAuthService } from './IAuthService';

/**
 * Authentication Service - Real Backend Implementation
 * 
 * Handles all authentication-related API operations by calling the Spring Boot backend.
 * This implementation contains NO mock logic - it's pure API integration.
 * 
 * Uses the generic ApiService for HTTP communications while focusing on auth business logic.
 * 
 * All methods make real HTTP calls to the backend API endpoints.
 */
export class AuthService implements IAuthService {

    /**
     * Login user with credentials
     * @param credentials - User login credentials
     * @returns Promise with JWT authentication response
     */
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        return apiService.post<AuthResponse>('/auth/login', credentials);
    }

    /**
     * Register new user
     * @param signUpData - User registration data with contact information
     * @returns Promise with CreateUserResponse containing the created user data
     */
    async register(signUpData: SignUpRequest): Promise<CreateUserResponse> {
        return apiService.create<CreateUserResponse>('/auth/register', signUpData);
    }

    /**
     * Get current authenticated user information
     * @param token - JWT authentication token
     * @returns Promise with current user summary data
     */
    async getCurrentUser(token: string): Promise<UserSummary> {
        return apiService.get<UserSummary>('/auth/current', token);
    }

    /**
     * Refresh JWT token
     * @param token - Current JWT token
     * @returns Promise with new JWT authentication response
     */
    async refreshToken(token: string): Promise<AuthResponse> {
        return apiService.post<AuthResponse>('/auth/refresh', undefined, token);
    }

    /**
     * Logout user (server-side session cleanup)
     * @param token - JWT authentication token
     * @returns Promise that resolves when logout is complete
     */
    async logout(token: string): Promise<void> {
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
        return apiService.get<ValidationResponse>('/auth/validate', token);
    }

    /**
     * Create admin user (requires admin privileges)
     * @param signUpData - Admin user registration data
     * @param token - JWT token with admin privileges
     * @returns Promise with admin user creation response
     */
    async createAdminUser(signUpData: SignUpRequest, token: string): Promise<User> {
        return apiService.post<User>('/auth/admin', signUpData, token);
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
