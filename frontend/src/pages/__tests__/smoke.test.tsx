import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ReactElement } from 'react';
import Projects from '../Projects';
import ProjectDetail from '../ProjectDetail';
import Estimates from '../Estimates';
import Catalog from '../Catalog';
import Settings from '../Settings';

// Helper function to render components with router
const renderWithRouter = (component: ReactElement, route = '/') => {
  return render(<MemoryRouter initialEntries={[route]}>{component}</MemoryRouter>);
};

describe('Page Smoke Tests', () => {
  test('Projects page renders without crashing', () => {
    renderWithRouter(<Projects />);
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(
      screen.getByText('Manage your construction projects and track progress')
    ).toBeInTheDocument();
    expect(screen.getByText('New Project')).toBeInTheDocument();
  });

  test('ProjectDetail page renders without crashing', () => {
    renderWithRouter(<ProjectDetail />, '/projects/123');
    expect(screen.getByText('Project')).toBeInTheDocument();
    expect(screen.getByText('Residential construction project')).toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
  });

  test('Estimates page renders without crashing', () => {
    renderWithRouter(<Estimates />);
    expect(screen.getByText('Estimates')).toBeInTheDocument();
    expect(screen.getByText('Create and manage project cost estimates')).toBeInTheDocument();
    expect(screen.getByText('New Estimate')).toBeInTheDocument();
  });

  test('Catalog page renders without crashing', () => {
    renderWithRouter(<Catalog />);
    expect(screen.getByText('Work Items Catalog')).toBeInTheDocument();
    expect(
      screen.getByText('Browse and manage your standard work items and pricing')
    ).toBeInTheDocument();
    expect(screen.getByText('Add Work Item')).toBeInTheDocument();
  });

  test('Settings page renders without crashing', () => {
    renderWithRouter(<Settings />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Manage your account and application preferences')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });
});
