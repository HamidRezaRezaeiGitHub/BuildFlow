/**
 * Tests for Theme page component
 * 
 * Tests the Theme page that showcases the design system
 */

import { render, screen } from '@testing-library/react';
import { Theme } from '@/pages/Theme';

// Mock the ThemeShowcase component
jest.mock('@/components/theme', () => ({
  ThemeShowcase: ({ showHeader }: { showHeader: boolean }) => (
    <div data-testid="theme-showcase" data-show-header={showHeader}>
      Theme Showcase Component
    </div>
  ),
}));

describe('Theme', () => {
  test('Theme_shouldRenderPageTitle_whenMounted', () => {
    render(<Theme />);
    
    expect(screen.getByRole('heading', { name: 'Theme Showcase' })).toBeInTheDocument();
    expect(screen.getByText('Explore BuildFlow\'s design system and theme capabilities')).toBeInTheDocument();
  });

  test('Theme_shouldHaveProperPageStructure_whenMounted', () => {
    render(<Theme />);
    
    // Check for main container with proper classes
    const container = document.querySelector('.min-h-screen.bg-background');
    expect(container).toBeInTheDocument();
    
    const innerContainer = document.querySelector('.container.mx-auto.px-4.py-8');
    expect(innerContainer).toBeInTheDocument();
  });

  test('Theme_shouldRenderThemeShowcase_whenMounted', () => {
    render(<Theme />);
    
    const themeShowcase = screen.getByTestId('theme-showcase');
    expect(themeShowcase).toBeInTheDocument();
  });

  test('Theme_shouldPassShowHeaderFalse_whenThemeShowcaseRendered', () => {
    render(<Theme />);
    
    const themeShowcase = screen.getByTestId('theme-showcase');
    expect(themeShowcase).toHaveAttribute('data-show-header', 'false');
  });

  test('Theme_shouldHaveProperHeadingHierarchy_whenMounted', () => {
    render(<Theme />);
    
    const mainHeading = screen.getByRole('heading', { name: 'Theme Showcase' });
    expect(mainHeading.tagName).toBe('H1');
    expect(mainHeading).toHaveClass('text-3xl');
    expect(mainHeading).toHaveClass('font-bold');
    expect(mainHeading).toHaveClass('text-primary');
  });

  test('Theme_shouldHaveProperTextAlignment_whenMounted', () => {
    render(<Theme />);
    
    const textCenter = document.querySelector('.text-center.mb-8');
    expect(textCenter).toBeInTheDocument();
    
    expect(screen.getByRole('heading')).toHaveClass('mb-4');
    expect(screen.getByText(/Explore BuildFlow's design system/)).toHaveClass('text-muted-foreground');
  });

  test('Theme_shouldBeAccessible_whenMounted', () => {
    render(<Theme />);
    
    // Check for proper heading structure
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    
    // Check for descriptive text
    const description = screen.getByText(/Explore BuildFlow's design system and theme capabilities/);
    expect(description).toBeInTheDocument();
  });

  test('Theme_shouldExportAsDefault_whenImported', () => {
    // This test ensures the default export works
    expect(Theme).toBeDefined();
    expect(typeof Theme).toBe('function');
  });
});