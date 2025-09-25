import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { AddressData, CreateProjectRequest, ProjectLocationRequestDto } from '@/services/dtos';
import { Building2, Mail, User } from 'lucide-react';
import React from 'react';
import AddressForm from '../address/AddressForm';
import { createEmptyAddress } from '../address/Address';

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
}

interface FormData {
  userRole: 'builder' | 'owner';
  otherPartyIdentifier: string; // Username or email of the other party
  projectLocation: AddressData;
}

/**
 * NewProjectForm component for creating new construction projects
 * 
 * Features:
 * - User role selection (builder or owner)
 * - Other party identifier input (username/email)
 * - Integrated address form for project location
 * - Form validation using the validation service
 * - Consistent styling with other forms in the application
 */
export const NewProjectForm: React.FC<NewProjectFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  submittingText = 'Creating Project...',
  className = ''
}) => {
  const { user } = useAuth();
  
  // Form state
  const [formData, setFormData] = React.useState<FormData>({
    userRole: 'builder', // Default to builder
    otherPartyIdentifier: '',
    projectLocation: createEmptyAddress()
  });

  // Validation state
  const [validationErrors, setValidationErrors] = React.useState<{
    userRole?: string[];
    otherPartyIdentifier?: string[];
    projectLocation?: boolean;
  }>({});

  const [hasBeenTouched, setHasBeenTouched] = React.useState({
    userRole: false,
    otherPartyIdentifier: false,
    projectLocation: false
  });

  const [isLocationValid, setIsLocationValid] = React.useState(false);

  // Basic address validation - check if required fields are filled
  const validateAddress = React.useCallback((address: AddressData) => {
    const requiredFields: (keyof AddressData)[] = [
      'streetName', 'city', 'stateOrProvince', 'country'
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

  // Validate other party identifier
  const validateOtherPartyIdentifier = React.useCallback((value: string) => {
    const rules = [
      {
        name: 'required',
        message: 'Please enter the username or email of the other party',
        validator: (val: string) => !!val && val.trim().length > 0
      },
      {
        name: 'format',
        message: 'Please enter a valid username or email address',
        validator: (val: string) => {
          if (!val) return false;
          // Check if it's email format or a simple username
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const usernameRegex = /^[a-zA-Z0-9_.-]{3,}$/;
          return emailRegex.test(val) || usernameRegex.test(val);
        }
      }
    ];

    const errors: string[] = [];
    for (const rule of rules) {
      if (!rule.validator(value)) {
        errors.push(rule.message);
      }
    }

    return { isValid: errors.length === 0, errors };
  }, []);

  // Handle role change
  const handleRoleChange = (role: 'builder' | 'owner') => {
    setFormData(prev => ({ ...prev, userRole: role }));
    if (!hasBeenTouched.userRole) {
      setHasBeenTouched(prev => ({ ...prev, userRole: true }));
    }
  };

  // Handle other party identifier change
  const handleOtherPartyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, otherPartyIdentifier: value }));
    
    if (!hasBeenTouched.otherPartyIdentifier) {
      setHasBeenTouched(prev => ({ ...prev, otherPartyIdentifier: true }));
    }

    // Validate if touched
    if (hasBeenTouched.otherPartyIdentifier) {
      const validation = validateOtherPartyIdentifier(value);
      setValidationErrors(prev => ({ 
        ...prev, 
        otherPartyIdentifier: validation.errors 
      }));
    }
  };

  // Handle other party identifier blur
  const handleOtherPartyBlur = () => {
    if (!hasBeenTouched.otherPartyIdentifier) {
      setHasBeenTouched(prev => ({ ...prev, otherPartyIdentifier: true }));
    }
    
    const validation = validateOtherPartyIdentifier(formData.otherPartyIdentifier);
    setValidationErrors(prev => ({ 
      ...prev, 
      otherPartyIdentifier: validation.errors 
    }));
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
      otherPartyIdentifier: true,
      projectLocation: true
    });

    // Validate other party identifier
    const otherPartyValidation = validateOtherPartyIdentifier(formData.otherPartyIdentifier);
    
    // Check if form is valid
    const isFormValid = otherPartyValidation.isValid && isLocationValid;
    
    if (!isFormValid) {
      setValidationErrors(prev => ({
        ...prev,
        otherPartyIdentifier: otherPartyValidation.errors
      }));
      return;
    }

    // Create project request
    const locationRequest: ProjectLocationRequestDto = {
      unitNumber: formData.projectLocation.unitNumber,
      streetNumber: formData.projectLocation.streetNumber,
      streetName: formData.projectLocation.streetName,
      city: formData.projectLocation.city,
      stateOrProvince: formData.projectLocation.stateOrProvince,
      postalOrZipCode: formData.projectLocation.postalOrZipCode,
      country: formData.projectLocation.country
    };

    const createRequest: CreateProjectRequest = {
      builderId: formData.userRole === 'builder' ? user.id : 'placeholder-id', // TODO: Resolve other party ID
      ownerId: formData.userRole === 'owner' ? user.id : 'placeholder-id', // TODO: Resolve other party ID
      locationRequestDto: locationRequest
    };

    await onSubmit(createRequest);
  };

  // Get validation errors for display
  const otherPartyErrors = hasBeenTouched.otherPartyIdentifier ? 
    (validationErrors.otherPartyIdentifier || []) : [];

  const isFormValid = (
    validationErrors.otherPartyIdentifier?.length === 0 &&
    isLocationValid
  );

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-6 w-6" />
          Create New Project
        </CardTitle>
        <CardDescription>
          Set up a new construction project by specifying your role and the project details.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Role Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">I am the:</Label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleRoleChange('builder')}
                className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                  formData.userRole === 'builder'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-muted-foreground/20 hover:border-muted-foreground/40'
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
                className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                  formData.userRole === 'owner'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-muted-foreground/20 hover:border-muted-foreground/40'
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

          {/* Other Party Identifier */}
          <div className="space-y-2">
            <Label htmlFor="otherParty" className="text-sm font-medium">
              {formData.userRole === 'builder' 
                ? "Property Owner's Username or Email" 
                : "Builder's Username or Email"}
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="otherParty"
                type="text"
                placeholder={formData.userRole === 'builder' 
                  ? "owner@example.com or owner_username" 
                  : "builder@example.com or builder_username"}
                value={formData.otherPartyIdentifier}
                onChange={handleOtherPartyChange}
                onBlur={handleOtherPartyBlur}
                disabled={isSubmitting}
                className={`pl-10 ${otherPartyErrors.length > 0 ? 'border-destructive' : ''}`}
              />
            </div>
            {otherPartyErrors.length > 0 && (
              <div className="text-sm text-destructive">
                {otherPartyErrors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Enter the username or email address of the {formData.userRole === 'builder' ? 'property owner' : 'builder'}.
            </p>
          </div>

          {/* Project Location */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Project Location</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Enter the complete address where the construction project will take place.
              </p>
            </div>
            
            <AddressForm
              addressData={formData.projectLocation}
              onAddressChange={handleAddressChange}
              onSubmit={() => {}} // Not used - handled by parent form
              inline={true}
              enableValidation={true}
              isSkippable={false}
              showAddressPanelHeader={false}
              disabled={isSubmitting}
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
      </CardContent>
    </Card>
  );
};