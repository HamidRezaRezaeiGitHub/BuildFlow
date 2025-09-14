import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AddressData } from '@/services/dtos';
import { MapPin } from 'lucide-react';
import React from 'react';

// Base interface for all address field components
export interface BaseFieldProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  errors?: string[];
}

// Unit Number Field Component
export interface UnitNumberFieldProps extends BaseFieldProps {
  placeholder?: string;
}

export const UnitNumberField: React.FC<UnitNumberFieldProps> = ({
  id = 'unitNumber',
  value,
  onChange,
  disabled = false,
  className = '',
  errors = [],
  placeholder = 'Unit 101'
}) => (
  <div className={`space-y-2 ${className}`}>
    <Label htmlFor={id} className="text-xs">Unit/Apt/Suite</Label>
    <Input
      id={id}
      type="text"
      placeholder={placeholder}
      className={errors.length ? 'border-red-500 focus:border-red-500' : ''}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
    {errors.length > 0 && (
      <div className="space-y-1">
        {errors.map((error, index) => (
          <p key={index} className="text-xs text-red-500">{error}</p>
        ))}
      </div>
    )}
  </div>
);

// Street Number Field Component
export interface StreetNumberFieldProps extends BaseFieldProps {
  placeholder?: string;
}

export const StreetNumberField: React.FC<StreetNumberFieldProps> = ({
  id = 'streetNumber',
  value,
  onChange,
  disabled = false,
  className = '',
  errors = [],
  placeholder = '123'
}) => (
  <div className={`space-y-2 ${className}`}>
    <Label htmlFor={id} className="text-xs">Street Number</Label>
    <Input
      id={id}
      type="text"
      placeholder={placeholder}
      className={errors.length ? 'border-red-500 focus:border-red-500' : ''}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
    {errors.length > 0 && (
      <div className="space-y-1">
        {errors.map((error, index) => (
          <p key={index} className="text-xs text-red-500">{error}</p>
        ))}
      </div>
    )}
  </div>
);

// Street Name Field Component
export interface StreetNameFieldProps extends BaseFieldProps {
  placeholder?: string;
}

export const StreetNameField: React.FC<StreetNameFieldProps> = ({
  id = 'streetName',
  value,
  onChange,
  disabled = false,
  className = '',
  errors = [],
  placeholder = 'Bay Street'
}) => (
  <div className={`space-y-2 ${className}`}>
    <Label htmlFor={id} className="text-xs">Street Name</Label>
    <Input
      id={id}
      type="text"
      placeholder={placeholder}
      className={errors.length ? 'border-red-500 focus:border-red-500' : ''}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
    {errors.length > 0 && (
      <div className="space-y-1">
        {errors.map((error, index) => (
          <p key={index} className="text-xs text-red-500">{error}</p>
        ))}
      </div>
    )}
  </div>
);

// City Field Component
export interface CityFieldProps extends BaseFieldProps {
  placeholder?: string;
}

export const CityField: React.FC<CityFieldProps> = ({
  id = 'city',
  value,
  onChange,
  disabled = false,
  className = '',
  errors = [],
  placeholder = 'Toronto'
}) => (
  <div className={`space-y-2 ${className}`}>
    <Label htmlFor={id} className="text-xs">City</Label>
    <Input
      id={id}
      type="text"
      placeholder={placeholder}
      className={errors.length ? 'border-red-500 focus:border-red-500' : ''}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
    {errors.length > 0 && (
      <div className="space-y-1">
        {errors.map((error, index) => (
          <p key={index} className="text-xs text-red-500">{error}</p>
        ))}
      </div>
    )}
  </div>
);

// State/Province Field Component
export interface StateProvinceFieldProps extends BaseFieldProps {
  placeholder?: string;
}

export const StateProvinceField: React.FC<StateProvinceFieldProps> = ({
  id = 'stateOrProvince',
  value,
  onChange,
  disabled = false,
  className = '',
  errors = [],
  placeholder = 'ON'
}) => (
  <div className={`space-y-2 ${className}`}>
    <Label htmlFor={id} className="text-xs">Province/State</Label>
    <Input
      id={id}
      type="text"
      placeholder={placeholder}
      className={errors.length ? 'border-red-500 focus:border-red-500' : ''}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
    {errors.length > 0 && (
      <div className="space-y-1">
        {errors.map((error, index) => (
          <p key={index} className="text-xs text-red-500">{error}</p>
        ))}
      </div>
    )}
  </div>
);

// Postal/Zip Code Field Component
export interface PostalCodeFieldProps extends BaseFieldProps {
  placeholder?: string;
}

export const PostalCodeField: React.FC<PostalCodeFieldProps> = ({
  id = 'postalOrZipCode',
  value,
  onChange,
  disabled = false,
  className = '',
  errors = [],
  placeholder = 'M5H 2N2'
}) => (
  <div className={`space-y-2 ${className}`}>
    <Label htmlFor={id} className="text-xs">Postal Code/Zip Code</Label>
    <Input
      id={id}
      type="text"
      placeholder={placeholder}
      className={errors.length ? 'border-red-500 focus:border-red-500' : ''}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
    {errors.length > 0 && (
      <div className="space-y-1">
        {errors.map((error, index) => (
          <p key={index} className="text-xs text-red-500">{error}</p>
        ))}
      </div>
    )}
  </div>
);

// Country Field Component
export interface CountryFieldProps extends BaseFieldProps {
  placeholder?: string;
}

export const CountryField: React.FC<CountryFieldProps> = ({
  id = 'country',
  value,
  onChange,
  disabled = false,
  className = '',
  errors = [],
  placeholder = 'Canada'
}) => (
  <div className={`space-y-2 ${className}`}>
    <Label htmlFor={id} className="text-xs">Country</Label>
    <Input
      id={id}
      type="text"
      placeholder={placeholder}
      className={errors.length ? 'border-red-500 focus:border-red-500' : ''}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
    {errors.length > 0 && (
      <div className="space-y-1">
        {errors.map((error, index) => (
          <p key={index} className="text-xs text-red-500">{error}</p>
        ))}
      </div>
    )}
  </div>
);

export interface AddressFieldsProps {
  addressData: AddressData;
  onAddressChange: (field: keyof AddressData, value: string) => void;
  errors?: { [K in keyof AddressData]?: string[] };
  disabled?: boolean;
  className?: string;
  showHeader?: boolean;
  headerText?: string;
}

/**
 * Complete Address Fields Component
 * 
 * Features:
 * - Complete address form with all fields using individual components
 * - Validation error display
 * - Toronto default placeholders
 * - Responsive grid layout
 * - Disabled state support
 * - Optional header
 */
const AddressFields: React.FC<AddressFieldsProps> = ({
  addressData,
  onAddressChange,
  errors = {},
  disabled = false,
  className = '',
  showHeader = true,
  headerText = 'Business Address'
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Address Section Header */}
      {showHeader && (
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">{headerText}</Label>
        </div>
      )}
      
      {/* Unit Number and Street Number Row */}
      <div className="grid grid-cols-2 gap-4">
        <UnitNumberField
          value={addressData.unitNumber || ''}
          onChange={(value) => onAddressChange('unitNumber', value)}
          errors={errors.unitNumber}
          disabled={disabled}
        />
        
        <StreetNumberField
          value={addressData.streetNumber || ''}
          onChange={(value) => onAddressChange('streetNumber', value)}
          errors={errors.streetNumber}
          disabled={disabled}
        />
      </div>

      {/* Street Name */}
      <StreetNameField
        value={addressData.streetName}
        onChange={(value) => onAddressChange('streetName', value)}
        errors={errors.streetName}
        disabled={disabled}
      />

      {/* City and Province Row */}
      <div className="grid grid-cols-2 gap-4">
        <CityField
          value={addressData.city}
          onChange={(value) => onAddressChange('city', value)}
          errors={errors.city}
          disabled={disabled}
        />
        
        <StateProvinceField
          value={addressData.stateOrProvince}
          onChange={(value) => onAddressChange('stateOrProvince', value)}
          errors={errors.stateOrProvince}
          disabled={disabled}
        />
      </div>

      {/* Postal Code and Country Row */}
      <div className="grid grid-cols-2 gap-4">
        <PostalCodeField
          value={addressData.postalOrZipCode || ''}
          onChange={(value) => onAddressChange('postalOrZipCode', value)}
          errors={errors.postalOrZipCode}
          disabled={disabled}
        />
        
        <CountryField
          value={addressData.country}
          onChange={(value) => onAddressChange('country', value)}
          errors={errors.country}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default AddressFields;