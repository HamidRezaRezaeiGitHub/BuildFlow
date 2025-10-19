import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StandardBottomNavbar } from './StandardNavbar';

// Mock the auth context
const mockLogout = jest.fn();

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    role: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    login: jest.fn(),
    register: jest.fn(),
    logout: mockLogout,
    refreshToken: jest.fn(),
    getCurrentUser: jest.fn(),
  }),
}));

// Mock the navigation context
const mockNavigateToDashboard = jest.fn();

jest.mock('@/contexts/NavigationContext', () => ({
  useNavigate: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    goForward: jest.fn(),
    scrollToSection: jest.fn(),
    navigateToAuth: jest.fn(),
    navigateToSignup: jest.fn(),
    navigateToLogin: jest.fn(),
    navigateToHome: jest.fn(),
    navigateToDashboard: mockNavigateToDashboard,
    navigateToAdmin: jest.fn(),
    navigateToProjects: jest.fn(),
    navigateToNewProject: jest.fn(),
    navigateToEstimates: jest.fn(),
    openExternalLink: jest.fn(),
  }),
}));

// Mock useMediaQuery hook
const mockUseMediaQuery = jest.fn();
jest.mock('@/utils/useMediaQuery', () => ({
  useMediaQuery: (query: string) => mockUseMediaQuery(query),
}));

describe('StandardBottomNavbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default to desktop view
    mockUseMediaQuery.mockReturnValue(false);
  });

  describe('Basic Rendering', () => {
    test('StandardBottomNavbar_shouldRenderWithDefaultProps', () => {
      render(<StandardBottomNavbar />);
      
      // Should render Projects button
      expect(screen.getByText('Projects')).toBeInTheDocument();
      
      // Should render More button
      expect(screen.getByText('More')).toBeInTheDocument();
      
      // Should render FAB
      expect(screen.getByLabelText(/Create new item/i)).toBeInTheDocument();
    });

    test('StandardBottomNavbar_shouldRenderWithThemeToggle', () => {
      render(<StandardBottomNavbar showThemeToggle={true} />);
      
      expect(screen.getByText('Projects')).toBeInTheDocument();
    });

    test('StandardBottomNavbar_shouldRenderWithoutThemeToggle', () => {
      render(<StandardBottomNavbar showThemeToggle={false} />);
      
      expect(screen.getByText('Projects')).toBeInTheDocument();
    });
  });

  describe('Navigation Integration', () => {
    test('StandardBottomNavbar_shouldNavigateToDashboardOnProjectsClick', () => {
      render(<StandardBottomNavbar />);
      
      const projectsButton = screen.getByText('Projects');
      fireEvent.click(projectsButton);
      
      expect(mockNavigateToDashboard).toHaveBeenCalledTimes(1);
    });

    test('StandardBottomNavbar_shouldUseCustomProjectsHandler', () => {
      const mockHandler = jest.fn();
      render(<StandardBottomNavbar onProjectsClick={mockHandler} />);
      
      const projectsButton = screen.getByText('Projects');
      fireEvent.click(projectsButton);
      
      expect(mockHandler).toHaveBeenCalledTimes(1);
      expect(mockNavigateToDashboard).not.toHaveBeenCalled();
    });
  });

  describe('Profile Handler', () => {
    test('StandardBottomNavbar_shouldLogProfileClickByDefault', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const user = userEvent.setup();
      
      // Mock mobile view for Sheet variant
      mockUseMediaQuery.mockReturnValue(true);
      
      render(<StandardBottomNavbar />);
      
      const moreButton = screen.getByText('More');
      await user.click(moreButton);
      
      await waitFor(() => {
        expect(screen.getByText('Profile')).toBeInTheDocument();
      });
      
      const profileButton = screen.getByText('Profile');
      await user.click(profileButton);
      
      expect(consoleSpy).toHaveBeenCalledWith('Profile clicked - Profile page not yet implemented');
      
      consoleSpy.mockRestore();
    });

    test('StandardBottomNavbar_shouldUseCustomProfileHandler', async () => {
      const mockHandler = jest.fn();
      const user = userEvent.setup();
      
      // Mock mobile view for Sheet variant
      mockUseMediaQuery.mockReturnValue(true);
      
      render(<StandardBottomNavbar onProfileClick={mockHandler} />);
      
      const moreButton = screen.getByText('More');
      await user.click(moreButton);
      
      await waitFor(() => {
        expect(screen.getByText('Profile')).toBeInTheDocument();
      });
      
      const profileButton = screen.getByText('Profile');
      await user.click(profileButton);
      
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Logout Handler', () => {
    test('StandardBottomNavbar_shouldUseAuthContextLogout', async () => {
      const user = userEvent.setup();
      
      // Mock mobile view for Sheet variant
      mockUseMediaQuery.mockReturnValue(true);
      
      render(<StandardBottomNavbar />);
      
      const moreButton = screen.getByText('More');
      await user.click(moreButton);
      
      await waitFor(() => {
        expect(screen.getByText('Log out')).toBeInTheDocument();
      });
      
      const logoutButton = screen.getByText('Log out');
      await user.click(logoutButton);
      
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    test('StandardBottomNavbar_shouldUseCustomLogoutHandler', async () => {
      const mockHandler = jest.fn();
      const user = userEvent.setup();
      
      // Mock mobile view for Sheet variant
      mockUseMediaQuery.mockReturnValue(true);
      
      render(<StandardBottomNavbar onLogoutClick={mockHandler} />);
      
      const moreButton = screen.getByText('More');
      await user.click(moreButton);
      
      await waitFor(() => {
        expect(screen.getByText('Log out')).toBeInTheDocument();
      });
      
      const logoutButton = screen.getByText('Log out');
      await user.click(logoutButton);
      
      expect(mockHandler).toHaveBeenCalledTimes(1);
      expect(mockLogout).not.toHaveBeenCalled();
    });
  });

  describe('Create Actions', () => {
    test('StandardBottomNavbar_shouldPassCreateProjectHandler', async () => {
      const mockHandler = jest.fn();
      const user = userEvent.setup();
      
      render(<StandardBottomNavbar onCreateNewProject={mockHandler} />);
      
      const fabButton = screen.getByLabelText(/Create new item/i);
      await user.click(fabButton);
      
      await waitFor(() => {
        expect(screen.getByText('Create New Project')).toBeInTheDocument();
      });
      
      const createButton = screen.getByText('Create New Project');
      await user.click(createButton);
      
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    test('StandardBottomNavbar_shouldPassCreateEstimateHandler', async () => {
      const mockHandler = jest.fn();
      const user = userEvent.setup();
      
      render(<StandardBottomNavbar onCreateNewEstimate={mockHandler} />);
      
      const fabButton = screen.getByLabelText(/Create new item/i);
      await user.click(fabButton);
      
      await waitFor(() => {
        expect(screen.getByText('Create New Estimate')).toBeInTheDocument();
      });
      
      const createButton = screen.getByText('Create New Estimate');
      await user.click(createButton);
      
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Props Forwarding', () => {
    test('StandardBottomNavbar_shouldForwardClassNameProp', () => {
      const { container } = render(<StandardBottomNavbar className="custom-class" />);
      
      // Find the bottom nav bar element
      const bottomNav = container.querySelector('.custom-class');
      expect(bottomNav).toBeInTheDocument();
    });

    test('StandardBottomNavbar_shouldForwardVisibilityProp', () => {
      const { container } = render(<StandardBottomNavbar isVisible={false} />);
      
      // Component should not render when isVisible is false
      expect(container.firstChild).toBeNull();
    });

    test('StandardBottomNavbar_shouldForwardShowFabProp', () => {
      render(<StandardBottomNavbar showFab={false} />);
      
      // FAB should not be present
      expect(screen.queryByLabelText(/Create new item/i)).not.toBeInTheDocument();
    });
  });
});
