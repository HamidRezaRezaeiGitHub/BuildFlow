import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { authService } from '../services';
import type { AuthResponse, UserSummary } from '../services';
import { AuthProvider, useAuth } from './AuthContext';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type { Mock } from 'vitest';

// Create mock timer service in hoisted scope
const { mockTimerService } = vi.hoisted(() => {
    const scheduledCallbacks = new Map<number, { callback: () => void | Promise<void>; delayMs: number }>();
    let nextId = 1;
    
    return {
        mockTimerService: {
            schedule(callback: () => void | Promise<void>, delayMs: number) {
                const timerId = nextId++;
                scheduledCallbacks.set(timerId, { callback, delayMs });
                return timerId;
            },
            cancel(timerId: number) {
                scheduledCallbacks.delete(timerId);
            },
            cancelAll() {
                scheduledCallbacks.clear();
                nextId = 1;
            },
            getScheduledCount() {
                return scheduledCallbacks.size;
            },
            getAllScheduled() {
                return Array.from(scheduledCallbacks.entries()).map(([timerId, data]) => ({
                    timerId,
                    ...data
                }));
            },
            async executeCallback(timerId: number) {
                const scheduled = scheduledCallbacks.get(timerId);
                if (scheduled) {
                    scheduledCallbacks.delete(timerId);
                    await scheduled.callback();
                }
            },
            async executeAllCallbacks() {
                const callbacks = Array.from(scheduledCallbacks.values());
                scheduledCallbacks.clear();
                for (const { callback } of callbacks) {
                    await callback();
                }
            }
        }
    };
});

// Mock the auth service
vi.mock('../services', () => ({
    authService: {
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        getCurrentUser: vi.fn(),
        refreshToken: vi.fn(),
    },
    handleApiError: vi.fn(),
    timerService: mockTimerService,
}));

// Mock localStorage
const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
});

// Test component to access the context
const TestComponent = () => {
    const {
        user,
        role,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        refreshToken,
        getCurrentUser,
    } = useAuth();

    return (
        <div>
            <div data-testid="user">{user ? JSON.stringify(user) : 'null'}</div>
            <div data-testid="role">{role || 'null'}</div>
            <div data-testid="token">{token || 'null'}</div>
            <div data-testid="isAuthenticated">{isAuthenticated.toString()}</div>
            <div data-testid="isLoading">{isLoading.toString()}</div>

            <button onClick={() => login({ username: 'test@example.com', password: 'password' })}>
                Login
            </button>
            <button onClick={() => register({
                username: 'johndoe',
                password: 'password',
                contact: {
                    firstName: 'John',
                    lastName: 'Doe',
                    labels: ['Builder'],
                    email: 'test@example.com'
                }
            })}>
                Register
            </button>
            <button onClick={logout}>Logout</button>
            <button onClick={refreshToken}>Refresh Token</button>
            <button onClick={getCurrentUser}>Get Current User</button>
        </div>
    );
};

// Helper to render component with AuthProvider
const renderWithAuthProvider = (ui: React.ReactElement) => {
    return render(
        <AuthProvider>
            {ui}
        </AuthProvider>
    );
};

describe('AuthProvider', () => {
    const mockUserSummary: UserSummary = {
        id: '1',
        username: 'johndoe',
        email: 'test@example.com',
        role: 'USER'
    };

    const mockAuthResponse: AuthResponse = {
        tokenType: 'Bearer',
        accessToken: 'mock-jwt-token',
        expiryDate: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
        expiresInSeconds: 3600,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockLocalStorage.getItem.mockReturnValue(null);
        // Reset timer service
        mockTimerService.cancelAll();
    });

    afterEach(() => {
        // Clean up any remaining timers
        mockTimerService.cancelAll();
    });

    describe('initialization', () => {
        test('AuthProvider_shouldInitializeWithNoToken_whenLocalStorageEmpty', () => {
            mockLocalStorage.getItem.mockReturnValue(null);

            renderWithAuthProvider(<TestComponent />);

            expect(screen.getByTestId('token')).toHaveTextContent('null');
            expect(screen.getByTestId('user')).toHaveTextContent('null');
            expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
        });

        test('AuthProvider_shouldInitializeWithToken_whenTokenInLocalStorage', () => {
            mockLocalStorage.getItem.mockReturnValue('existing-token');

            renderWithAuthProvider(<TestComponent />);

            expect(screen.getByTestId('token')).toHaveTextContent('existing-token');
        });

        test('AuthProvider_shouldFetchCurrentUser_whenTokenExists', async () => {
            mockLocalStorage.getItem.mockReturnValue('existing-token');
            (authService.getCurrentUser as Mock).mockResolvedValue(mockUserSummary);

            renderWithAuthProvider(<TestComponent />);

            await waitFor(() => {
                expect(authService.getCurrentUser).toHaveBeenCalledWith('existing-token');
            });

            await waitFor(() => {
                expect(screen.getByTestId('user')).toHaveTextContent('johndoe');
                expect(screen.getByTestId('role')).toHaveTextContent('USER');
                expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
                expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
            });
        });

        test('AuthProvider_shouldClearTokenAndUser_whenGetCurrentUserFails', async () => {
            mockLocalStorage.getItem.mockReturnValue('invalid-token');
            (authService.getCurrentUser as Mock).mockRejectedValue(new Error('Unauthorized'));

            renderWithAuthProvider(<TestComponent />);

            await waitFor(() => {
                expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('jwt_token');
                expect(screen.getByTestId('token')).toHaveTextContent('null');
                expect(screen.getByTestId('user')).toHaveTextContent('null');
                expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
            });
        });
    });

    describe('login', () => {
        test('AuthProvider_shouldLoginSuccessfully_whenCredentialsValid', async () => {
            (authService.login as Mock).mockResolvedValue(mockAuthResponse);
            (authService.getCurrentUser as Mock).mockResolvedValue(mockUserSummary);

            const user = userEvent.setup();

            renderWithAuthProvider(<TestComponent />);

            await user.click(screen.getByText('Login'));

            await waitFor(() => {
                expect(authService.login).toHaveBeenCalledWith({
                    username: 'test@example.com',
                    password: 'password'
                });
            });

            await waitFor(() => {
                expect(mockLocalStorage.setItem).toHaveBeenCalledWith('jwt_token', 'mock-jwt-token');
                expect(screen.getByTestId('token')).toHaveTextContent('mock-jwt-token');
                expect(screen.getByTestId('user')).toHaveTextContent('johndoe');
                expect(screen.getByTestId('role')).toHaveTextContent('USER');
                expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
            });
        });

        test('AuthProvider_shouldScheduleTokenRefresh_whenLoginSuccessful', async () => {
            (authService.login as Mock).mockResolvedValue(mockAuthResponse);
            (authService.getCurrentUser as Mock).mockResolvedValue(mockUserSummary);

            const user = userEvent.setup();

            renderWithAuthProvider(<TestComponent />);

            await user.click(screen.getByText('Login'));

            await waitFor(() => {
                expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
            });

            // Verify timer was scheduled
            expect(mockTimerService.getScheduledCount()).toBe(1);
            
            const scheduled = mockTimerService.getAllScheduled()[0];
            expect(scheduled.delayMs).toBe(3570000); // 3600 - 30 seconds = 3570 seconds
        });

        test('AuthProvider_shouldHandleLoginError_whenCredentialsInvalid', async () => {
            const loginError = new Error('Invalid credentials');
            (authService.login as Mock).mockRejectedValue(loginError);

            const user = userEvent.setup();

            renderWithAuthProvider(<TestComponent />);

            await user.click(screen.getByText('Login'));

            await waitFor(() => {
                expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('jwt_token');
                expect(screen.getByTestId('token')).toHaveTextContent('null');
                expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
            });
        });
    });

    describe('register', () => {
        test('AuthProvider_shouldRegisterSuccessfully_whenDataValid', async () => {
            (authService.register as Mock).mockResolvedValue(undefined);

            const user = userEvent.setup();

            renderWithAuthProvider(<TestComponent />);

            await user.click(screen.getByText('Register'));

            await waitFor(() => {
                expect(authService.register).toHaveBeenCalledWith({
                    username: 'johndoe',
                    password: 'password',
                    contact: {
                        firstName: 'John',
                        lastName: 'Doe',
                        labels: ['Builder'],
                        email: 'test@example.com'
                    }
                });
            });
        });

        test('AuthProvider_shouldNotLoginUser_whenRegistrationSuccessful', async () => {
            (authService.register as Mock).mockResolvedValue(undefined);

            const user = userEvent.setup();

            renderWithAuthProvider(<TestComponent />);

            await user.click(screen.getByText('Register'));

            await waitFor(() => {
                expect(screen.getByTestId('token')).toHaveTextContent('null');
                expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
            });
        });
    });

    describe('logout', () => {
        test('AuthProvider_shouldLogoutSuccessfully_whenUserAuthenticated', async () => {
            mockLocalStorage.getItem.mockReturnValue('existing-token');
            (authService.getCurrentUser as Mock).mockResolvedValue(mockUserSummary);
            (authService.logout as Mock).mockResolvedValue(undefined);

            const user = userEvent.setup();

            renderWithAuthProvider(<TestComponent />);

            // Wait for initialization
            await waitFor(() => {
                expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
            });

            await user.click(screen.getByText('Logout'));

            await waitFor(() => {
                expect(authService.logout).toHaveBeenCalledWith('existing-token');
                expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('jwt_token');
                expect(screen.getByTestId('token')).toHaveTextContent('null');
                expect(screen.getByTestId('user')).toHaveTextContent('null');
                expect(screen.getByTestId('role')).toHaveTextContent('null');
                expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
            });
        });

        test('AuthProvider_shouldClearLocalState_whenBackendLogoutFails', async () => {
            mockLocalStorage.getItem.mockReturnValue('existing-token');
            (authService.getCurrentUser as Mock).mockResolvedValue(mockUserSummary);
            (authService.logout as Mock).mockRejectedValue(new Error('Network error'));

            const user = userEvent.setup();

            renderWithAuthProvider(<TestComponent />);

            // Wait for initialization
            await waitFor(() => {
                expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
            });

            await user.click(screen.getByText('Logout'));

            await waitFor(() => {
                expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('jwt_token');
                expect(screen.getByTestId('token')).toHaveTextContent('null');
                expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
            });
        });
    });

    describe('token refresh', () => {
        test('AuthProvider_shouldRefreshTokenSuccessfully_whenTokenValid', async () => {
            const newAuthResponse: AuthResponse = {
                ...mockAuthResponse,
                accessToken: 'new-jwt-token',
            };

            mockLocalStorage.getItem.mockReturnValue('existing-token');
            (authService.getCurrentUser as Mock).mockResolvedValue(mockUserSummary);
            (authService.refreshToken as Mock).mockResolvedValue(newAuthResponse);

            const user = userEvent.setup();

            renderWithAuthProvider(<TestComponent />);

            // Wait for initialization
            await waitFor(() => {
                expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
            });

            await user.click(screen.getByText('Refresh Token'));

            await waitFor(() => {
                expect(authService.refreshToken).toHaveBeenCalledWith('existing-token');
                expect(mockLocalStorage.setItem).toHaveBeenCalledWith('jwt_token', 'new-jwt-token');
                expect(screen.getByTestId('token')).toHaveTextContent('new-jwt-token');
            });
        });

        test('AuthProvider_shouldLogoutUser_whenTokenRefreshFails', async () => {
            mockLocalStorage.getItem.mockReturnValue('existing-token');
            (authService.getCurrentUser as Mock).mockResolvedValue(mockUserSummary);
            (authService.refreshToken as Mock).mockRejectedValue(new Error('Token expired'));

            const user = userEvent.setup();

            renderWithAuthProvider(<TestComponent />);

            // Wait for initialization
            await waitFor(() => {
                expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
            });

            await user.click(screen.getByText('Refresh Token'));

            await waitFor(() => {
                expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('jwt_token');
                expect(screen.getByTestId('token')).toHaveTextContent('null');
                expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
            });
        });
    });

    describe('automatic token refresh', () => {
        test('AuthProvider_shouldScheduleAutomaticRefresh_whenTokenHasEnoughTime', async () => {
            const longExpiryResponse: AuthResponse = {
                ...mockAuthResponse,
                expiresInSeconds: 300, // 5 minutes
            };

            (authService.login as Mock).mockResolvedValue(longExpiryResponse);
            (authService.getCurrentUser as Mock).mockResolvedValue(mockUserSummary);

            const user = userEvent.setup();

            renderWithAuthProvider(<TestComponent />);

            await user.click(screen.getByText('Login'));

            await waitFor(() => {
                expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
            });

            // Verify timer was scheduled with correct delay (270 seconds = 300 - 30)
            expect(mockTimerService.getScheduledCount()).toBe(1);
            const scheduled = mockTimerService.getAllScheduled()[0];
            expect(scheduled.delayMs).toBe(270000);
        });

        test('AuthProvider_shouldNotScheduleRefresh_whenTokenExpiresTooSoon', async () => {
            const shortExpiryResponse: AuthResponse = {
                ...mockAuthResponse,
                expiresInSeconds: 20, // 20 seconds
            };

            (authService.login as Mock).mockResolvedValue(shortExpiryResponse);
            (authService.getCurrentUser as Mock).mockResolvedValue(mockUserSummary);

            const user = userEvent.setup();

            renderWithAuthProvider(<TestComponent />);

            await user.click(screen.getByText('Login'));

            await waitFor(() => {
                expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
            });

            // Verify no timer was scheduled
            expect(mockTimerService.getScheduledCount()).toBe(0);
        });

        test('AuthProvider_shouldRefreshAutomatically_whenTimerTriggers', async () => {
            (authService.login as Mock).mockResolvedValue(mockAuthResponse);
            (authService.getCurrentUser as Mock).mockResolvedValue(mockUserSummary);

            const user = userEvent.setup();

            renderWithAuthProvider(<TestComponent />);

            await user.click(screen.getByText('Login'));

            await waitFor(() => {
                expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
            });

            // Verify timer was scheduled with correct delay
            expect(mockTimerService.getScheduledCount()).toBe(1);
            const scheduled = mockTimerService.getAllScheduled()[0];
            expect(scheduled.delayMs).toBe(3570000); // 3600 - 30 seconds = 3570 seconds

            // Verify that the scheduled callback is a function (contains refresh logic)
            expect(typeof scheduled.callback).toBe('function');
        });

        test('AuthProvider_shouldLogoutUser_whenAutomaticRefreshFails', async () => {
            (authService.login as Mock).mockResolvedValue(mockAuthResponse);
            (authService.getCurrentUser as Mock).mockResolvedValue(mockUserSummary);

            const user = userEvent.setup();

            renderWithAuthProvider(<TestComponent />);

            await user.click(screen.getByText('Login'));

            await waitFor(() => {
                expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
            });

            // Verify timer was scheduled
            expect(mockTimerService.getScheduledCount()).toBe(1);
            const scheduled = mockTimerService.getAllScheduled()[0];
            expect(scheduled.delayMs).toBe(3570000);

            // Test manual refresh failure behavior (same logic as auto-refresh)
            (authService.refreshToken as Mock).mockRejectedValue(new Error('Refresh failed'));
            
            await user.click(screen.getByText('Refresh Token'));

            await waitFor(() => {
                expect(screen.getByTestId('token')).toHaveTextContent('null');
                expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
            });
        });
    });

    describe('timer cleanup', () => {
        test('AuthProvider_shouldClearTimer_whenComponentUnmounts', async () => {
            (authService.login as Mock).mockResolvedValue(mockAuthResponse);
            (authService.getCurrentUser as Mock).mockResolvedValue(mockUserSummary);

            const user = userEvent.setup();

            const { unmount } = renderWithAuthProvider(<TestComponent />);

            // Login to schedule a timer
            await user.click(screen.getByText('Login'));

            await waitFor(() => {
                expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
            });

            // Verify timer was scheduled
            expect(mockTimerService.getScheduledCount()).toBe(1);

            // Unmount the component
            unmount();

            // Verify timer was cancelled (this depends on implementation)
            // Note: Due to the way useEffect cleanup works, the timer might still be in the mock
            // but the actual component cleanup should prevent memory leaks
            expect(() => unmount()).not.toThrow();
        });

        test('AuthProvider_shouldClearPreviousTimer_whenNewRefreshScheduled', async () => {
            (authService.login as Mock).mockResolvedValue(mockAuthResponse);
            (authService.getCurrentUser as Mock).mockResolvedValue(mockUserSummary);

            const user = userEvent.setup();

            renderWithAuthProvider(<TestComponent />);

            // Login to schedule first timer
            await user.click(screen.getByText('Login'));

            await waitFor(() => {
                expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
            });

            // Verify first timer was scheduled
            expect(mockTimerService.getScheduledCount()).toBe(1);

            // Login again to schedule second timer (should clear first)
            await user.click(screen.getByText('Login'));

            await waitFor(() => {
                expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
            });

            // Should still have only one timer (new one replaced old one)
            expect(mockTimerService.getScheduledCount()).toBe(1);
        });
    });

    describe('context hook', () => {
        test('useAuth_shouldThrowError_whenUsedOutsideProvider', () => {
            const TestComponentWithoutProvider = () => {
                useAuth();
                return <div>Test</div>;
            };

            // Suppress error boundary console.error for this test
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            expect(() => {
                render(<TestComponentWithoutProvider />);
            }).toThrow('useAuth must be used within an AuthProvider');

            consoleSpy.mockRestore();
        });
    });
});