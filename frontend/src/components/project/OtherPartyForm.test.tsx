import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OtherPartyForm, createEmptyOtherPartyFormData } from './OtherPartyForm';

describe('OtherPartyForm', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderForm = (props = {}) => {
    return render(
      <OtherPartyForm
        otherPartyRole="owner"
        formData={createEmptyOtherPartyFormData()}
        onChange={mockOnChange}
        {...props}
      />
    );
  };

  it('renders with owner role label', () => {
    renderForm({ otherPartyRole: 'owner' });
    expect(screen.getByText(/Owner Information/i)).toBeInTheDocument();
  });

  it('renders with builder role label', () => {
    renderForm({ otherPartyRole: 'builder' });
    expect(screen.getByText(/Builder Information/i)).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    renderForm();
    
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
  });

  it('indicates all fields are optional', () => {
    renderForm();
    
    expect(screen.getByText(/All fields are optional/i)).toBeInTheDocument();
  });

  it('calls onChange when first name is entered', async () => {
    const user = userEvent.setup();
    renderForm();

    const firstNameInput = screen.getByLabelText(/First Name/i);
    await user.type(firstNameInput, 'John');

    // Check that onChange was called with firstName field
    expect(mockOnChange).toHaveBeenCalledWith('firstName', expect.any(String));
    expect(mockOnChange.mock.calls.length).toBeGreaterThan(0);
  });

  it('calls onChange when last name is entered', async () => {
    const user = userEvent.setup();
    renderForm();

    const lastNameInput = screen.getByLabelText(/Last Name/i);
    await user.type(lastNameInput, 'Doe');

    expect(mockOnChange).toHaveBeenCalledWith('lastName', expect.any(String));
    expect(mockOnChange.mock.calls.length).toBeGreaterThan(0);
  });

  it('calls onChange when email is entered', async () => {
    const user = userEvent.setup();
    renderForm();

    const emailInput = screen.getByLabelText(/Email/i);
    await user.type(emailInput, 'test@test.com');

    expect(mockOnChange).toHaveBeenCalledWith('email', expect.any(String));
    expect(mockOnChange.mock.calls.length).toBeGreaterThan(0);
  });

  it('calls onChange when phone is entered', async () => {
    const user = userEvent.setup();
    renderForm();

    const phoneInput = screen.getByLabelText(/Phone Number/i);
    await user.type(phoneInput, '5551234');

    expect(mockOnChange).toHaveBeenCalledWith('phone', expect.any(String));
    expect(mockOnChange.mock.calls.length).toBeGreaterThan(0);
  });

  it('disables all fields when disabled prop is true', () => {
    renderForm({ disabled: true });

    expect(screen.getByLabelText(/First Name/i)).toBeDisabled();
    expect(screen.getByLabelText(/Last Name/i)).toBeDisabled();
    expect(screen.getByLabelText(/Email/i)).toBeDisabled();
    expect(screen.getByLabelText(/Phone Number/i)).toBeDisabled();
  });

  it('creates empty form data correctly', () => {
    const emptyData = createEmptyOtherPartyFormData();
    
    expect(emptyData).toEqual({
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    });
  });
});
