import { AddressData, AddressFieldConfig, createEmptyAddress, FlexibleAddressForm } from '@/components/address';
import FlexibleSignUpForm from '@/components/auth/FlexibleSignUpForm';
import { StandardBottomNavbar } from '@/components/navbar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { CreateProjectRequest, ProjectLocationRequest, projectService } from '@/services';
import { Building2, MapPin, User } from 'lucide-react';
import React from 'react';
import { useNavigate as useReactRouterNavigate } from 'react-router-dom';

// Constants
const FOCUS_TRANSITION_DELAY_MS = 100;

/**
 * Other party information data structure
 */
interface OtherPartyFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

/**
 * Multi-step form data state
 */
interface MultiStepFormState {
  // Step 1: User's role
  userRole: 'builder' | 'owner';

  // Step 2: Other party information (optional)
  otherParty: OtherPartyFormData;

  // Step 3: Project location
  projectLocation: AddressData;
}

/**
 * Helper function to focus on a step heading for accessibility
 */
const focusStep = (step: string) => {
  setTimeout(() => {
    const trigger = document.querySelector(`[data-step="${step}"]`);
    if (trigger instanceof HTMLElement) {
      trigger.focus();
    }
  }, FOCUS_TRANSITION_DELAY_MS);
};

/**
 * NewProject page component
 * 
 * Multi-step accordion flow for creating new construction projects:
 * - Step 1: User role selection (Builder or Owner)
 * - Step 2: Other party information (optional, role-dependent)
 * - Step 3: Project location (required address fields)
 * 
 * Features:
 * - Accordion-based navigation with Next/Previous buttons
 * - State persistence across steps
 * - Validation gating for required fields (Steps 1 & 3)
 * - Keyboard accessible with ARIA attributes
 * - Mobile-first responsive design
 */
export const NewProject: React.FC = () => {
  const navigate = useReactRouterNavigate();
  const { user, token } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Current active step (controlled accordion)
  const [activeStep, setActiveStep] = React.useState<string>('step-1');

  // Address field configuration following BaseAddressDto structure
  const addressFieldsConfig: AddressFieldConfig[] = [
    { field: 'unitNumber', colSpan: 1, required: false, show: true },
    { field: 'streetNumberAndName', colSpan: 1, required: true, show: true },
    { field: 'city', colSpan: 1, required: true, show: true },
    { field: 'stateOrProvince', colSpan: 1, required: true, show: true },
    { field: 'country', colSpan: 1, required: true, show: true },
    { field: 'postalOrZipCode', colSpan: 1, required: false, show: true }
  ];

  // Form state (single source of truth)
  const [formData, setFormData] = React.useState<MultiStepFormState>({
    userRole: 'builder',
    otherParty: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    },
    projectLocation: createEmptyAddress()
  });

  // Validation state for location
  const [isLocationValid, setIsLocationValid] = React.useState(false);

  // Validate address (required fields: streetNumberAndName, city, stateOrProvince, country)
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

  // Handle role change (Step 1)
  const handleRoleChange = (role: 'builder' | 'owner') => {
    setFormData(prev => ({ ...prev, userRole: role }));
  };

  // Handle other party field change (Step 2)
  const handleOtherPartyChange = (field: keyof OtherPartyFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      otherParty: { ...prev.otherParty, [field]: value }
    }));
  };

  // Handle address field change (Step 3)
  const handleAddressChange = (field: keyof AddressData, value: string) => {
    setFormData(prev => ({
      ...prev,
      projectLocation: { ...prev.projectLocation, [field]: value }
    }));
  };

  // Navigate to next step
  const handleNext = (currentStep: string) => {
    const stepMap: Record<string, string> = {
      'step-1': 'step-2',
      'step-2': 'step-3'
    };
    const nextStep = stepMap[currentStep];
    if (nextStep) {
      setActiveStep(nextStep);
      focusStep(nextStep);
    }
  };

  // Navigate to previous step
  const handlePrevious = (currentStep: string) => {
    const stepMap: Record<string, string> = {
      'step-2': 'step-1',
      'step-3': 'step-2'
    };
    const prevStep = stepMap[currentStep];
    if (prevStep) {
      setActiveStep(prevStep);
      focusStep(prevStep);
    }
  };

  // Handle final form submission
  const handleSubmit = async () => {
    if (!user || !token) {
      setError('You must be logged in to create a project');
      return;
    }

    // Validate Step 3 (location is required)
    if (!isLocationValid) {
      setError('Please complete all required address fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
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
        userId: user.id,
        role: formData.userRole === 'builder' ? 'BUILDER' : 'OWNER',
        location: locationRequest
      };

      console.log('Creating project with request:', createRequest);
      const response = await projectService.createProject(createRequest, token);

      console.log('Project created successfully:', response);

      // Navigate to project details page
      navigate(`/projects/${response.project.id}`);

    } catch (err) {
      console.error('Error creating project:', err);
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine the other party role based on user's role
  const otherPartyRole = formData.userRole === 'builder' ? 'owner' : 'builder';

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Content container with bottom padding to avoid overlap with bottom nav */}
      <section className="py-8 bg-background">
        <div className="mx-auto max-w-screen-2xl px-4 lg:px-8">
          {/* Page Header */}
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Create New Project
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Follow the steps below to set up your new construction project.
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="max-w-2xl mx-auto mb-6">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-destructive"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-destructive-foreground">
                      Error Creating Project
                    </h3>
                    <div className="mt-2 text-sm text-destructive-foreground/80">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Multi-Step Accordion Form */}
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Building2 className="h-5 w-5" />
                  New Project Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Accordion
                  type="single"
                  value={activeStep}
                  onValueChange={setActiveStep}
                  className="w-full"
                >
                  {/* Step 1: User Role Selection */}
                  <AccordionItem value="step-1">
                    <AccordionTrigger
                      data-step="step-1"
                      className="hover:no-underline"
                      disabled={isSubmitting}
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                          1
                        </div>
                        <div>
                          <div className="font-semibold">Your Role</div>
                          <div className="text-xs text-muted-foreground font-normal">
                            Are you the builder or owner?
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6 pt-4">
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
                              aria-pressed={formData.userRole === 'builder'}
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
                              aria-pressed={formData.userRole === 'owner'}
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

                        {/* Navigation Buttons */}
                        <div className="flex justify-end gap-3">
                          <Button
                            type="button"
                            onClick={() => handleNext('step-1')}
                            disabled={isSubmitting}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Step 2: Other Party Information */}
                  <AccordionItem value="step-2">
                    <AccordionTrigger
                      data-step="step-2"
                      className="hover:no-underline"
                      disabled={isSubmitting}
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                          2
                        </div>
                        <div>
                          <div className="font-semibold">
                            {otherPartyRole === 'owner' ? 'Owner' : 'Builder'} Information
                          </div>
                          <div className="text-xs text-muted-foreground font-normal">
                            Optional contact details
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6 pt-4">
                        {/* Other Party Information Form */}
                        <div>
                          <div className="mb-4">
                            <Label className="text-sm font-medium">
                              {otherPartyRole === 'owner' ? 'Owner' : 'Builder'} Information (Optional)
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              Provide information about the project {otherPartyRole.toLowerCase()}.
                              All fields are optional and can be updated later.
                            </p>
                          </div>

                          <FlexibleSignUpForm
                            fieldsConfig={[
                              { field: 'firstName', colSpan: 1, required: false, show: true },
                              { field: 'lastName', colSpan: 1, required: false, show: true },
                              { field: 'email', colSpan: 1, required: false, show: true },
                              { field: 'phone', colSpan: 1, required: false, show: true },
                              { field: 'password', show: false },
                              { field: 'confirmPassword', show: false },
                              { field: 'username', show: false }
                            ]}
                            includeAddress={false}
                            showPersonalInfoHeader={false}
                            inline={true}
                            enableValidation={false}
                            disabled={isSubmitting}
                            onFormDataChange={(flexibleFormData) => {
                              // Sync FlexibleSignUpForm changes back to parent state
                              if (flexibleFormData.firstName !== formData.otherParty.firstName) {
                                handleOtherPartyChange('firstName', flexibleFormData.firstName);
                              }
                              if (flexibleFormData.lastName !== formData.otherParty.lastName) {
                                handleOtherPartyChange('lastName', flexibleFormData.lastName);
                              }
                              if (flexibleFormData.email !== formData.otherParty.email) {
                                handleOtherPartyChange('email', flexibleFormData.email);
                              }
                              if (flexibleFormData.phone !== formData.otherParty.phone) {
                                handleOtherPartyChange('phone', flexibleFormData.phone);
                              }
                            }}
                            submitButtonText="Submit"
                            className="[&_button[type='submit']]:hidden"
                          />
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between gap-3 pt-4 border-t">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handlePrevious('step-2')}
                            disabled={isSubmitting}
                          >
                            Previous
                          </Button>
                          <Button
                            type="button"
                            onClick={() => handleNext('step-2')}
                            disabled={isSubmitting}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Step 3: Project Location */}
                  <AccordionItem value="step-3">
                    <AccordionTrigger
                      data-step="step-3"
                      className="hover:no-underline"
                      disabled={isSubmitting}
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                          3
                        </div>
                        <div>
                          <div className="font-semibold">Project Location</div>
                          <div className="text-xs text-muted-foreground font-normal">
                            Where will the project take place?
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6 pt-4">
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Project Address
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              Enter the complete address where the construction project will take place.
                            </p>
                          </div>

                          <FlexibleAddressForm
                            addressData={formData.projectLocation}
                            onAddressChange={handleAddressChange}
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

                        {/* Navigation & Action Buttons */}
                        <div className="flex justify-between gap-3">
                          <div className="flex gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handlePrevious('step-3')}
                              disabled={isSubmitting}
                            >
                              Previous
                            </Button>
                          </div>
                          <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting || !isLocationValid}
                          >
                            {isSubmitting ? 'Creating Project...' : 'Create Project'}
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Help Text */}
          <div className="max-w-2xl mx-auto mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Need help? Contact support or check our{' '}
              <button
                className="text-primary hover:text-primary/80 hover:underline transition-colors"
                onClick={() => console.log('Documentation clicked')}
              >
                documentation
              </button>{' '}
              for guidance on setting up projects.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Navigation - Mobile-first design */}
      <StandardBottomNavbar />
    </div>
  );
};