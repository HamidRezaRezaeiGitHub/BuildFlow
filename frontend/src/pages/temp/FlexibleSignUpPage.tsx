import { FlexibleSignUpForm, FlexibleSignUpFormData, SignUpFieldConfig, signUpFieldConfigs } from '@/components/auth';
import { AddressFieldConfig, addressFieldConfigs } from '@/components/address';
import { ConfigurableNavbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import React, { useState } from 'react';

// Types for form configuration UI
type FormType = 'fixed' | 'flexible';
type PersonalInfoPreset = keyof typeof signUpFieldConfigs | 'custom';
type AddressPreset = keyof typeof addressFieldConfigs | 'custom';

interface PersonalFieldState {
    show: boolean;
    required: boolean;
    colSpan: 1 | 2;
}

/**
 * Enhanced FlexibleSignUpPage for comprehensive testing of FlexibleSignUpForm
 * 
 * Features:
 * - Choose between Fixed and Flexible form modes
 * - For Flexible: Select from preset layouts or create custom field configuration
 * - Individual field control: show/hide, required/optional, column span
 * - Address section configuration: include/exclude, collapsible, expanded by default
 * - Validation mode toggle (enabled/disabled)
 * - Sample data loading
 * - Real-time form configuration testing
 */
const FlexibleSignUpPage: React.FC = () => {
    // Form state
    const [formData, setFormData] = useState<FlexibleSignUpFormData | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    // Form type and configuration
    const [formType, setFormType] = useState<FormType>('flexible');
    const [personalInfoPreset, setPersonalInfoPreset] = useState<PersonalInfoPreset>('full');
    const [addressPreset, setAddressPreset] = useState<AddressPreset>('full');
    
    // Form behavior settings
    const [enableValidation, setEnableValidation] = useState(true);
    const [includeAddress, setIncludeAddress] = useState(true);
    const [addressCollapsible, setAddressCollapsible] = useState(true);
    const [addressExpandedByDefault, setAddressExpandedByDefault] = useState(false);
    const [showPersonalInfoHeader, setShowPersonalInfoHeader] = useState(true);
    const [showAddressPanelHeader, setShowAddressPanelHeader] = useState(false);
    const [inline, setInline] = useState(false);
    const [buttonLayout, setButtonLayout] = useState<'horizontal' | 'vertical'>('horizontal');

    // Individual field states for custom configuration
    const [personalFieldStates, setPersonalFieldStates] = useState<{ [K in keyof FlexibleSignUpFormData]: PersonalFieldState }>({
        firstName: { show: true, required: true, colSpan: 1 },
        lastName: { show: true, required: true, colSpan: 1 },
        username: { show: true, required: true, colSpan: 1 },
        email: { show: true, required: true, colSpan: 1 },
        phone: { show: true, required: false, colSpan: 2 },
        password: { show: true, required: true, colSpan: 1 },
        confirmPassword: { show: true, required: true, colSpan: 1 },
        // Address fields (used when address is not collapsible)
        unitNumber: { show: true, required: false, colSpan: 1 },
        streetNumber: { show: true, required: true, colSpan: 1 },
        streetName: { show: true, required: true, colSpan: 2 },
        city: { show: true, required: true, colSpan: 1 },
        stateOrProvince: { show: true, required: true, colSpan: 1 },
        postalOrZipCode: { show: true, required: true, colSpan: 1 },
        country: { show: true, required: true, colSpan: 1 }
    });

    // Generate current configuration based on settings
    const getCurrentPersonalInfoConfig = (): SignUpFieldConfig[] | keyof typeof signUpFieldConfigs => {
        if (personalInfoPreset !== 'custom') {
            return personalInfoPreset;
        }

        // Generate custom configuration from individual field states
        const personalInfoFields: (keyof FlexibleSignUpFormData)[] = [
            'firstName', 'lastName', 'username', 'email', 'phone', 'password', 'confirmPassword'
        ];

        return personalInfoFields
            .filter(field => personalFieldStates[field].show)
            .map(field => ({
                field,
                show: personalFieldStates[field].show,
                required: personalFieldStates[field].required,
                colSpan: personalFieldStates[field].colSpan
            })) as SignUpFieldConfig[];
    };

    const getCurrentAddressConfig = (): AddressFieldConfig[] | keyof typeof addressFieldConfigs => {
        if (addressPreset !== 'custom') {
            return addressPreset;
        }

        // Use default full configuration for custom address
        return 'full';
    };

    // Handle form data changes
    const handleFormDataChange = (data: FlexibleSignUpFormData) => {
        setFormData(data);
    };

    // Handle validation state changes
    const handleValidationStateChange = (isValid: boolean) => {
        setIsFormValid(isValid);
    };

    // Handle loading state changes
    const handleLoadingStateChange = (isLoading: boolean) => {
        setIsSubmitting(isLoading);
    };

    // Handle form submission
    const handleFormSubmit = (data: FlexibleSignUpFormData) => {
        console.log('Form submitted with data:', data);
        setSubmitMessage('Form submitted successfully! Check console for details.');
        setTimeout(() => setSubmitMessage(''), 3000);
    };

    // Handle signup success
    const handleSignUpSuccess = () => {
        setSubmitMessage('Sign up successful!');
        setTimeout(() => setSubmitMessage(''), 3000);
    };

    // Handle signup error
    const handleSignUpError = (error: string) => {
        setSubmitMessage(`Sign up error: ${error}`);
        setTimeout(() => setSubmitMessage(''), 5000);
    };

    // Load sample data
    const loadSampleData = () => {
        // This would typically come from the form's internal state
        setSubmitMessage('Sample data would be loaded into the form');
        setTimeout(() => setSubmitMessage(''), 3000);
    };

    // Update personal field state
    const updatePersonalFieldState = (field: keyof FlexibleSignUpFormData, updates: Partial<PersonalFieldState>) => {
        setPersonalFieldStates(prev => ({
            ...prev,
            [field]: { ...prev[field], ...updates }
        }));
    };

    // Reset to defaults
    const resetToDefaults = () => {
        setFormType('flexible');
        setPersonalInfoPreset('full');
        setAddressPreset('full');
        setEnableValidation(true);
        setIncludeAddress(true);
        setAddressCollapsible(true);
        setAddressExpandedByDefault(false);
        setShowPersonalInfoHeader(true);
        setShowAddressPanelHeader(false);
        setInline(false);
        setButtonLayout('horizontal');
        setSubmitMessage('Configuration reset to defaults');
        setTimeout(() => setSubmitMessage(''), 3000);
    };

    return (
        <div className="min-h-screen bg-background">
            <ConfigurableNavbar />
            
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Flexible Sign Up Form Testing</h1>
                    <p className="text-muted-foreground">
                        Test all configurations and options of the FlexibleSignUpForm component.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Configuration Panel */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Form Configuration</CardTitle>
                                <CardDescription>
                                    Customize the form appearance and behavior
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Form Type Selection */}
                                <div className="space-y-2">
                                    <Label>Form Type</Label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="w-full justify-between">
                                                {formType === 'flexible' ? 'Flexible Form' : 'Fixed Form (for comparison)'}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-full">
                                            <DropdownMenuItem onClick={() => setFormType('flexible')}>
                                                Flexible Form
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setFormType('fixed')}>
                                                Fixed Form (for comparison)
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Personal Info Configuration */}
                                {formType === 'flexible' && (
                                    <div className="space-y-2">
                                        <Label>Personal Info Fields</Label>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="w-full justify-between">
                                                    {personalInfoPreset === 'full' ? 'Full (All fields)' :
                                                     personalInfoPreset === 'minimal' ? 'Minimal' :
                                                     personalInfoPreset === 'essential' ? 'Essential (Username, Email, Password only)' :
                                                     personalInfoPreset === 'extended' ? 'Extended' : 'Custom'}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-full">
                                                <DropdownMenuItem onClick={() => setPersonalInfoPreset('full')}>
                                                    Full (All fields)
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setPersonalInfoPreset('minimal')}>
                                                    Minimal
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setPersonalInfoPreset('essential')}>
                                                    Essential (Username, Email, Password only)
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setPersonalInfoPreset('extended')}>
                                                    Extended
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setPersonalInfoPreset('custom')}>
                                                    Custom
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )}

                                {/* Custom Personal Fields Configuration */}
                                {formType === 'flexible' && personalInfoPreset === 'custom' && (
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium">Custom Personal Fields</Label>
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {(['firstName', 'lastName', 'username', 'email', 'phone', 'password', 'confirmPassword'] as const).map(field => (
                                                <div key={field} className="flex items-center justify-between p-2 border rounded">
                                                    <div className="flex items-center space-x-2">
                                                        <Switch
                                                            checked={personalFieldStates[field].show}
                                                            onCheckedChange={(checked) => updatePersonalFieldState(field, { show: checked })}
                                                        />
                                                        <span className="text-sm capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                        {(['username', 'password', 'confirmPassword'].includes(field)) && (
                                                            <Badge variant="secondary" className="text-xs">Mandatory</Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex space-x-1">
                                                        <Button
                                                            size="sm"
                                                            variant={personalFieldStates[field].required ? "default" : "outline"}
                                                            onClick={() => updatePersonalFieldState(field, { required: !personalFieldStates[field].required })}
                                                            className="text-xs px-2 py-1"
                                                        >
                                                            Req
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => updatePersonalFieldState(field, { 
                                                                colSpan: personalFieldStates[field].colSpan === 1 ? 2 : 1 
                                                            })}
                                                            className="text-xs px-2 py-1"
                                                        >
                                                            {personalFieldStates[field].colSpan}x
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Address Configuration */}
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <Switch checked={includeAddress} onCheckedChange={setIncludeAddress} />
                                        <Label>Include Address Section</Label>
                                    </div>

                                    {includeAddress && (
                                        <>
                                            <div className="flex items-center space-x-2">
                                                <Switch checked={addressCollapsible} onCheckedChange={setAddressCollapsible} />
                                                <Label>Address Collapsible</Label>
                                            </div>

                                            {addressCollapsible && (
                                                <div className="flex items-center space-x-2">
                                                    <Switch checked={addressExpandedByDefault} onCheckedChange={setAddressExpandedByDefault} />
                                                    <Label>Expanded by Default</Label>
                                                </div>
                                            )}

                                            {formType === 'flexible' && (
                                                <div className="space-y-2">
                                                    <Label>Address Fields</Label>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="outline" className="w-full justify-between">
                                                                {addressPreset === 'full' ? 'Full' :
                                                                 addressPreset === 'minimal' ? 'Minimal' :
                                                                 addressPreset === 'shipping' ? 'Shipping' :
                                                                 addressPreset === 'international' ? 'International' :
                                                                 addressPreset === 'combined' ? 'Combined' : 'Custom'}
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent className="w-full">
                                                            <DropdownMenuItem onClick={() => setAddressPreset('full')}>
                                                                Full
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => setAddressPreset('minimal')}>
                                                                Minimal
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => setAddressPreset('shipping')}>
                                                                Shipping
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => setAddressPreset('international')}>
                                                                International
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => setAddressPreset('combined')}>
                                                                Combined
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => setAddressPreset('custom')}>
                                                                Custom
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Form Behavior Settings */}
                                <div className="space-y-3 border-t pt-3">
                                    <Label className="text-sm font-medium">Form Behavior</Label>
                                    
                                    <div className="flex items-center space-x-2">
                                        <Switch checked={enableValidation} onCheckedChange={setEnableValidation} />
                                        <Label>Enable Validation</Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Switch checked={showPersonalInfoHeader} onCheckedChange={setShowPersonalInfoHeader} />
                                        <Label>Show Personal Info Header</Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Switch checked={showAddressPanelHeader} onCheckedChange={setShowAddressPanelHeader} />
                                        <Label>Show Address Panel Header</Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Switch checked={inline} onCheckedChange={setInline} />
                                        <Label>Inline Mode (No Card)</Label>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Button Layout</Label>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="w-full justify-between">
                                                    {buttonLayout === 'horizontal' ? 'Horizontal' : 'Vertical'}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-full">
                                                <DropdownMenuItem onClick={() => setButtonLayout('horizontal')}>
                                                    Horizontal
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setButtonLayout('vertical')}>
                                                    Vertical
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2 border-t pt-3">
                                    <Button onClick={loadSampleData} variant="outline" className="w-full">
                                        Load Sample Data
                                    </Button>
                                    <Button onClick={resetToDefaults} variant="outline" className="w-full">
                                        Reset to Defaults
                                    </Button>
                                </div>

                                {/* Status Messages */}
                                {submitMessage && (
                                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-md">
                                        <p className="text-sm text-primary">{submitMessage}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Current Configuration Summary */}
                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle className="text-lg">Configuration Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <div><strong>Form Type:</strong> {formType}</div>
                                    {formType === 'flexible' && (
                                        <>
                                            <div><strong>Personal Info:</strong> {String(personalInfoPreset)}</div>
                                            <div><strong>Address Fields:</strong> {String(addressPreset)}</div>
                                        </>
                                    )}
                                    <div><strong>Include Address:</strong> {includeAddress ? 'Yes' : 'No'}</div>
                                    {includeAddress && (
                                        <>
                                            <div><strong>Collapsible:</strong> {addressCollapsible ? 'Yes' : 'No'}</div>
                                            {addressCollapsible && (
                                                <div><strong>Expanded by Default:</strong> {addressExpandedByDefault ? 'Yes' : 'No'}</div>
                                            )}
                                        </>
                                    )}
                                    <div><strong>Validation:</strong> {enableValidation ? 'Enabled' : 'Disabled'}</div>
                                    <div><strong>Form Valid:</strong> {isFormValid ? 'Yes' : 'No'}</div>
                                    <div><strong>Submitting:</strong> {isSubmitting ? 'Yes' : 'No'}</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Form Display */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>FlexibleSignUpForm Preview</CardTitle>
                                <CardDescription>
                                    {formType === 'flexible' 
                                        ? 'Interactive preview of the flexible sign up form with current configuration'
                                        : 'Standard fixed sign up form for comparison'
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {formType === 'flexible' ? (
                                    <FlexibleSignUpForm
                                        fieldsConfig={getCurrentPersonalInfoConfig()}
                                        addressFieldsConfig={getCurrentAddressConfig()}
                                        title={inline ? undefined : "Create Your Account"}  
                                        description={inline ? undefined : "Enter your details to get started"}
                                        submitButtonText="Create Account"
                                        showPersonalInfoHeader={showPersonalInfoHeader}
                                        personalInfoHeaderText="Personal Information"
                                        includeAddress={includeAddress}
                                        addressCollapsible={addressCollapsible}
                                        addressExpandedByDefault={addressExpandedByDefault}
                                        addressSectionTitle="Address Information"
                                        showAddressPanelHeader={showAddressPanelHeader}
                                        addressPanelHeaderText="Address Details"
                                        isSubmitting={isSubmitting}
                                        submittingText="Creating Account..."
                                        disabled={false}
                                        inline={inline}
                                        buttonLayout={buttonLayout}
                                        submitButtonVariant="default"
                                        enableValidation={enableValidation}
                                        maxColumns={2}
                                        onFormDataChange={handleFormDataChange}
                                        onValidationStateChange={handleValidationStateChange}
                                        onLoadingStateChange={handleLoadingStateChange}
                                        onFormSubmit={handleFormSubmit}
                                        onSignUpSuccess={handleSignUpSuccess}
                                        onSignUpError={handleSignUpError}
                                        redirectPath="/dashboard"
                                        autoRedirect={false}
                                    />
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground">
                                            Fixed form comparison would be rendered here using existing SignUpForm component
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Form Data Debug */}
                        {formData && (
                            <Card className="mt-4">
                                <CardHeader>
                                    <CardTitle className="text-lg">Current Form Data</CardTitle>
                                    <CardDescription>
                                        Real-time form data for debugging purposes
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-40">
                                        {JSON.stringify(formData, null, 2)}
                                    </pre>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlexibleSignUpPage;