import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProjectsSection } from './ProjectsSection';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from '@/contexts/NavigationContext';
import { ProjectServiceWithAuth } from '@/services/project/projectServiceFactory';
import { Project, PagedResponse } from '@/services';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { MockedFunction } from 'vitest';

// Mock the dependencies
vi.mock('@/contexts/AuthContext');
vi.mock('@/contexts/NavigationContext');
vi.mock('@/services/project/projectServiceFactory', () => ({
  ProjectServiceWithAuth: vi.fn()
}));

const mockUseAuth = useAuth as MockedFunction<typeof useAuth>;
const mockUseNavigate = useNavigate as MockedFunction<typeof useNavigate>;
const MockedProjectServiceWithAuth = ProjectServiceWithAuth as unknown as MockedFunction<typeof ProjectServiceWithAuth>;

describe('ProjectsSection', () => {
  // Helper to render with router context
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  const mockUser = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    registered: true,
    contact: {
      id: '1',
      firstName: 'Test',
      lastName: 'User',
      labels: [],
      email: 'test@example.com',
      phone: '',
      address: {
        id: '1',
        unitNumber: '',
        streetNumberAndName: '',
        city: '',
        stateOrProvince: '',
        postalOrZipCode: '',
        country: ''
      }
    }
  };

  const mockNavigateToNewProject = vi.fn();

  const mockProjects: Project[] = [
    {
      id: '1',
      userId: '1',
      role: 'BUILDER',
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
      userId: '1',
      role: 'BUILDER',
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
  ];

  const mockPagedResponse: PagedResponse<Project> = {
    content: mockProjects,
    pagination: {
      page: 0,
      size: 25,
      totalElements: 2,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
      isFirst: true,
      isLast: true,
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseAuth.mockReturnValue({
      user: mockUser,
      token: 'mock-token',
      isAuthenticated: true,
      isLoading: false,
      role: 'USER',
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn(),
      getCurrentUser: vi.fn(),
    });

    mockUseNavigate.mockReturnValue({
      navigate: vi.fn(),
      goBack: vi.fn(),
      goForward: vi.fn(),
      scrollToSection: vi.fn(),
      navigateToAuth: vi.fn(),
      navigateToSignup: vi.fn(),
      navigateToLogin: vi.fn(),
      navigateToHome: vi.fn(),
      navigateToDashboard: vi.fn(),
      navigateToAdmin: vi.fn(),
      navigateToProjects: vi.fn(),
      navigateToNewProject: mockNavigateToNewProject,
      navigateToEstimates: vi.fn(),
      openExternalLink: vi.fn(),
    });
  });

  describe('Loading State', () => {
    test('displays loading skeletons while fetching data', () => {
      // Mock service to never resolve
      const mockGetProjectsByUserId = vi.fn(() => new Promise(() => {}));
      MockedProjectServiceWithAuth.mockImplementation(function() {
        return {
          getProjectsByUserId: mockGetProjectsByUserId,
          createProject: vi.fn(),
          getProjectById: vi.fn(),
        };
      });

      renderWithRouter(<ProjectsSection />);

      // Should show loading skeletons
      const cards = screen.getAllByRole('generic').filter(el => 
        el.className.includes('animate-pulse')
      );
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe('Success State - Projects Loaded', () => {
    beforeEach(() => {
      const mockGetProjectsByUserId = vi.fn().mockResolvedValue(mockPagedResponse);
      MockedProjectServiceWithAuth.mockImplementation(function() {
        return {
          getProjectsByUserId: mockGetProjectsByUserId,
          createProject: vi.fn(),
          getProjectById: vi.fn(),
        };
      });
    });

    test('renders section title by default', async () => {
      renderWithRouter(<ProjectsSection />);

      await waitFor(() => {
        expect(screen.getByText('Projects')).toBeInTheDocument();
      });
    });

    test('renders custom title when provided', async () => {
      renderWithRouter(<ProjectsSection title="Builder Projects" />);

      await waitFor(() => {
        expect(screen.getByText('Builder Projects')).toBeInTheDocument();
      });
    });

    test('renders description when provided', async () => {
      renderWithRouter(<ProjectsSection description="View all your construction projects" />);

      await waitFor(() => {
        expect(screen.getByText('View all your construction projects')).toBeInTheDocument();
      });
    });

    test('displays projects after successful fetch', async () => {
      renderWithRouter(<ProjectsSection />);

      await waitFor(() => {
        expect(screen.getByText('123 Main St, Vancouver, BC')).toBeInTheDocument();
        expect(screen.getByText(/Unit 302, 456 Oak Ave, Toronto, ON/)).toBeInTheDocument();
      });
    });

    test('displays Export and Filter buttons when projects exist', async () => {
      renderWithRouter(<ProjectsSection showCreateAction={true} />);

      await waitFor(() => {
        expect(screen.getByText('Export')).toBeInTheDocument();
        expect(screen.getByText('Filter')).toBeInTheDocument();
      });
    });

    test('does not display Create Project button when projects exist', async () => {
      renderWithRouter(<ProjectsSection showCreateAction={true} />);

      await waitFor(() => {
        expect(screen.queryByText('Create Project')).not.toBeInTheDocument();
      });
    });

    test('displays pagination info', async () => {
      renderWithRouter(<ProjectsSection />);

      await waitFor(() => {
        expect(screen.getByText(/Showing 2 of 2 projects/)).toBeInTheDocument();
      });
    });
  });

  describe('Empty State', () => {
    beforeEach(() => {
      const emptyResponse: PagedResponse<Project> = {
        content: [],
        pagination: {
          page: 0,
          size: 25,
          totalElements: 0,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false,
          isFirst: true,
          isLast: true,
        }
      };

      const mockGetProjectsByUserId = vi.fn().mockResolvedValue(emptyResponse);
      MockedProjectServiceWithAuth.mockImplementation(function() {
        return {
          getProjectsByUserId: mockGetProjectsByUserId,
          createProject: vi.fn(),
          getProjectById: vi.fn(),
        };
      });
    });

    test('displays empty state when no projects exist', async () => {
      renderWithRouter(<ProjectsSection />);

      await waitFor(() => {
        expect(screen.getByText('No Projects Yet')).toBeInTheDocument();
        expect(screen.getByText(/Get started by creating your first construction project/)).toBeInTheDocument();
      });
    });

    test('displays Create Project button in empty state when showCreateAction is true', async () => {
      renderWithRouter(<ProjectsSection showCreateAction={true} />);

      await waitFor(() => {
        expect(screen.getByText('Create Project')).toBeInTheDocument();
      });
    });

    test('hides Create Project button in empty state when showCreateAction is false', async () => {
      renderWithRouter(<ProjectsSection showCreateAction={false} />);

      await waitFor(() => {
        expect(screen.queryByText('Create Project')).not.toBeInTheDocument();
      });
    });

    test('calls navigateToNewProject when Create Project button is clicked', async () => {
      renderWithRouter(<ProjectsSection showCreateAction={true} />);

      await waitFor(() => {
        expect(screen.getByText('Create Project')).toBeInTheDocument();
      });

      const createButton = screen.getByText('Create Project');
      fireEvent.click(createButton);

      expect(mockNavigateToNewProject).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error State', () => {
    beforeEach(() => {
      const mockGetProjectsByUserId = vi.fn().mockRejectedValue(new Error('Network error'));
      MockedProjectServiceWithAuth.mockImplementation(function() {
        return {
          getProjectsByUserId: mockGetProjectsByUserId,
          createProject: vi.fn(),
          getProjectById: vi.fn(),
        };
      });
    });

    test('displays error state when fetch fails', async () => {
      renderWithRouter(<ProjectsSection />);

      await waitFor(() => {
        expect(screen.getByText('Error Loading Projects')).toBeInTheDocument();
        expect(screen.getByText('Failed to load projects. Please try again later.')).toBeInTheDocument();
      });
    });

    test('displays retry button in error state', async () => {
      renderWithRouter(<ProjectsSection />);

      await waitFor(() => {
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });
    });

    test('retry button refetches data without page reload', async () => {
      const mockGetProjectsByUserId = vi.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(mockPagedResponse);
      
      MockedProjectServiceWithAuth.mockImplementation(function() {
        return {
          getProjectsByUserId: mockGetProjectsByUserId,
          createProject: vi.fn(),
          getProjectById: vi.fn(),
        };
      });

      renderWithRouter(<ProjectsSection />);

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByText('Error Loading Projects')).toBeInTheDocument();
      });

      // Click retry button
      const retryButton = screen.getByText('Retry');
      fireEvent.click(retryButton);

      // Verify the function was called twice (initial + retry)
      await waitFor(() => {
        expect(mockGetProjectsByUserId).toHaveBeenCalledTimes(2);
      });

      // Verify projects are now displayed
      await waitFor(() => {
        expect(screen.getByText('123 Main St, Vancouver, BC')).toBeInTheDocument();
      });
    });
  });

  describe('Filter by Role', () => {
    test('fetches builder projects when filterByRole is "builder"', async () => {
      const mockGetProjectsByUserId = vi.fn().mockResolvedValue(mockPagedResponse);
      
      MockedProjectServiceWithAuth.mockImplementation(function() {
        return {
          getProjectsByUserId: mockGetProjectsByUserId,
          createProject: vi.fn(),
          getProjectById: vi.fn(),
        };
      });

      renderWithRouter(<ProjectsSection filterByRole="builder" />);

      await waitFor(() => {
        expect(mockGetProjectsByUserId).toHaveBeenCalledWith('1', expect.any(Object), undefined);
      });
    });

    test('fetches owner projects when filterByRole is "owner"', async () => {
      const mockGetProjectsByUserId = vi.fn().mockResolvedValue(mockPagedResponse);
      
      MockedProjectServiceWithAuth.mockImplementation(function() {
        return {
          getProjectsByUserId: mockGetProjectsByUserId,
          createProject: vi.fn(),
          getProjectById: vi.fn(),
        };
      });

      renderWithRouter(<ProjectsSection filterByRole="owner" />);

      await waitFor(() => {
        expect(mockGetProjectsByUserId).toHaveBeenCalledWith('1', expect.any(Object), undefined);
      });
    });

    test('fetches combined projects by default when no filterByRole is specified', async () => {
      const mockGetProjectsByUserId = vi.fn().mockResolvedValue(mockPagedResponse);
      
      MockedProjectServiceWithAuth.mockImplementation(function() {
        return {
          getProjectsByUserId: mockGetProjectsByUserId,
          createProject: vi.fn(),
          getProjectById: vi.fn(),
        };
      });

      renderWithRouter(<ProjectsSection />);

      await waitFor(() => {
        expect(mockGetProjectsByUserId).toHaveBeenCalledWith('1', expect.any(Object), undefined);
      });
    });

    test('filters projects by BUILDER role on client side', async () => {
      const mixedProjects: Project[] = [
        { ...mockProjects[0], role: 'BUILDER' },
        { ...mockProjects[1], role: 'OWNER' },
      ];

      const mixedResponse: PagedResponse<Project> = {
        ...mockPagedResponse,
        content: mixedProjects,
      };

      const mockGetProjectsByUserId = vi.fn().mockResolvedValue(mixedResponse);
      MockedProjectServiceWithAuth.mockImplementation(function() {
        return {
          getProjectsByUserId: mockGetProjectsByUserId,
          createProject: vi.fn(),
          getProjectById: vi.fn(),
        };
      });

      renderWithRouter(<ProjectsSection filterByRole="builder" />);

      await waitFor(() => {
        expect(screen.getByText('123 Main St, Vancouver, BC')).toBeInTheDocument();
      });

      // OWNER project should not be shown
      expect(screen.queryByText(/Unit 302, 456 Oak Ave, Toronto, ON/)).not.toBeInTheDocument();
    });
  });

  describe('Authentication', () => {
    test('does not fetch projects when user is not authenticated', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        role: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        refreshToken: vi.fn(),
        getCurrentUser: vi.fn(),
      });

      const mockGetProjectsByUserId = vi.fn();
      MockedProjectServiceWithAuth.mockImplementation(function() {
        return {
          getProjectsByUserId: mockGetProjectsByUserId,
          createProject: vi.fn(),
          getProjectById: vi.fn(),
        };
      });

      renderWithRouter(<ProjectsSection />);

      await waitFor(() => {
        expect(mockGetProjectsByUserId).not.toHaveBeenCalled();
      });
    });
  });

  describe('Pagination Parameters', () => {
    test('passes pagination parameters to service', async () => {
      const mockGetProjectsByUserId = vi.fn().mockResolvedValue(mockPagedResponse);
      
      MockedProjectServiceWithAuth.mockImplementation(function() {
        return {
          getProjectsByUserId: mockGetProjectsByUserId,
          createProject: vi.fn(),
          getProjectById: vi.fn(),
        };
      });

      renderWithRouter(<ProjectsSection />);

      await waitFor(() => {
        // Verify the service was called with userId, pagination params, and date filter
        expect(mockGetProjectsByUserId).toHaveBeenCalledWith('1', expect.objectContaining({
          page: expect.any(Number),
          size: expect.any(Number),
        }), undefined);
      });
    });
  });

  describe('Progressive Loading', () => {
    test('shows pagination info when projects are loaded', async () => {
      const response: PagedResponse<Project> = {
        content: mockProjects,
        pagination: {
          page: 0,
          size: 5,
          totalElements: 10,
          totalPages: 2,
          hasNext: true,
          hasPrevious: false,
          isFirst: true,
          isLast: false,
        }
      };

      const mockGetProjectsByUserId = vi.fn().mockResolvedValue(response);
      MockedProjectServiceWithAuth.mockImplementation(function() {
        return {
          getProjectsByUserId: mockGetProjectsByUserId,
          createProject: vi.fn(),
          getProjectById: vi.fn(),
        };
      });

      renderWithRouter(<ProjectsSection />);

      await waitFor(() => {
        expect(screen.getByText(/Showing 2 of 10 projects/)).toBeDefined();
      });
    });

    test('shows Load More button when more projects are available', async () => {
      const response: PagedResponse<Project> = {
        content: mockProjects,
        pagination: {
          page: 0,
          size: 5,
          totalElements: 10,
          totalPages: 2,
          hasNext: true,
          hasPrevious: false,
          isFirst: true,
          isLast: false,
        }
      };

      const mockGetProjectsByUserId = vi.fn().mockResolvedValue(response);
      MockedProjectServiceWithAuth.mockImplementation(function() {
        return {
          getProjectsByUserId: mockGetProjectsByUserId,
          createProject: vi.fn(),
          getProjectById: vi.fn(),
        };
      });

      renderWithRouter(<ProjectsSection />);

      await waitFor(() => {
        expect(screen.getByText('Load More')).toBeDefined();
      });
    });

    test('Load More button fetches next page', async () => {
      const firstPageResponse: PagedResponse<Project> = {
        content: mockProjects.slice(0, 1),
        pagination: {
          page: 0,
          size: 1,
          totalElements: 2,
          totalPages: 2,
          hasNext: true,
          hasPrevious: false,
          isFirst: true,
          isLast: false,
        }
      };

      const secondPageResponse: PagedResponse<Project> = {
        content: mockProjects.slice(1, 2),
        pagination: {
          page: 1,
          size: 1,
          totalElements: 2,
          totalPages: 2,
          hasNext: false,
          hasPrevious: true,
          isFirst: false,
          isLast: true,
        }
      };

      const mockGetProjectsByUserId = vi.fn()
        .mockResolvedValueOnce(firstPageResponse)
        .mockResolvedValueOnce(secondPageResponse);
        
      MockedProjectServiceWithAuth.mockImplementation(function() {
        return {
          getProjectsByUserId: mockGetProjectsByUserId,
          createProject: vi.fn(),
          getProjectById: vi.fn(),
        };
      });

      renderWithRouter(<ProjectsSection />);

      // Wait for first page to load
      await waitFor(() => {
        expect(screen.getByText('Load More')).toBeDefined();
      });

      // Click Load More
      const loadMoreButton = screen.getByText('Load More');
      fireEvent.click(loadMoreButton);

      // Verify second page was requested
      await waitFor(() => {
        expect(mockGetProjectsByUserId).toHaveBeenCalledTimes(2);
        expect(mockGetProjectsByUserId).toHaveBeenCalledWith('1', expect.objectContaining({
          page: 1
        }), undefined);
      });
    });

    test('hides Load More button when all projects are loaded', async () => {
      const response: PagedResponse<Project> = {
        content: mockProjects,
        pagination: {
          page: 0,
          size: 25,
          totalElements: 2,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
          isFirst: true,
          isLast: true,
        }
      };

      const mockGetProjectsByUserId = vi.fn().mockResolvedValue(response);
      MockedProjectServiceWithAuth.mockImplementation(function() {
        return {
          getProjectsByUserId: mockGetProjectsByUserId,
          createProject: vi.fn(),
          getProjectById: vi.fn(),
        };
      });

      renderWithRouter(<ProjectsSection />);

      await waitFor(() => {
        expect(screen.getByText('123 Main St, Vancouver, BC')).toBeInTheDocument();
      });

      expect(screen.queryByText('Load More')).not.toBeInTheDocument();
    });
  });

  describe('Export Functionality', () => {
    test('shows export button when projects exist', async () => {
      const mockGetProjectsByUserId = vi.fn().mockResolvedValue(mockPagedResponse);
      MockedProjectServiceWithAuth.mockImplementation(function() {
        return {
          getProjectsByUserId: mockGetProjectsByUserId,
          createProject: vi.fn(),
          getProjectById: vi.fn(),
        };
      });

      renderWithRouter(<ProjectsSection />);

      await waitFor(() => {
        expect(screen.getByText('Export')).toBeInTheDocument();
      });
    });

    test('hides export button when no projects exist', async () => {
      const emptyResponse: PagedResponse<Project> = {
        content: [],
        pagination: {
          page: 0,
          size: 25,
          totalElements: 0,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false,
          isFirst: true,
          isLast: true,
        }
      };

      const mockGetProjectsByUserId = vi.fn().mockResolvedValue(emptyResponse);
      MockedProjectServiceWithAuth.mockImplementation(function() {
        return {
          getProjectsByUserId: mockGetProjectsByUserId,
          createProject: vi.fn(),
          getProjectById: vi.fn(),
        };
      });

      renderWithRouter(<ProjectsSection />);

      await waitFor(() => {
        expect(screen.getByText('No Projects Yet')).toBeInTheDocument();
      });

      expect(screen.queryByText('Export')).not.toBeInTheDocument();
    });
  });

  describe('Filter Functionality', () => {
    test('opens filter sheet when Filter button is clicked', async () => {
      const mockGetProjectsByUserId = vi.fn().mockResolvedValue(mockPagedResponse);
      MockedProjectServiceWithAuth.mockImplementation(function() {
        return {
          getProjectsByUserId: mockGetProjectsByUserId,
          createProject: vi.fn(),
          getProjectById: vi.fn(),
        };
      });

      renderWithRouter(<ProjectsSection />);

      await waitFor(() => {
        expect(screen.getByText('Filter')).toBeInTheDocument();
      });

      const filterButton = screen.getByText('Filter');
      fireEvent.click(filterButton);

      await waitFor(() => {
        expect(screen.getByText('Filter Projects')).toBeInTheDocument();
      });
    });

    test('displays filter options in the sheet', async () => {
      const mockGetProjectsByUserId = vi.fn().mockResolvedValue(mockPagedResponse);
      MockedProjectServiceWithAuth.mockImplementation(function() {
        return {
          getProjectsByUserId: mockGetProjectsByUserId,
          createProject: vi.fn(),
          getProjectById: vi.fn(),
        };
      });

      renderWithRouter(<ProjectsSection />);

      await waitFor(() => {
        expect(screen.getByText('Filter')).toBeInTheDocument();
      });

      const filterButton = screen.getByText('Filter');
      fireEvent.click(filterButton);

      await waitFor(() => {
        expect(screen.getByText('Builder or Owner')).toBeInTheDocument();
        expect(screen.getByText('Builder only')).toBeInTheDocument();
        expect(screen.getByText('Owner only')).toBeInTheDocument();
        expect(screen.getByLabelText('Filter by created after date')).toBeInTheDocument();
        expect(screen.getByLabelText('Filter by created before date')).toBeInTheDocument();
      });
    });

    test('closes filter sheet when Cancel button is clicked', async () => {
      const mockGetProjectsByUserId = vi.fn().mockResolvedValue(mockPagedResponse);
      MockedProjectServiceWithAuth.mockImplementation(function() {
        return {
          getProjectsByUserId: mockGetProjectsByUserId,
          createProject: vi.fn(),
          getProjectById: vi.fn(),
        };
      });

      renderWithRouter(<ProjectsSection />);

      await waitFor(() => {
        expect(screen.getByText('Filter')).toBeInTheDocument();
      });

      const filterButton = screen.getByText('Filter');
      fireEvent.click(filterButton);

      await waitFor(() => {
        expect(screen.getByText('Cancel')).toBeInTheDocument();
      });

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      // Wait for the filter sheet to close
      await waitFor(() => {
        expect(screen.queryByText('Filter Projects')).not.toBeInTheDocument();
      });
    });
  });


});
