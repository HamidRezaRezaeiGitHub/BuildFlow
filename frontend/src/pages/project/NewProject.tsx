import { StandardBottomNavbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { CreateProjectRequest, projectService } from '@/services';
import { Building2 } from 'lucide-react';
import React from 'react';
import { useNavigate as useReactRouterNavigate } from 'react-router-dom';
import { NewProjectForm } from '../../components/project/NewProjectForm';

/**
 * NewProject page component
 * 
 * This page provides a form for creating new construction projects.
 * It uses the NewProjectForm component and handles the form submission,
 * navigation, and error handling.
 * 
 * Mobile-first design with bottom navigation bar.
 */
export const NewProject: React.FC = () => {
  const navigate = useReactRouterNavigate();
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  // Handle form submission
  const handleSubmit = async (request: CreateProjectRequest) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Ensure user is authenticated
      if (!token) {
        throw new Error('You must be logged in to create a project');
      }

      // Call API service to create project
      console.log('Creating project with request:', request);
      const response = await projectService.createProject(request, token);
      
      console.log('Project created successfully:', response);
      
      // Show success message
      setSuccessMessage(`Project created successfully! Project ID: ${response.projectDto.id}`);
      
      // Navigate to projects list after a brief delay to show success message
      setTimeout(() => {
        // Try to navigate to projects page, fallback to dashboard
        try {
          navigate('/projects');
        } catch {
          // If /projects route doesn't exist, go to dashboard
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

  // Handle form cancellation
  const handleCancel = () => {
    // Navigate back to previous page or dashboard
    navigate(-1);
  };

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
            Start a new construction project by providing the basic information. 
            You can add more details and manage the project after creation.
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

        {/* New Project Form */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Building2 className="h-5 w-5" />
                Create New Project
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <NewProjectForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSubmitting={isSubmitting}
                submittingText="Creating Project..."
                inline={true}
              />
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