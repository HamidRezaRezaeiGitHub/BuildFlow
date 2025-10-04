import { config } from '@/config/environment';
import { findUserAuthenticationByUsername, mockUsers } from '@/mocks/authMocks';
import { apiService } from './ApiService';
import { CreateUserRequest, CreateUserResponse, User, UserAuthentication } from './dtos';
import { UserDetails } from './dtos/UserDtos';

/**
 * AdminService class that handles all administrative operations
 * Uses the generic ApiService for HTTP communications while focusing on admin business logic
 * 
 * This service provides functions for admin-only endpoints including:
 * - User management and authentication data
 * - Admin user creation
 * - User statistics and monitoring
 * 
 * All methods require admin authentication (ADMIN_USERS authority)
 * Token must be provided as parameter to each method
 */
class AdminService {

    /**
     * Get all user authentication records
     * Requires ADMIN_USERS authority
     * 
     * @param token - JWT authentication token
     * @returns Promise<UserAuthentication[]> - Array of user authentication data
     */
    async getAllUserAuthentications(token: string): Promise<UserAuthentication[]> {
        return apiService.get<UserAuthentication[]>('/auth/user-auth', token);
    }

    /**
     * Get user authentication by username
     * Requires ADMIN_USERS authority
     * 
     * @param username - Username to retrieve authentication for
     * @param token - JWT authentication token
     * @returns Promise<UserAuthentication> - User authentication data
     */
    async getUserAuthenticationByUsername(username: string, token: string): Promise<UserAuthentication> {
        return apiService.get<UserAuthentication>(`/auth/user-auth/${encodeURIComponent(username)}`, token);
    }

    /**
     * Get user information by username
     * Requires ADMIN_USERS authority
     * 
     * @param username - Username to retrieve user data for
     * @param token - JWT authentication token
     * @returns Promise<User> - Complete user information
     */
    async getUserByUsername(username: string, token: string): Promise<User> {
        return apiService.get<User>(`/v1/users/${encodeURIComponent(username)}`, token);
    }

    /**
     * Get all users
     * Requires ADMIN_USERS authority
     * 
     * @param token - JWT authentication token
     * @returns Promise<User[]> - Array of all users
     */
    async getAllUsers(token: string): Promise<User[]> {
        return apiService.get<User[]>('/v1/users', token);
    }

    /**
     * Create a new user
     * Requires ADMIN_USERS authority
     * 
     * @param request - User creation request data
     * @param token - JWT authentication token
     * @returns Promise<CreateUserResponse> - Created user response
     */
    async createUser(request: CreateUserRequest, token: string): Promise<CreateUserResponse> {
        return apiService.create<CreateUserResponse>('/v1/users', request, token);
    }

    /**
     * Create a new admin user
     * Requires CREATE_ADMIN authority
     * 
     * @param request - Admin user creation request data
     * @param token - JWT authentication token
     * @returns Promise<CreateUserResponse> - Created admin user response
     */
    async createAdminUser(request: CreateUserRequest, token: string): Promise<CreateUserResponse> {
        return apiService.create<CreateUserResponse>('/auth/admin', request, token);
    }

    /**
     * Get user details (User + UserAuthentication combined)
     * This method combines user profile data with authentication data
     * Environment-aware: Uses mock data when config.enableMockAuth is true
     * 
     * @param username - Username to get details for
     * @param token - JWT authentication token (ignored in mock mode)
     * @returns Promise with user details
     */
    async getUserDetails(username: string, token: string): Promise<UserDetails> {
        // Use mock data in standalone mode
        if (config.enableMockAuth) {
            if (config.enableConsoleLogs) {
                console.log('[AdminService] Getting mock user details for:', username);
            }

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const user = mockUsers.find(u => u.username === username);
                    const userAuthentication = findUserAuthenticationByUsername(username);

                    if (!user) {
                        reject(new Error(`User not found: ${username}`));
                        return;
                    }

                    if (!userAuthentication) {
                        reject(new Error(`User authentication not found: ${username}`));
                        return;
                    }

                    const userDetails: UserDetails = {
                        username,
                        user,
                        userAuthentication
                    };

                    resolve(userDetails);
                }, 300); // Simulate network delay
            });
        }

        // Real API calls in integrated mode
        const [user, userAuthentication] = await Promise.all([
            apiService.get<User>(`/v1/users/${encodeURIComponent(username)}`, token),
            apiService.get<UserAuthentication>(`/auth/user-auth/${encodeURIComponent(username)}`, token)
        ]);

        return {
            username,
            user,
            userAuthentication
        };
    }

    /**
     * Get all user details (All Users + UserAuthentications combined)
     * This method fetches all users and their authentication data efficiently
     * Environment-aware: Uses mock data when config.enableMockAuth is true
     * 
     * @param token - JWT authentication token (ignored in mock mode)
     * @returns Promise with array of user details
     */
    async getAllUserDetails(token: string): Promise<UserDetails[]> {
        // Use mock data in standalone mode
        if (config.enableMockAuth) {
            if (config.enableConsoleLogs) {
                console.log('[AdminService] Using mock user data');
            }

            return new Promise((resolve) => {
                setTimeout(() => {
                    // Combine mock users with their corresponding authentication data
                    const mockUserDetailsList: UserDetails[] = mockUsers.map(user => {
                        const userAuthentication = findUserAuthenticationByUsername(user.username);
                        if (!userAuthentication) {
                            throw new Error(`Authentication data not found for user: ${user.username}`);
                        }

                        return {
                            username: user.username,
                            user: user,
                            userAuthentication
                        };
                    });

                    resolve(mockUserDetailsList);
                }, 800); // Simulate network delay
            });
        }

        // Real API calls in integrated mode
        // Fetch both datasets in parallel using bulk APIs
        const [authentications, users] = await Promise.all([
            apiService.get<UserAuthentication[]>('/auth/user-auth', token),
            apiService.get<User[]>('/v1/users', token)
        ]);

        // Validate authentication data
        const validAuthentications = authentications.filter(auth => {
            if (!auth || typeof auth !== 'object') {
                console.warn('Invalid authentication object:', auth);
                return false;
            }
            if (!auth.username || !auth.role) {
                console.warn('Authentication missing required fields:', auth);
                return false;
            }
            return true;
        });

        // Create a map of users by username for efficient lookup
        const userMap = new Map<string, User>();
        users.forEach(user => {
            if (user && user.username) {
                userMap.set(user.username, user);
            }
        });

        // Join authentication data with user data using username
        // Filter out entries where user is not found (should not happen based on backend contract)
        return validAuthentications
            .map(userAuthentication => {
                const user = userMap.get(userAuthentication.username);
                if (!user) {
                    console.warn(`User not found for username: ${userAuthentication.username}`);
                    return null;
                }
                return {
                    username: userAuthentication.username,
                    user,
                    userAuthentication
                };
            })
            .filter((details): details is UserDetails => details !== null);
    }

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
    } {
        const authentications = userDetailsList.map(details => details.userAuthentication);
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        return {
            totalUsers: authentications.length,
            activeUsers: authentications.filter(auth => auth.enabled).length,
            inactiveUsers: authentications.filter(auth => !auth.enabled).length,
            adminUsers: authentications.filter(auth => auth.role === 'ADMIN').length,
            regularUsers: authentications.filter(auth => auth.role === 'USER').length,
            premiumUsers: authentications.filter(auth => auth.role === 'PREMIUM_USER').length,
            recentLogins: authentications.filter(auth =>
                auth.lastLogin && new Date(auth.lastLogin) > sevenDaysAgo
            ).length
        };
    }
}

/**
 * Service wrapper that integrates with AuthContext
 * This wrapper automatically provides the authentication token from context
 * Consumers don't need to handle token management
 */
export class AdminServiceWithAuth {
    private adminService: AdminService;
    private getToken: () => string | null;

    constructor(getToken: () => string | null) {
        this.adminService = new AdminService();
        this.getToken = getToken;
    }

    private ensureToken(): string {
        const token = this.getToken();
        if (!token) {
            throw new Error('Authentication token required for admin operations');
        }
        return token;
    }

    async getAllUserAuthentications(): Promise<UserAuthentication[]> {
        return this.adminService.getAllUserAuthentications(this.ensureToken());
    }

    async getUserAuthenticationByUsername(username: string): Promise<UserAuthentication> {
        return this.adminService.getUserAuthenticationByUsername(username, this.ensureToken());
    }

    async getUserByUsername(username: string): Promise<User> {
        return this.adminService.getUserByUsername(username, this.ensureToken());
    }

    async getAllUsers(): Promise<User[]> {
        return this.adminService.getAllUsers(this.ensureToken());
    }

    async createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
        return this.adminService.createUser(request, this.ensureToken());
    }

    async createAdminUser(request: CreateUserRequest): Promise<CreateUserResponse> {
        return this.adminService.createAdminUser(request, this.ensureToken());
    }

    async getUserDetails(username: string): Promise<UserDetails> {
        return this.adminService.getUserDetails(username, this.ensureToken());
    }

    async getAllUserDetails(): Promise<UserDetails[]> {
        return this.adminService.getAllUserDetails(this.ensureToken());
    }

    calculateUserStats(userDetailsList: UserDetails[]): {
        totalUsers: number;
        activeUsers: number;
        inactiveUsers: number;
        adminUsers: number;
        regularUsers: number;
        premiumUsers: number;
        recentLogins: number;
    } {
        return this.adminService.calculateUserStats(userDetailsList);
    }
}

// Create and export a singleton instance of the raw service
export const adminService = new AdminService();

// Also export the class for testing or custom instances
// export default AdminService; // Removed to avoid confusion; use named export if needed