import type {
    CreateUserRequest,
    CreateUserResponse,
    User,
    UserAuthentication
} from '..';
import { apiService } from '../ApiService';
import type { UserDetails } from '../user/UserDtos';
import type { IAdminService } from './IAdminService';

/**
 * Admin Service - Real Backend Implementation
 * 
 * Handles all administrative operations by calling the Spring Boot backend.
 * This implementation contains NO mock logic - it's pure API integration.
 * 
 * All methods require admin authentication (ADMIN_USERS or CREATE_ADMIN authority).
 * Token must be provided as parameter to each method.
 */
export class AdminService implements IAdminService {

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
     * 
     * @param username - Username to get details for
     * @param token - JWT authentication token
     * @returns Promise with user details
     */
    async getUserDetails(username: string, token: string): Promise<UserDetails> {
        // Fetch both datasets in parallel
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
     * 
     * @param token - JWT authentication token
     * @returns Promise with array of user details
     */
    async getAllUserDetails(token: string): Promise<UserDetails[]> {
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
