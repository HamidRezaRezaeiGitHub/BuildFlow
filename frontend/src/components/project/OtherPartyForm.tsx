import { EmailField, NameField, PhoneField } from '@/components/auth';
import { Label } from '@/components/ui/label';
import React from 'react';

/**
 * Form data for capturing other party information (Owner or Builder)
 * All fields are optional as this is supplementary information
 */
export interface OtherPartyFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

/**
 * Props for OtherPartyForm component
 */
export interface OtherPartyFormProps {
  /** The role of the other party - determines form header text */
  otherPartyRole: 'owner' | 'builder';
  
  /** Form data */
  formData: OtherPartyFormData;
  
  /** Callback when form data changes */
  onChange: (field: keyof OtherPartyFormData, value: string) => void;
  
  /** Whether the form is disabled (e.g., during submission) */
  disabled?: boolean;
  
  /** Additional CSS classes */
  className?: string;
}

/**
 * Create empty other party form data
 */
export const createEmptyOtherPartyFormData = (): OtherPartyFormData => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
});

/**
 * OtherPartyForm component for capturing Owner or Builder information
 * 
 * This form is used in Step 2 of the new project creation flow.
 * All fields are optional - the form provides helpful information
 * about the other party but doesn't enforce completion.
 * 
 * Features:
 * - Dynamically adapts to show "Owner" or "Builder" based on current user's role
 * - All fields optional with non-blocking validation hints
 * - Reuses existing auth field components for consistency
 * - Mobile-first responsive design
 */
export const OtherPartyForm: React.FC<OtherPartyFormProps> = ({
  otherPartyRole,
  formData,
  onChange,
  disabled = false,
  className = ''
}) => {
  const roleLabel = otherPartyRole === 'owner' ? 'Owner' : 'Builder';
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <Label className="text-sm font-medium">
          {roleLabel} Information (Optional)
        </Label>
        <p className="text-xs text-muted-foreground mt-1">
          Provide information about the project {roleLabel.toLowerCase()}. 
          All fields are optional and can be updated later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NameField
          nameType="firstName"
          value={formData.firstName}
          onChange={(value) => onChange('firstName', value)}
          disabled={disabled}
          enableValidation={false}
          validationMode="optional"
        />

        <NameField
          nameType="lastName"
          value={formData.lastName}
          onChange={(value) => onChange('lastName', value)}
          disabled={disabled}
          enableValidation={false}
          validationMode="optional"
        />
      </div>

      <EmailField
        value={formData.email}
        onChange={(value) => onChange('email', value)}
        disabled={disabled}
        enableValidation={false}
        validationMode="optional"
      />

      <PhoneField
        value={formData.phone}
        onChange={(value) => onChange('phone', value)}
        disabled={disabled}
        enableValidation={false}
        validationMode="optional"
      />
    </div>
  );
};
