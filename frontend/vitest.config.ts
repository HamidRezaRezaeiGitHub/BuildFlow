import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

/**
 * Vitest Configuration
 * 
 * Extends the Vite configuration to use the same settings for testing.
 * This ensures consistency between development and test environments.
 */
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      // Test environment - Simulate a browser environment
      environment: 'jsdom',
      
      // Enable globals (describe, it, expect, etc.) without imports
      globals: true,
      
      // Setup files - Run before each test file
      setupFiles: ['./src/test/setup.ts'],
      
      // CSS handling - Mock CSS imports
      css: {
        modules: {
          classNameStrategy: 'non-scoped',
        },
      },
      
      // Coverage configuration
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/test/',
          '**/*.d.ts',
          '**/*.config.*',
          '**/mockData',
          'dist/',
        ],
      },
      
      // Test file patterns
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      
      // Exclude patterns
      exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    },
  })
)
