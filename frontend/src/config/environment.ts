/**
 * Environment Configuration
 * 
 * Centralized access to environment variables with type safety.
 * Similar to Spring Boot's application.yml profile system.
 * 
 * Environment files:
 * - .env.development - Standalone development (npm run dev)
 * - .env.development.integrated - With backend (npm run dev:integrated)
 * - .env.uat - UAT deployment (npm run build:uat)
 * - .env.production - Production deployment (npm run build)
 */

export type AppMode = 'standalone' | 'integrated';
export type Environment = 'development' | 'development-integrated' | 'uat' | 'production';

interface EnvironmentConfig {
  // Application Mode
  appMode: AppMode;
  isStandalone: boolean;
  isIntegrated: boolean;
  
  // Backend Integration
  backendEnabled: boolean;
  apiBaseUrl: string;
  
  // Feature Flags
  enableMockAuth: boolean;
  enableMockData: boolean;
  enableConsoleLogs: boolean;
  
  // Environment Info
  environment: Environment;
  isDevelopment: boolean;
  isProduction: boolean;
  isUAT: boolean;
}

/**
 * Get environment variable with type safety
 */
function getEnvVar(key: string, defaultValue?: string): string {
  const value = import.meta.env[key];
  if (value === undefined && defaultValue === undefined) {
    console.warn(`Environment variable ${key} is not defined`);
    return '';
  }
  return value ?? defaultValue ?? '';
}

/**
 * Get boolean environment variable
 */
function getBooleanEnvVar(key: string, defaultValue: boolean = false): boolean {
  const value = getEnvVar(key, String(defaultValue));
  return value === 'true' || value === '1';
}

/**
 * Environment configuration singleton
 */
class Config implements EnvironmentConfig {
  // Application Mode
  readonly appMode: AppMode;
  readonly isStandalone: boolean;
  readonly isIntegrated: boolean;
  
  // Backend Integration
  readonly backendEnabled: boolean;
  readonly apiBaseUrl: string;
  
  // Feature Flags
  readonly enableMockAuth: boolean;
  readonly enableMockData: boolean;
  readonly enableConsoleLogs: boolean;
  
  // Environment Info
  readonly environment: Environment;
  readonly isDevelopment: boolean;
  readonly isProduction: boolean;
  readonly isUAT: boolean;

  constructor() {
    // Application Mode
    this.appMode = (getEnvVar('VITE_APP_MODE', 'standalone') as AppMode);
    this.isStandalone = this.appMode === 'standalone';
    this.isIntegrated = this.appMode === 'integrated';
    
    // Backend Integration
    this.backendEnabled = getBooleanEnvVar('VITE_BACKEND_ENABLED', false);
    this.apiBaseUrl = getEnvVar('VITE_API_BASE_URL', '/api');
    
    // Feature Flags
    this.enableMockAuth = getBooleanEnvVar('VITE_ENABLE_MOCK_AUTH', true);
    this.enableMockData = getBooleanEnvVar('VITE_ENABLE_MOCK_DATA', true);
    this.enableConsoleLogs = getBooleanEnvVar('VITE_ENABLE_CONSOLE_LOGS', true);
    
    // Environment Info
    this.environment = (getEnvVar('VITE_ENVIRONMENT', 'development') as Environment);
    this.isDevelopment = this.environment.startsWith('development');
    this.isProduction = this.environment === 'production';
    this.isUAT = this.environment === 'uat';
    
    // Log configuration in development
    if (this.isDevelopment && this.enableConsoleLogs) {
      this.logConfig();
    }
  }
  
  /**
   * Log current configuration (development only)
   */
  private logConfig(): void {
    console.group('🔧 Application Configuration');
    console.log('Mode:', this.appMode);
    console.log('Environment:', this.environment);
    console.log('Backend Enabled:', this.backendEnabled);
    console.log('API Base URL:', this.apiBaseUrl);
    console.log('Mock Auth:', this.enableMockAuth);
    console.log('Mock Data:', this.enableMockData);
    console.groupEnd();
  }
  
  /**
   * Get full API endpoint URL
   */
  getApiEndpoint(path: string): string {
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    // If apiBaseUrl already ends with /, remove it
    const baseUrl = this.apiBaseUrl.endsWith('/') 
      ? this.apiBaseUrl.slice(0, -1) 
      : this.apiBaseUrl;
    
    return `${baseUrl}${normalizedPath}`;
  }
  
  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(feature: 'mockAuth' | 'mockData' | 'consoleLogs'): boolean {
    switch (feature) {
      case 'mockAuth':
        return this.enableMockAuth;
      case 'mockData':
        return this.enableMockData;
      case 'consoleLogs':
        return this.enableConsoleLogs;
      default:
        return false;
    }
  }
}

/**
 * Export singleton instance
 */
export const config = new Config();

/**
 * Export default for convenience
 */
export default config;
