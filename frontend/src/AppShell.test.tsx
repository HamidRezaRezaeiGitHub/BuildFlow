import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';

// Helper function to render AppShell with router (not full App)
const renderAppShell = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AppShell />
    </MemoryRouter>
  );
};

describe('AppShell', () => {
  test('renders navigation items', () => {
    renderAppShell();

    // Check that main navigation items are present (all appear in both desktop and mobile)
    expect(screen.getAllByText('BuildFlow')).toHaveLength(2); // Desktop sidebar + mobile top bar
    expect(screen.getAllByText('Projects').length).toBeGreaterThan(0); // Desktop + mobile
    expect(screen.getAllByText('Estimates').length).toBeGreaterThan(0); // Desktop + mobile
    expect(screen.getAllByText('Catalog').length).toBeGreaterThan(0); // Desktop + mobile
    expect(screen.getAllByText('Settings').length).toBeGreaterThan(0); // Desktop + mobile
  });

  test('renders skip to content link', () => {
    renderAppShell();

    const skipLink = screen.getByText('Skip to content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  test('renders responsive navigation elements', () => {
    renderAppShell();

    // Check that both desktop sidebar and mobile tabs are rendered
    // Both have role="navigation" and aria-label="Main navigation"
    const navigationElements = screen.getAllByRole('navigation', { name: 'Main navigation' });
    expect(navigationElements).toHaveLength(2); // Desktop sidebar + mobile bottom tabs
  });
});
