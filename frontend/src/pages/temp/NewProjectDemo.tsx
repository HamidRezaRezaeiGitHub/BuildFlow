import React from 'react';
import { NewProjectForm } from '../../components/project/NewProjectForm';
import { CreateProjectRequest } from '../../services/dtos';

/**
 * Demo page to showcase the NewProjectForm component
 */
export const NewProjectDemo: React.FC = () => {
  const handleSubmit = async (request: CreateProjectRequest) => {
    console.log('Demo form submission:', request);
    alert('Form submitted successfully! Check the console for details.');
  };

  const handleCancel = () => {
    console.log('Demo form cancelled');
    alert('Form cancelled');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto">
        {/* Demo Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            New Project Form Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            This is a demonstration of the NewProjectForm component. The form includes role selection, 
            other party identification, and complete address input with validation.
          </p>
        </div>

        {/* Form Demo */}
        <NewProjectForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={false}
        />

        {/* Demo Footer */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Form Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">Role Selection</h3>
              <p className="text-gray-600 text-sm">
                Choose between Builder or Owner role with visual indicators
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">Smart Validation</h3>
              <p className="text-gray-600 text-sm">
                Username or email validation with real-time feedback
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">Address Integration</h3>
              <p className="text-gray-600 text-sm">
                Complete address form with validation and error handling
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">Shadcn UI</h3>
              <p className="text-gray-600 text-sm">
                Modern UI components with consistent styling
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">TypeScript</h3>
              <p className="text-gray-600 text-sm">
                Full type safety with backend DTO compatibility
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">Form State</h3>
              <p className="text-gray-600 text-sm">
                Loading states, error handling, and form validation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProjectDemo;