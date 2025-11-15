import { config } from '@/config/environment';
import type { CreateUserRequest } from '../dtos';
import type { UserDetails } from '../dtos/UserDtos';
import { AdminMockService } from './AdminMockService';
import { AdminService } from './AdminService';
import type { IAdminService } from './IAdminService';

/**
 * Admin Service Factory
 * 
 * Creates and returns the appropriate admin service implementation
 * based on the application configuration.
 * 
 * Decision Logic:
 * - If config.enableMockAuth is true → Returns AdminMockService (standalone mode)
 * - If config.enableMockAuth is false → Returns AdminService (integrated mode)
 * 
 * This factory provides a single point of control for switching between
 * mock and real admin service implementations.
 * 
 * Usage:
 * ```typescript
 * import { adminService } from '@/services';
 * 
 * const users = await adminService.getAllUsers(token);
 * ```
 */
function createAdminService(): IAdminService {
    if (config.enableMockAuth) {
        if (config.enableConsoleLogs) {
            console.log('[AdminServiceFactory] Creating AdminMockService (standalone mode)');
        }
        return new AdminMockService();
    }

    if (config.enableConsoleLogs) {
        console.log('[AdminServiceFactory] Creating AdminService (integrated mode)');
    }
    return new AdminService();
}

/**
 * Singleton instance of the admin service
 * 
 * This is the primary export that should be used throughout the application.
 * The factory determines which implementation to use based on configuration.
 */
export const adminService = createAdminService();

/**
 * Export the factory function for testing purposes
 * Allows tests to create fresh instances if needed
 */
export { createAdminService };

/**
 * Export types and classes for advanced usage and testing
 */
export type { IAdminService };
export { AdminService } from './AdminService';
export { AdminMockService } from './AdminMockService';

/**
 * Service wrapper that integrates with AuthContext
 * This wrapper automatically provides the authentication token from context
 * Consumers don't need to handle token management
 */
export class AdminServiceWithAuth {
    private adminService: IAdminService;
    private getToken: () => string | null;

    constructor(getToken: () => string | null) {
        this.adminService = createAdminService();
        this.getToken = getToken;
    }

    private ensureToken(): string {
        const token = this.getToken();
        if (!token) {
            throw new Error('Authentication token required for admin operations');
        }
        return token;
    }

    async getAllUserAuthentications() {
        return this.adminService.getAllUserAuthentications(this.ensureToken());
    }

    async getUserAuthenticationByUsername(username: string) {
        return this.adminService.getUserAuthenticationByUsername(username, this.ensureToken());
    }

    async getUserByUsername(username: string) {
        return this.adminService.getUserByUsername(username, this.ensureToken());
    }

    async getAllUsers() {
        return this.adminService.getAllUsers(this.ensureToken());
    }

    async createUser(request: CreateUserRequest) {
        return this.adminService.createUser(request, this.ensureToken());
    }

    async createAdminUser(request: CreateUserRequest) {
        return this.adminService.createAdminUser(request, this.ensureToken());
    }

    async getUserDetails(username: string) {
        return this.adminService.getUserDetails(username, this.ensureToken());
    }

    async getAllUserDetails() {
        return this.adminService.getAllUserDetails(this.ensureToken());
    }

    calculateUserStats(userDetailsList: UserDetails[]) {
        return this.adminService.calculateUserStats(userDetailsList);
    }
}
