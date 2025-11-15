import { config } from '@/config/environment';
import { findUserAuthenticationByUsername, mockUsers } from '@/mocks/MockUsers';
import type {
    CreateUserRequest,
    CreateUserResponse,
    User,
    UserAuthentication
} from '../dtos';
import type { UserDetails } from '../dtos/UserDtos';
import type { IAdminService } from './IAdminService';

/**
 * Admin Mock Service
 * 
 * Provides mock administrative functionality for standalone frontend development.
 * This implementation contains NO real API calls - it's pure mock logic using local data.
 * 
 * Uses mock data from @/mocks/MockUsers to simulate backend responses.
 * All methods include simulated network delays for realistic development experience.
 * 
 * Enabled when config.enableMockAuth is true (standalone mode).
 */
export class AdminMockService implements IAdminService {

    /**
     * Get all user authentication records using mock data
     * 
     * @param _token - Mock JWT authentication token (ignored)
     * @returns Promise<UserAuthentication[]> - Array of mock user authentication data
     */
    async getAllUserAuthentications(_token: string): Promise<UserAuthentication[]> {
        if (config.enableConsoleLogs) {
            console.log('[AdminMockService] Getting all mock user authentications');
        }

        return new Promise((resolve) => {
            setTimeout(() => {
                const authentications = mockUsers.map(user => {
                    const auth = findUserAuthenticationByUsername(user.username);
                    if (!auth) {
                        throw new Error(`Authentication data not found for user: ${user.username}`);
                    }
                    return auth;
                });
                resolve(authentications);
            }, 300); // Simulate network delay
        });
    }

    /**
     * Get user authentication by username using mock data
     * 
     * @param username - Username to retrieve authentication for
     * @param _token - Mock JWT authentication token (ignored)
     * @returns Promise<UserAuthentication> - Mock user authentication data
     */
    async getUserAuthenticationByUsername(username: string, _token: string): Promise<UserAuthentication> {
        if (config.enableConsoleLogs) {
            console.log('[AdminMockService] Getting mock user authentication for:', username);
        }

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const userAuthentication = findUserAuthenticationByUsername(username);
                if (!userAuthentication) {
                    reject(new Error(`User authentication not found: ${username}`));
                    return;
                }
                resolve(userAuthentication);
            }, 300); // Simulate network delay
        });
    }

    /**
     * Get user information by username using mock data
     * 
     * @param username - Username to retrieve user data for
     * @param _token - Mock JWT authentication token (ignored)
     * @returns Promise<User> - Mock user information
     */
    async getUserByUsername(username: string, _token: string): Promise<User> {
        if (config.enableConsoleLogs) {
            console.log('[AdminMockService] Getting mock user by username:', username);
        }

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = mockUsers.find(u => u.username === username);
                if (!user) {
                    reject(new Error(`User not found: ${username}`));
                    return;
                }
                resolve(user);
            }, 300); // Simulate network delay
        });
    }

    /**
     * Get all users using mock data
     * 
     * @param _token - Mock JWT authentication token (ignored)
     * @returns Promise<User[]> - Array of mock users
     */
    async getAllUsers(_token: string): Promise<User[]> {
        if (config.enableConsoleLogs) {
            console.log('[AdminMockService] Getting all mock users');
        }

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...mockUsers]);
            }, 400); // Simulate network delay
        });
    }

    /**
     * Create a new user using mock data
     * 
     * @param request - User creation request data
     * @param _token - Mock JWT authentication token (ignored)
     * @returns Promise<CreateUserResponse> - Mock created user response
     */
    async createUser(request: CreateUserRequest, _token: string): Promise<CreateUserResponse> {
        if (config.enableConsoleLogs) {
            console.log('[AdminMockService] Mock user creation:', request);
        }

        return new Promise((resolve) => {
            setTimeout(() => {
                // In mock mode, we just simulate success
                // Actual User object creation would require all fields
                resolve({
                    user: {
                        id: crypto.randomUUID(),
                        username: request.username || 'new-user',
                        email: request.contact.email,
                        registered: true,
                        contact: {
                            id: crypto.randomUUID(),
                            ...request.contact,
                            address: request.contact.address ? { ...request.contact.address, id: crypto.randomUUID() } : undefined
                        } as any // Type assertion for mock - address type mismatch is acceptable in mock
                    }
                });
            }, 500); // Simulate network delay
        });
    }

    /**
     * Create a new admin user using mock data
     * 
     * @param request - Admin user creation request data
     * @param _token - Mock JWT authentication token (ignored)
     * @returns Promise<CreateUserResponse> - Mock created admin user response
     */
    async createAdminUser(request: CreateUserRequest, _token: string): Promise<CreateUserResponse> {
        if (config.enableConsoleLogs) {
            console.log('[AdminMockService] Mock admin user creation:', request);
        }

        return new Promise((resolve) => {
            setTimeout(() => {
                // In mock mode, we just simulate success
                resolve({
                    user: {
                        id: crypto.randomUUID(),
                        username: request.username || 'new-admin',
                        email: request.contact.email,
                        registered: true,
                        contact: {
                            id: crypto.randomUUID(),
                            ...request.contact,
                            labels: [...(request.contact.labels || []), 'Administrator'],
                            address: request.contact.address ? { ...request.contact.address, id: crypto.randomUUID() } : undefined
                        } as any // Type assertion for mock - address type mismatch is acceptable in mock
                    }
                });
            }, 500); // Simulate network delay
        });
    }

    /**
     * Get user details (User + UserAuthentication combined) using mock data
     * 
     * @param username - Username to get details for
     * @param _token - Mock JWT authentication token (ignored)
     * @returns Promise with mock user details
     */
    async getUserDetails(username: string, _token: string): Promise<UserDetails> {
        if (config.enableConsoleLogs) {
            console.log('[AdminMockService] Getting mock user details for:', username);
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

    /**
     * Get all user details (All Users + UserAuthentications combined) using mock data
     * 
     * @param _token - Mock JWT authentication token (ignored)
     * @returns Promise with array of mock user details
     */
    async getAllUserDetails(_token: string): Promise<UserDetails[]> {
        if (config.enableConsoleLogs) {
            console.log('[AdminMockService] Using mock user data');
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
