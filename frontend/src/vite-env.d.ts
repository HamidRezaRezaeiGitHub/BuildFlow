/// <reference types="vite/client" />

/**
 * Vite Environment Variables Type Definitions
 * 
 * This file provides type safety for environment variables
 * accessed via import.meta.env
 */

interface ImportMetaEnv {
  // Application Mode
  readonly VITE_APP_MODE: 'standalone' | 'integrated';
  
  // Backend Integration
  readonly VITE_BACKEND_ENABLED: string; // 'true' | 'false'
  readonly VITE_API_BASE_URL: string;
  
  // Feature Flags
  readonly VITE_ENABLE_MOCK_AUTH: string; // 'true' | 'false'
  readonly VITE_ENABLE_MOCK_DATA: string; // 'true' | 'false'
  readonly VITE_ENABLE_CONSOLE_LOGS: string; // 'true' | 'false'
  
  // Environment Name
  readonly VITE_ENVIRONMENT: 'development' | 'development-integrated' | 'uat' | 'production';
  
  // Vite Built-in Variables
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
