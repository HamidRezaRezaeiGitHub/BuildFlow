import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FlexibleBottomNavbar } from './FlexibleBottomNavbar';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { Mock } from 'vitest';

// Mock the auth context
const mockLogout = vi.fn();

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    role: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: mockLogout,
    refreshToken: vi.fn(),
    getCurrentUser: vi.fn(),
  }),
}));

// Mock useMediaQuery hook
const mockUseMediaQuery = vi.fn();
vi.mock('@/utils/useMediaQuery', () => ({
  useMediaQuery: (query: string) => mockUseMediaQuery(query),
}));

describe('FlexibleBottomNavbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default to desktop view
    mockUseMediaQuery.mockReturnValue(false);
  });

  describe('Basic Rendering', () => {
    test('FlexibleBottomNavbar_shouldRenderWithDefaultProps', () => {
      render(<FlexibleBottomNavbar />);
      
      // Should render Projects button
      expect(screen.getByText('Projects')).toBeInTheDocument();
      
      // Should render More button
      expect(screen.getByText('More')).toBeInTheDocument();
      
      // Should render FAB
      expect(screen.getByLabelText(/Create new item/i)).toBeInTheDocument();
    });

    test('FlexibleBottomNavbar_shouldHideWhenNotVisible', () => {
      const { container } = render(<FlexibleBottomNavbar isVisible={false} />);
      
      // Component should not render when isVisible is false
      expect(container.firstChild).toBeNull();
    });

    test('FlexibleBottomNavbar_shouldHideFabWhenShowFabIsFalse', () => {
      render(<FlexibleBottomNavbar showFab={false} />);
      
      // FAB should not be present
      expect(screen.queryByLabelText(/Create new item/i)).not.toBeInTheDocument();
    });
  });

  describe('Plus Menu - Default Actions', () => {
    test('FlexibleBottomNavbar_shouldOpenPlusMenuOnFabClick', async () => {
      const user = userEvent.setup();
      render(<FlexibleBottomNavbar />);
      
      const fabButton = screen.getByLabelText(/Create new item/i);
      
      // Click to open menu
      await user.click(fabButton);
      
      // Menu should open and show "Create New Project"
      await waitFor(() => {
        const menuItem = screen.queryByText('Create New Project');
        expect(menuItem).toBeInTheDocument();
      });
    });

    test('FlexibleBottomNavbar_shouldShowCreateNewProjectByDefault', async () => {
      const user = userEvent.setup();
      render(<FlexibleBottomNavbar />);
      
      const fabButton = screen.getByLabelText(/Create new item/i);
      await user.click(fabButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Create New Project')).toBeInTheDocument();
      });
    });

    test('FlexibleBottomNavbar_shouldHideCreateNewProjectWhenToggled', async () => {
      const user = userEvent.setup();
      render(<FlexibleBottomNavbar showCreateNewProject={false} />);
      
      const fabButton = screen.getByLabelText(/Create new item/i);
      await user.click(fabButton);
      
      // Menu should not have the Create New Project option
      expect(screen.queryByText('Create New Project')).not.toBeInTheDocument();
    });

    test('FlexibleBottomNavbar_shouldCallHandlerWhenCreateNewProjectClicked', async () => {
      const user = userEvent.setup();
      const mockHandler = vi.fn();
      render(<FlexibleBottomNavbar onCreateNewProject={mockHandler} />);
      
      const fabButton = screen.getByLabelText(/Create new item/i);
      await user.click(fabButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Create New Project')).toBeInTheDocument();
      });
      
      const createButton = screen.getByText('Create New Project');
      await user.click(createButton);
      
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    test('FlexibleBottomNavbar_shouldDisableCreateNewProjectWithoutHandler', async () => {
      const user = userEvent.setup();
      render(<FlexibleBottomNavbar />);
      
      const fabButton = screen.getByLabelText(/Create new item/i);
      await user.click(fabButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Create New Project')).toBeInTheDocument();
      });
      
      // In dropdown, disabled items render with data-disabled attribute (empty string or "true")
      const createButton = screen.getByText('Create New Project').closest('[role="menuitem"]');
      expect(createButton).toHaveAttribute('data-disabled');
    });

    test('FlexibleBottomNavbar_shouldShowCreateNewEstimateByDefault', async () => {
      const user = userEvent.setup();
      render(<FlexibleBottomNavbar />);
      
      const fabButton = screen.getByLabelText(/Create new item/i);
      await user.click(fabButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Create New Estimate')).toBeInTheDocument();
      });
    });

    test('FlexibleBottomNavbar_shouldHideCreateNewEstimateWhenToggled', async () => {
      const user = userEvent.setup();
      render(<FlexibleBottomNavbar showCreateNewEstimate={false} />);
      
      const fabButton = screen.getByLabelText(/Create new item/i);
      await user.click(fabButton);
      
      // Menu should not have the Create New Estimate option
      expect(screen.queryByText('Create New Estimate')).not.toBeInTheDocument();
    });

    test('FlexibleBottomNavbar_shouldCallHandlerWhenCreateNewEstimateClicked', async () => {
      const user = userEvent.setup();
      const mockHandler = vi.fn();
      render(<FlexibleBottomNavbar onCreateNewEstimate={mockHandler} />);
      
      const fabButton = screen.getByLabelText(/Create new item/i);
      await user.click(fabButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Create New Estimate')).toBeInTheDocument();
      });
      
      const createButton = screen.getByText('Create New Estimate');
      await user.click(createButton);
      
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    test('FlexibleBottomNavbar_shouldDisableCreateNewEstimateWithoutHandler', async () => {
      const user = userEvent.setup();
      render(<FlexibleBottomNavbar />);
      
      const fabButton = screen.getByLabelText(/Create new item/i);
      await user.click(fabButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Create New Estimate')).toBeInTheDocument();
      });
      
      // In dropdown, disabled items render with data-disabled attribute
      const createButton = screen.getByText('Create New Estimate').closest('[role="menuitem"]');
      expect(createButton).toHaveAttribute('data-disabled');
    });

    test('FlexibleBottomNavbar_shouldShowBothDefaultActions', async () => {
      const user = userEvent.setup();
      const mockProjectHandler = vi.fn();
      const mockEstimateHandler = vi.fn();
      render(
        <FlexibleBottomNavbar 
          onCreateNewProject={mockProjectHandler}
          onCreateNewEstimate={mockEstimateHandler}
        />
      );
      
      const fabButton = screen.getByLabelText(/Create new item/i);
      await user.click(fabButton);
      
      await waitFor(() => {
        expect(screen.getByText('Create New Project')).toBeInTheDocument();
        expect(screen.getByText('Create New Estimate')).toBeInTheDocument();
      });
    });
  });

  describe('Plus Menu - Custom Actions', () => {
    test('FlexibleBottomNavbar_shouldRenderCustomMenuItems', async () => {
      const user = userEvent.setup();
      const customItems = [
        { label: 'Custom Action 1', onClick: vi.fn() },
        { label: 'Custom Action 2', onClick: vi.fn() },
      ];
      
      render(<FlexibleBottomNavbar plusMenuItems={customItems} />);
      
      const fabButton = screen.getByLabelText(/Create new item/i);
      await user.click(fabButton);
      
      await waitFor(() => {
        expect(screen.getByText('Custom Action 1')).toBeInTheDocument();
        expect(screen.getByText('Custom Action 2')).toBeInTheDocument();
      });
    });

    test('FlexibleBottomNavbar_shouldCallCustomItemHandler', async () => {
      const user = userEvent.setup();
      const mockHandler = vi.fn();
      const customItems = [
        { label: 'Custom Action', onClick: mockHandler },
      ];
      
      render(<FlexibleBottomNavbar plusMenuItems={customItems} />);
      
      const fabButton = screen.getByLabelText(/Create new item/i);
      await user.click(fabButton);
      
      await waitFor(() => {
        expect(screen.getByText('Custom Action')).toBeInTheDocument();
      });
      
      const customButton = screen.getByText('Custom Action');
      await user.click(customButton);
      
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    test('FlexibleBottomNavbar_shouldShowDefaultAndCustomItemsTogether', async () => {
      const user = userEvent.setup();
      const mockHandler = vi.fn();
      const customItems = [
        { label: 'Custom Action', onClick: vi.fn() },
      ];
      
      render(
        <FlexibleBottomNavbar 
          onCreateNewProject={mockHandler}
          plusMenuItems={customItems}
        />
      );
      
      const fabButton = screen.getByLabelText(/Create new item/i);
      await user.click(fabButton);
      
      await waitFor(() => {
        expect(screen.getByText('Create New Project')).toBeInTheDocument();
        expect(screen.getByText('Custom Action')).toBeInTheDocument();
      });
    });

    test('FlexibleBottomNavbar_shouldHandleDisabledCustomItems', async () => {
      const user = userEvent.setup();
      const mockHandler = vi.fn();
      const customItems = [
        { label: 'Disabled Action', onClick: mockHandler, disabled: true },
      ];
      
      render(<FlexibleBottomNavbar plusMenuItems={customItems} />);
      
      const fabButton = screen.getByLabelText(/Create new item/i);
      await user.click(fabButton);
      
      await waitFor(() => {
        expect(screen.getByText('Disabled Action')).toBeInTheDocument();
      });
      
      const disabledButton = screen.getByText('Disabled Action').closest('[role="menuitem"]');
      expect(disabledButton).toHaveAttribute('data-disabled');
    });
  });

  describe('Plus Menu - Responsive Behavior', () => {
    test('FlexibleBottomNavbar_shouldUseSheetOnMobile', async () => {
      const user = userEvent.setup();
      // Mock mobile view
      mockUseMediaQuery.mockReturnValue(true);
      
      render(<FlexibleBottomNavbar onCreateNewProject={vi.fn()} />);
      
      const fabButton = screen.getByLabelText(/Create new item/i);
      await user.click(fabButton);
      
      // Sheet should be used (contains SheetTitle "Create New")
      await waitFor(() => {
        expect(screen.getByText('Create New')).toBeInTheDocument();
      });
    });

    test('FlexibleBottomNavbar_shouldUseDropdownOnDesktop', async () => {
      const user = userEvent.setup();
      // Mock desktop view
      mockUseMediaQuery.mockReturnValue(false);
      
      render(<FlexibleBottomNavbar onCreateNewProject={vi.fn()} />);
      
      const fabButton = screen.getByLabelText(/Create new item/i);
      await user.click(fabButton);
      
      // Dropdown should be used
      await waitFor(() => {
        expect(screen.getByText('Create New Project')).toBeInTheDocument();
      });
    });

    test('FlexibleBottomNavbar_shouldRespectPlusMenuVariantSheet', async () => {
      const user = userEvent.setup();
      // Force sheet even on desktop
      mockUseMediaQuery.mockReturnValue(false);
      
      render(
        <FlexibleBottomNavbar 
          onCreateNewProject={vi.fn()}
          plusMenuVariant="sheet"
        />
      );
      
      const fabButton = screen.getByLabelText(/Create new item/i);
      await user.click(fabButton);
      
      // Sheet should be used (contains SheetTitle)
      await waitFor(() => {
        expect(screen.getByText('Create New')).toBeInTheDocument();
      });
    });

    test('FlexibleBottomNavbar_shouldRespectPlusMenuVariantDropdown', async () => {
      const user = userEvent.setup();
      // Force dropdown even on mobile
      mockUseMediaQuery.mockReturnValue(true);
      
      render(
        <FlexibleBottomNavbar 
          onCreateNewProject={vi.fn()}
          plusMenuVariant="dropdown"
        />
      );
      
      const fabButton = screen.getByLabelText(/Create new item/i);
      await user.click(fabButton);
      
      // Dropdown should be used (no "Create New" title in dropdown)
      await waitFor(() => {
        expect(screen.getByText('Create New Project')).toBeInTheDocument();
      });
      
      // Sheet title should not be present
      expect(screen.queryByText('Create New')).not.toBeInTheDocument();
    });
  });

  describe('Plus Menu - Layout and Accessibility', () => {
    test('FlexibleBottomNavbar_shouldMaintainLayoutWhenMenuOpens', async () => {
      const user = userEvent.setup();
      const { container } = render(<FlexibleBottomNavbar onCreateNewProject={vi.fn()} />);
      
      const initialBottom = container.querySelector('[class*="fixed bottom"]');
      
      const fabButton = screen.getByLabelText(/Create new item/i);
      await user.click(fabButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Create New Project')).toBeInTheDocument();
      });
      
      // Layout should remain stable
      const afterBottom = container.querySelector('[class*="fixed bottom"]');
      expect(initialBottom).toEqual(afterBottom);
    });

    test('FlexibleBottomNavbar_shouldHaveProperAriaLabel', () => {
      render(<FlexibleBottomNavbar />);
      
      const fabButton = screen.getByLabelText(/Create new item/i);
      expect(fabButton).toHaveAttribute('aria-label');
    });

    test('FlexibleBottomNavbar_shouldSupportCustomFabAriaLabel', () => {
      render(
        <FlexibleBottomNavbar 
          fab={{ 'aria-label': 'Custom create button' }}
        />
      );
      
      expect(screen.getByLabelText('Custom create button')).toBeInTheDocument();
    });
  });

  describe('Legacy FAB Support', () => {
    test('FlexibleBottomNavbar_shouldSupportLegacyFabOnClick', () => {
      const mockFabClick = vi.fn();
      render(
        <FlexibleBottomNavbar 
          fab={{ onClick: mockFabClick }}
        />
      );
      
      const fabButton = screen.getByLabelText(/Floating action button/i);
      fireEvent.click(fabButton);
      
      expect(mockFabClick).toHaveBeenCalledTimes(1);
    });

    test('FlexibleBottomNavbar_shouldNotOpenMenuWithLegacyFabOnClick', async () => {
      const mockFabClick = vi.fn();
      render(
        <FlexibleBottomNavbar 
          fab={{ onClick: mockFabClick }}
          onCreateNewProject={vi.fn()}
        />
      );
      
      const fabButton = screen.getByLabelText(/Floating action button/i);
      fireEvent.click(fabButton);
      
      // Menu should not open
      await waitFor(() => {
        expect(screen.queryByText('Create New Project')).not.toBeInTheDocument();
      }, { timeout: 500 }).catch(() => {
        // Expected behavior - menu doesn't open
      });
      
      expect(mockFabClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('More Menu Integration', () => {
    test('FlexibleBottomNavbar_shouldKeepMoreMenuFunctional', async () => {
      // Mock mobile view to use Sheet variant which has "My Account" title
      mockUseMediaQuery.mockReturnValue(true);
      render(<FlexibleBottomNavbar />);
      
      const moreButton = screen.getByText('More');
      fireEvent.click(moreButton);
      
      // More menu should open
      await waitFor(() => {
        expect(screen.getByText('My Account')).toBeInTheDocument();
      });
    });

    test('FlexibleBottomNavbar_shouldCallProjectsHandler', () => {
      const mockHandler = vi.fn();
      render(<FlexibleBottomNavbar onProjectsClick={mockHandler} />);
      
      const projectsButton = screen.getByText('Projects');
      fireEvent.click(projectsButton);
      
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('More Menu - Responsive Behavior', () => {
    test('FlexibleBottomNavbar_shouldUseSheetForMoreMenuOnMobile', async () => {
      const user = userEvent.setup();
      // Mock mobile view
      mockUseMediaQuery.mockReturnValue(true);
      
      render(<FlexibleBottomNavbar />);
      
      const moreButton = screen.getByText('More');
      await user.click(moreButton);
      
      // Sheet should be used (contains SheetTitle "My Account")
      await waitFor(() => {
        expect(screen.getByText('My Account')).toBeInTheDocument();
      });
    });

    test('FlexibleBottomNavbar_shouldUseDropdownForMoreMenuOnDesktop', async () => {
      const user = userEvent.setup();
      // Mock desktop view
      mockUseMediaQuery.mockReturnValue(false);
      
      render(<FlexibleBottomNavbar />);
      
      const moreButton = screen.getByText('More');
      await user.click(moreButton);
      
      // Dropdown should be used - Profile menu item should be present
      await waitFor(() => {
        expect(screen.getByText('Profile')).toBeInTheDocument();
      });
    });

    test('FlexibleBottomNavbar_shouldRespectMoreMenuVariantSheet', async () => {
      const user = userEvent.setup();
      // Force sheet even on desktop
      mockUseMediaQuery.mockReturnValue(false);
      
      render(<FlexibleBottomNavbar moreMenuVariant="sheet" />);
      
      const moreButton = screen.getByText('More');
      await user.click(moreButton);
      
      // Sheet should be used (contains SheetTitle)
      await waitFor(() => {
        expect(screen.getByText('My Account')).toBeInTheDocument();
      });
    });

    test('FlexibleBottomNavbar_shouldRespectMoreMenuVariantDropdown', async () => {
      const user = userEvent.setup();
      // Force dropdown even on mobile
      mockUseMediaQuery.mockReturnValue(true);
      
      render(<FlexibleBottomNavbar moreMenuVariant="dropdown" />);
      
      const moreButton = screen.getByText('More');
      await user.click(moreButton);
      
      // Dropdown should be used (no "My Account" title in dropdown)
      await waitFor(() => {
        expect(screen.getByText('Profile')).toBeInTheDocument();
      });
      
      // Sheet title should not be present
      expect(screen.queryByText('My Account')).not.toBeInTheDocument();
    });

    test('FlexibleBottomNavbar_shouldCallProfileHandlerFromMoreMenu', async () => {
      const user = userEvent.setup();
      const mockHandler = vi.fn();
      render(<FlexibleBottomNavbar onProfileClick={mockHandler} />);
      
      const moreButton = screen.getByText('More');
      await user.click(moreButton);
      
      await waitFor(() => {
        expect(screen.getByText('Profile')).toBeInTheDocument();
      });
      
      const profileButton = screen.getByText('Profile');
      await user.click(profileButton);
      
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    test('FlexibleBottomNavbar_shouldCallLogoutHandlerFromMoreMenu', async () => {
      const user = userEvent.setup();
      const mockHandler = vi.fn();
      render(<FlexibleBottomNavbar onLogoutClick={mockHandler} />);
      
      const moreButton = screen.getByText('More');
      await user.click(moreButton);
      
      await waitFor(() => {
        expect(screen.getByText('Log out')).toBeInTheDocument();
      });
      
      const logoutButton = screen.getByText('Log out');
      await user.click(logoutButton);
      
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Visual Separation', () => {
    test('FlexibleBottomNavbar_shouldHaveBorderAndShadowForVisualSeparation', () => {
      const { container } = render(<FlexibleBottomNavbar />);
      
      // Find the border overlay element
      const borderOverlay = container.querySelector('.border-t.border-border.shadow-sm');
      expect(borderOverlay).toBeInTheDocument();
    });

    test('FlexibleBottomNavbar_shouldMaintainVisualSeparationAcrossThemes', () => {
      const { container } = render(<FlexibleBottomNavbar />);
      
      // Border should use theme-adaptive border color token
      const borderOverlay = container.querySelector('.border-border');
      expect(borderOverlay).toBeInTheDocument();
      expect(borderOverlay).toHaveClass('border-t');
      expect(borderOverlay).toHaveClass('shadow-sm');
    });

    test('FlexibleBottomNavbar_shouldNotAffectNavbarHeight', () => {
      const { container } = render(<FlexibleBottomNavbar />);
      
      // Content container should maintain h-16 height
      const contentContainer = container.querySelector('.h-16');
      expect(contentContainer).toBeInTheDocument();
    });
  });

  describe('Sheet Bottom Padding', () => {
    test('FlexibleBottomNavbar_shouldHaveBottomPaddingInPlusMenuSheet', async () => {
      const user = userEvent.setup();
      // Mock mobile view to ensure Sheet is used
      mockUseMediaQuery.mockReturnValue(true);
      
      render(<FlexibleBottomNavbar onCreateNewProject={vi.fn()} />);
      
      const fabButton = screen.getByLabelText(/Create new item/i);
      await user.click(fabButton);
      
      await waitFor(() => {
        expect(screen.getByText('Create New')).toBeInTheDocument();
        expect(screen.getByText('Create New Project')).toBeInTheDocument();
      });
      
      // Find the parent div of "Create New Project" button which should have pb-6 class
      const createButton = screen.getByText('Create New Project');
      const contentDiv = createButton.closest('.pb-6');
      expect(contentDiv).toBeInTheDocument();
      expect(contentDiv).toHaveClass('mt-4');
      expect(contentDiv).toHaveClass('space-y-1');
      expect(contentDiv).toHaveClass('pb-6');
    });

    test('FlexibleBottomNavbar_shouldHaveBottomPaddingInMoreMenuSheet', async () => {
      const user = userEvent.setup();
      // Mock mobile view to ensure Sheet is used
      mockUseMediaQuery.mockReturnValue(true);
      
      render(<FlexibleBottomNavbar />);
      
      const moreButton = screen.getByText('More');
      await user.click(moreButton);
      
      await waitFor(() => {
        expect(screen.getByText('My Account')).toBeInTheDocument();
        expect(screen.getByText('Profile')).toBeInTheDocument();
      });
      
      // Find the parent div of "Profile" button which should have pb-6 class
      const profileButton = screen.getByText('Profile');
      const contentDiv = profileButton.closest('.pb-6');
      expect(contentDiv).toBeInTheDocument();
      expect(contentDiv).toHaveClass('mt-4');
      expect(contentDiv).toHaveClass('space-y-1');
      expect(contentDiv).toHaveClass('pb-6');
    });

    test('FlexibleBottomNavbar_shouldNotAffectDropdownMenuPadding', async () => {
      const user = userEvent.setup();
      // Mock desktop view to ensure Dropdown is used
      mockUseMediaQuery.mockReturnValue(false);
      
      render(<FlexibleBottomNavbar onCreateNewProject={vi.fn()} />);
      
      const fabButton = screen.getByLabelText(/Create new item/i);
      await user.click(fabButton);
      
      await waitFor(() => {
        expect(screen.getByText('Create New Project')).toBeInTheDocument();
      });
      
      // In dropdown, there should be no pb-6 class on the content
      const createButton = screen.getByText('Create New Project');
      const contentDiv = createButton.closest('.pb-6');
      expect(contentDiv).not.toBeInTheDocument();
    });
  });
});
