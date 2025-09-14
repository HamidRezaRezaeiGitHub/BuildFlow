import { AddressData } from '@/services/dtos';

/**
 * Address Utilities and Default Values
 * 
 * Provides default address values, validation helpers, and formatting utilities
 * for address components throughout the application
 */

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