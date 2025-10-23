import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NewProject } from './NewProject';
import { useAuth } from '@/contexts/AuthContext';
import { projectService } from '@/services';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn()
}));

jest.mock('@/services', () => ({
  projectService: {
    createProject: jest.fn()
  }
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockCreateProject = projectService.createProject as jest.MockedFunction<typeof projectService.createProject>;

// Mock user for testing
const mockUser = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  registered: true,
  contact: {
    id: 'c1',
    firstName: 'Test',
    lastName: 'User',
    labels: [],
    email: 'test@example.com',
    phone: '+1234567890',
    address: {
      id: 'a1',
      unitNumber: '',
      streetNumberAndName: '123 Test St',
      city: 'Test City',
      stateOrProvince: 'TS',
      postalOrZipCode: '12345',
      country: 'Test Country'
    }
  }
};

describe('NewProject - Multi-Step Accordion Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseAuth.mockReturnValue({
      user: mockUser,
      token: 'mock-token',
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      refreshToken: jest.fn(),
      getCurrentUser: jest.fn(),
      isLoading: false,
      role: 'USER'
    });
  });

  const renderPage = () => {
    return render(
      <BrowserRouter>
        <NewProject />
      </BrowserRouter>
    );
  };

  describe('Initial Render', () => {
    it('renders the page with accordion steps', () => {
      renderPage();
      
      expect(screen.getByText(/Create New Project/i)).toBeInTheDocument();
      expect(screen.getByText(/Your Role/i)).toBeInTheDocument();
      expect(screen.getByText(/Owner Information/i)).toBeInTheDocument();
      expect(screen.getByText(/Project Location/i)).toBeInTheDocument();
    });

    it('starts with Step 1 expanded', () => {
      renderPage();
      
      // Step 1 should be visible with role selection buttons
      expect(screen.getByRole('button', { name: /Builder/i })).toBeVisible();
      expect(screen.getByRole('button', { name: /Owner/i })).toBeVisible();
    });
  });

  describe('Step 1: User Role Selection', () => {
    it('allows selecting builder role', async () => {
      const user = userEvent.setup();
      renderPage();

      const builderButton = screen.getByRole('button', { name: /Builder/i });
      await user.click(builderButton);

      expect(builderButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('allows selecting owner role', async () => {
      const user = userEvent.setup();
      renderPage();

      const ownerButton = screen.getByRole('button', { name: /Owner/i });
      await user.click(ownerButton);

      expect(ownerButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('shows Next button in Step 1', () => {
      renderPage();
      
      const nextButtons = screen.getAllByRole('button', { name: /Next/i });
      expect(nextButtons.length).toBeGreaterThan(0);
    });

    it('does not show Previous button in Step 1', () => {
      renderPage();
      
      // Only one Next button should be visible (from Step 1)
      const nextButtons = screen.getAllByRole('button', { name: /Next/i });
      const previousButtons = screen.queryAllByRole('button', { name: /Previous/i });
      
      // Previous buttons should not be visible initially
      expect(previousButtons.length).toBe(0);
    });
  });

  describe('Step 2: Other Party Information', () => {
    it('shows Owner information form when user is Builder', async () => {
      const user = userEvent.setup();
      renderPage();

      // Select Builder role
      await user.click(screen.getByRole('button', { name: /Builder/i }));
      
      // Click Next to go to Step 2
      const nextButtons = screen.getAllByRole('button', { name: /Next/i });
      await user.click(nextButtons[0]);

      // Wait for Step 2 to expand
      await waitFor(() => {
        expect(screen.getByText(/Owner Information/i)).toBeVisible();
      });
    });

    it('shows Builder information form when user is Owner', async () => {
      const user = userEvent.setup();
      renderPage();

      // Select Owner role
      await user.click(screen.getByRole('button', { name: /Owner/i }));
      
      // Click Next to go to Step 2
      const nextButtons = screen.getAllByRole('button', { name: /Next/i });
      await user.click(nextButtons[0]);

      // Wait for Step 2 to expand
      await waitFor(() => {
        expect(screen.getByText(/Builder Information/i)).toBeVisible();
      });
    });

    it('allows entering optional other party information', async () => {
      const user = userEvent.setup();
      renderPage();

      // Navigate to Step 2
      const nextButtons = screen.getAllByRole('button', { name: /Next/i });
      await user.click(nextButtons[0]);

      await waitFor(() => {
        expect(screen.getByLabelText(/First Name/i)).toBeVisible();
      });

      // Enter information
      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');

      expect(screen.getByLabelText(/First Name/i)).toHaveValue('John');
      expect(screen.getByLabelText(/Last Name/i)).toHaveValue('Doe');
      expect(screen.getByLabelText(/Email/i)).toHaveValue('john@example.com');
    });

    it('shows Previous and Next buttons in Step 2', async () => {
      const user = userEvent.setup();
      renderPage();

      // Navigate to Step 2
      const nextButtons = screen.getAllByRole('button', { name: /Next/i });
      await user.click(nextButtons[0]);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Previous/i })).toBeVisible();
        expect(screen.getByRole('button', { name: /Next/i })).toBeVisible();
      });
    });

    it('navigates back to Step 1 when Previous is clicked', async () => {
      const user = userEvent.setup();
      renderPage();

      // Navigate to Step 2
      const nextButtons = screen.getAllByRole('button', { name: /Next/i });
      await user.click(nextButtons[0]);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Previous/i })).toBeVisible();
      });

      // Click Previous
      await user.click(screen.getByRole('button', { name: /Previous/i }));

      // Should be back at Step 1 with role selection visible
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Builder/i })).toBeVisible();
      });
    });
  });

  describe('Step 3: Project Location', () => {
    it('shows address fields in Step 3', async () => {
      const user = userEvent.setup();
      renderPage();

      // Navigate through steps to Step 3
      let nextButtons = screen.getAllByRole('button', { name: /Next/i });
      await user.click(nextButtons[0]); // Step 1 -> Step 2
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Previous/i })).toBeVisible();
      });

      nextButtons = screen.getAllByRole('button', { name: /Next/i });
      await user.click(nextButtons[0]); // Step 2 -> Step 3

      await waitFor(() => {
        expect(screen.getByLabelText(/Street Number & Name/i)).toBeVisible();
      });

      expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Province\/State/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
    });

    it('shows Previous, Cancel, and Create Project buttons in Step 3', async () => {
      const user = userEvent.setup();
      renderPage();

      // Navigate to Step 3
      const nextButtons = screen.getAllByRole('button', { name: /Next/i });
      await user.click(nextButtons[0]);
      
      await waitFor(() => {
        const buttons = screen.getAllByRole('button', { name: /Next/i });
        user.click(buttons[0]);
      });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Previous/i })).toBeVisible();
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeVisible();
        expect(screen.getByRole('button', { name: /Create Project/i })).toBeVisible();
      });
    });

    it('disables Create Project button when required fields are empty', async () => {
      const user = userEvent.setup();
      renderPage();

      // Navigate to Step 3
      const nextButtons = screen.getAllByRole('button', { name: /Next/i });
      await user.click(nextButtons[0]);
      
      await waitFor(() => {
        const buttons = screen.getAllByRole('button', { name: /Next/i });
        user.click(buttons[0]);
      });

      await waitFor(() => {
        const createButton = screen.getByRole('button', { name: /Create Project/i });
        expect(createButton).toBeDisabled();
      });
    });

    it('enables Create Project button when all required fields are filled', async () => {
      const user = userEvent.setup();
      renderPage();

      // Navigate to Step 3
      let nextButtons = screen.getAllByRole('button', { name: /Next/i });
      await user.click(nextButtons[0]);
      
      await waitFor(() => {
        nextButtons = screen.getAllByRole('button', { name: /Next/i });
      });
      await user.click(nextButtons[0]);

      await waitFor(() => {
        expect(screen.getByLabelText(/Street Number & Name/i)).toBeVisible();
      });

      // Fill required address fields
      await user.type(screen.getByLabelText(/Street Number & Name/i), '123 Main St');
      await user.type(screen.getByLabelText(/City/i), 'Toronto');
      await user.type(screen.getByLabelText(/Province\/State/i), 'ON');
      await user.type(screen.getByLabelText(/Country/i), 'Canada');

      await waitFor(() => {
        const createButton = screen.getByRole('button', { name: /Create Project/i });
        expect(createButton).not.toBeDisabled();
      });
    });
  });

  describe('State Persistence', () => {
    it('retains role selection when navigating between steps', async () => {
      const user = userEvent.setup();
      renderPage();

      // Select Owner role
      await user.click(screen.getByRole('button', { name: /Owner/i }));

      // Navigate to Step 2
      let nextButtons = screen.getAllByRole('button', { name: /Next/i });
      await user.click(nextButtons[0]);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Previous/i })).toBeVisible();
      });

      // Navigate back to Step 1
      await user.click(screen.getByRole('button', { name: /Previous/i }));

      await waitFor(() => {
        const ownerButton = screen.getByRole('button', { name: /Owner/i });
        expect(ownerButton).toHaveAttribute('aria-pressed', 'true');
      });
    });

    it('retains other party information when navigating between steps', async () => {
      const user = userEvent.setup();
      renderPage();

      // Navigate to Step 2
      let nextButtons = screen.getAllByRole('button', { name: /Next/i });
      await user.click(nextButtons[0]);

      await waitFor(() => {
        expect(screen.getByLabelText(/First Name/i)).toBeVisible();
      });

      // Enter information
      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Email/i), 'john@test.com');

      // Navigate to Step 3
      nextButtons = screen.getAllByRole('button', { name: /Next/i });
      await user.click(nextButtons[0]);

      await waitFor(() => {
        expect(screen.getByLabelText(/Street Number & Name/i)).toBeVisible();
      });

      // Navigate back to Step 2
      await user.click(screen.getByRole('button', { name: /Previous/i }));

      await waitFor(() => {
        expect(screen.getByLabelText(/First Name/i)).toHaveValue('John');
        expect(screen.getByLabelText(/Email/i)).toHaveValue('john@test.com');
      });
    });
  });

  describe('Form Submission', () => {
    it('submits the correct request when Create Project is clicked', async () => {
      const user = userEvent.setup();
      mockCreateProject.mockResolvedValue({
        project: {
          id: 'project-123',
          builderId: '1',
          ownerId: '2',
          location: {
            id: 'loc-1',
            streetNumberAndName: '123 Main St',
            city: 'Toronto',
            stateOrProvince: 'ON',
            country: 'Canada'
          },
          createdAt: '2024-01-01T00:00:00Z',
          lastUpdatedAt: '2024-01-01T00:00:00Z'
        }
      });

      renderPage();

      // Select builder role
      await user.click(screen.getByRole('button', { name: /Builder/i }));

      // Navigate to Step 3
      let nextButtons = screen.getAllByRole('button', { name: /Next/i });
      await user.click(nextButtons[0]);
      
      await waitFor(() => {
        nextButtons = screen.getAllByRole('button', { name: /Next/i });
      });
      await user.click(nextButtons[0]);

      await waitFor(() => {
        expect(screen.getByLabelText(/Street Number & Name/i)).toBeVisible();
      });

      // Fill required fields
      await user.type(screen.getByLabelText(/Street Number & Name/i), '123 Main St');
      await user.type(screen.getByLabelText(/City/i), 'Toronto');
      await user.type(screen.getByLabelText(/Province\/State/i), 'ON');
      await user.type(screen.getByLabelText(/Country/i), 'Canada');

      await waitFor(() => {
        const createButton = screen.getByRole('button', { name: /Create Project/i });
        expect(createButton).not.toBeDisabled();
      });

      // Submit
      const createButton = screen.getByRole('button', { name: /Create Project/i });
      await user.click(createButton);

      await waitFor(() => {
        expect(mockCreateProject).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: mockUser.id,
            isBuilder: true,
            locationRequestDto: expect.objectContaining({
              streetNumberAndName: '123 Main St',
              city: 'Toronto',
              stateOrProvince: 'ON',
              country: 'Canada'
            })
          }),
          'mock-token'
        );
      });
    });
  });

  describe('Cancel Confirmation', () => {
    it('shows confirmation dialog when Cancel is clicked', async () => {
      const user = userEvent.setup();
      renderPage();

      // Navigate to Step 3
      let nextButtons = screen.getAllByRole('button', { name: /Next/i });
      await user.click(nextButtons[0]);
      
      await waitFor(() => {
        nextButtons = screen.getAllByRole('button', { name: /Next/i });
      });
      await user.click(nextButtons[0]);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeVisible();
      });

      // Click Cancel
      await user.click(screen.getByRole('button', { name: /Cancel/i }));

      await waitFor(() => {
        expect(screen.getByText(/Confirm Cancellation/i)).toBeInTheDocument();
        expect(screen.getByText(/Any information you've entered will be lost/i)).toBeInTheDocument();
      });
    });

    it('allows continuing editing from cancel confirmation', async () => {
      const user = userEvent.setup();
      renderPage();

      // Navigate to Step 3 and click Cancel
      let nextButtons = screen.getAllByRole('button', { name: /Next/i });
      await user.click(nextButtons[0]);
      
      await waitFor(() => {
        nextButtons = screen.getAllByRole('button', { name: /Next/i });
      });
      await user.click(nextButtons[0]);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeVisible();
      });

      await user.click(screen.getByRole('button', { name: /Cancel/i }));

      await waitFor(() => {
        expect(screen.getByText(/Confirm Cancellation/i)).toBeInTheDocument();
      });

      // Click Continue Editing
      await user.click(screen.getByRole('button', { name: /Continue Editing/i }));

      // Confirmation should be hidden
      await waitFor(() => {
        expect(screen.queryByText(/Confirm Cancellation/i)).not.toBeInTheDocument();
      });
    });
  });
});
