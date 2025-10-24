import FlexibleSignUpForm, { SignUpFieldConfig, FlexibleSignUpFormData } from '@/components/auth/FlexibleSignUpForm';
import { Label } from '@/components/ui/label';
import React, { useRef } from 'react';

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
 * - Reuses FlexibleSignUpForm for consistency
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
  
  // Track whether we've initialized to avoid calling onChange on mount
  const isInitializedRef = useRef(false);
  
  // Configuration for the 4 fields we need: firstName, lastName, email, phone
  // All fields are optional for this use case
  const fieldsConfig: SignUpFieldConfig[] = [
    { field: 'firstName', colSpan: 1, required: false, show: true },
    { field: 'lastName', colSpan: 1, required: false, show: true },
    { field: 'email', colSpan: 1, required: false, show: true },
    { field: 'phone', colSpan: 1, required: false, show: true },
    // Hide password and username fields - they won't be rendered
    { field: 'password', show: false },
    { field: 'confirmPassword', show: false },
    { field: 'username', show: false }
  ];

  // Handle form data changes from FlexibleSignUpForm
  const handleFormDataChange = (flexibleFormData: FlexibleSignUpFormData) => {
    // Skip the first call which is the initialization
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      return;
    }
    
    // Extract only the fields we care about and call onChange for each changed field
    if (flexibleFormData.firstName !== formData.firstName) {
      onChange('firstName', flexibleFormData.firstName);
    }
    if (flexibleFormData.lastName !== formData.lastName) {
      onChange('lastName', flexibleFormData.lastName);
    }
    if (flexibleFormData.email !== formData.email) {
      onChange('email', flexibleFormData.email);
    }
    if (flexibleFormData.phone !== formData.phone) {
      onChange('phone', flexibleFormData.phone);
    }
  };

  // Note: FlexibleSignUpForm manages its own internal state and doesn't support
  // controlled mode with external values. The form will start empty and sync changes
  // back to the parent via onFormDataChange. This is a limitation of the current
  // FlexibleSignUpForm implementation.
  
  return (
    <div className={className}>
      <div className="mb-4">
        <Label className="text-sm font-medium">
          {roleLabel} Information (Optional)
        </Label>
        <p className="text-xs text-muted-foreground mt-1">
          Provide information about the project {roleLabel.toLowerCase()}. 
          All fields are optional and can be updated later.
        </p>
      </div>

      <FlexibleSignUpForm
        fieldsConfig={fieldsConfig}
        includeAddress={false}
        showPersonalInfoHeader={false}
        inline={true}
        enableValidation={false}
        disabled={disabled}
        onFormDataChange={handleFormDataChange}
        submitButtonText="Submit"
        className="[&_button[type='submit']]:hidden"
      />
    </div>
  );
};
