import { render, screen, waitFor } from '@testing-library/react';
import { ProjectsSection } from './ProjectsSection';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from '@/contexts/NavigationContext';
import { ProjectServiceWithAuth } from '@/services/ProjectService';
import { ProjectDto, PagedResponse } from '@/services/dtos';
import '@testing-library/jest-dom';

// Mock the dependencies
jest.mock('@/contexts/AuthContext');
jest.mock('@/contexts/NavigationContext');
jest.mock('@/services/ProjectService');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>;
const MockedProjectServiceWithAuth = ProjectServiceWithAuth as jest.MockedClass<typeof ProjectServiceWithAuth>;

describe('ProjectsSection', () => {
  const mockUser = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    registered: true,
    contactDto: {
      id: '1',
      firstName: 'Test',
      lastName: 'User',
      labels: [],
      email: 'test@example.com',
      phone: '',
      addressDto: {
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

  const mockProjects: ProjectDto[] = [
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
  ];

  const mockPagedResponse: PagedResponse<ProjectDto> = {
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
      const mockGetProjectsByBuilderIdPaginated = jest.fn(() => new Promise(() => {}));
      MockedProjectServiceWithAuth.mockImplementation(() => ({
        getProjectsByBuilderIdPaginated: mockGetProjectsByBuilderIdPaginated,
        getProjectsByOwnerIdPaginated: jest.fn(),
        createProject: jest.fn(),
        getProjectsByBuilderId: jest.fn(),
        getProjectsByOwnerId: jest.fn(),
      }) as any);

      render(<ProjectsSection />);

      // Should show loading skeletons
      const cards = screen.getAllByRole('generic').filter(el => 
        el.className.includes('animate-pulse')
      );
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe('Success State - Projects Loaded', () => {
    beforeEach(() => {
      const mockGetProjectsByBuilderIdPaginated = jest.fn().mockResolvedValue(mockPagedResponse);
      MockedProjectServiceWithAuth.mockImplementation(() => ({
        getProjectsByBuilderIdPaginated: mockGetProjectsByBuilderIdPaginated,
        getProjectsByOwnerIdPaginated: jest.fn(),
        createProject: jest.fn(),
        getProjectsByBuilderId: jest.fn(),
        getProjectsByOwnerId: jest.fn(),
      }) as any);
    });

    test('renders section title by default', async () => {
      render(<ProjectsSection />);

      await waitFor(() => {
        expect(screen.getByText('My Projects')).toBeInTheDocument();
      });
    });

    test('renders custom title when provided', async () => {
      render(<ProjectsSection title="Builder Projects" />);

      await waitFor(() => {
        expect(screen.getByText('Builder Projects')).toBeInTheDocument();
      });
    });

    test('renders description when provided', async () => {
      render(<ProjectsSection description="View all your construction projects" />);

      await waitFor(() => {
        expect(screen.getByText('View all your construction projects')).toBeInTheDocument();
      });
    });

    test('displays projects after successful fetch', async () => {
      render(<ProjectsSection />);

      await waitFor(() => {
        expect(screen.getByText('123 Main St, Vancouver, BC')).toBeInTheDocument();
        expect(screen.getByText(/Unit 302, 456 Oak Ave, Toronto, ON/)).toBeInTheDocument();
      });
    });

    test('displays Create Project button when showCreateAction is true', async () => {
      render(<ProjectsSection showCreateAction={true} />);

      await waitFor(() => {
        const createButtons = screen.getAllByText('Create Project');
        expect(createButtons.length).toBeGreaterThan(0);
      });
    });

    test('hides Create Project button when showCreateAction is false', async () => {
      render(<ProjectsSection showCreateAction={false} />);

      await waitFor(() => {
        expect(screen.queryByText('Create Project')).not.toBeInTheDocument();
      });
    });

    test('displays pagination info', async () => {
      render(<ProjectsSection />);

      await waitFor(() => {
        expect(screen.getByText(/Showing 2 of 2 projects/)).toBeInTheDocument();
      });
    });
  });

  describe('Empty State', () => {
    beforeEach(() => {
      const emptyResponse: PagedResponse<ProjectDto> = {
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

      const mockGetProjectsByBuilderIdPaginated = jest.fn().mockResolvedValue(emptyResponse);
      MockedProjectServiceWithAuth.mockImplementation(() => ({
        getProjectsByBuilderIdPaginated: mockGetProjectsByBuilderIdPaginated,
        getProjectsByOwnerIdPaginated: jest.fn(),
        createProject: jest.fn(),
        getProjectsByBuilderId: jest.fn(),
        getProjectsByOwnerId: jest.fn(),
      }) as any);
    });

    test('displays empty state when no projects exist', async () => {
      render(<ProjectsSection />);

      await waitFor(() => {
        expect(screen.getByText('No Projects Yet')).toBeInTheDocument();
        expect(screen.getByText(/Get started by creating your first construction project/)).toBeInTheDocument();
      });
    });

    test('displays Create Project button in empty state when showCreateAction is true', async () => {
      render(<ProjectsSection showCreateAction={true} />);

      await waitFor(() => {
        expect(screen.getByText('Create Project')).toBeInTheDocument();
      });
    });

    test('hides Create Project button in empty state when showCreateAction is false', async () => {
      render(<ProjectsSection showCreateAction={false} />);

      await waitFor(() => {
        expect(screen.queryByText('Create Project')).not.toBeInTheDocument();
      });
    });
  });

  describe('Error State', () => {
    beforeEach(() => {
      const mockGetProjectsByBuilderIdPaginated = jest.fn().mockRejectedValue(new Error('Network error'));
      MockedProjectServiceWithAuth.mockImplementation(() => ({
        getProjectsByBuilderIdPaginated: mockGetProjectsByBuilderIdPaginated,
        getProjectsByOwnerIdPaginated: jest.fn(),
        createProject: jest.fn(),
        getProjectsByBuilderId: jest.fn(),
        getProjectsByOwnerId: jest.fn(),
      }) as any);
    });

    test('displays error state when fetch fails', async () => {
      render(<ProjectsSection />);

      await waitFor(() => {
        expect(screen.getByText('Error Loading Projects')).toBeInTheDocument();
        expect(screen.getByText('Failed to load projects. Please try again later.')).toBeInTheDocument();
      });
    });

    test('displays retry button in error state', async () => {
      render(<ProjectsSection />);

      await waitFor(() => {
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });
    });
  });

  describe('Filter by Role', () => {
    test('fetches builder projects when filterByRole is "builder"', async () => {
      const mockGetProjectsByBuilderIdPaginated = jest.fn().mockResolvedValue(mockPagedResponse);
      const mockGetProjectsByOwnerIdPaginated = jest.fn();
      
      MockedProjectServiceWithAuth.mockImplementation(() => ({
        getProjectsByBuilderIdPaginated: mockGetProjectsByBuilderIdPaginated,
        getProjectsByOwnerIdPaginated: mockGetProjectsByOwnerIdPaginated,
        createProject: jest.fn(),
        getProjectsByBuilderId: jest.fn(),
        getProjectsByOwnerId: jest.fn(),
      }) as any);

      render(<ProjectsSection filterByRole="builder" />);

      await waitFor(() => {
        expect(mockGetProjectsByBuilderIdPaginated).toHaveBeenCalledWith('1', undefined);
        expect(mockGetProjectsByOwnerIdPaginated).not.toHaveBeenCalled();
      });
    });

    test('fetches owner projects when filterByRole is "owner"', async () => {
      const mockGetProjectsByBuilderIdPaginated = jest.fn();
      const mockGetProjectsByOwnerIdPaginated = jest.fn().mockResolvedValue(mockPagedResponse);
      
      MockedProjectServiceWithAuth.mockImplementation(() => ({
        getProjectsByBuilderIdPaginated: mockGetProjectsByBuilderIdPaginated,
        getProjectsByOwnerIdPaginated: mockGetProjectsByOwnerIdPaginated,
        createProject: jest.fn(),
        getProjectsByBuilderId: jest.fn(),
        getProjectsByOwnerId: jest.fn(),
      }) as any);

      render(<ProjectsSection filterByRole="owner" />);

      await waitFor(() => {
        expect(mockGetProjectsByOwnerIdPaginated).toHaveBeenCalledWith('1', undefined);
        expect(mockGetProjectsByBuilderIdPaginated).not.toHaveBeenCalled();
      });
    });

    test('fetches builder projects by default when no filterByRole is specified', async () => {
      const mockGetProjectsByBuilderIdPaginated = jest.fn().mockResolvedValue(mockPagedResponse);
      const mockGetProjectsByOwnerIdPaginated = jest.fn();
      
      MockedProjectServiceWithAuth.mockImplementation(() => ({
        getProjectsByBuilderIdPaginated: mockGetProjectsByBuilderIdPaginated,
        getProjectsByOwnerIdPaginated: mockGetProjectsByOwnerIdPaginated,
        createProject: jest.fn(),
        getProjectsByBuilderId: jest.fn(),
        getProjectsByOwnerId: jest.fn(),
      }) as any);

      render(<ProjectsSection />);

      await waitFor(() => {
        expect(mockGetProjectsByBuilderIdPaginated).toHaveBeenCalledWith('1', undefined);
        expect(mockGetProjectsByOwnerIdPaginated).not.toHaveBeenCalled();
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

      const mockGetProjectsByBuilderIdPaginated = jest.fn();
      MockedProjectServiceWithAuth.mockImplementation(() => ({
        getProjectsByBuilderIdPaginated: mockGetProjectsByBuilderIdPaginated,
        getProjectsByOwnerIdPaginated: jest.fn(),
        createProject: jest.fn(),
        getProjectsByBuilderId: jest.fn(),
        getProjectsByOwnerId: jest.fn(),
      }) as any);

      render(<ProjectsSection />);

      await waitFor(() => {
        expect(mockGetProjectsByBuilderIdPaginated).not.toHaveBeenCalled();
      });
    });
  });

  describe('Pagination Parameters', () => {
    test('passes pagination parameters to service', async () => {
      const mockGetProjectsByBuilderIdPaginated = jest.fn().mockResolvedValue(mockPagedResponse);
      
      MockedProjectServiceWithAuth.mockImplementation(() => ({
        getProjectsByBuilderIdPaginated: mockGetProjectsByBuilderIdPaginated,
        getProjectsByOwnerIdPaginated: jest.fn(),
        createProject: jest.fn(),
        getProjectsByBuilderId: jest.fn(),
        getProjectsByOwnerId: jest.fn(),
      }) as any);

      const paginationParams = { page: 1, size: 10 };
      render(<ProjectsSection paginationParams={paginationParams} />);

      await waitFor(() => {
        expect(mockGetProjectsByBuilderIdPaginated).toHaveBeenCalledWith('1', paginationParams);
      });
    });
  });
});
