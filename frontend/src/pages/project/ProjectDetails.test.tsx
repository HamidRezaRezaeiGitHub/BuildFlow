import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProjectDetails } from './ProjectDetails';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectServiceWithAuth } from '@/services/ProjectService';
import { Project } from '@/services/dtos';
import '@testing-library/jest-dom';

// Mock the dependencies
jest.mock('@/contexts/AuthContext');
jest.mock('@/services/ProjectService');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const MockedProjectServiceWithAuth = ProjectServiceWithAuth as jest.MockedClass<typeof ProjectServiceWithAuth>;

describe('ProjectDetails', () => {
  // Helper to render with router context and route params
  const renderWithRouterAndParams = (projectId: string = '1') => {
    return render(
      <MemoryRouter initialEntries={[`/projects/${projectId}`]}>
        <Routes>
          <Route path="/projects/:id" element={<ProjectDetails />} />
        </Routes>
      </MemoryRouter>
    );
  };

  const mockProject: Project = {
    id: '1',
    builderId: '1',
    ownerId: '2',
    location: {
      id: '1',
      unitNumber: '302',
      streetNumberAndName: '123 Main St',
      city: 'Vancouver',
      stateOrProvince: 'BC',
      postalOrZipCode: 'V5K 1A1',
      country: 'Canada',
    },
    createdAt: '2024-01-15T10:30:00Z',
    lastUpdatedAt: '2024-10-20T14:20:00Z',
  };

  const mockGetProjectById = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseAuth.mockReturnValue({
      user: null,
      token: 'mock-token',
      isAuthenticated: true,
      isLoading: false,
      role: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
      getCurrentUser: jest.fn(),
    });

    MockedProjectServiceWithAuth.mockImplementation(() => ({
      getProjectById: mockGetProjectById,
      createProject: jest.fn(),
      getProjectsByBuilderId: jest.fn(),
      getProjectsByBuilderIdPaginated: jest.fn(),
      getProjectsByOwnerId: jest.fn(),
      getProjectsByOwnerIdPaginated: jest.fn(),
      getCombinedProjectsPaginated: jest.fn(),
    } as any));
  });

  describe('Loading State', () => {
    test('displays loading skeleton while fetching project', async () => {
      mockGetProjectById.mockImplementation(() => new Promise(() => {})); // Never resolves

      renderWithRouterAndParams('1');

      // Check for skeleton elements
      const skeletons = document.querySelectorAll('[class*="animate-pulse"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Error State', () => {
    test('displays error message when project fetch fails', async () => {
      mockGetProjectById.mockRejectedValue(new Error('Failed to load project'));

      renderWithRouterAndParams('1');

      await waitFor(() => {
        expect(screen.getByText(/Error Loading Project/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/Failed to load project/i)).toBeInTheDocument();
    });

    test('displays error when authentication token is missing', async () => {
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

      renderWithRouterAndParams('1');

      await waitFor(() => {
        expect(screen.getByText(/Error Loading Project/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/Authentication required/i)).toBeInTheDocument();
    });
  });

  describe('Success State', () => {
    test('displays project details when fetch succeeds', async () => {
      mockGetProjectById.mockResolvedValue(mockProject);

      renderWithRouterAndParams('1');

      await waitFor(() => {
        expect(screen.getByText(/123 Main St, Vancouver/i)).toBeInTheDocument();
      });
    });

    test('displays project summary information', async () => {
      mockGetProjectById.mockResolvedValue(mockProject);

      renderWithRouterAndParams('1');

      await waitFor(() => {
        expect(screen.getByText(/Project Summary/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/Builder ID/i)).toBeInTheDocument();
      expect(screen.getByText(/Owner ID/i)).toBeInTheDocument();
    });

    test('displays location information', async () => {
      mockGetProjectById.mockResolvedValue(mockProject);

      renderWithRouterAndParams('1');

      await waitFor(() => {
        expect(screen.getByText(/Location/i)).toBeInTheDocument();
      });

      expect(screen.getByText('123 Main St')).toBeInTheDocument();
      expect(screen.getByText('Vancouver')).toBeInTheDocument();
    });

    test('displays tabs for Overview, Estimates, and Work Items', async () => {
      mockGetProjectById.mockResolvedValue(mockProject);

      renderWithRouterAndParams('1');

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /Overview/i })).toBeInTheDocument();
      });

      expect(screen.getByRole('tab', { name: /Estimates/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Work Items/i })).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    test('displays Back, Edit, and Delete buttons', async () => {
      mockGetProjectById.mockResolvedValue(mockProject);

      renderWithRouterAndParams('1');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
    });
  });
});
