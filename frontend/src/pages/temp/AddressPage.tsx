import { AddressForm, FlexibleAddressForm, createEmptyAddress, AddressFieldConfig, addressFieldConfigs } from '@/components/address';
import { ConfigurableNavbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from '@/contexts';
import { AddressData } from '@/services/dtos';
import React, { useState } from 'react';

// Types for field configuration UI
type FormType = 'fixed' | 'flexible';
type PresetLayout = keyof typeof addressFieldConfigs | 'custom';

interface FieldState {
    show: boolean;
    required: boolean;
    colSpan: 1 | 2;
}

/**
 * Enhanced AddressPage for comprehensive testing of both AddressForm and FlexibleAddressForm
 * 
 * Features:
 * - Choose between Fixed AddressForm or Flexible AddressForm
 * - For Flexible: Select from preset layouts or create custom field configuration
 * - Individual field control: show/hide, required/optional, column span
 * - Validation mode toggle (required/optional)
 * - Sample data loading
 * - Real-time form configuration testing
 */
const AddressPage: React.FC = () => {
    const navigation = useNavigate();

    // Form state
    const [addressData, setAddressData] = useState<AddressData>(createEmptyAddress());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [isSkippable, setIsSkippable] = useState(false);

    // Form type and configuration
    const [formType, setFormType] = useState<FormType>('fixed');
    const [presetLayout, setPresetLayout] = useState<PresetLayout>('full');
    
    // Individual field states for custom configuration
    const [fieldStates, setFieldStates] = useState<{ [K in keyof AddressData]: FieldState }>({
        unitNumber: { show: true, required: false, colSpan: 1 },
        streetNumber: { show: true, required: true, colSpan: 1 },
        streetName: { show: true, required: true, colSpan: 2 },
        city: { show: true, required: true, colSpan: 1 },
        stateOrProvince: { show: true, required: true, colSpan: 1 },
        postalOrZipCode: { show: true, required: true, colSpan: 1 },
        country: { show: true, required: true, colSpan: 1 }
    });

    // Field labels for UI
    const fieldLabels: { [K in keyof AddressData]: string } = {
        unitNumber: 'Unit Number',
        streetNumber: 'Street Number',
        streetName: 'Street Name',
        city: 'City',
        stateOrProvince: 'State/Province',
        postalOrZipCode: 'Postal/Zip Code',
        country: 'Country'
    };

    const handleAddressChange = (field: keyof AddressData, value: string) => {
        setAddressData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleReset = () => {
        setAddressData(createEmptyAddress());
        setSubmitMessage('');
    };

    const handleLoadSample = () => {
        if (isSkippable) {
            // Load partial sample for skippable form
            setAddressData({
                unitNumber: '',
                streetNumber: '456',
                streetName: 'Oak Avenue',
                city: 'Vancouver',
                stateOrProvince: 'BC',
                postalOrZipCode: '',
                country: 'Canada'
            });
        } else {
            // Load complete sample for required form
            setAddressData({
                unitNumber: '5A',
                streetNumber: '123',
                streetName: 'Main Street',
                city: 'Toronto',
                stateOrProvince: 'ON',
                postalOrZipCode: 'M5V 3A8',
                country: 'Canada'
            });
        }
        setSubmitMessage('');
    };

    // Update field states when preset layout changes
    const handlePresetLayoutChange = (layout: PresetLayout) => {
        setPresetLayout(layout);
        if (layout !== 'custom' && layout in addressFieldConfigs) {
            const preset = addressFieldConfigs[layout];
            const newFieldStates = { ...fieldStates };
            
            // Reset all fields to hidden first
            Object.keys(newFieldStates).forEach(field => {
                newFieldStates[field as keyof AddressData] = {
                    show: false,
                    required: false,
                    colSpan: 1
                };
            });
            
            // Apply preset configuration
            preset.forEach(config => {
                newFieldStates[config.field] = {
                    show: true,
                    required: config.required ?? true,
                    colSpan: config.colSpan || 1
                };
            });
            
            setFieldStates(newFieldStates);
        }
    };

    // Generate custom field configuration for FlexibleAddressForm
    const generateCustomFieldConfig = (): AddressFieldConfig[] => {
        return Object.entries(fieldStates)
            .filter(([_, state]) => state.show)
            .map(([field, state]) => ({
                field: field as keyof AddressData,
                required: state.required,
                colSpan: state.colSpan,
                show: true
            }));
    };

    // Update individual field state
    const updateFieldState = (field: keyof AddressData, updates: Partial<FieldState>) => {
        setFieldStates(prev => ({
            ...prev,
            [field]: { ...prev[field], ...updates }
        }));
        // Switch to custom when manually changing fields
        if (presetLayout !== 'custom') {
            setPresetLayout('custom');
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <ConfigurableNavbar
                navItems={[
                    { label: 'Home', onClick: () => navigation.navigateToHome() },
                    { label: 'Addresses', onClick: () => console.log('Current page') },
                    { label: 'Contact', onClick: () => navigation.scrollToSection('contact') }
                ]}
                themeToggleType="compact"
                onLoginClick={() => navigation.navigateToAuth('login')}
                onSignUpClick={() => navigation.navigateToAuth('signup')}
            />

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Enhanced Address Form Testing</h1>
                    <p className="text-muted-foreground">
                        Test both Fixed AddressForm and FlexibleAddressForm with full customization options
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Configuration Panel */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-lg">Form Configuration</CardTitle>
                            <CardDescription>
                                Customize form type, layout, and field behavior
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Form Type Selection */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Form Type</Label>
                                <div className="flex gap-2">
                                    <Button
                                        variant={formType === 'fixed' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setFormType('fixed')}
                                        className="flex-1"
                                    >
                                        Fixed Form
                                    </Button>
                                    <Button
                                        variant={formType === 'flexible' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setFormType('flexible')}
                                        className="flex-1"
                                    >
                                        Flexible Form
                                    </Button>
                                </div>
                            </div>

                            {/* Validation Mode */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Validation Mode</Label>
                                <div className="flex items-center justify-between space-x-3">
                                    <span className="text-sm">Required</span>
                                    <Switch
                                        checked={isSkippable}
                                        onCheckedChange={(checked) => {
                                            setIsSkippable(checked);
                                            setSubmitMessage('');
                                        }}
                                        disabled={isSubmitting}
                                    />
                                    <span className="text-sm">Optional</span>
                                </div>
                            </div>

                            {/* Flexible Form Configuration */}
                            {formType === 'flexible' && (
                                <div className="space-y-4 border-t pt-4">
                                    <Label className="text-sm font-medium">Layout Preset</Label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="w-full justify-between">
                                                {presetLayout === 'custom' ? 'Custom Layout' : 
                                                 presetLayout.charAt(0).toUpperCase() + presetLayout.slice(1)}
                                                <span className="ml-auto">▼</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-full">
                                            <DropdownMenuItem onClick={() => handlePresetLayoutChange('full')}>
                                                Full Layout
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handlePresetLayoutChange('minimal')}>
                                                Minimal Layout
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handlePresetLayoutChange('shipping')}>
                                                Shipping Layout
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handlePresetLayoutChange('international')}>
                                                International Layout
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handlePresetLayoutChange('custom')}>
                                                Custom Layout
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    {/* Individual Field Configuration */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium">Field Configuration</Label>
                                        <div className="space-y-3 max-h-64 overflow-y-auto">
                                            {Object.entries(fieldLabels).map(([field, label]) => {
                                                const fieldKey = field as keyof AddressData;
                                                const state = fieldStates[fieldKey];
                                                if (!state) return null;
                                                
                                                return (
                                                    <div key={field} className="border rounded p-3 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Label className="text-xs font-medium">{label}</Label>
                                                            <Switch
                                                                checked={state.show}
                                                                onCheckedChange={(checked) => 
                                                                    updateFieldState(fieldKey, { show: checked })
                                                                }
                                                                disabled={isSubmitting}
                                                            />
                                                        </div>
                                                        
                                                        {state.show && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-xs">Required</span>
                                                                    <Switch
                                                                        checked={state.required}
                                                                        onCheckedChange={(checked) => 
                                                                            updateFieldState(fieldKey, { required: checked })
                                                                        }
                                                                        disabled={isSubmitting}
                                                                    />
                                                                </div>
                                                                
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-xs">Col Span</span>
                                                                    <div className="flex gap-1">
                                                                        <Button
                                                                            variant={state.colSpan === 1 ? 'default' : 'outline'}
                                                                            size="sm"
                                                                            onClick={() => updateFieldState(fieldKey, { colSpan: 1 })}
                                                                            className="w-8 h-6 p-0 text-xs"
                                                                        >
                                                                            1
                                                                        </Button>
                                                                        <Button
                                                                            variant={state.colSpan === 2 ? 'default' : 'outline'}
                                                                            size="sm"
                                                                            onClick={() => updateFieldState(fieldKey, { colSpan: 2 })}
                                                                            className="w-8 h-6 p-0 text-xs"
                                                                        >
                                                                            2
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Control Buttons */}
                            <div className="border-t pt-4 space-y-2">
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleReset}
                                        disabled={isSubmitting}
                                        className="flex-1"
                                        size="sm"
                                    >
                                        Reset Data
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={handleLoadSample}
                                        disabled={isSubmitting}
                                        className="flex-1"
                                        size="sm"
                                    >
                                        Load Sample
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Form Panel */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className={`text-xl font-bold ${isSkippable ? 'text-green-600' : 'text-red-600'}`}>
                                {formType === 'fixed' ? 'Fixed AddressForm' : 'Flexible AddressForm'} 
                                <Badge variant={isSkippable ? 'secondary' : 'destructive'} className="ml-2">
                                    {isSkippable ? 'Optional' : 'Required'}
                                </Badge>
                            </CardTitle>
                            <CardDescription>
                                {formType === 'fixed' 
                                    ? 'Standard address form with all fields' 
                                    : `Customizable form - ${presetLayout === 'custom' ? 'Custom Layout' : presetLayout + ' preset'}`
                                }
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {formType === 'fixed' ? (
                                <AddressForm
                                    addressData={addressData}
                                    onAddressChange={handleAddressChange}
                                    onSubmit={async () => {
                                        setIsSubmitting(true);
                                        setSubmitMessage('');

                                        try {
                                            await new Promise(resolve => setTimeout(resolve, 1000));
                                            console.log('Fixed form submitted:', addressData);
                                            const message = `Fixed ${isSkippable ? 'optional' : 'required'} form submitted successfully!`;
                                            setSubmitMessage(message);

                                            setTimeout(() => {
                                                setAddressData(createEmptyAddress());
                                                setSubmitMessage('');
                                            }, 2000);

                                        } catch (error) {
                                            console.error('Error submitting form:', error);
                                            setSubmitMessage('Error submitting form. Please try again.');
                                        } finally {
                                            setIsSubmitting(false);
                                        }
                                    }}
                                    onSkip={isSkippable ? () => {
                                        console.log('Fixed form skipped');
                                        setSubmitMessage('Fixed form skipped - proceeding without address');
                                        setTimeout(() => {
                                            setSubmitMessage('');
                                        }, 2000);
                                    } : undefined}
                                    title={isSkippable ? "Optional Address Information" : "Required Address Information"}
                                    submitButtonText={isSkippable ? "Save Address" : "Submit Address"}
                                    skipButtonText="Skip This Step"
                                    isSubmitting={isSubmitting}
                                    submittingText={isSkippable ? "Saving..." : "Submitting..."}
                                    inline={true}
                                    isSkippable={isSkippable}
                                    enableValidation={true}
                                />
                            ) : (
                                <FlexibleAddressForm
                                    addressData={addressData}
                                    onAddressChange={handleAddressChange}
                                    fieldsConfig={presetLayout === 'custom' ? generateCustomFieldConfig() : presetLayout}
                                    onSubmit={async () => {
                                        setIsSubmitting(true);
                                        setSubmitMessage('');

                                        try {
                                            await new Promise(resolve => setTimeout(resolve, 1000));
                                            console.log('Flexible form submitted:', addressData);
                                            const configInfo = presetLayout === 'custom' ? 'custom' : presetLayout;
                                            const message = `Flexible ${isSkippable ? 'optional' : 'required'} form (${configInfo}) submitted successfully!`;
                                            setSubmitMessage(message);

                                            setTimeout(() => {
                                                setAddressData(createEmptyAddress());
                                                setSubmitMessage('');
                                            }, 2000);

                                        } catch (error) {
                                            console.error('Error submitting form:', error);
                                            setSubmitMessage('Error submitting form. Please try again.');
                                        } finally {
                                            setIsSubmitting(false);
                                        }
                                    }}
                                    onSkip={isSkippable ? () => {
                                        console.log('Flexible form skipped');
                                        setSubmitMessage('Flexible form skipped - proceeding without address');
                                        setTimeout(() => {
                                            setSubmitMessage('');
                                        }, 2000);
                                    } : undefined}
                                    title={isSkippable ? "Optional Address Information" : "Required Address Information"}
                                    submitButtonText={isSkippable ? "Save Address" : "Submit Address"}
                                    skipButtonText="Skip This Step"
                                    isSubmitting={isSubmitting}
                                    submittingText={isSkippable ? "Saving..." : "Submitting..."}
                                    inline={true}
                                    isSkippable={isSkippable}
                                    enableValidation={true}
                                />
                            )}

                            {submitMessage && (
                                <div className={`text-center p-3 rounded-md ${submitMessage.includes('Error')
                                    ? 'bg-red-50 text-red-700 border border-red-200'
                                    : submitMessage.includes('skipped')
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                        : 'bg-green-50 text-green-700 border border-green-200'
                                    }`}>
                                    {submitMessage}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AddressPage;