import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NewProjectForm } from './NewProjectForm';
import { useAuth } from '@/contexts/AuthContext';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock, MockedFunction } from 'vitest';

// Mock the useAuth hook
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn()
}));

const mockUseAuth = useAuth as MockedFunction<typeof useAuth>;

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

describe('NewProjectForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock return value
    mockUseAuth.mockReturnValue({
      user: mockUser,
      token: 'mock-token',
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      refreshToken: vi.fn(),
      getCurrentUser: vi.fn(),
      isLoading: false,
      role: 'USER'
    });
  });

  const renderForm = (props = {}) => {
    return render(
      <NewProjectForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        {...props}
      />
    );
  };

  it('renders all address fields including streetNumberAndName', () => {
    renderForm();

    // Check for role selection
    expect(screen.getByText(/I am the:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Builder/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Owner/i })).toBeInTheDocument();

    // Check for address fields - the critical one we're testing
    expect(screen.getByLabelText(/Street/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Province/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Unit\/Apt\/Suite/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Postal Code/i)).toBeInTheDocument();
  });

  it('has Create Project button disabled initially', () => {
    renderForm();
    
    const submitButton = screen.getByRole('button', { name: /Create Project/i });
    expect(submitButton).toBeDisabled();
  });

  it('enables Create Project button when all required fields are filled', async () => {
    const user = userEvent.setup();
    renderForm();

    // Fill in required address fields
    await user.type(screen.getByLabelText(/Street/i), '123 Main Street');
    await user.type(screen.getByLabelText(/City/i), 'Toronto');
    await user.type(screen.getByLabelText(/Province/i), 'ON');
    await user.type(screen.getByLabelText(/Country/i), 'Canada');

    // Wait for validation to complete
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /Create Project/i });
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('keeps Create Project button disabled when required fields are empty', async () => {
    const user = userEvent.setup();
    renderForm();

    // Fill only some fields
    await user.type(screen.getByLabelText(/Street/i), '123 Main Street');
    await user.type(screen.getByLabelText(/City/i), 'Toronto');
    // Don't fill Province/State and Country

    // Button should still be disabled
    const submitButton = screen.getByRole('button', { name: /Create Project/i });
    expect(submitButton).toBeDisabled();
  });

  it('allows optional fields to be empty', async () => {
    const user = userEvent.setup();
    renderForm();

    // Fill only required fields (not unitNumber and postalOrZipCode)
    await user.type(screen.getByLabelText(/Street/i), '123 Main Street');
    await user.type(screen.getByLabelText(/City/i), 'Toronto');
    await user.type(screen.getByLabelText(/Province/i), 'ON');
    await user.type(screen.getByLabelText(/Country/i), 'Canada');

    // Button should be enabled even without optional fields
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /Create Project/i });
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('submits correct data structure when form is filled', async () => {
    const user = userEvent.setup();
    renderForm();

    // Select builder role
    await user.click(screen.getByRole('button', { name: /Builder/i }));

    // Fill in all required fields
    await user.type(screen.getByLabelText(/Street/i), '123 Main Street');
    await user.type(screen.getByLabelText(/City/i), 'Toronto');
    await user.type(screen.getByLabelText(/Province/i), 'ON');
    await user.type(screen.getByLabelText(/Country/i), 'Canada');
    await user.type(screen.getByLabelText(/Unit\/Apt\/Suite/i), 'Unit 5');
    await user.type(screen.getByLabelText(/Postal Code/i), 'M5H 2N2');

    // Wait for button to be enabled
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /Create Project/i });
      expect(submitButton).not.toBeDisabled();
    });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /Create Project/i });
    await user.click(submitButton);

    // Verify the data structure passed to onSubmit
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUser.id,
          role: 'BUILDER',
          locationRequestDto: expect.objectContaining({
            streetNumberAndName: '123 Main Street',
            city: 'Toronto',
            stateOrProvince: 'ON',
            country: 'Canada',
            unitNumber: 'Unit 5',
            postalOrZipCode: 'M5H 2N2'
          })
        })
      );
    });
  });

  it('calls onCancel when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderForm();

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('disables form when isSubmitting is true', () => {
    renderForm({ isSubmitting: true });

    // All buttons should be disabled
    expect(screen.getByRole('button', { name: /Creating Project.../i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeDisabled();
  });
});
