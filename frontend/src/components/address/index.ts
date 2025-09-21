// Individual Address Field Components
export {
  UnitNumberField,
  StreetNumberField,
  StreetNameField,
  CityField,
  StateProvinceField,
  PostalCodeField,
  CountryField
} from './AddressFields';

export type {
  BaseFieldProps,
  UnitNumberFieldProps,
  StreetNumberFieldProps,
  StreetNameFieldProps,
  CityFieldProps,
  StateProvinceFieldProps,
  PostalCodeFieldProps,
  CountryFieldProps
} from './AddressFields';

// Complete Address Fields Component
export { default as AddressFields } from './AddressFields';
export type { AddressFieldsProps } from './AddressFields';

// Address Utilities (re-export from AddressFields)
export {
  TORONTO_DEFAULT_ADDRESS,
  createEmptyAddress,
  createTorontoDefaultAddress,
  formatAddress,
  isAddressEmpty,
  isAddressComplete,
  getAddressCompletionPercentage
} from './AddressFields';