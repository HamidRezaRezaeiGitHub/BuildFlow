import { AddressForm, createEmptyAddress } from '@/components/address';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { AddressData } from '@/services/dtos';
import React, { useState } from 'react';

/**
 * Temporary Address page for testing both skippable and non-skippable AddressForm components
 * and validation service integration.
 * 
 * Features:
 * - Two separate forms: Required validation and Optional validation
 * - Complete address form using AddressForm
 * - Form submission handling
 * - Address data state management
 * - Responsive card layout
 */
const Address: React.FC = () => {
    // Single form state
    const [addressData, setAddressData] = useState<AddressData>(createEmptyAddress());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [isSkippable, setIsSkippable] = useState(false);

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

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Address Form Validation Testing</h1>
                    <p className="text-muted-foreground">
                        Testing single form with toggle between required and optional validation modes
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className={`text-xl font-bold text-center ${isSkippable ? 'text-green-600' : 'text-red-600'}`}>
                            {isSkippable ? 'Optional Validation Form' : 'Required Validation Form'}
                        </CardTitle>
                        <CardDescription className="text-center">
                            {isSkippable
                                ? 'Fields are optional, but if entered, must be valid. Partial addresses allowed.'
                                : 'All fields must be valid to submit. Submit button disabled until form is valid.'
                            }
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <AddressForm
                            addressData={addressData}
                            onAddressChange={handleAddressChange}
                            onSubmit={async () => {
                                setIsSubmitting(true);
                                setSubmitMessage('');

                                try {
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                    console.log('Form submitted:', addressData);
                                    const message = isSkippable ? 'Optional form submitted successfully!' : 'Required form submitted successfully!';
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
                                console.log('Form skipped');
                                setSubmitMessage('Form skipped - proceeding without address');
                                setTimeout(() => {
                                    setSubmitMessage('');
                                }, 2000);
                            } : undefined}
                            title={isSkippable ? "Optional Address Information" : "User Registration Address"}
                            description={isSkippable ? "You can skip this step or provide partial information" : "All fields are required for account creation"}
                            submitButtonText={isSkippable ? "Save Address" : "Create Account"}
                            skipButtonText="Skip This Step"
                            isSubmitting={isSubmitting}
                            submittingText={isSkippable ? "Saving..." : "Creating Account..."}
                            inline={true}
                            isSkippable={isSkippable}
                            enableValidation={true}
                        />

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

                        <div className="border-t pt-4 space-y-4">
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleReset}
                                    disabled={isSubmitting}
                                    className="flex-1"
                                >
                                    Reset
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={handleLoadSample}
                                    disabled={isSubmitting}
                                    className="flex-1"
                                >
                                    {isSkippable ? 'Load Partial' : 'Load Sample'}
                                </Button>
                            </div>

                            <div className="flex items-center justify-center space-x-3 pt-2">
                                <label htmlFor="validation-mode" className="text-sm font-medium">
                                    Required Fields
                                </label>
                                <Switch
                                    id="validation-mode"
                                    checked={isSkippable}
                                    onCheckedChange={(checked) => {
                                        setIsSkippable(checked);
                                        setSubmitMessage('');
                                    }}
                                    disabled={isSubmitting}
                                />
                                <label htmlFor="validation-mode" className="text-sm font-medium">
                                    Optional Fields
                                </label>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Address;