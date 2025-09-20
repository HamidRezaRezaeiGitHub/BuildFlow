/**
 * Jest setup configuration for React Testing Library
 * 
 * This file is run once before all tests and sets up:
 * - jest-dom custom matchers
 * - Global test configurations
 */

import '@testing-library/jest-dom';

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