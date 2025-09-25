import { AddressForm, createEmptyAddress, parseStreetNumber } from '@/components/address';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { contactLabelOptions } from '@/services/dtos/UserDtos';
import { AddressData } from '@/services/dtos';
import { ChevronDown, ChevronUp, Phone, Tag, User } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { EmailField } from './Email';
import { UsernameField } from './Username';
import { PasswordField } from './Password';
import { ConfirmPasswordField } from './ConfirmPassword';

export interface SignUpFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  // Optional fields
  phone: string;
  labels: string[];
  // Address fields
  unitNumber: string;
  streetNumber: string;
  streetName: string;
  city: string;
  stateOrProvince: string;
  postalOrZipCode: string;
  country: string;
}

export interface SignUpFormProps {
  // Optional form configuration
  title?: string;
  description?: string;
  inline?: boolean;
  className?: string;
  
  // Password visibility (controlled by parent)
  showPassword: boolean;
  showConfirmPassword: boolean;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  
  // Form callbacks
  onSignUpSuccess?: () => void;
  onSignUpError?: (error: string) => void;
  
  // Validation configuration
  enableValidation?: boolean;
  
  // External errors (from parent)
  errors?: Record<string, string[]>;
  
  // Address integration
  includeAddress?: boolean;
  requiredFields?: {
    firstName?: boolean;
    lastName?: boolean;
    username?: boolean;
    email?: boolean;
    password?: boolean;
    confirmPassword?: boolean;
    phone?: boolean;
    address?: boolean;
  };
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  title = "Create your account",
  description = "Enter your information to get started with BuildFlow",
  inline = false,
  className = '',
  showPassword,
  showConfirmPassword,
  onTogglePassword,
  onToggleConfirmPassword,
  onSignUpSuccess,
  onSignUpError,
  enableValidation = true,
  errors = {},
  includeAddress = true,
  requiredFields = {
    firstName: true,
    lastName: true,
    username: true,
    email: true,
    password: true,
    confirmPassword: true,
    phone: false,
    address: false
  }
}) => {
  // Initialize form with empty values
  const [signUpForm, setSignUpForm] = useState<SignUpFormData>(() => {
    const emptyAddress = createEmptyAddress();
    return {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      // Optional fields
      phone: '',
      labels: [] as string[],
      // Address fields with empty values (Toronto values will be placeholders)
      unitNumber: emptyAddress.unitNumber || '',
      streetNumber: emptyAddress.streetNumber || '',
      streetName: emptyAddress.streetName,
      city: emptyAddress.city,
      stateOrProvince: emptyAddress.stateOrProvince,
      postalOrZipCode: emptyAddress.postalOrZipCode || '',
      country: emptyAddress.country
    };
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [addressExpanded, setAddressExpanded] = useState(false);
  const [fieldValidations, setFieldValidations] = useState<Record<string, boolean>>({
    firstName: false,
    lastName: false,
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    phone: true, // Optional by default
    address: true // Optional by default
  });

  const { register } = useAuth();

  // Auto-parse street number when it contains alphabetic parts and street name is empty
  React.useEffect(() => {
    // Clear errors when user modifies the form
    if (submitError) {
      setSubmitError(null);
    }
    
    if (signUpForm.streetNumber && !signUpForm.streetName.trim()) {
      const parsed = parseStreetNumber(signUpForm.streetNumber);
      if (parsed.streetName) {
        // Auto-fill street name if parsing found one
        setSignUpForm(prev => ({
          ...prev,
          streetNumber: parsed.streetNumber,
          streetName: parsed.streetName
        }));
      }
    }
  }, [signUpForm.streetNumber, signUpForm.streetName, submitError]);

  // Handle field validation changes
  const handleFieldValidation = (fieldName: string, isValid: boolean) => {
    setFieldValidations(prev => ({ ...prev, [fieldName]: isValid }));
  };

  // Handle address data changes
  const handleAddressChange = (field: keyof AddressData, value: string) => {
    setSignUpForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Check if form is valid
  const isFormValid = useMemo(() => {
    const requiredValidations = Object.entries(requiredFields)
      .filter(([, isRequired]) => isRequired)
      .map(([field]) => fieldValidations[field])
      .every(isValid => isValid);

    const requiredFieldsHaveValues = Object.entries(requiredFields)
      .filter(([, isRequired]) => isRequired)
      .every(([field]) => {
        if (field === 'address') {
          return true; // Address validation handled separately
        }
        return signUpForm[field as keyof SignUpFormData]?.toString().trim() !== '';
      });

    return requiredValidations && requiredFieldsHaveValues;
  }, [fieldValidations, requiredFields, signUpForm]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!signUpForm.firstName || !signUpForm.lastName || !signUpForm.username || !signUpForm.email || !signUpForm.password) {
      const error = 'Please fill in all required fields.';
      setSubmitError(error);
      if (onSignUpError) onSignUpError(error);
      return;
    }

    if (signUpForm.password !== signUpForm.confirmPassword) {
      const error = 'Passwords do not match.';
      setSubmitError(error);
      if (onSignUpError) onSignUpError(error);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await register({
        username: signUpForm.username,
        password: signUpForm.password,
        contactRequestDto: {
          firstName: signUpForm.firstName,
          lastName: signUpForm.lastName,
          email: signUpForm.email,
          phone: signUpForm.phone || undefined,
          labels: signUpForm.labels,
          addressRequestDto: includeAddress ? {
            unitNumber: signUpForm.unitNumber || undefined,
            streetNumber: signUpForm.streetNumber || undefined,
            streetName: signUpForm.streetName,
            city: signUpForm.city,
            stateOrProvince: signUpForm.stateOrProvince,
            postalOrZipCode: signUpForm.postalOrZipCode || undefined,
            country: signUpForm.country
          } : undefined
        }
      });
      
      setSubmitSuccess(true);
      setTimeout(() => {
        if (onSignUpSuccess) onSignUpSuccess();
      }, 2000);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      setSubmitError(errorMessage);
      if (onSignUpError) onSignUpError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form content
  const formContent = (
    <form onSubmit={handleSignUp} className="space-y-6">
      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-xs">
            First Name
            {requiredFields.firstName && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              className="pl-10"
              value={signUpForm.firstName}
              onChange={(e) => setSignUpForm(prev => ({ ...prev, firstName: e.target.value }))}
              required={requiredFields.firstName}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-xs">
            Last Name
            {requiredFields.lastName && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="lastName"
              type="text"
              placeholder="Smith"
              className="pl-10"
              value={signUpForm.lastName}
              onChange={(e) => setSignUpForm(prev => ({ ...prev, lastName: e.target.value }))}
              required={requiredFields.lastName}
            />
          </div>
        </div>
      </div>

      {/* Username Field */}
      <UsernameField
        id="signupUsername"
        value={signUpForm.username}
        onChange={(value) => setSignUpForm(prev => ({ ...prev, username: value }))}
        enableValidation={enableValidation}
        validationMode={requiredFields.username ? 'required' : 'optional'}
        onValidationChange={(isValid) => handleFieldValidation('username', isValid)}
        errors={errors.username}
        placeholder="john_doe"
      />

      {/* Email Field */}
      <EmailField
        id="signupEmail"
        value={signUpForm.email}
        onChange={(value) => setSignUpForm(prev => ({ ...prev, email: value }))}
        enableValidation={enableValidation}
        validationMode={requiredFields.email ? 'required' : 'optional'}
        onValidationChange={(isValid) => handleFieldValidation('email', isValid)}
        errors={errors.email}
        placeholder="john@company.com"
      />

      {/* Password Fields */}
      <div className="grid grid-cols-1 gap-4">
        <PasswordField
          id="signupPassword"
          value={signUpForm.password}
          onChange={(value) => setSignUpForm(prev => ({ ...prev, password: value }))}
          placeholder="Create your password"
          showPassword={showPassword}
          onToggleVisibility={onTogglePassword}
          enableValidation={enableValidation}
          validationMode={requiredFields.password ? 'required' : 'optional'}
          validationType="signup"
          onValidationChange={(isValid) => handleFieldValidation('password', isValid)}
          errors={errors.password}
        />
        
        <ConfirmPasswordField
          id="confirmPassword"
          value={signUpForm.confirmPassword}
          onChange={(value) => setSignUpForm(prev => ({ ...prev, confirmPassword: value }))}
          placeholder="Confirm your password"
          showPassword={showConfirmPassword}
          onToggleVisibility={onToggleConfirmPassword}
          originalPassword={signUpForm.password}
          enableValidation={enableValidation}
          validationMode={requiredFields.confirmPassword ? 'required' : 'optional'}
          onValidationChange={(isValid) => handleFieldValidation('confirmPassword', isValid)}
          errors={errors.confirmPassword}
        />
      </div>

      {/* Optional Phone Field */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-xs">
          Phone Number
          {requiredFields.phone && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            className="pl-10"
            value={signUpForm.phone}
            onChange={(e) => setSignUpForm(prev => ({ ...prev, phone: e.target.value }))}
            required={requiredFields.phone}
          />
        </div>
      </div>

      {/* Labels Field */}
      <div className="space-y-2">
        <Label className="text-xs">Labels (Optional)</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                {signUpForm.labels.length > 0 
                  ? `${signUpForm.labels.length} selected` 
                  : 'Select labels'
                }
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            {contactLabelOptions.map((label) => (
              <DropdownMenuCheckboxItem
                key={label}
                checked={signUpForm.labels.includes(label)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSignUpForm(prev => ({ ...prev, labels: [...prev.labels, label] }));
                  } else {
                    setSignUpForm(prev => ({ ...prev, labels: prev.labels.filter(l => l !== label) }));
                  }
                }}
              >
                {label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {signUpForm.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {signUpForm.labels.map((label) => (
              <span key={label} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Address Section */}
      {includeAddress && (
        <Collapsible open={addressExpanded} onOpenChange={setAddressExpanded}>
          <CollapsibleTrigger asChild>
            <Button type="button" variant="outline" className="w-full justify-between">
              <span className="flex items-center">
                Address Information 
                {requiredFields.address && <span className="text-red-500 ml-1">*</span>}
                <span className="text-muted-foreground ml-2">(Optional)</span>
              </span>
              {addressExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            <AddressForm
              addressData={{
                unitNumber: signUpForm.unitNumber || '',
                streetNumber: signUpForm.streetNumber || '',
                streetName: signUpForm.streetName,
                city: signUpForm.city,
                stateOrProvince: signUpForm.stateOrProvince,
                postalOrZipCode: signUpForm.postalOrZipCode || '',
                country: signUpForm.country
              }}
              onAddressChange={handleAddressChange}
              onSubmit={() => {}} // No-op since this is integrated
              inline={true}
            />
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="p-4 rounded-md bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{submitError}</p>
        </div>
      )}

      {/* Success Message */}
      {submitSuccess && (
        <div className="p-4 rounded-md bg-green-50 border border-green-200">
          <p className="text-sm text-green-600">
            Account created successfully! Redirecting to login...
          </p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={!isFormValid || isSubmitting}
      >
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By creating an account, you agree to our{' '}
        <a href="/terms" className="text-primary hover:underline">Terms of Service</a>{' '}
        and{' '}
        <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
      </p>
    </form>
  );

  // Return inline version (just the form)
  if (inline) {
    return (
      <div className={className}>
        {formContent}
      </div>
    );
  }

  // Return card version (with header)
  return (
    <Card className={className}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">{title}</CardTitle>
        <CardDescription className="text-center">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {formContent}
      </CardContent>
    </Card>
  );
};

export default SignUpForm;