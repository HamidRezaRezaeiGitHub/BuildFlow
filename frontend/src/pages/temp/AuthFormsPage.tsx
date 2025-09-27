import { CompactSignUpForm } from '@/components/auth/CompactSignUpForm';
import { ShortSignUpForm } from '@/components/auth/ShortSignUpForm';
import { ConfigurableNavbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from '@/contexts';
import React, { useState } from 'react';

/**
 * Temporary AuthFormsPage for testing both CompactSignUpForm and ShortSignUpForm
 * components side by side with different configurations.
 * 
 * Features:
 * - Tabbed interface for different forms
 * - Both card and inline modes for each form
 * - Shared configuration controls
 * - Form submission handling
 * - Success/error callbacks
 * - Different configuration options
 * - Responsive layout
 */
const AuthFormsPage: React.FC = () => {
    const navigation = useNavigate();
    
    // Form state and settings (shared between forms)
    const [enableValidation, setEnableValidation] = useState(true);
    const [autoRedirect, setAutoRedirect] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [compactFormData, setCompactFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [shortFormData, setShortFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [validationState, setValidationState] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    // External errors for testing
    const [externalErrors, setExternalErrors] = useState<Record<string, string[]>>({});

    const handleCompactFormDataChange = (data: any) => {
        setCompactFormData(data);
        // Clear submit message when user modifies form
        if (submitMessage) {
            setSubmitMessage('');
        }
    };

    const handleShortFormDataChange = (data: any) => {
        setShortFormData(data);
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

    const handleFormSubmit = (data: any, formType: string) => {
        console.log(`${formType} form submitted:`, data);
        if (formType === 'Compact') {
            setSubmitMessage(`Compact form submitted with email: ${data.email}`);
        } else {
            setSubmitMessage(`Short form submitted with email: ${data.email}, name: ${data.firstName} ${data.lastName}`);
        }
    };

    const handleSignUpSuccess = (formType: string) => {
        console.log(`${formType} signup successful!`);
        setSubmitMessage(`${formType} signup successful! 🎉`);
    };

    const handleSignUpError = (error: string, formType: string) => {
        console.log(`${formType} signup error:`, error);
        setSubmitMessage(`${formType} signup error: ${error}`);
    };

    const handleReset = () => {
        setCompactFormData({
            email: '',
            password: '',
            confirmPassword: ''
        });
        setShortFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
        setSubmitMessage('');
        setExternalErrors({});
    };

    const handleSimulateCompactErrors = () => {
        setExternalErrors({
            email: ['Email already exists in our system'],
            password: ['Password does not meet security requirements'],
            confirmPassword: ['Please confirm your password']
        });
        setSubmitMessage('Compact form errors simulated');
    };

    const handleSimulateShortErrors = () => {
        setExternalErrors({
            firstName: ['First name is required'],
            lastName: ['Last name is required'],
            email: ['Email already exists in our system'],
            password: ['Password does not meet security requirements'],
            confirmPassword: ['Please confirm your password']
        });
        setSubmitMessage('Short form errors simulated');
    };

    return (
        <div className="min-h-screen bg-background">
            <ConfigurableNavbar />
            
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    
                    {/* Page Header */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Authentication Forms Testing</CardTitle>
                            <CardDescription>
                                Compare and test both CompactSignUpForm and ShortSignUpForm components 
                                with different configurations and validation modes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-4">
                                <Button onClick={handleReset} variant="outline">
                                    Reset All Forms
                                </Button>
                                <Button onClick={handleSimulateCompactErrors} variant="outline">
                                    Simulate Compact Errors
                                </Button>
                                <Button onClick={handleSimulateShortErrors} variant="outline">
                                    Simulate Short Errors
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
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t text-sm">
                                <div>
                                    <strong>Form Valid:</strong> {validationState ? '✅ Yes' : '❌ No'}
                                </div>
                                <div>
                                    <strong>Loading:</strong> {isLoading ? '🔄 Yes' : '✅ No'}
                                </div>
                                <div>
                                    <strong>Compact Email:</strong> {compactFormData.email || 'Empty'}
                                </div>
                                <div>
                                    <strong>Short Name:</strong> {shortFormData.firstName || shortFormData.lastName ? `${shortFormData.firstName} ${shortFormData.lastName}`.trim() : 'Empty'}
                                </div>
                            </div>

                            {submitMessage && (
                                <div className="p-3 rounded-md bg-blue-50 border border-blue-200">
                                    <p className="text-sm text-blue-700">{submitMessage}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Forms Tabs */}
                    <Tabs defaultValue="compact" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="compact">Compact SignUp Form</TabsTrigger>
                            <TabsTrigger value="short">Short SignUp Form</TabsTrigger>
                        </TabsList>

                        {/* Compact SignUp Form Tab */}
                        <TabsContent value="compact" className="space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                
                                {/* Compact Card Mode */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Compact Form - Card Mode</h3>
                                    <CompactSignUpForm
                                        title="Join BuildFlow"
                                        description="Create your account with email and password"
                                        enableValidation={enableValidation}
                                        autoRedirect={autoRedirect}
                                        redirectPath="/dashboard"
                                        errors={externalErrors}
                                        onFormDataChange={handleCompactFormDataChange}
                                        onValidationStateChange={handleValidationStateChange}
                                        onLoadingStateChange={handleLoadingStateChange}
                                        onFormSubmit={(data) => handleFormSubmit(data, 'Compact')}
                                        onSignUpSuccess={() => handleSignUpSuccess('Compact')}
                                        onSignUpError={(error) => handleSignUpError(error, 'Compact')}
                                    />
                                </div>

                                {/* Compact Inline Mode */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Compact Form - Inline Mode</h3>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Custom Container</CardTitle>
                                            <CardDescription>
                                                CompactSignUpForm in inline mode
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <CompactSignUpForm
                                                inline={true}
                                                enableValidation={enableValidation}
                                                autoRedirect={autoRedirect}
                                                redirectPath="/projects/new"
                                                errors={externalErrors}
                                                onFormDataChange={(data) => {
                                                    setCompactFormData(data);
                                                    console.log('Compact inline form data:', data);
                                                }}
                                                onValidationStateChange={(isValid) => {
                                                    console.log('Compact inline form valid:', isValid);
                                                }}
                                                onLoadingStateChange={(loading) => {
                                                    console.log('Compact inline form loading:', loading);
                                                }}
                                                onFormSubmit={(data) => {
                                                    console.log('Compact inline form submitted:', data);
                                                    setSubmitMessage(`Compact inline form submitted: ${data.email}`);
                                                }}
                                                onSignUpSuccess={() => {
                                                    console.log('Compact inline signup successful!');
                                                    setSubmitMessage('Compact inline signup successful! 🚀');
                                                }}
                                                onSignUpError={(error) => {
                                                    console.log('Compact inline signup error:', error);
                                                    setSubmitMessage(`Compact inline error: ${error}`);
                                                }}
                                            />
                                        </CardContent>
                                    </Card>
                                </div>

                            </div>
                        </TabsContent>

                        {/* Short SignUp Form Tab */}
                        <TabsContent value="short" className="space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                
                                {/* Short Card Mode */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Short Form - Card Mode</h3>
                                    <ShortSignUpForm
                                        title="Join BuildFlow"
                                        description="Create your account with personal details"
                                        enableValidation={enableValidation}
                                        autoRedirect={autoRedirect}
                                        redirectPath="/dashboard"
                                        errors={externalErrors}
                                        onFormDataChange={handleShortFormDataChange}
                                        onValidationStateChange={handleValidationStateChange}
                                        onLoadingStateChange={handleLoadingStateChange}
                                        onFormSubmit={(data) => handleFormSubmit(data, 'Short')}
                                        onSignUpSuccess={() => handleSignUpSuccess('Short')}
                                        onSignUpError={(error) => handleSignUpError(error, 'Short')}
                                    />
                                </div>

                                {/* Short Inline Mode */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Short Form - Inline Mode</h3>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Custom Container</CardTitle>
                                            <CardDescription>
                                                ShortSignUpForm in inline mode
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <ShortSignUpForm
                                                inline={true}
                                                enableValidation={enableValidation}
                                                autoRedirect={autoRedirect}
                                                redirectPath="/projects/new"
                                                errors={externalErrors}
                                                onFormDataChange={(data) => {
                                                    setShortFormData(data);
                                                    console.log('Short inline form data:', data);
                                                }}
                                                onValidationStateChange={(isValid) => {
                                                    console.log('Short inline form valid:', isValid);
                                                }}
                                                onLoadingStateChange={(loading) => {
                                                    console.log('Short inline form loading:', loading);
                                                }}
                                                onFormSubmit={(data) => {
                                                    console.log('Short inline form submitted:', data);
                                                    setSubmitMessage(`Short inline form submitted: ${data.firstName} ${data.lastName} (${data.email})`);
                                                }}
                                                onSignUpSuccess={() => {
                                                    console.log('Short inline signup successful!');
                                                    setSubmitMessage('Short inline signup successful! 🚀');
                                                }}
                                                onSignUpError={(error) => {
                                                    console.log('Short inline signup error:', error);
                                                    setSubmitMessage(`Short inline error: ${error}`);
                                                }}
                                            />
                                        </CardContent>
                                    </Card>
                                </div>

                            </div>
                        </TabsContent>
                    </Tabs>

                    {/* Comparison Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Form Comparison</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <h4 className="font-semibold mb-2">Compact SignUp Form:</h4>
                                    <ul className="space-y-1">
                                        <li>• Email field only (no name fields)</li>
                                        <li>• Password and Confirm Password</li>
                                        <li>• Quick signup process</li>
                                        <li>• Uses email as username</li>
                                        <li>• Minimal required information</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Short SignUp Form:</h4>
                                    <ul className="space-y-1">
                                        <li>• First Name and Last Name fields</li>
                                        <li>• Email field</li>
                                        <li>• Password and Confirm Password</li>
                                        <li>• Complete user profile creation</li>
                                        <li>• Uses Name component integration</li>
                                        <li>• More detailed user information</li>
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

export default AuthFormsPage;