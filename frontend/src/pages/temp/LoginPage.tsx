import { LoginForm } from '@/components/auth/LoginForm';
import { FlexibleNavbar } from '@/components/navbar';
import { CompactThemeToggle } from '@/components/theme';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from '@/contexts';
import React, { useState } from 'react';

// Wrapper component to make CompactThemeToggle compatible with FlexibleNavbar
const NavbarThemeToggle: React.FC<{ showLabel?: boolean }> = ({ showLabel }) => {
    return (
        <div className="flex items-center gap-2">
            <CompactThemeToggle />
            {showLabel && (
                <span className="text-sm font-medium text-muted-foreground">
                    Theme
                </span>
            )}
        </div>
    );
};

/**
 * Temporary LoginPage for testing the LoginForm component
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
const LoginPage: React.FC = () => {
    const navigation = useNavigate();

    // Form state and settings
    const [enableValidation, setEnableValidation] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        usernameOrEmail: '',
        password: ''
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

    const handlePasswordToggle = () => {
        setShowPassword(prev => !prev);
    };

    const handleFormSubmit = (data: any) => {
        console.log('Login form submitted:', data);
        setSubmitMessage(`Login attempted with: ${data.usernameOrEmail}`);
    };

    const handleLoginSuccess = () => {
        console.log('Login successful!');
        setSubmitMessage('Login successful! 🎉');
    };

    const handleLoginError = (error: string) => {
        console.log('Login error:', error);
        setSubmitMessage(`Login error: ${error}`);
    };

    const handleReset = () => {
        setFormData({
            usernameOrEmail: '',
            password: ''
        });
        setSubmitMessage('');
        setExternalErrors({});
        setShowPassword(false);
    };

    const handleLoadSampleData = () => {
        // This won't actually set the form data since it's controlled internally
        // But we can simulate a successful state
        setExternalErrors({});
        setSubmitMessage('Sample login data would be loaded (internal form state)');
    };

    const handleSimulateErrors = () => {
        setExternalErrors({
            usernameOrEmail: ['Username or email is required'],
            password: ['Password is required']
        });
        setSubmitMessage('External login errors simulated');
    };

    const handleSimulateLoginError = () => {
        setExternalErrors({});
        setSubmitMessage('Invalid credentials - please check your username/email and password');
    };

    return (
        <div className="min-h-screen bg-background">
            <FlexibleNavbar
                brandText="BuildFlow"
                ThemeToggleComponent={NavbarThemeToggle}
            />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Page Header */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Login Form Testing</CardTitle>
                            <CardDescription>
                                Test the LoginForm component with different configurations.
                                This form uses the updated UsernameEmail and Password components with smart validation.
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
                                    Simulate Field Errors
                                </Button>
                                <Button onClick={handleSimulateLoginError} variant="outline">
                                    Simulate Login Error
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
                                        id="show-password"
                                        checked={showPassword}
                                        onCheckedChange={setShowPassword}
                                    />
                                    <label htmlFor="show-password" className="text-sm font-medium">
                                        Show Password (Force)
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
                                    <strong>Username/Email:</strong> {formData.usernameOrEmail || 'Empty'}
                                </div>
                                <div>
                                    <strong>Password:</strong> {formData.password ? '•'.repeat(formData.password.length) : 'Empty'}
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
                            <LoginForm
                                title="Welcome Back"
                                description="Enter your credentials to sign in to your account"
                                enableValidation={enableValidation}
                                errors={externalErrors}
                                showPassword={showPassword}
                                onTogglePassword={handlePasswordToggle}
                                onFormDataChange={handleFormDataChange}
                                onValidationStateChange={handleValidationStateChange}
                                onLoadingStateChange={handleLoadingStateChange}
                                onFormSubmit={handleFormSubmit}
                                onLoginSuccess={handleLoginSuccess}
                                onLoginError={handleLoginError}
                            />
                        </div>

                        {/* Inline Mode Form */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Inline Mode</h3>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Custom Container</CardTitle>
                                    <CardDescription>
                                        LoginForm in inline mode within a custom container
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <LoginForm
                                        inline={true}
                                        enableValidation={enableValidation}
                                        errors={externalErrors}
                                        showPassword={showPassword}
                                        onTogglePassword={handlePasswordToggle}
                                        onFormDataChange={(data) => {
                                            setFormData(data);
                                            console.log('Inline login form data:', data);
                                        }}
                                        onValidationStateChange={(isValid) => {
                                            console.log('Inline login form valid:', isValid);
                                        }}
                                        onLoadingStateChange={(loading) => {
                                            console.log('Inline login form loading:', loading);
                                        }}
                                        onFormSubmit={(data) => {
                                            console.log('Inline login form submitted:', data);
                                            setSubmitMessage(`Inline login attempted: ${data.usernameOrEmail}`);
                                        }}
                                        onLoginSuccess={() => {
                                            console.log('Inline login successful!');
                                            setSubmitMessage('Inline login successful! 🚀');
                                        }}
                                        onLoginError={(error) => {
                                            console.log('Inline login error:', error);
                                            setSubmitMessage(`Inline login error: ${error}`);
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
                                        <li>• Password Visibility: {showPassword ? 'Forced On' : 'User Controlled'}</li>
                                        <li>• External Errors: {Object.keys(externalErrors).length > 0 ? 'Set' : 'None'}</li>
                                        <li>• Remember Me: Checkbox available</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Features Demonstrated:</h4>
                                    <ul className="space-y-1">
                                        <li>• UsernameEmail field (smart icon switching)</li>
                                        <li>• Password field with visibility toggle</li>
                                        <li>• Smart field validation hooks</li>
                                        <li>• Real-time validation feedback</li>
                                        <li>• Form state callbacks</li>
                                        <li>• External error injection</li>
                                        <li>• Card vs Inline modes</li>
                                        <li>• Remember Me and Forgot Password links</li>
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

export default LoginPage;