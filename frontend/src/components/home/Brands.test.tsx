/**
 * Tests for Brands component
 * 
 * Tests the Brands section component that displays testimonials and partner companies
 */

import { render, screen } from '@testing-library/react';
import Brands from '@/components/home/Brands';

// Mock the NavigationProvider hook
const mockNavigateToSignup = jest.fn();
jest.mock('@/components/home/NavigationProvider', () => ({
  useNavigation: () => ({
    navigateToSignup: mockNavigateToSignup,
  }),
}));

describe('Brands', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Brands_shouldRenderSection_whenMounted', () => {
    render(<Brands />);
    
    expect(screen.getByText('Trusted by Industry Leaders')).toBeInTheDocument();
  });

  test('Brands_shouldDisplayTestimonialsSection_whenMounted', () => {
    render(<Brands />);
    
    // Check for testimonial section header
    expect(screen.getByText('What Our Clients Say')).toBeInTheDocument();
  });

  test('Brands_shouldDisplayTestimonialContent_whenMounted', () => {
    render(<Brands />);
    
    // Check for testimonial content (partial text to avoid issues with line breaks)
    expect(screen.getByText(/BuildFlow has revolutionized/)).toBeInTheDocument();
    expect(screen.getByText(/estimate generation feature/)).toBeInTheDocument();
    expect(screen.getByText(/Team collaboration has never/)).toBeInTheDocument();
  });

  test('Brands_shouldDisplaySocialProofMetrics_whenMounted', () => {
    render(<Brands />);
    
    expect(screen.getByText('500+')).toBeInTheDocument();
    expect(screen.getByText('Projects Completed')).toBeInTheDocument();
    
    expect(screen.getByText('50+')).toBeInTheDocument();
    expect(screen.getByText('Active Teams')).toBeInTheDocument();
    
    expect(screen.getByText('$2M+')).toBeInTheDocument();
    expect(screen.getByText('Projects Managed')).toBeInTheDocument();
    
    expect(screen.getByText('99%')).toBeInTheDocument();
    expect(screen.getByText('Customer Satisfaction')).toBeInTheDocument();
  });

  test('Brands_shouldRenderStarRatings_whenTestimonialsDisplayed', () => {
    render(<Brands />);
    
    // Since all testimonials have 5-star ratings, we should have star icons
    const starElements = document.querySelectorAll('.text-yellow-400.fill-current');
    expect(starElements.length).toBeGreaterThan(0);
  });

  test('Brands_shouldApplyCustomClassName_whenClassNameProvided', () => {
    render(<Brands className="custom-brands-class" />);
    
    const section = document.querySelector('section#brands');
    expect(section).toHaveClass('custom-brands-class');
  });

  test('Brands_shouldHaveProperSectionStructure_whenMounted', () => {
    render(<Brands />);
    
    // Check for the main section with ID
    const section = document.querySelector('section#brands');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('py-24');
    expect(section).toHaveClass('bg-muted/30');
  });

  test('Brands_shouldDisplayQuoteIcons_whenTestimonialsRendered', () => {
    render(<Brands />);
    
    // Look for quote icons via SVG elements with the quote path
    const quoteIcons = document.querySelectorAll('svg path[d*="M16 3a2 2 0 0 0-2 2v6"]');
    expect(quoteIcons.length).toBeGreaterThan(0);
  });

  test('Brands_shouldHaveResponsiveGrid_whenMounted', () => {
    render(<Brands />);
    
    // Check for responsive grid classes - adjust selectors based on actual implementation
    const testimonialsGrid = document.querySelector('.grid-cols-1.md\\:grid-cols-3') ||
                             document.querySelector('.grid.grid-cols-1');
    expect(testimonialsGrid).toBeInTheDocument();
    
    const metricsGrid = document.querySelector('.grid-cols-2.md\\:grid-cols-4') ||
                       document.querySelector('.grid.grid-cols-2');
    expect(metricsGrid).toBeInTheDocument();
  });

  test('Brands_shouldHaveDescriptiveText_whenMounted', () => {
    render(<Brands />);
    
    expect(screen.getByText(/Join hundreds of construction companies/)).toBeInTheDocument();
  });
});