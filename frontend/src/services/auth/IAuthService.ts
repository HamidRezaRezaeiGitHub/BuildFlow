import type {
    AuthResponse,
    CreateUserResponse,
    LoginCredentials,
    SignUpData,
    User,
    UserSummary,
    ValidationResponse
} from '../dtos';

/**
 * Authentication Service Interface
 * 
 * Defines the contract for authentication operations.
 * Implementations:
 * - AuthService: Real backend API calls
 * - AuthMockService: Mock data for standalone development
 * 
 * Factory (authServiceFactory) determines which implementation to use based on config.enableMockAuth
 */
export interface IAuthService {
    /**
     * Login user with credentials
     * @param credentials - User login credentials
     * @returns Promise with JWT authentication response
     */
    login(credentials: LoginCredentials): Promise<AuthResponse>;

    /**
     * Register new user
     * @param signUpData - User registration data with contact information
     * @returns Promise with CreateUserResponse containing the created user data
     */
    register(signUpData: SignUpData): Promise<CreateUserResponse>;

    /**
     * Get current authenticated user information
     * @param token - JWT authentication token
     * @returns Promise with current user summary data
     */
    getCurrentUser(token: string): Promise<UserSummary>;

    /**
     * Refresh JWT token
     * @param token - Current JWT token
     * @returns Promise with new JWT authentication response
     */
    refreshToken(token: string): Promise<AuthResponse>;

    /**
     * Logout user (server-side session cleanup)
     * @param token - JWT authentication token
     * @returns Promise that resolves when logout is complete
     */
    logout(token: string): Promise<void>;

    /**
     * Validate JWT token
     * @param token - JWT token to validate
     * @returns Promise with validation response
     */
    validateToken(token: string): Promise<ValidationResponse>;

    /**
     * Create admin user (requires admin privileges)
     * @param signUpData - Admin user registration data
     * @param token - JWT token with admin privileges
     * @returns Promise with admin user creation response
     */
    createAdminUser(signUpData: SignUpData, token: string): Promise<User>;

    /**
     * Check if a token appears to be valid format (basic validation)
     * This is a client-side check and should not replace server-side validation
     * @param token - JWT token to check
     * @returns boolean indicating if token format appears valid
     */
    isTokenFormatValid(token: string | null): boolean;

    /**
     * Extract token expiration time (if available)
     * This is a client-side utility and should not replace server-side validation
     * @param token - JWT token
     * @returns Date object representing expiration time or null if cannot be determined
     */
    getTokenExpiration(token: string | null): Date | null;

    /**
     * Check if token is expired (client-side check)
     * This is a client-side utility and should not replace server-side validation
     * @param token - JWT token
     * @returns boolean indicating if token appears to be expired
     */
    isTokenExpired(token: string | null): boolean;
}
