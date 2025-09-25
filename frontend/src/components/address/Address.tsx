import { AddressData } from '@/services/dtos';

// Base interface for all address field components
export interface BaseFieldProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  errors?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Default Toronto address values
export const TORONTO_DEFAULT_ADDRESS: AddressData = {
  unitNumber: '',
  streetNumber: '100',
  streetName: 'Queen Street West',
  city: 'Toronto',
  stateOrProvince: 'ON',
  postalOrZipCode: 'M5H 2N2',
  country: 'Canada'
};

// Create an empty address data object
export const createEmptyAddress = (): AddressData => ({
  unitNumber: '',
  streetNumber: '',
  streetName: '',
  city: '',
  stateOrProvince: '',
  postalOrZipCode: '',
  country: ''
});

// Create address with Toronto defaults
export const createTorontoDefaultAddress = (): AddressData => ({
  ...TORONTO_DEFAULT_ADDRESS
});

// Format address for display
export const formatAddress = (address: AddressData): string => {
  const parts: string[] = [];

  if (address.unitNumber) {
    parts.push(`Unit ${address.unitNumber}`);
  }

  if (address.streetNumber || address.streetName) {
    const streetPart = [address.streetNumber, address.streetName].filter(Boolean).join(' ');
    if (streetPart) parts.push(streetPart);
  }

  if (address.city) {
    parts.push(address.city);
  }

  if (address.stateOrProvince) {
    parts.push(address.stateOrProvince);
  }

  if (address.postalOrZipCode) {
    parts.push(address.postalOrZipCode);
  }

  if (address.country) {
    parts.push(address.country);
  }

  return parts.join(', ');
};

// Check if address is empty
export const isAddressEmpty = (address: AddressData): boolean => {
  return Object.values(address).every(value => !value || !value.trim());
};

// Check if address is complete (all required fields filled)
export const isAddressComplete = (address: AddressData): boolean => {
  // Unit number and postal code are optional, others are required
  return !!(
    address.streetNumber?.trim() &&
    address.streetName?.trim() &&
    address.city?.trim() &&
    address.stateOrProvince?.trim() &&
    address.country?.trim()
  );
};

// Get address completion percentage
export const getAddressCompletionPercentage = (address: AddressData): number => {
  const totalFields = 7; // All fields including optional ones
  const filledFields = Object.values(address).filter(value => value && value.trim()).length;
  return Math.round((filledFields / totalFields) * 100);
};

/**
 * Validates street number (should only contain numbers)
 */
export const validateStreetNumber = (streetNumber: string): ValidationResult => {
  const errors: string[] = [];

  // Street number is optional, so only validate if provided
  if (streetNumber.trim()) {
    // Max length validation (from BaseAddressDto)
    if (streetNumber.length > 20) {
      errors.push('Street number must not exceed 20 characters');
    }

    // Should only contain numbers
    if (!/^\d+$/.test(streetNumber)) {
      errors.push('Street number must contain only numbers');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};