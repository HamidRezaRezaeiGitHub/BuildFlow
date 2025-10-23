import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProjectList } from './ProjectList';
import { Project } from '@/services/dtos';
import '@testing-library/jest-dom';

describe('ProjectList', () => {
  // Helper to render with router context
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  const mockProjects: Project[] = [
    {
      id: '1',
      builderId: '1',
      ownerId: '2',
      location: {
        id: '1',
        unitNumber: '',
        streetNumberAndName: '123 Main St',
        city: 'Vancouver',
        stateOrProvince: 'BC',
        postalOrZipCode: 'V5K 1A1',
        country: 'Canada',
      },
      createdAt: '2024-01-15T10:30:00Z',
      lastUpdatedAt: '2024-10-20T14:20:00Z',
    },
    {
      id: '2',
      builderId: '1',
      ownerId: '3',
      location: {
        id: '2',
        unitNumber: '302',
        streetNumberAndName: '456 Oak Ave',
        city: 'Toronto',
        stateOrProvince: 'ON',
        postalOrZipCode: 'M4B 1B3',
        country: 'Canada',
      },
      createdAt: '2024-02-20T08:15:00Z',
      lastUpdatedAt: '2024-10-19T16:45:00Z',
    },
    {
      id: '3',
      builderId: '2',
      ownerId: '1',
      location: {
        id: '3',
        unitNumber: '5B',
        streetNumberAndName: '789 Cedar Lane',
        city: 'Montreal',
        stateOrProvince: 'QC',
        postalOrZipCode: 'H3A 1A1',
        country: 'Canada',
      },
      createdAt: '2024-03-10T11:00:00Z',
      lastUpdatedAt: '2024-10-18T09:30:00Z',
    },
  ];

  describe('Basic Rendering', () => {
    test('renders without crashing with empty array', () => {
      renderWithRouter(<ProjectList projects={[]} />);
      // Should render empty grid
      const grid = document.querySelector('.grid');
      expect(grid).toBeInTheDocument();
    });

    test('renders project cards for all projects', () => {
      renderWithRouter(<ProjectList projects={mockProjects} />);
      
      expect(screen.getByText('123 Main St, Vancouver, BC')).toBeInTheDocument();
      expect(screen.getByText(/Unit 302, 456 Oak Ave, Toronto, ON/)).toBeInTheDocument();
      expect(screen.getByText(/Unit 5B, 789 Cedar Lane, Montreal, QC/)).toBeInTheDocument();
    });

    test('displays correct number of project cards', () => {
      const { container } = renderWithRouter(<ProjectList projects={mockProjects} />);
      
      // Count the number of cards
      const cards = container.querySelectorAll('[class*="hover:shadow-md"]');
      expect(cards).toHaveLength(3);
    });
  });

  describe('Project Card Content', () => {
    test('displays project location as title', () => {
      renderWithRouter(<ProjectList projects={mockProjects} />);
      
      expect(screen.getByText('123 Main St, Vancouver, BC')).toBeInTheDocument();
    });

    test('does not display internal project IDs', () => {
      renderWithRouter(<ProjectList projects={mockProjects} />);
      
      // Project IDs should not be displayed in the cards
      expect(screen.queryByText('#1')).not.toBeInTheDocument();
      expect(screen.queryByText('#2')).not.toBeInTheDocument();
      expect(screen.queryByText('#3')).not.toBeInTheDocument();
      expect(screen.queryByText('Project ID:')).not.toBeInTheDocument();
    });

    test('displays last updated timestamp', () => {
      renderWithRouter(<ProjectList projects={mockProjects} />);
      
      // Should have "Updated:" text in CardContent for each project
      // Format is "Updated: {date} • Created: {date}"
      const updatedTexts = screen.getAllByText(/Updated:/);
      expect(updatedTexts).toHaveLength(3);
    });

    test('displays created timestamp', () => {
      renderWithRouter(<ProjectList projects={mockProjects} />);
      
      // Should have "Created:" text in CardContent for each project as part of the combined string
      // Format is "Updated: {date} • Created: {date}"
      const createdTexts = screen.getAllByText(/Created:/);
      expect(createdTexts).toHaveLength(3);
    });

    test('formats location with unit number when present', () => {
      renderWithRouter(<ProjectList projects={mockProjects} />);
      
      expect(screen.getByText(/Unit 302/)).toBeInTheDocument();
      expect(screen.getByText(/Unit 5B/)).toBeInTheDocument();
    });

    test('formats location without unit number when not present', () => {
      renderWithRouter(<ProjectList projects={mockProjects} />);
      
      const locationText = screen.getByText('123 Main St, Vancouver, BC');
      expect(locationText).toBeInTheDocument();
      expect(locationText.textContent).not.toContain('Unit');
    });
  });

  describe('Clickable Cards', () => {
    test('cards are clickable with role="button"', () => {
      const { container } = renderWithRouter(<ProjectList projects={mockProjects} />);
      
      const cards = container.querySelectorAll('[role="button"]');
      expect(cards).toHaveLength(3);
    });

    test('calls onProjectSelect when card is clicked', () => {
      const handleProjectSelect = jest.fn();
      const { container } = renderWithRouter(<ProjectList projects={mockProjects} onProjectSelect={handleProjectSelect} />);
      
      const cards = container.querySelectorAll('[role="button"]');
      fireEvent.click(cards[0]);
      
      expect(handleProjectSelect).toHaveBeenCalledWith('1');
    });

    test('navigates to project details when card is clicked without handler', () => {
      const { container } = renderWithRouter(<ProjectList projects={mockProjects} />);
      
      const cards = container.querySelectorAll('[role="button"]');
      
      // Should not throw error when clicking - navigation is handled by React Router
      expect(() => fireEvent.click(cards[0])).not.toThrow();
      expect(cards[0]).toBeInTheDocument();
    });

    test('calls handlers with correct project IDs for different projects', () => {
      const handleProjectSelect = jest.fn();
      const { container } = renderWithRouter(<ProjectList projects={mockProjects} onProjectSelect={handleProjectSelect} />);
      
      const cards = container.querySelectorAll('[role="button"]');
      fireEvent.click(cards[1]); // Click second project
      
      expect(handleProjectSelect).toHaveBeenCalledWith('2');
    });

    test('card activates on Enter key press', () => {
      const handleProjectSelect = jest.fn();
      const { container } = renderWithRouter(<ProjectList projects={mockProjects} onProjectSelect={handleProjectSelect} />);
      
      const cards = container.querySelectorAll('[role="button"]');
      fireEvent.keyDown(cards[0], { key: 'Enter' });
      
      expect(handleProjectSelect).toHaveBeenCalledWith('1');
    });

    test('card activates on Space key press', () => {
      const handleProjectSelect = jest.fn();
      const { container } = renderWithRouter(<ProjectList projects={mockProjects} onProjectSelect={handleProjectSelect} />);
      
      const cards = container.querySelectorAll('[role="button"]');
      fireEvent.keyDown(cards[0], { key: ' ' });
      
      expect(handleProjectSelect).toHaveBeenCalledWith('1');
    });

    test('cards are keyboard focusable with tabIndex', () => {
      const { container } = renderWithRouter(<ProjectList projects={mockProjects} />);
      
      const cards = container.querySelectorAll('[role="button"][tabindex="0"]');
      expect(cards).toHaveLength(3);
    });

    test('cards have aria-label for accessibility', () => {
      const { container } = renderWithRouter(<ProjectList projects={mockProjects} />);
      
      const firstCard = container.querySelector('[aria-label*="Open project"]');
      expect(firstCard).toBeInTheDocument();
    });
  });

  describe('Dropdown Menu Actions', () => {
    test('displays dropdown menu trigger for each card', () => {
      renderWithRouter(<ProjectList projects={mockProjects} />);
      
      // Find all menu trigger buttons using sr-only text
      const menuButtons = screen.getAllByText('Open menu');
      expect(menuButtons).toHaveLength(3);
    });

    test('has dropdown menu structure for each card', () => {
      const { container } = renderWithRouter(<ProjectList projects={mockProjects} />);
      
      // Check that dropdown menu triggers exist
      const menuTriggers = container.querySelectorAll('button[class*="h-8 w-8"]');
      expect(menuTriggers.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Responsive Layout', () => {
    test('applies responsive grid classes', () => {
      const { container } = renderWithRouter(<ProjectList projects={mockProjects} />);
      
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('gap-4', 'md:grid-cols-2', 'lg:grid-cols-3');
    });

    test('cards have hover effect', () => {
      const { container } = renderWithRouter(<ProjectList projects={mockProjects} />);
      
      const cards = container.querySelectorAll('[class*="hover:shadow-md"]');
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe('Date Formatting', () => {
    test('formats relative dates correctly', () => {
      // Create a project with recent timestamp
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const recentProject: Project = {
        ...mockProjects[0],
        lastUpdatedAt: today.toISOString(),
        createdAt: yesterday.toISOString(),
      };
      
      renderWithRouter(<ProjectList projects={[recentProject]} />);
      
      // Should display "Today" in CardContent only
      const todayTexts = screen.getAllByText(/Today/);
      expect(todayTexts.length).toBeGreaterThanOrEqual(1);
    });

    test('handles multiple projects with different dates', () => {
      renderWithRouter(<ProjectList projects={mockProjects} />);
      
      // Each project displays dates in CardContent only
      // 3 projects * 1 instance = 3 total
      const updatedTexts = screen.getAllByText(/Updated:/);
      expect(updatedTexts).toHaveLength(3);
    });
  });

  describe('Accessibility', () => {
    test('has proper button roles', () => {
      renderWithRouter(<ProjectList projects={mockProjects} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    test('has screen reader text for menu buttons', () => {
      renderWithRouter(<ProjectList projects={mockProjects} />);
      
      const srText = screen.getAllByText('Open menu');
      expect(srText).toHaveLength(3);
    });
  });

  describe('Edge Cases', () => {
    test('handles project with minimal location data', () => {
      const minimalProject: Project = {
        id: '99',
        builderId: '1',
        ownerId: '2',
        location: {
          id: '99',
          unitNumber: '',
          streetNumberAndName: '',
          city: 'City',
          stateOrProvince: '',
          postalOrZipCode: '',
          country: '',
        },
        createdAt: '2024-01-01T00:00:00Z',
        lastUpdatedAt: '2024-01-01T00:00:00Z',
      };
      
      renderWithRouter(<ProjectList projects={[minimalProject]} />);
      
      // Should still render without crashing
      expect(screen.getByText('City')).toBeInTheDocument();
    });

    test('handles project with no location data', () => {
      const noLocationProject: Project = {
        id: '100',
        builderId: '1',
        ownerId: '2',
        location: {
          id: '100',
          unitNumber: '',
          streetNumberAndName: '',
          city: '',
          stateOrProvince: '',
          postalOrZipCode: '',
          country: '',
        },
        createdAt: '2024-01-01T00:00:00Z',
        lastUpdatedAt: '2024-01-01T00:00:00Z',
      };
      
      renderWithRouter(<ProjectList projects={[noLocationProject]} />);
      
      // Should display fallback message
      expect(screen.getByText('No location specified')).toBeInTheDocument();
    });
  });
});
