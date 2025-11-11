import { AddressData } from '@/services/dtos';
import { render, screen } from '@testing-library/react';
import FlexibleAddressForm, { FlexibleAddressFormProps } from './FlexibleAddressForm';

describe('FlexibleAddressForm', () => {
    const mockOnAddressChange = vi.fn();
    const mockOnSubmit = vi.fn();

    const defaultAddressData: AddressData = {
        unitNumber: '',
        streetNumberAndName: '',
        city: '',
        stateOrProvince: '',
        postalOrZipCode: '',
        country: ''
    };

    const defaultProps: FlexibleAddressFormProps = {
        addressData: defaultAddressData,
        onAddressChange: mockOnAddressChange,
        onSubmit: mockOnSubmit
    };

    test('renders address form', () => {
        render(<FlexibleAddressForm {...defaultProps} />);
        expect(screen.getByRole('form')).toBeInTheDocument();
    });
});
