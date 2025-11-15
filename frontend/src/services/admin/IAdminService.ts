import type {
    CreateUserRequest,
    CreateUserResponse,
    User,
    UserAuthentication
} from '../dtos';
import type { UserDetails } from '../dtos/UserDtos';

/**
 * Admin Service Interface
 * 
 * Defines the contract for administrative operations.
 * Implementations:
 * - AdminService: Real backend API calls
 * - AdminMockService: Mock data for standalone development
 * 
 * Factory (adminServiceFactory) determines which implementation to use based on config.enableMockAuth
 */
export interface IAdminService {
    /**
     * Get all user authentication records
     * Requires ADMIN_USERS authority
     * 
     * @param token - JWT authentication token
     * @returns Promise<UserAuthentication[]> - Array of user authentication data
     */
    getAllUserAuthentications(token: string): Promise<UserAuthentication[]>;

    /**
     * Get user authentication by username
     * Requires ADMIN_USERS authority
     * 
     * @param username - Username to retrieve authentication for
     * @param token - JWT authentication token
     * @returns Promise<UserAuthentication> - User authentication data
     */
    getUserAuthenticationByUsername(username: string, token: string): Promise<UserAuthentication>;

    /**
     * Get user information by username
     * Requires ADMIN_USERS authority
     * 
     * @param username - Username to retrieve user data for
     * @param token - JWT authentication token
     * @returns Promise<User> - Complete user information
     */
    getUserByUsername(username: string, token: string): Promise<User>;

    /**
     * Get all users
     * Requires ADMIN_USERS authority
     * 
     * @param token - JWT authentication token
     * @returns Promise<User[]> - Array of all users
     */
    getAllUsers(token: string): Promise<User[]>;

    /**
     * Create a new user
     * Requires ADMIN_USERS authority
     * 
     * @param request - User creation request data
     * @param token - JWT authentication token
     * @returns Promise<CreateUserResponse> - Created user response
     */
    createUser(request: CreateUserRequest, token: string): Promise<CreateUserResponse>;

    /**
     * Create a new admin user
     * Requires CREATE_ADMIN authority
     * 
     * @param request - Admin user creation request data
     * @param token - JWT authentication token
     * @returns Promise<CreateUserResponse> - Created admin user response
     */
    createAdminUser(request: CreateUserRequest, token: string): Promise<CreateUserResponse>;

    /**
     * Get user details (User + UserAuthentication combined)
     * This method combines user profile data with authentication data
     * 
     * @param username - Username to get details for
     * @param token - JWT authentication token
     * @returns Promise with user details
     */
    getUserDetails(username: string, token: string): Promise<UserDetails>;

    /**
     * Get all user details (All Users + UserAuthentications combined)
     * This method fetches all users and their authentication data efficiently
     * 
     * @param token - JWT authentication token
     * @returns Promise with array of user details
     */
    getAllUserDetails(token: string): Promise<UserDetails[]>;

    /**
     * Calculate user statistics from user details array
     * This method analyzes user data and returns various statistics
     * 
     * @param userDetailsList - Array of user details
     * @returns Object containing user statistics
     */
    calculateUserStats(userDetailsList: UserDetails[]): {
        totalUsers: number;
        activeUsers: number;
        inactiveUsers: number;
        adminUsers: number;
        regularUsers: number;
        premiumUsers: number;
        recentLogins: number;
    };
}
