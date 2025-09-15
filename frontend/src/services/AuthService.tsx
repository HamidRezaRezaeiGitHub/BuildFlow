import { apiService } from './ApiService';
import type {
    LoginCredentials,
    SignUpData,
    AuthResponse,
    ValidationResponse,
    DomainUser
} from './dtos';

/**
 * Authentication Service class that handles all auth-related API operations
 * Uses the generic ApiService for HTTP communications while focusing on auth business logic
 */
class AuthService {

    /**
     * Login user with credentials
     * @param credentials - User login credentials
     * @returns Promise with JWT authentication response
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        return await apiService.post<AuthResponse>('/auth/login', credentials);
    }

    /**
     * Register new user
     * @param signUpData - User registration data with contact information
     * @returns Promise with authentication response
     */
    async register(signUpData: SignUpData): Promise<AuthResponse> {
        // Use the create method since registration should return 201 CREATED
        return await apiService.create<AuthResponse>('/auth/register', signUpData);
    }

    /**
     * Get current authenticated user information
     * @param token - JWT authentication token
     * @returns Promise with current user data
     */
    async getCurrentUser(token: string): Promise<DomainUser> {
        return await apiService.get<DomainUser>('/auth/current', token);
    }

    /**
     * Refresh JWT token
     * @param token - Current JWT token
     * @returns Promise with new JWT authentication response
     */
    async refreshToken(token: string): Promise<AuthResponse> {
        return await apiService.post<AuthResponse>('/auth/refresh', undefined, token);
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
        return await apiService.get<ValidationResponse>('/auth/validate', token);
    }

    /**
     * Create admin user (requires admin privileges)
     * @param signUpData - Admin user registration data
     * @param token - JWT token with admin privileges
     * @returns Promise with admin user creation response
     */
    async createAdminUser(signUpData: SignUpData, token: string): Promise<DomainUser> {
        return await apiService.post<DomainUser>('/auth/admin', signUpData, token);
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

    /**
     * Store JWT token in localStorage
     * @param token - JWT token to store
     */
    setToken(token: string): void {
        localStorage.setItem('jwt_token', token);
    }

    /**
     * Retrieve JWT token from localStorage
     * @returns JWT token or null if not found
     */
    getToken(): string | null {
        return localStorage.getItem('jwt_token');
    }

    /**
     * Remove JWT token from localStorage
     */
    removeToken(): void {
        localStorage.removeItem('jwt_token');
    }

    /**
     * Check if user is currently authenticated (has valid token)
     * @returns boolean indicating if user appears to be authenticated
     */
    isAuthenticated(): boolean {
        const token = this.getToken();
        return this.isTokenFormatValid(token) && !this.isTokenExpired(token);
    }
}

// Create and export a singleton instance
export const authService = new AuthService();

// Also export the class for testing or custom instances
export default AuthService;