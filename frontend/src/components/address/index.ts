import { BaseAddressDto } from '@/services/dtos/AddressDtos';

// Base interface for all address field components
export interface BaseFieldProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  errors?: string[];
}

// Create an empty address data object
export const createEmptyAddress = (): AddressData => ({
  unitNumber: '',
  streetNumberAndName: '',
  city: '',
  stateOrProvince: '',
  postalOrZipCode: '',
  country: ''
});

export interface AddressData extends BaseAddressDto {

}

// Flexible Address Form Component (Primary Address Form)
export { addressFieldConfigs, default as FlexibleAddressForm } from './FlexibleAddressForm';
export type { AddressFieldConfig, FlexibleAddressFormProps } from './FlexibleAddressForm';

// Individual Address Field Components
export { CityField } from './City';
export { CountryField } from './Country';
export { PostalCodeField } from './PostalCode';
export { StateProvinceField } from './StateProvince';
export { StreetNameField } from './StreetName';
export { StreetNumberField } from './StreetNumber';
export { StreetNumberNameField } from './StreetNumberName';
export { UnitNumberField } from './UnitNumber';

// Field Component Prop Types
export type { CityFieldProps } from './City';
export type { CountryFieldProps } from './Country';
export type { PostalCodeFieldProps } from './PostalCode';
export type { StateProvinceFieldProps } from './StateProvince';
export type { StreetNameFieldProps } from './StreetName';
export type { StreetNumberFieldProps } from './StreetNumber';
export type { StreetNumberNameFieldProps } from './StreetNumberName';
export type { UnitNumberFieldProps } from './UnitNumber';

