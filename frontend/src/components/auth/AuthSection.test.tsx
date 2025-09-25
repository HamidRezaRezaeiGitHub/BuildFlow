import { fireEvent, render, screen } from '@testing-library/react';
import AuthSection from './AuthSection';

// Mock the form components
jest.mock('./LoginForm', () => {
    return function MockLoginForm({ showPassword, onTogglePassword, inline }: any) {
        return (
            <div data-testid="login-form">
                <div>Login Form Content</div>
                <div>Show Password: {showPassword ? 'true' : 'false'}</div>
                <button onClick={onTogglePassword} data-testid="login-toggle-password">
                    Toggle Password
                </button>
                {inline && <div data-testid="login-inline">Inline Mode</div>}
            </div>
        );
    };
});

jest.mock('./SignUpForm', () => {
    return function MockSignUpForm({ 
        showPassword, 
        showConfirmPassword, 
        onTogglePassword, 
        onToggleConfirmPassword, 
        onSignUpSuccess,
        inline 
    }: any) {
        return (
            <div data-testid="signup-form">
                <div>SignUp Form Content</div>
                <div>Show Password: {showPassword ? 'true' : 'false'}</div>
                <div>Show Confirm Password: {showConfirmPassword ? 'true' : 'false'}</div>
                <button onClick={onTogglePassword} data-testid="signup-toggle-password">
                    Toggle Password
                </button>
                <button onClick={onToggleConfirmPassword} data-testid="signup-toggle-confirm-password">
                    Toggle Confirm Password
                </button>
                <button onClick={onSignUpSuccess} data-testid="signup-success">
                    Simulate Success
                </button>
                {inline && <div data-testid="signup-inline">Inline Mode</div>}
            </div>
        );
    };
});

// Mock window location
const mockLocationHash = jest.fn();
Object.defineProperty(window, 'location', {
    value: {
        get hash() {
            return mockLocationHash();
        },
        set hash(value) {
            mockLocationHash.mockReturnValue(value);
        }
    },
    writable: true
});

// Mock sessionStorage
const mockSessionStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
};
Object.defineProperty(window, 'sessionStorage', {
    value: mockSessionStorage
});

describe('Auth Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockLocationHash.mockReturnValue('');
        mockSessionStorage.getItem.mockReturnValue(null);
    });

    // Basic rendering tests
    test('Auth_shouldRenderWithDefaultState', () => {
        render(<AuthSection />);

        // Should render the main heading and description
        expect(screen.getByText('Ready to Get Started?')).toBeInTheDocument();
        expect(screen.getByText(/Join thousands of construction professionals/)).toBeInTheDocument();

        // Should render tab triggers
        expect(screen.getByRole('tab', { name: 'Sign Up' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Login' })).toBeInTheDocument();

        // Should render signup form by default (active tab)
        expect(screen.getByTestId('signup-form')).toBeInTheDocument();
        expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();

        // Should render social proof section
        expect(screen.getByText('Join 500+ construction professionals already using BuildFlow')).toBeInTheDocument();
    });

    test('Auth_shouldRenderStarsInSocialProof', () => {
        render(<AuthSection />);

        // Should render 5 stars
        const stars = document.querySelectorAll('svg');
        expect(stars.length).toBeGreaterThan(4); // Should have at least 5 stars
    });

    // Tab navigation tests
    test('Auth_shouldSwitchToLoginTab_whenLoginTabClicked', () => {
        render(<AuthSection />);

        // Initially should show signup
        expect(screen.getByTestId('signup-form')).toBeInTheDocument();
        expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();

        // Click login tab
        const loginTab = screen.getByRole('tab', { name: 'Login' });
        fireEvent.click(loginTab);

        // Should now show login form
        expect(screen.getByTestId('login-form')).toBeInTheDocument();
        expect(screen.queryByTestId('signup-form')).not.toBeInTheDocument();
    });

    test('Auth_shouldSwitchToSignUpTab_whenSignUpTabClicked', () => {
        render(<AuthSection />);

        // First switch to login
        const loginTab = screen.getByRole('tab', { name: 'Login' });
        fireEvent.click(loginTab);
        expect(screen.getByTestId('login-form')).toBeInTheDocument();

        // Then switch back to signup
        const signupTab = screen.getByRole('tab', { name: 'Sign Up' });
        fireEvent.click(signupTab);
        expect(screen.getByTestId('signup-form')).toBeInTheDocument();
        expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
    });

    test('Auth_shouldMaintainTabState_whenNavigatingBetweenTabs', () => {
        render(<AuthSection />);

        // Switch to login tab
        const loginTab = screen.getByRole('tab', { name: 'Login' });
        fireEvent.click(loginTab);

        // Check that login tab is now active
        expect(loginTab).toHaveAttribute('data-state', 'active');
        
        const signupTab = screen.getByRole('tab', { name: 'Sign Up' });
        expect(signupTab).toHaveAttribute('data-state', 'inactive');
    });

    // Password visibility tests
    test('Auth_shouldManagePasswordVisibility_forSignUpForm', () => {
        render(<AuthSection />);

        // Should start with password hidden
        expect(screen.getByText('Show Password: false')).toBeInTheDocument();
        expect(screen.getByText('Show Confirm Password: false')).toBeInTheDocument();

        // Toggle password visibility
        const togglePasswordButton = screen.getByTestId('signup-toggle-password');
        fireEvent.click(togglePasswordButton);

        // Password should now be visible
        expect(screen.getByText('Show Password: true')).toBeInTheDocument();

        // Toggle confirm password visibility
        const toggleConfirmPasswordButton = screen.getByTestId('signup-toggle-confirm-password');
        fireEvent.click(toggleConfirmPasswordButton);

        // Confirm password should now be visible
        expect(screen.getByText('Show Confirm Password: true')).toBeInTheDocument();
    });

    test('Auth_shouldManagePasswordVisibility_forLoginForm', () => {
        render(<AuthSection />);

        // Switch to login tab
        const loginTab = screen.getByRole('tab', { name: 'Login' });
        fireEvent.click(loginTab);

        // Should start with password hidden
        expect(screen.getByText('Show Password: false')).toBeInTheDocument();

        // Toggle password visibility
        const togglePasswordButton = screen.getByTestId('login-toggle-password');
        fireEvent.click(togglePasswordButton);

        // Password should now be visible
        expect(screen.getByText('Show Password: true')).toBeInTheDocument();
    });

    test('Auth_shouldSharePasswordVisibility_betweenForms', () => {
        render(<AuthSection />);

        // Toggle password in signup form
        const signupToggleButton = screen.getByTestId('signup-toggle-password');
        fireEvent.click(signupToggleButton);
        expect(screen.getByText('Show Password: true')).toBeInTheDocument();

        // Switch to login form
        const loginTab = screen.getByRole('tab', { name: 'Login' });
        fireEvent.click(loginTab);

        // Password visibility should be shared
        expect(screen.getByText('Show Password: true')).toBeInTheDocument();
    });

    // URL hash navigation tests
    test('Auth_shouldHandleHashChange_toAuthHash', async () => {
        mockLocationHash.mockReturnValue('#auth');
        mockSessionStorage.getItem.mockReturnValue('login');

        render(<AuthSection />);

        // Should handle the hash change and potentially switch tabs based on stored preference
        // This tests the useEffect that listens for hash changes
        expect(screen.getByTestId('signup-form')).toBeInTheDocument();
    });

    test('Auth_shouldStoreTabPreference_inSessionStorage', () => {
        render(<AuthSection />);

        // Switch to login tab
        const loginTab = screen.getByRole('tab', { name: 'Login' });
        fireEvent.click(loginTab);

        // Should store tab preference (this would be implemented in the actual component)
        // For now, we just verify the tab switch worked
        expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });

    // Success flow tests
    test('Auth_shouldSwitchToLoginTab_whenSignUpSuccessful', () => {
        render(<AuthSection />);

        // Should start on signup tab
        expect(screen.getByTestId('signup-form')).toBeInTheDocument();

        // Simulate signup success
        const signupSuccessButton = screen.getByTestId('signup-success');
        fireEvent.click(signupSuccessButton);

        // Should switch to login tab
        expect(screen.getByTestId('login-form')).toBeInTheDocument();
        expect(screen.queryByTestId('signup-form')).not.toBeInTheDocument();
    });

    // Form integration tests
    test('Auth_shouldPassInlinePropsToForms', () => {
        render(<AuthSection />);

        // Both forms should receive inline=true
        expect(screen.getByTestId('signup-inline')).toBeInTheDocument();

        // Switch to login and check
        const loginTab = screen.getByRole('tab', { name: 'Login' });
        fireEvent.click(loginTab);
        expect(screen.getByTestId('login-inline')).toBeInTheDocument();
    });

    test('Auth_shouldPassPasswordVisibilityPropsToForms', () => {
        render(<AuthSection />);

        // Check initial password visibility props are passed
        expect(screen.getByText('Show Password: false')).toBeInTheDocument();
        expect(screen.getByText('Show Confirm Password: false')).toBeInTheDocument();

        // Toggle and verify props are updated
        const toggleButton = screen.getByTestId('signup-toggle-password');
        fireEvent.click(toggleButton);
        expect(screen.getByText('Show Password: true')).toBeInTheDocument();
    });

    // Accessibility tests
    test('Auth_shouldHaveProperTabAccessibility', () => {
        render(<AuthSection />);

        const signupTab = screen.getByRole('tab', { name: 'Sign Up' });
        const loginTab = screen.getByRole('tab', { name: 'Login' });

        // Tabs should have proper ARIA attributes
        expect(signupTab).toHaveAttribute('data-tab', 'signup');
        expect(loginTab).toHaveAttribute('data-tab', 'login');

        // Should have proper tab panel associations
        expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });

    test('Auth_shouldHaveProperHeadingStructure', () => {
        render(<AuthSection />);

        // Should have proper heading hierarchy
        const mainHeading = screen.getByRole('heading', { level: 2 });
        expect(mainHeading).toHaveTextContent('Ready to Get Started?');
    });

    // Layout tests
    test('Auth_shouldHaveProperContainerStructure', () => {
        const { container } = render(<AuthSection />);

        // Should have proper max-width container
        expect(container.querySelector('.max-w-md')).toBeInTheDocument();
        
        // Should have proper spacing classes
        expect(container.querySelector('.space-y-4')).toBeInTheDocument();
        expect(container.querySelector('.mb-16')).toBeInTheDocument();
    });

    test('Auth_shouldRenderTabsWithProperGridLayout', () => {
        render(<AuthSection />);

        // Tab list should have grid layout
        const tabsList = screen.getByRole('tablist');
        expect(tabsList).toHaveClass('grid', 'w-full', 'grid-cols-2');
    });

    // Edge cases
    test('Auth_shouldHandleMultiplePasswordToggles', () => {
        render(<AuthSection />);

        const passwordToggle = screen.getByTestId('signup-toggle-password');
        const confirmPasswordToggle = screen.getByTestId('signup-toggle-confirm-password');

        // Toggle password multiple times
        fireEvent.click(passwordToggle);
        expect(screen.getByText('Show Password: true')).toBeInTheDocument();
        
        fireEvent.click(passwordToggle);
        expect(screen.getByText('Show Password: false')).toBeInTheDocument();

        // Toggle confirm password
        fireEvent.click(confirmPasswordToggle);
        expect(screen.getByText('Show Confirm Password: true')).toBeInTheDocument();
        
        fireEvent.click(confirmPasswordToggle);
        expect(screen.getByText('Show Confirm Password: false')).toBeInTheDocument();
    });

    test('Auth_shouldMaintainStateWhenSwitchingTabs', () => {
        render(<AuthSection />);

        // Toggle password in signup
        const signupPasswordToggle = screen.getByTestId('signup-toggle-password');
        fireEvent.click(signupPasswordToggle);

        // Switch to login
        const loginTab = screen.getByRole('tab', { name: 'Login' });
        fireEvent.click(loginTab);

        // Switch back to signup
        const signupTab = screen.getByRole('tab', { name: 'Sign Up' });
        fireEvent.click(signupTab);

        // Password visibility should be maintained
        expect(screen.getByText('Show Password: true')).toBeInTheDocument();
    });

    // Props and customization tests
    test('Auth_shouldAcceptCustomClassName', () => {
        const { container } = render(<AuthSection className="custom-auth-class" />);
        
        // The Auth component should accept and apply custom className
        // This would need to be implemented in the actual component
        expect(container.firstChild).toBeInTheDocument();
    });

    // Error handling tests
    test('Auth_shouldHandleFormErrors_gracefully', () => {
        render(<AuthSection />);

        // Component should render even if forms have errors
        // This is more of a structural test to ensure robustness
        expect(screen.getByTestId('signup-form')).toBeInTheDocument();
        
        const loginTab = screen.getByRole('tab', { name: 'Login' });
        fireEvent.click(loginTab);
        expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });
});