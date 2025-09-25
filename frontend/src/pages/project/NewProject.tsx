import { CreateProjectRequest } from '@/services/dtos';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="container mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Project
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Start a new construction project by providing the basic information. 
            You can add more details and manage the project after creation.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg 
                    className="h-5 w-5 text-red-400" 
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
                  <h3 className="text-sm font-medium text-red-800">
                    Error Creating Project
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Project Form */}
        <NewProjectForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          submittingText="Creating Project..."
        />

        {/* Help Text */}
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact support or check our{' '}
            <button 
              className="text-primary hover:underline"
              onClick={() => console.log('Documentation clicked')}
            >
              documentation
            </button>{' '}
            for guidance on setting up projects.
          </p>
        </div>
      </div>
    </div>
  );
};