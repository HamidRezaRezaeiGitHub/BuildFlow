/**
 * Environment Configuration
 * 
 * Centralized access to environment variables with type safety.
 * Similar to Spring Boot's application.yml profile system.
 * 
 * Environment files:
 * - .env.development - Standalone development (npm run dev)
 * - .env.integrated - With backend (npm run dev:integrated)
 * - .env.uat - UAT deployment (npm run build:uat)
 * - .env.production - Production deployment (npm run build)
 */

export type AppMode = 'standalone' | 'integrated';
export type Environment = 'development' | 'integrated' | 'uat' | 'production';

interface EnvironmentConfig {
  // Application Mode
  appMode: AppMode;
  isStandalone: boolean;
  isIntegrated: boolean;

  // Backend Integration
  backendEnabled: boolean;
  apiBaseUrl: string;
  basePath: string;

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
 *
 * Uses Vite's import.meta.env (replaced at build/dev time).
 */
function getEnvVar(key: string, defaultValue?: string): string {
  const env = (import.meta as any).env as Record<string, any>;
  const value = env?.[key] ?? defaultValue;
  if (value === undefined) {
    console.warn(`Environment variable ${key} is not defined`);
    return '';
  }
  return String(value);
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
  readonly basePath: string;

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
    this.basePath = this.calculateBasePath();

    // Feature Flags
    this.enableMockAuth = getBooleanEnvVar('VITE_ENABLE_MOCK_AUTH', true);
    this.enableMockData = getBooleanEnvVar('VITE_ENABLE_MOCK_DATA', true);
    this.enableConsoleLogs = getBooleanEnvVar('VITE_ENABLE_CONSOLE_LOGS', true);

    // Environment Info
    this.environment = (getEnvVar('VITE_ENVIRONMENT', 'development') as Environment);
    this.isDevelopment = this.environment === 'development' || this.environment === 'integrated';
    this.isProduction = this.environment === 'production';
    this.isUAT = this.environment === 'uat';

    // Log configuration in development
    if (this.isDevelopment && this.enableConsoleLogs) {
      this.logConfig();
    }
  }

  /**
   * Calculate base path for routing based on deployment environment
   * - Development: '/'
   * - GitHub Pages: '/BuildFlow/'
   * - Production: '/' or custom path from VITE_BASE_PATH
   */
  private calculateBasePath(): string {
    // Check if VITE_BASE_PATH is explicitly set in environment
    const envBasePath = getEnvVar('VITE_BASE_PATH');
    if (envBasePath) {
      return envBasePath;
    }

    // For GitHub Pages deployment, detect from hostname
    if (typeof window !== 'undefined') {
      const isGitHubPages = window.location.hostname === 'hamidrezarezaeigithub.github.io';
      if (isGitHubPages) {
        return '/BuildFlow/';
      }
    }

    // Default to root path
    return '/';
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
    console.log('Base Path:', this.basePath);
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
