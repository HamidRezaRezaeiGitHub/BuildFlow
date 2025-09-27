import { SimpleSignUpForm } from '@/components/auth/SimpleSignUpForm';
import { ConfigurableNavbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from '@/contexts';
import React, { useState } from 'react';

/**
 * Temporary SimpleSignUpPage for testing the SimpleSignUpForm component
 * with different configurations and validation modes.
 * 
 * Features:
 * - Two separate forms: Card mode and Inline mode
 * - Toggle between validation enabled/disabled
 * - Form submission handling
 * - Success/error callbacks
 * - Different configuration options
 * - Responsive layout
 */
const SimpleSignUpPage: React.FC = () => {
    const navigation = useNavigate();
    
    // Form state and settings
    const [enableValidation, setEnableValidation] = useState(true);
    const [autoRedirect, setAutoRedirect] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [validationState, setValidationState] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    // External errors for testing
    const [externalErrors, setExternalErrors] = useState<Record<string, string[]>>({});

    const handleFormDataChange = (data: any) => {
        setFormData(data);
        // Clear submit message when user modifies form
        if (submitMessage) {
            setSubmitMessage('');
        }
    };

    const handleValidationStateChange = (isValid: boolean) => {
        setValidationState(isValid);
    };

    const handleLoadingStateChange = (loading: boolean) => {
        setIsLoading(loading);
    };

    const handleFormSubmit = (data: any) => {
        console.log('Form submitted:', data);
        setSubmitMessage(`Form submitted with email: ${data.email}`);
    };

    const handleSignUpSuccess = () => {
        console.log('Signup successful!');
        setSubmitMessage('Signup successful! 🎉');
    };

    const handleSignUpError = (error: string) => {
        console.log('Signup error:', error);
        setSubmitMessage(`Signup error: ${error}`);
    };

    const handleReset = () => {
        setFormData({
            email: '',
            password: '',
            confirmPassword: ''
        });
        setSubmitMessage('');
        setExternalErrors({});
    };

    const handleLoadSampleData = () => {
        // This won't actually set the form data since it's controlled internally
        // But we can simulate external errors
        setExternalErrors({});
        setSubmitMessage('Sample data loaded (internal form state)');
    };

    const handleSimulateErrors = () => {
        setExternalErrors({
            email: ['Email already exists in our system'],
            password: ['Password does not meet security requirements'],
            confirmPassword: ['Please confirm your password']
        });
        setSubmitMessage('External errors simulated');
    };

    return (
        <div className="min-h-screen bg-background">
            <ConfigurableNavbar />
            
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    
                    {/* Page Header */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Simple Sign Up Form Testing</CardTitle>
                            <CardDescription>
                                Test the SimpleSignUpForm component with different configurations.
                                This page demonstrates both card and inline modes, validation options, and callbacks.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-4">
                                <Button onClick={handleReset} variant="outline">
                                    Reset Forms
                                </Button>
                                <Button onClick={handleLoadSampleData} variant="outline">
                                    Load Sample Data
                                </Button>
                                <Button onClick={handleSimulateErrors} variant="outline">
                                    Simulate Errors
                                </Button>
                                <Button onClick={() => navigation.navigateToHome()} variant="outline">
                                    Back to Home
                                </Button>
                            </div>

                            {/* Configuration Controls */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="enable-validation"
                                        checked={enableValidation}
                                        onCheckedChange={setEnableValidation}
                                    />
                                    <label htmlFor="enable-validation" className="text-sm font-medium">
                                        Enable Validation
                                    </label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="auto-redirect"
                                        checked={autoRedirect}
                                        onCheckedChange={setAutoRedirect}
                                    />
                                    <label htmlFor="auto-redirect" className="text-sm font-medium">
                                        Auto Redirect
                                    </label>
                                </div>
                            </div>

                            {/* Status Display */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t text-sm">
                                <div>
                                    <strong>Form Valid:</strong> {validationState ? '✅ Yes' : '❌ No'}
                                </div>
                                <div>
                                    <strong>Loading:</strong> {isLoading ? '🔄 Yes' : '✅ No'}
                                </div>
                                <div>
                                    <strong>Email:</strong> {formData.email || 'Empty'}
                                </div>
                            </div>

                            {submitMessage && (
                                <div className="p-3 rounded-md bg-blue-50 border border-blue-200">
                                    <p className="text-sm text-blue-700">{submitMessage}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        {/* Card Mode Form */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Card Mode (Default)</h3>
                            <SimpleSignUpForm
                                title="Join BuildFlow"
                                description="Create your account to get started with project management"
                                enableValidation={enableValidation}
                                autoRedirect={autoRedirect}
                                redirectPath="/dashboard"
                                errors={externalErrors}
                                onFormDataChange={handleFormDataChange}
                                onValidationStateChange={handleValidationStateChange}
                                onLoadingStateChange={handleLoadingStateChange}
                                onFormSubmit={handleFormSubmit}
                                onSignUpSuccess={handleSignUpSuccess}
                                onSignUpError={handleSignUpError}
                            />
                        </div>

                        {/* Inline Mode Form */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Inline Mode</h3>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Custom Container</CardTitle>
                                    <CardDescription>
                                        SimpleSignUpForm in inline mode within a custom container
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <SimpleSignUpForm
                                        inline={true}
                                        enableValidation={enableValidation}
                                        autoRedirect={autoRedirect}
                                        redirectPath="/projects/new"
                                        errors={externalErrors}
                                        onFormDataChange={(data) => {
                                            setFormData(data);
                                            console.log('Inline form data:', data);
                                        }}
                                        onValidationStateChange={(isValid) => {
                                            console.log('Inline form valid:', isValid);
                                        }}
                                        onLoadingStateChange={(loading) => {
                                            console.log('Inline form loading:', loading);
                                        }}
                                        onFormSubmit={(data) => {
                                            console.log('Inline form submitted:', data);
                                            setSubmitMessage(`Inline form submitted: ${data.email}`);
                                        }}
                                        onSignUpSuccess={() => {
                                            console.log('Inline signup successful!');
                                            setSubmitMessage('Inline signup successful! 🚀');
                                        }}
                                        onSignUpError={(error) => {
                                            console.log('Inline signup error:', error);
                                            setSubmitMessage(`Inline error: ${error}`);
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                    </div>

                    {/* Configuration Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Current Configuration</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <h4 className="font-semibold mb-2">Form Settings:</h4>
                                    <ul className="space-y-1">
                                        <li>• Validation: {enableValidation ? 'Enabled' : 'Disabled'}</li>
                                        <li>• Auto Redirect: {autoRedirect ? 'Yes' : 'No'}</li>
                                        <li>• External Errors: {Object.keys(externalErrors).length > 0 ? 'Set' : 'None'}</li>
                                        <li>• Password Visibility: Internal state managed</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Features Demonstrated:</h4>
                                    <ul className="space-y-1">
                                        <li>• Internal password visibility toggle</li>
                                        <li>• useNavigate hook for redirects</li>
                                        <li>• Real-time validation feedback</li>
                                        <li>• Form state callbacks</li>
                                        <li>• External error injection</li>
                                        <li>• Card vs Inline modes</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
};

export default SimpleSignUpPage;