import { StandardNavbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateProjectRequest } from '@/services/dtos';
import { Building2 } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NewProjectForm } from '../../components/project/NewProjectForm';

/**
 * NewProject page component
 * 
 * This page provides a form for creating new construction projects.
 * It uses the NewProjectForm component and handles the form submission,
 * navigation, and error handling.
 */
export const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Handle form submission
  const handleSubmit = async (request: CreateProjectRequest) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Call API service to create project
      console.log('Creating project with request:', request);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // On success, navigate to projects list or dashboard
      // navigate('/projects'); // Uncomment when projects page exists
      console.log('Project created successfully!');
      
      // For now, show success message
      alert('Project created successfully! (This is a placeholder - backend integration pending)');
      
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
    <div className="min-h-screen bg-background">
      <StandardNavbar
      />
      
      <div className="bg-gradient-to-br from-muted/20 to-muted/40 py-8 px-4">
        <div className="container mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Create New Project
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Start a new construction project by providing the basic information. 
            You can add more details and manage the project after creation.
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

        {/* New Project Form */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                Create New Project
              </CardTitle>
            </CardHeader>
            <CardContent>
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
      </div>
    </div>
  );
};