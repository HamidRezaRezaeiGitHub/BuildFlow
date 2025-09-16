import { apiService } from './ApiService';
import { User, UserAuthentication, CreateUserRequest, CreateUserResponse } from './dtos';

/**
 * AdminService - Service for administrative operations
 * 
 * This service provides functions for admin-only endpoints including:
 * - User management and authentication data
 * - Admin user creation
 * - User statistics and monitoring
 * 
 * All methods require admin authentication (ADMIN_USERS authority)
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
     * Get combined user data (User + UserAuthentication)
     * This method combines user profile data with authentication data
     * 
     * @param username - Username to get combined data for
     * @param token - JWT authentication token
     * @returns Promise with combined user data
     */
    async getCombinedUserData(username: string, token: string): Promise<{
        user: User;
        authentication: UserAuthentication;
    }> {
        const [user, authentication] = await Promise.all([
            this.getUserByUsername(username, token),
            this.getUserAuthenticationByUsername(username, token)
        ]);

        return { user, authentication };
    }

    /**
     * Get all users with their authentication data
     * Useful for admin dashboard with complete user overview
     * Uses bulk fetch APIs and joins data by username
     * 
     * @param token - JWT authentication token
     * @returns Promise with array of combined user data
     */
    async getAllUsersWithAuth(token: string): Promise<Array<{
        user: User | null;
        authentication: UserAuthentication;
    }>> {
        // Fetch both datasets in parallel using bulk APIs
        const [authentications, users] = await Promise.all([
            this.getAllUserAuthentications(token),
            this.getAllUsers(token)
        ]);

        // Create a map of users by username for efficient lookup
        const userMap = new Map<string, User>();
        users.forEach(user => {
            userMap.set(user.username, user);
        });

        // Join authentication data with user data using username
        return authentications.map(authentication => ({
            user: userMap.get(authentication.username) || null,
            authentication
        }));
    }

    /**
     * Get user statistics for admin dashboard
     * 
     * @param token - JWT authentication token
     * @returns Promise with user statistics
     */
    async getUserStats(token: string): Promise<{
        totalUsers: number;
        activeUsers: number;
        inactiveUsers: number;
        adminUsers: number;
        regularUsers: number;
        premiumUsers: number;
        recentLogins: number; // Users who logged in within last 7 days
    }> {
        const authentications = await this.getAllUserAuthentications(token);
        
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const stats = {
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

        return stats;
    }
}

// Create and export a singleton instance
export const adminService = new AdminService();

// Also export the class for testing or custom instances
export default AdminService;