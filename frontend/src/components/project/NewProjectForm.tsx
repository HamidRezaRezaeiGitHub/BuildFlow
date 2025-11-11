import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { AddressData, CreateProjectRequest, ProjectLocationRequest } from '@/services/dtos';
import { Building2, User } from 'lucide-react';
import React from 'react';
import { AddressFieldConfig, createEmptyAddress, FlexibleAddressForm } from '../address';

export interface NewProjectFormProps {
  /** Callback when form is submitted successfully */
  onSubmit: (request: CreateProjectRequest) => void | Promise<void>;

  /** Optional callback when form is cancelled/closed */
  onCancel?: () => void;

  /** Whether the form is currently submitting */
  isSubmitting?: boolean;

  /** Loading text to show when submitting */
  submittingText?: string;

  /** Additional CSS classes for the form container */
  className?: string;

  /** Whether to show form as inline (no card wrapper) */
  inline?: boolean;
}

interface FormData {
  userRole: 'builder' | 'owner';
  projectLocation: AddressData;
}

/**
 * NewProjectForm component for creating new construction projects
 * 
 * Features:
 * - User role selection (builder or owner) - indicates current user's role in the project
 * - Integrated address form for project location
 * - Form validation for location completeness
 * - Consistent styling with other forms in the application
 * 
 * The form creates a CreateProjectRequest with:
 * - userId: Always the current authenticated user's ID
 * - isBuilder: Boolean indicating if the current user is the builder (true) or owner (false)
 * - locationRequestDto: Complete project location details
 * 
 * Note: The other party (builder or owner) will be associated with the project later
 * through a separate process, so no other party information is required during creation.
 */
export const NewProjectForm: React.FC<NewProjectFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  submittingText = 'Creating Project...',
  className = '',
  inline = false
}) => {
  const { user } = useAuth();

  // Address field configuration following BaseAddressDto structure
  // Required: streetNumberAndName, city, stateOrProvince, country
  // Optional: unitNumber, postalOrZipCode
  const addressFieldsConfig: AddressFieldConfig[] = [
    { field: 'unitNumber', colSpan: 1, required: false, show: true },
    { field: 'streetNumberAndName', colSpan: 1, required: true, show: true },
    { field: 'city', colSpan: 1, required: true, show: true },
    { field: 'stateOrProvince', colSpan: 1, required: true, show: true },
    { field: 'country', colSpan: 1, required: true, show: true },
    { field: 'postalOrZipCode', colSpan: 1, required: false, show: true }
  ];

  // Form state
  const [formData, setFormData] = React.useState<FormData>({
    userRole: 'builder', // Default to builder
    projectLocation: createEmptyAddress()
  });

  const [hasBeenTouched, setHasBeenTouched] = React.useState({
    userRole: false,
    projectLocation: false
  });

  const [isLocationValid, setIsLocationValid] = React.useState(false);

  // Basic address validation - check if required fields are filled
  // Based on BaseAddressDto: required fields are streetNumberAndName, city, stateOrProvince, country
  // Optional fields: unitNumber, postalOrZipCode
  const validateAddress = React.useCallback((address: AddressData) => {
    const requiredFields: (keyof AddressData)[] = [
      'streetNumberAndName', 'city', 'stateOrProvince', 'country'
    ];

    return requiredFields.every(field => {
      const value = address[field];
      return value && value.trim().length > 0;
    });
  }, []);

  // Update location validation when address changes
  React.useEffect(() => {
    const isValid = validateAddress(formData.projectLocation);
    setIsLocationValid(isValid);
  }, [formData.projectLocation, validateAddress]);

  // Handle role change
  const handleRoleChange = (role: 'builder' | 'owner') => {
    setFormData(prev => ({ ...prev, userRole: role }));
    if (!hasBeenTouched.userRole) {
      setHasBeenTouched(prev => ({ ...prev, userRole: true }));
    }
  };

  // Handle address changes
  const handleAddressChange = (field: keyof AddressData, value: string) => {
    setFormData(prev => ({
      ...prev,
      projectLocation: { ...prev.projectLocation, [field]: value }
    }));

    if (!hasBeenTouched.projectLocation) {
      setHasBeenTouched(prev => ({ ...prev, projectLocation: true }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      console.error('User not authenticated');
      return;
    }

    // Mark all fields as touched for validation
    setHasBeenTouched({
      userRole: true,
      projectLocation: true
    });

    // Check if form is valid (only location needs to be valid now)
    if (!isLocationValid) {
      return;
    }

    // Create project request
    const locationRequest: ProjectLocationRequest = {
      unitNumber: formData.projectLocation.unitNumber,
      streetNumberAndName: formData.projectLocation.streetNumberAndName,
      city: formData.projectLocation.city,
      stateOrProvince: formData.projectLocation.stateOrProvince,
      postalOrZipCode: formData.projectLocation.postalOrZipCode,
      country: formData.projectLocation.country
    };

    const createRequest: CreateProjectRequest = {
      userId: user.id, // Always the current authenticated user
      role: formData.userRole === 'builder' ? 'BUILDER' : 'OWNER', // User's role in the project
      locationRequestDto: locationRequest,
    };

    await onSubmit(createRequest);
  };

  // Form is valid when location is valid
  const isFormValid = isLocationValid;

  const formContent = (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* User Role Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">I am the:</Label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleRoleChange('builder')}
            className={`flex-1 p-4 rounded-lg border-2 transition-colors ${formData.userRole === 'builder'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border hover:border-border/60'
              }`}
            disabled={isSubmitting}
          >
            <div className="flex items-center gap-2 justify-center">
              <Building2 className="h-5 w-5" />
              <span className="font-medium">Builder</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              I will be constructing this project
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('owner')}
            className={`flex-1 p-4 rounded-lg border-2 transition-colors ${formData.userRole === 'owner'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border hover:border-border/60'
              }`}
            disabled={isSubmitting}
          >
            <div className="flex items-center gap-2 justify-center">
              <User className="h-5 w-5" />
              <span className="font-medium">Owner</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              I own the property for this project
            </p>
          </button>
        </div>
      </div>

      {/* Project Location */}
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Project Location</Label>
          <p className="text-xs text-muted-foreground mt-1">
            Enter the complete address where the construction project will take place.
          </p>
        </div>

        <FlexibleAddressForm
          addressData={formData.projectLocation}
          onAddressChange={handleAddressChange}
          onSubmit={() => { }} // Not used - handled by parent form
          fieldsConfig={addressFieldsConfig}
          inline={true}
          enableValidation={true}
          isSkippable={false}
          showAddressPanelHeader={false}
          disabled={isSubmitting}
          noFormWrapper={true}
          showActionButtons={false}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting || !isFormValid}
        >
          {isSubmitting ? submittingText : 'Create Project'}
        </Button>
      </div>
    </form>
  );

  // Return inline version (just the form)
  if (inline) {
    return formContent;
  }

  // Return card version (with header)
  return (
    <Card className={`w-full max-w-2xl mx-auto`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-6 w-6" />
          Create New Project
        </CardTitle>
        <CardDescription>
          Set up a new construction project by specifying your role and the project location.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {formContent}
      </CardContent>
    </Card>
  );
};