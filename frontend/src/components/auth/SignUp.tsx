import {
    CityField,
    CountryField,
    createEmptyAddress,
    PostalCodeField,
    StateProvinceField,
    StreetNameField,
    StreetNumberField,
    UnitNumberField
} from '@/components/address';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { contactLabelOptions } from '@/services/dtos/UserDtos';
import { validateSignUpForm, type SignUpFormData } from '@/utils/validation';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronDown, ChevronUp, Phone, Tag, User } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { EmailField, PasswordField } from './CredentialFields';

interface SignUpProps {
    showPassword: boolean;
    showConfirmPassword: boolean;
    onTogglePassword: () => void;
    onToggleConfirmPassword: () => void;
    onSignUpSuccess?: () => void; // Callback to switch to login tab
}

const SignUp: React.FC<SignUpProps> = ({
    showPassword,
    showConfirmPassword,
    onTogglePassword,
    onToggleConfirmPassword,
    onSignUpSuccess
}) => {
    const [isOptionalSectionOpen, setIsOptionalSectionOpen] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const { register } = useAuth();

    // Utility function to parse street number with alphabetic parts
    const parseStreetNumber = (input: string): { streetNumber: string; streetName: string } => {
        if (!input.trim()) {
            return { streetNumber: '', streetName: '' };
        }

        const trimmedInput = input.trim();
        
        // Match pattern: numeric part (possibly with suffix like A, B) followed by space and street name
        // Examples: "123 King St", "456A Main", "789 Queen Street West", "12B Bay Street"
        const match = trimmedInput.match(/^(\d+[A-Za-z]?)\s+(.+)$/);
        
        if (match) {
            const [, numericPart, streetPart] = match;
            const result = {
                streetNumber: numericPart.trim(),
                streetName: streetPart.trim()
            };
            // console.log(`Parsed "${trimmedInput}" -> Number: "${result.streetNumber}", Street: "${result.streetName}"`);
            return result;
        }

        // Special case: if input is purely numeric or numeric with letter suffix, keep as street number
        if (/^\d+[A-Za-z]?$/.test(trimmedInput)) {
            return { streetNumber: trimmedInput, streetName: '' };
        }

        // If no clear pattern, treat the whole input as street number
        return { streetNumber: trimmedInput, streetName: '' };
    };

    // Form state
    const [signUpForm, setSignUpForm] = useState(() => {
        const emptyAddress = createEmptyAddress();
        return {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            // Optional fields
            phone: '',
            labels: [] as string[],
            // Address fields with empty values (Toronto values will be placeholders)
            unitNumber: emptyAddress.unitNumber,
            streetNumber: emptyAddress.streetNumber,
            streetName: emptyAddress.streetName,
            city: emptyAddress.city,
            stateOrProvince: emptyAddress.stateOrProvince,
            postalOrZipCode: emptyAddress.postalOrZipCode,
            country: emptyAddress.country
        };
    });

    // Auto-parse street number when it contains alphabetic parts and street name is empty
    const parsedStreetData = useMemo(() => {
        // Clear errors when user modifies the form
        if (submitError) {
            setSubmitError(null);
        }
        
        if (signUpForm.streetNumber && !signUpForm.streetName.trim()) {
            const parsed = parseStreetNumber(signUpForm.streetNumber);
            
            // Only return parsed data if parsing actually separated the components
            if (parsed.streetName && parsed.streetNumber !== signUpForm.streetNumber) {
                return parsed;
            }
        }
        return null;
    }, [signUpForm.streetNumber, signUpForm.streetName, submitError]);

    // Apply parsed street data to form values
    const effectiveFormData = useMemo(() => {
        if (parsedStreetData) {
            return {
                ...signUpForm,
                streetNumber: parsedStreetData.streetNumber,
                streetName: parsedStreetData.streetName
            };
        }
        return signUpForm;
    }, [signUpForm, parsedStreetData]);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formValidation.isFormValid) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            // Transform form data to match SignUpData DTO structure
            const signUpData = {
                username: effectiveFormData.email, // Use email as username
                password: effectiveFormData.password,
                contactRequestDto: {
                    firstName: effectiveFormData.firstName,
                    lastName: effectiveFormData.lastName,
                    email: effectiveFormData.email,
                    phone: effectiveFormData.phone || undefined,
                    labels: effectiveFormData.labels,
                    addressRequestDto: {
                        unitNumber: effectiveFormData.unitNumber?.trim() || undefined,
                        streetNumber: effectiveFormData.streetNumber?.trim() || undefined,
                        streetName: effectiveFormData.streetName?.trim() || '',
                        city: effectiveFormData.city?.trim() || '',
                        stateOrProvince: effectiveFormData.stateOrProvince?.trim() || '',
                        postalOrZipCode: effectiveFormData.postalOrZipCode?.trim() || undefined,
                        country: effectiveFormData.country?.trim() || ''
                    }
                }
            };

            await register(signUpData);
            
            setSubmitSuccess(true);
            
            // Show success message and switch to login tab
            setTimeout(() => {
                onSignUpSuccess?.();
            }, 1500);
            
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Real-time form validation
    const formValidation = useMemo(() => {
        return validateSignUpForm(effectiveFormData as SignUpFormData);
    }, [effectiveFormData]);

    // Helper function to get validation errors for a specific field
    const getFieldErrors = (fieldName: keyof typeof formValidation.validations): string[] => {
        return formValidation.validations[fieldName]?.errors || [];
    };

    // Helper function to check if a field has errors
    const hasFieldErrors = (fieldName: keyof typeof formValidation.validations): boolean => {
        return !formValidation.validations[fieldName]?.isValid;
    };

    // Helper function to get displayable errors (filters out "required" messages)
    const getDisplayableErrors = (fieldName: keyof typeof formValidation.validations): string[] => {
        const errors = getFieldErrors(fieldName);
        return errors.filter(error => !error.toLowerCase().includes('is required'));
    };

    // Helper function to check if field should have error styling (includes "required" errors)
    const shouldShowErrorStyling = (fieldName: keyof typeof formValidation.validations): boolean => {
        return hasFieldErrors(fieldName);
    };

    return (
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Create an account</CardTitle>
                <CardDescription className="text-center">
                    Enter your details below to create your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="firstName"
                                    type="text"
                                    placeholder="John"
                                    className={`pl-10 ${shouldShowErrorStyling('firstName') ? 'border-red-500 focus:border-red-500' : ''}`}
                                    value={signUpForm.firstName}
                                    onChange={(e) => setSignUpForm(prev => ({ ...prev, firstName: e.target.value }))}
                                    required
                                />
                            </div>
                            {getDisplayableErrors('firstName').length > 0 && (
                                <div className="space-y-1">
                                    {getDisplayableErrors('firstName').map((error, index) => (
                                        <p key={index} className="text-xs text-red-500">{error}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                type="text"
                                placeholder="Doe"
                                className={shouldShowErrorStyling('lastName') ? 'border-red-500 focus:border-red-500' : ''}
                                value={signUpForm.lastName}
                                onChange={(e) => setSignUpForm(prev => ({ ...prev, lastName: e.target.value }))}
                                required
                            />
                            {getDisplayableErrors('lastName').length > 0 && (
                                <div className="space-y-1">
                                    {getDisplayableErrors('lastName').map((error, index) => (
                                        <p key={index} className="text-xs text-red-500">{error}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Email Field */}
                    <EmailField
                        id="signUpEmail"
                        value={signUpForm.email}
                        onChange={(e) => setSignUpForm(prev => ({ ...prev, email: e.target.value }))}
                        errors={getDisplayableErrors('email')}
                        hasError={shouldShowErrorStyling('email')}
                    />

                    {/* Password Field */}
                    <PasswordField
                        id="signUpPassword"
                        value={signUpForm.password}
                        onChange={(e) => setSignUpForm(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Create a strong password"
                        showPassword={showPassword}
                        onToggleVisibility={onTogglePassword}
                        errors={getDisplayableErrors('password')}
                        hasError={shouldShowErrorStyling('password')}
                    />

                    {/* Confirm Password Field */}
                    <PasswordField
                        id="confirmPassword"
                        value={signUpForm.confirmPassword}
                        onChange={(e) => setSignUpForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm your password"
                        showPassword={showConfirmPassword}
                        onToggleVisibility={onToggleConfirmPassword}
                        errors={getDisplayableErrors('confirmPassword')}
                        hasError={shouldShowErrorStyling('confirmPassword')}
                    />

                    {/* Optional Information Section - Collapsible */}
                    <Collapsible open={isOptionalSectionOpen} onOpenChange={setIsOptionalSectionOpen}>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="w-full justify-between p-0 font-normal">
                                <span className="text-sm text-muted-foreground">Additional Information (Optional)</span>
                                {isOptionalSectionOpen ? (
                                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-4 pt-4">
                            {/* Phone Field */}
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+1-555-123-4567"
                                        className={`pl-10 ${shouldShowErrorStyling('phone') ? 'border-red-500 focus:border-red-500' : ''}`}
                                        value={signUpForm.phone}
                                        onChange={(e) => setSignUpForm(prev => ({ ...prev, phone: e.target.value }))}
                                    />
                                </div>
                                {getDisplayableErrors('phone').length > 0 && (
                                    <div className="space-y-1">
                                        {getDisplayableErrors('phone').map((error, index) => (
                                            <p key={index} className="text-xs text-red-500">{error}</p>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Labels/Tags Field */}
                            <div className="space-y-2">
                                <Label htmlFor="labels">Professional Tags</Label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between"
                                            type="button"
                                        >
                                            <div className="flex items-center">
                                                <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                                                <span className="text-left">
                                                    {signUpForm.labels.length > 0
                                                        ? `${signUpForm.labels.length} selected`
                                                        : "Select professional tags"
                                                    }
                                                </span>
                                            </div>
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-full">
                                        {contactLabelOptions.map((option) => (
                                            <DropdownMenuCheckboxItem
                                                key={option}
                                                checked={signUpForm.labels.includes(option)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setSignUpForm(prev => ({
                                                            ...prev,
                                                            labels: [...prev.labels, option]
                                                        }));
                                                    } else {
                                                        setSignUpForm(prev => ({
                                                            ...prev,
                                                            labels: prev.labels.filter(label => label !== option)
                                                        }));
                                                    }
                                                }}
                                            >
                                                {option}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                {signUpForm.labels.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {signUpForm.labels.map((label) => (
                                            <span
                                                key={label}
                                                className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-primary/10 text-primary"
                                            >
                                                {label}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <p className="text-xs text-muted-foreground">Select one or more professional tags that describe your role</p>
                            </div>

                            {/* Address Section */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2 mb-4">
                                    <span className="text-sm font-medium">Business Address</span>
                                </div>

                                {/* Unit Number and Street Number Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <UnitNumberField
                                        value={signUpForm.unitNumber || ''}
                                        onChange={(value) => setSignUpForm(prev => ({ ...prev, unitNumber: value }))}
                                        placeholder="Unit 101"
                                    />

                                    <StreetNumberField
                                        value={effectiveFormData.streetNumber || ''}
                                        onChange={(value) => setSignUpForm(prev => ({ ...prev, streetNumber: value }))}
                                        errors={getFieldErrors('streetNumber')}
                                        placeholder="123"
                                    />
                                </div>

                                {/* Street Name */}
                                <StreetNameField
                                    value={effectiveFormData.streetName}
                                    onChange={(value) => setSignUpForm(prev => ({ ...prev, streetName: value }))}
                                    placeholder="Bay Street"
                                />

                                {/* City and Province Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <CityField
                                        value={signUpForm.city}
                                        onChange={(value) => setSignUpForm(prev => ({ ...prev, city: value }))}
                                        placeholder="Toronto"
                                    />

                                    <StateProvinceField
                                        value={signUpForm.stateOrProvince}
                                        onChange={(value) => setSignUpForm(prev => ({ ...prev, stateOrProvince: value }))}
                                        placeholder="ON"
                                    />
                                </div>

                                {/* Postal Code and Country Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <PostalCodeField
                                        value={signUpForm.postalOrZipCode || ''}
                                        onChange={(value) => setSignUpForm(prev => ({ ...prev, postalOrZipCode: value }))}
                                        placeholder="M5H 2N2"
                                    />

                                    <CountryField
                                        value={signUpForm.country}
                                        onChange={(value) => setSignUpForm(prev => ({ ...prev, country: value }))}
                                        placeholder="Canada"
                                    />
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

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
                        disabled={!formValidation.isFormValid || isSubmitting}
                    >
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                        By signing up, you agree to our{' '}
                        <a href="#" className="text-primary hover:underline">Terms of Service</a>{' '}
                        and{' '}
                        <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
};

export default SignUp;