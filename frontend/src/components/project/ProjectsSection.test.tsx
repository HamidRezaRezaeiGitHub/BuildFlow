import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProjectsSection } from './ProjectsSection';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from '@/contexts/NavigationContext';
import { ProjectServiceWithAuth } from '@/services/ProjectService';
import { Project, PagedResponse } from '@/services/dtos';
import '@testing-library/jest-dom';

// Mock the dependencies
jest.mock('@/contexts/AuthContext');
jest.mock('@/contexts/NavigationContext');
jest.mock('@/services/ProjectService');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>;
const MockedProjectServiceWithAuth = ProjectServiceWithAuth as jest.MockedClass<typeof ProjectServiceWithAuth>;

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

  const mockNavigateToNewProject = jest.fn();

  const mockProjects: Project[] = [
    {
      id: '1',
      userId: '1',
      role: 'BUILDER',
      participants: [
        { id: 'p1', role: 'OWNER', contactId: '2' }
      ],
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
      participants: [
        { id: 'p2', role: 'OWNER', contactId: '3' }
      ],
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
    jest.clearAllMocks();
    
    mockUseAuth.mockReturnValue({
      user: mockUser,
      token: 'mock-token',
      isAuthenticated: true,
      isLoading: false,
      role: 'USER',
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
      getCurrentUser: jest.fn(),
    });

    mockUseNavigate.mockReturnValue({
      navigate: jest.fn(),
      goBack: jest.fn(),
      goForward: jest.fn(),
      scrollToSection: jest.fn(),
      navigateToAuth: jest.fn(),
      navigateToSignup: jest.fn(),
      navigateToLogin: jest.fn(),
      navigateToHome: jest.fn(),
      navigateToDashboard: jest.fn(),
      navigateToAdmin: jest.fn(),
      navigateToProjects: jest.fn(),
      navigateToNewProject: mockNavigateToNewProject,
      navigateToEstimates: jest.fn(),
      openExternalLink: jest.fn(),
    });
  });

  describe('Loading State', () => {
    test('displays loading skeletons while fetching data', () => {
      // Mock service to never resolve
      const mockGetCombinedProjectsPaginated = jest.fn(() => new Promise(() => {}));
      MockedProjectServiceWithAuth.mockImplementation(() => ({
        getProjectsByBuilderIdPaginated: jest.fn(),
        getProjectsByOwnerIdPaginated: jest.fn(),
        getCombinedProjectsPaginated: mockGetCombinedProjectsPaginated,
        createProject: jest.fn(),
        getProjectsByBuilderId: jest.fn(),
        getProjectsByOwnerId: jest.fn(),
      }) as any);

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
      const mockGetCombinedProjectsPaginated = jest.fn().mockResolvedValue(mockPagedResponse);
      MockedProjectServiceWithAuth.mockImplementation(() => ({
        getProjectsByBuilderIdPaginated: jest.fn(),
        getProjectsByOwnerIdPaginated: jest.fn(),
        getCombinedProjectsPaginated: mockGetCombinedProjectsPaginated,
        createProject: jest.fn(),
        getProjectsByBuilderId: jest.fn(),
        getProjectsByOwnerId: jest.fn(),
      }) as any);
    });

    test('renders section title by default', async () => {
      renderWithRouter(<ProjectsSection />);

      await waitFor(() => {
        expect(screen.getByText('My Projects')).toBeInTheDocument();
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

      const mockGetCombinedProjectsPaginated = jest.fn().mockResolvedValue(emptyResponse);
      MockedProjectServiceWithAuth.mockImplementation(() => ({
        getProjectsByBuilderIdPaginated: jest.fn(),
        getProjectsByOwnerIdPaginated: jest.fn(),
        getCombinedProjectsPaginated: mockGetCombinedProjectsPaginated,
        createProject: jest.fn(),
        getProjectsByBuilderId: jest.fn(),
        getProjectsByOwnerId: jest.fn(),
      }) as any);
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
  });

  describe('Error State', () => {
    beforeEach(() => {
      const mockGetCombinedProjectsPaginated = jest.fn().mockRejectedValue(new Error('Network error'));
      MockedProjectServiceWithAuth.mockImplementation(() => ({
        getProjectsByBuilderIdPaginated: jest.fn(),
        getProjectsByOwnerIdPaginated: jest.fn(),
        getCombinedProjectsPaginated: mockGetCombinedProjectsPaginated,
        createProject: jest.fn(),
        getProjectsByBuilderId: jest.fn(),
        getProjectsByOwnerId: jest.fn(),
      }) as any);
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
      const mockGetCombinedProjectsPaginated = jest.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(mockPagedResponse);
      
      MockedProjectServiceWithAuth.mockImplementation(() => ({
        getProjectsByBuilderIdPaginated: jest.fn(),
        getProjectsByOwnerIdPaginated: jest.fn(),
        getCombinedProjectsPaginated: mockGetCombinedProjectsPaginated,
        createProject: jest.fn(),
        getProjectsByBuilderId: jest.fn(),
        getProjectsByOwnerId: jest.fn(),
      }) as any);

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
        expect(mockGetCombinedProjectsPaginated).toHaveBeenCalledTimes(2);
      });

      // Verify projects are now displayed
      await waitFor(() => {
        expect(screen.getByText('123 Main St, Vancouver, BC')).toBeInTheDocument();
      });
    });
  });

  describe('Filter by Role', () => {
    test('fetches builder projects when filterByRole is "builder"', async () => {
      const mockGetCombinedProjectsPaginated = jest.fn().mockResolvedValue(mockPagedResponse);
      
      MockedProjectServiceWithAuth.mockImplementation(() => ({
        getProjectsByBuilderIdPaginated: jest.fn(),
        getProjectsByOwnerIdPaginated: jest.fn(),
        getCombinedProjectsPaginated: mockGetCombinedProjectsPaginated,
        createProject: jest.fn(),
        getProjectsByBuilderId: jest.fn(),
        getProjectsByOwnerId: jest.fn(),
      }) as any);

      renderWithRouter(<ProjectsSection filterByRole="builder" />);

      await waitFor(() => {
        expect(mockGetCombinedProjectsPaginated).toHaveBeenCalledWith('1', 'builder', undefined, undefined, undefined);
      });
    });

    test('fetches owner projects when filterByRole is "owner"', async () => {
      const mockGetCombinedProjectsPaginated = jest.fn().mockResolvedValue(mockPagedResponse);
      
      MockedProjectServiceWithAuth.mockImplementation(() => ({
        getProjectsByBuilderIdPaginated: jest.fn(),
        getProjectsByOwnerIdPaginated: jest.fn(),
        getCombinedProjectsPaginated: mockGetCombinedProjectsPaginated,
        createProject: jest.fn(),
        getProjectsByBuilderId: jest.fn(),
        getProjectsByOwnerId: jest.fn(),
      }) as any);

      renderWithRouter(<ProjectsSection filterByRole="owner" />);

      await waitFor(() => {
        expect(mockGetCombinedProjectsPaginated).toHaveBeenCalledWith('1', 'owner', undefined, undefined, undefined);
      });
    });

    test('fetches combined projects by default when no filterByRole is specified', async () => {
      const mockGetCombinedProjectsPaginated = jest.fn().mockResolvedValue(mockPagedResponse);
      
      MockedProjectServiceWithAuth.mockImplementation(() => ({
        getProjectsByBuilderIdPaginated: jest.fn(),
        getProjectsByOwnerIdPaginated: jest.fn(),
        getCombinedProjectsPaginated: mockGetCombinedProjectsPaginated,
        createProject: jest.fn(),
        getProjectsByBuilderId: jest.fn(),
        getProjectsByOwnerId: jest.fn(),
      }) as any);

      renderWithRouter(<ProjectsSection />);

      await waitFor(() => {
        expect(mockGetCombinedProjectsPaginated).toHaveBeenCalledWith('1', 'both', undefined, undefined, undefined);
      });
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
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        refreshToken: jest.fn(),
        getCurrentUser: jest.fn(),
      });

      const mockGetCombinedProjectsPaginated = jest.fn();
      MockedProjectServiceWithAuth.mockImplementation(() => ({
        getProjectsByBuilderIdPaginated: jest.fn(),
        getProjectsByOwnerIdPaginated: jest.fn(),
        getCombinedProjectsPaginated: mockGetCombinedProjectsPaginated,
        createProject: jest.fn(),
        getProjectsByBuilderId: jest.fn(),
        getProjectsByOwnerId: jest.fn(),
      }) as any);

      renderWithRouter(<ProjectsSection />);

      await waitFor(() => {
        expect(mockGetCombinedProjectsPaginated).not.toHaveBeenCalled();
      });
    });
  });

  describe('Pagination Parameters', () => {
    test('passes pagination parameters to service', async () => {
      const mockGetCombinedProjectsPaginated = jest.fn().mockResolvedValue(mockPagedResponse);
      
      MockedProjectServiceWithAuth.mockImplementation(() => ({
        getProjectsByBuilderIdPaginated: jest.fn(),
        getProjectsByOwnerIdPaginated: jest.fn(),
        getCombinedProjectsPaginated: mockGetCombinedProjectsPaginated,
        createProject: jest.fn(),
        getProjectsByBuilderId: jest.fn(),
        getProjectsByOwnerId: jest.fn(),
      }) as any);

      const paginationParams = { page: 1, size: 10 };
      renderWithRouter(<ProjectsSection paginationParams={paginationParams} />);

      await waitFor(() => {
        expect(mockGetCombinedProjectsPaginated).toHaveBeenCalledWith('1', 'both', undefined, undefined, paginationParams);
      });
    });
  });

  describe('Progressive Loading', () => {
    test('initially displays only 3 projects when more are available', async () => {
      const manyProjects: Project[] = Array.from({ length: 10 }, (_, i) => ({
        id: String(i + 1),
        userId: '1',
        role: 'BUILDER',
        participants: [],
        location: {
          id: String(i + 1),
          unitNumber: '',
          streetNumberAndName: `${i + 1} Test St`,
          city: 'Vancouver',
          stateOrProvince: 'BC',
          postalOrZipCode: 'V5K 1A1',
          country: 'Canada',
        },
        createdAt: '2024-01-15T10:30:00Z',
        lastUpdatedAt: '2024-10-20T14:20:00Z',
      }));

      const largeResponse: PagedResponse<Project> = {
        content: manyProjects,
        pagination: {
          page: 0,
          size: 25,
          totalElements: 10,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
          isFirst: true,
          isLast: true,
        }
      };

      const mockGetCombinedProjectsPaginated = jest.fn().mockResolvedValue(largeResponse);
      MockedProjectServiceWithAuth.mockImplementation(() => ({
        getProjectsByBuilderIdPaginated: jest.fn(),
        getProjectsByOwnerIdPaginated: jest.fn(),
        getCombinedProjectsPaginated: mockGetCombinedProjectsPaginated,
        createProject: jest.fn(),
        getProjectsByBuilderId: jest.fn(),
        getProjectsByOwnerId: jest.fn(),
      }) as any);

      renderWithRouter(<ProjectsSection initialDisplayCount={3} />);

      await waitFor(() => {
        const displayedText = screen.getByText(/Showing 3 of 10 projects/);
        expect(displayedText).toBeInTheDocument();
      });
    });

    test('shows Load More button when more projects are available', async () => {
      const manyProjects: Project[] = Array.from({ length: 10 }, (_, i) => ({
        id: String(i + 1),
        userId: '1',
        role: 'BUILDER',
        participants: [],
        location: {
          id: String(i + 1),
          unitNumber: '',
          streetNumberAndName: `${i + 1} Test St`,
          city: 'Vancouver',
          stateOrProvince: 'BC',
          postalOrZipCode: 'V5K 1A1',
          country: 'Canada',
        },
        createdAt: '2024-01-15T10:30:00Z',
        lastUpdatedAt: '2024-10-20T14:20:00Z',
      }));

      const largeResponse: PagedResponse<Project> = {
        content: manyProjects,
        pagination: {
          page: 0,
          size: 25,
          totalElements: 10,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
          isFirst: true,
          isLast: true,
        }
      };

      const mockGetCombinedProjectsPaginated = jest.fn().mockResolvedValue(largeResponse);
      MockedProjectServiceWithAuth.mockImplementation(() => ({
        getProjectsByBuilderIdPaginated: jest.fn(),
        getProjectsByOwnerIdPaginated: jest.fn(),
        getCombinedProjectsPaginated: mockGetCombinedProjectsPaginated,
        createProject: jest.fn(),
        getProjectsByBuilderId: jest.fn(),
        getProjectsByOwnerId: jest.fn(),
      }) as any);

      renderWithRouter(<ProjectsSection initialDisplayCount={3} />);

      await waitFor(() => {
        expect(screen.getByText('Load More')).toBeInTheDocument();
      });
    });

    test('Load More button increases displayed projects', async () => {
      const manyProjects: Project[] = Array.from({ length: 10 }, (_, i) => ({
        id: String(i + 1),
        userId: '1',
        role: 'BUILDER',
        participants: [],
        location: {
          id: String(i + 1),
          unitNumber: '',
          streetNumberAndName: `${i + 1} Test St`,
          city: 'Vancouver',
          stateOrProvince: 'BC',
          postalOrZipCode: 'V5K 1A1',
          country: 'Canada',
        },
        createdAt: '2024-01-15T10:30:00Z',
        lastUpdatedAt: '2024-10-20T14:20:00Z',
      }));

      const largeResponse: PagedResponse<Project> = {
        content: manyProjects,
        pagination: {
          page: 0,
          size: 25,
          totalElements: 10,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
          isFirst: true,
          isLast: true,
        }
      };

      const mockGetCombinedProjectsPaginated = jest.fn().mockResolvedValue(largeResponse);
      MockedProjectServiceWithAuth.mockImplementation(() => ({
        getProjectsByBuilderIdPaginated: jest.fn(),
        getProjectsByOwnerIdPaginated: jest.fn(),
        getCombinedProjectsPaginated: mockGetCombinedProjectsPaginated,
        createProject: jest.fn(),
        getProjectsByBuilderId: jest.fn(),
        getProjectsByOwnerId: jest.fn(),
      }) as any);

      renderWithRouter(<ProjectsSection initialDisplayCount={3} />);

      await waitFor(() => {
        expect(screen.getByText(/Showing 3 of 10 projects/)).toBeInTheDocument();
      });

      const loadMoreButton = screen.getByText('Load More');
      fireEvent.click(loadMoreButton);

      await waitFor(() => {
        expect(screen.getByText(/Showing 6 of 10 projects/)).toBeInTheDocument();
      });
    });
  });
});
