// Address Utilities
export {
  createEmptyAddress,
  createTorontoDefaultAddress,
  formatAddress,
  getAddressCompletionPercentage,
  isAddressComplete,
  isAddressEmpty,
  TORONTO_DEFAULT_ADDRESS,
  validateStreetNumber
} from './Address';

export type { ValidationResult } from './Address';

// Complete Address Form Component (Recommended)
export { default as AddressForm, parseStreetNumber } from './AddressForm';
export type { AddressFormProps } from './AddressForm';

// Flexible Address Form Component with Customizable Fields
export { default as FlexibleAddressForm, addressFieldConfigs } from './FlexibleAddressForm';
export type { FlexibleAddressFormProps, AddressFieldConfig } from './FlexibleAddressForm';

// Individual Address Field Components
export { CityField } from './City';
export { CountryField } from './Country';
export { PostalCodeField } from './PostalCode';
export { StateProvinceField } from './StateProvince';
export { StreetNameField } from './StreetName';
export { StreetNumberField } from './StreetNumber';
export { UnitNumberField } from './UnitNumber';

// Field Component Prop Types
export type { BaseFieldProps } from './Address';
export type { CityFieldProps } from './City';
export type { CountryFieldProps } from './Country';
export type { PostalCodeFieldProps } from './PostalCode';
export type { StateProvinceFieldProps } from './StateProvince';
export type { StreetNameFieldProps } from './StreetName';
export type { StreetNumberFieldProps } from './StreetNumber';
export type { UnitNumberFieldProps } from './UnitNumber';

// Complete Address Panel Component (DEPRECATED - Use AddressForm instead)
export { default as AddressPanel } from './AddressPanel';
export type { AddressPanelProps } from './AddressPanel';

