/**
 * Vitest setup configuration for React Testing Library
 * 
 * This file is run once before all tests and sets up:
 * - jest-dom custom matchers (compatible with Vitest)
 * - Automatic cleanup after each test
 * - Global test configurations
 * - Browser API mocks
 */

import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test (removes mounted components from the DOM)
afterEach(() => {
  cleanup();
});

// Mock modules that may cause issues in test environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  root = null;
  rootMargin = '';
  thresholds = [];
  
  constructor(_callback: any, _options?: any) {}
  
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
};
