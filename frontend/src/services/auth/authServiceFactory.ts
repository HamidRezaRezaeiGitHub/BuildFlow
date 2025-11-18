import { config } from '@/config/environment';
import { AuthMockService } from './AuthMockService';
import { AuthService } from './AuthService';
import type { IAuthService } from './IAuthService';

/**
 * Authentication Service Factory
 * 
 * Creates and returns the appropriate authentication service implementation
 * based on the application configuration.
 * 
 * Decision Logic:
 * - If config.enableMockAuth is true → Returns AuthMockService (standalone mode)
 * - If config.enableMockAuth is false → Returns AuthService (integrated mode)
 * 
 * This factory provides a single point of control for switching between
 * mock and real authentication implementations.
 * 
 * Usage:
 * ```typescript
 * import { authService } from '@/services';
 * 
 * const response = await authService.login(credentials);
 * ```
 */
function createAuthService(): IAuthService {
    if (config.enableMockAuth) {
        if (config.enableConsoleLogs) {
            console.log('[AuthServiceFactory] Creating AuthMockService (standalone mode)');
        }
        return new AuthMockService();
    }

    if (config.enableConsoleLogs) {
        console.log('[AuthServiceFactory] Creating AuthService (integrated mode)');
    }
    return new AuthService();
}

/**
 * Singleton instance of the authentication service
 * 
 * This is the primary export that should be used throughout the application.
 * The factory determines which implementation to use based on configuration.
 */
export const authService = createAuthService();

/**
 * Export the factory function for testing purposes
 * Allows tests to create fresh instances if needed
 */
export { createAuthService };

/**
 * Export types and classes for advanced usage and testing
 */
export { AuthMockService } from './AuthMockService';
export { AuthService } from './AuthService';
export type { IAuthService };
