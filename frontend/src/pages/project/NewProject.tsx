import { StandardBottomNavbar } from '@/components/navbar';
import { createEmptyAddress, FlexibleAddressForm, AddressFieldConfig, AddressData } from '@/components/address';
import { OtherPartyForm, OtherPartyFormData, createEmptyOtherPartyFormData } from '@/components/project/OtherPartyForm';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { CreateProjectRequest, ProjectLocationRequest, projectService } from '@/services';
import { Building2, User, MapPin } from 'lucide-react';
import React from 'react';
import { useNavigate as useReactRouterNavigate } from 'react-router-dom';

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
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = React.useState(false);

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
    otherParty: createEmptyOtherPartyFormData(),
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
      // Focus on the next step heading for accessibility
      setTimeout(() => {
        const nextTrigger = document.querySelector(`[data-step="${nextStep}"]`);
        if (nextTrigger instanceof HTMLElement) {
          nextTrigger.focus();
        }
      }, 100);
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
      // Focus on the previous step heading for accessibility
      setTimeout(() => {
        const prevTrigger = document.querySelector(`[data-step="${prevStep}"]`);
        if (prevTrigger instanceof HTMLElement) {
          prevTrigger.focus();
        }
      }, 100);
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
    setSuccessMessage(null);

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
        isBuilder: formData.userRole === 'builder',
        locationRequestDto: locationRequest
      };

      console.log('Creating project with request:', createRequest);
      const response = await projectService.createProject(createRequest, token);
      
      console.log('Project created successfully:', response);
      
      // Show success message
      setSuccessMessage(`Project created successfully! Project ID: ${response.project.id}`);
      
      // Navigate to projects list after a brief delay
      setTimeout(() => {
        try {
          navigate('/projects');
        } catch {
          navigate('/dashboard');
        }
      }, 2000);
      
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel with confirmation
  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    navigate(-1);
  };

  const cancelCancel = () => {
    setShowCancelConfirm(false);
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

          {/* Success Display */}
          {successMessage && (
            <div className="max-w-2xl mx-auto mb-6">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg 
                      className="h-5 w-5 text-green-500" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-500">
                      Project Created Successfully
                    </h3>
                    <div className="mt-2 text-sm text-foreground/80">
                      <p>{successMessage}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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

          {/* Cancel Confirmation Modal */}
          {showCancelConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <Card className="max-w-md mx-4">
                <CardHeader>
                  <CardTitle>Confirm Cancellation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Are you sure you want to cancel? Any information you've entered will be lost.
                  </p>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={cancelCancel}>
                      Continue Editing
                    </Button>
                    <Button variant="destructive" onClick={confirmCancel}>
                      Yes, Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
                          <div className="flex flex-col sm:flex-row gap-4">
                            <button
                              type="button"
                              onClick={() => handleRoleChange('builder')}
                              className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                                formData.userRole === 'builder'
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
                              className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                                formData.userRole === 'owner'
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
                        <div className="flex justify-end gap-3 pt-4 border-t">
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
                        <OtherPartyForm
                          otherPartyRole={otherPartyRole}
                          formData={formData.otherParty}
                          onChange={handleOtherPartyChange}
                          disabled={isSubmitting}
                        />

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
                            onSubmit={() => {}} // Not used - handled by parent
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
                        <div className="flex justify-between gap-3 pt-4 border-t">
                          <div className="flex gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handlePrevious('step-3')}
                              disabled={isSubmitting}
                            >
                              Previous
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleCancel}
                              disabled={isSubmitting}
                            >
                              Cancel
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