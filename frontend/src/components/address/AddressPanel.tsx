import { Label } from '@/components/ui/label';
import { AddressData } from '@/services/dtos';
import { MapPin } from 'lucide-react';
import React from 'react';
import { CityField } from './City';
import { CountryField } from './Country';
import { PostalCodeField } from './PostalCode';
import { StateProvinceField } from './StateProvince';
import { StreetNameField } from './StreetName';
import { StreetNumberField } from './StreetNumber';
import { UnitNumberField } from './UnitNumber';


export interface AddressPanelProps {
  addressData: AddressData;
  onAddressChange: (field: keyof AddressData, value: string) => void;
  errors?: { [K in keyof AddressData]?: string[] };
  disabled?: boolean;
  className?: string;
  showHeader?: boolean;
  headerText?: string;
}

/**
 * Complete Address Panel Component
 * 
 * Features:
 * - Complete address form with all fields using individual components
 * - Validation error display
 * - Toronto default placeholders
 * - Responsive grid layout
 * - Disabled state support
 * - Optional header
 */
const AddressPanel: React.FC<AddressPanelProps> = ({
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

export default AddressPanel;