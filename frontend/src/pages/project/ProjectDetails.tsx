import React, { useEffect, useState } from 'react';
import { useParams, useNavigate as useReactRouterNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectServiceWithAuth } from '@/services/ProjectService';
import { Project } from '@/services/dtos';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * ProjectDetails Component
 * 
 * Full-page component for displaying detailed information about a specific project.
 * 
 * Features:
 * - Retrieves project ID from URL parameters
 * - Fetches project data via ProjectService
 * - Loading state with skeleton placeholders
 * - Error state with user-friendly message
 * - Header section with project title and quick actions
 * - Summary card with key project information
 * - Location section with full address display
 * - Participants section with builder and owner info
 * - Future tabs for Estimates and Work Items (placeholders)
 * - Mobile-first responsive design
 * - Back navigation to project list
 * 
 * Route: /projects/:id
 * Access: Protected (requires authentication)
 */
export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useReactRouterNavigate();
  const { token } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        setError('Project ID is required');
        setIsLoading(false);
        return;
      }

      if (!token) {
        setError('Authentication required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const projectService = new ProjectServiceWithAuth(() => token);
        const fetchedProject = await projectService.getProjectById(id);
        setProject(fetchedProject);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, token]);

  // Format timestamp for display
  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get short address for title (street address and city)
  const getShortAddress = (project: Project): string => {
    const { location } = project;
    const parts = [];
    
    if (location.streetNumberAndName) {
      parts.push(location.streetNumberAndName);
    }
    if (location.city) {
      parts.push(location.city);
    }
    
    return parts.join(', ') || 'Project Details';
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/dashboard');
  };

  // Handle edit action (placeholder)
  const handleEdit = () => {
    alert('Edit functionality will be implemented in a future update.');
  };

  // Handle delete action (placeholder)
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      alert('Delete functionality will be implemented in a future update.');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <section className="py-8 bg-background">
          <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
            {/* Header skeleton */}
            <div className="mb-6">
              <Skeleton className="h-8 w-1/3 mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>

            {/* Content skeleton */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <section className="py-8 bg-background">
          <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-destructive"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h2 className="text-2xl font-semibold text-destructive">Error Loading Project</h2>
                  <p className="text-muted-foreground">{error}</p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={handleBack} variant="outline">
                      Back to Dashboard
                    </Button>
                    <Button onClick={() => window.location.reload()}>
                      Retry
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  // Project not found (shouldn't happen if error handling is correct)
  if (!project) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <section className="py-8 bg-background">
          <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-semibold">Project Not Found</h2>
                  <p className="text-muted-foreground">The requested project could not be found.</p>
                  <Button onClick={handleBack}>Back to Dashboard</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  // Success state - display project details
  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="py-8 bg-background">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-foreground mb-2 truncate">
                  {getShortAddress(project)}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Project ID: {project.id}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button onClick={handleBack} variant="outline" size="sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back
                </Button>
                <Button onClick={handleEdit} variant="outline" size="sm">
                  Edit
                </Button>
                <Button onClick={handleDelete} variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Builder ID</dt>
                    <dd className="text-sm mt-1">{project.builderId}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Owner ID</dt>
                    <dd className="text-sm mt-1">{project.ownerId}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                    <dd className="text-sm mt-1">{formatDate(project.createdAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                    <dd className="text-sm mt-1">{formatDate(project.lastUpdatedAt)}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* Location Section */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  {project.location.unitNumber && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Unit Number</dt>
                      <dd className="text-sm mt-1">{project.location.unitNumber}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Street Address</dt>
                    <dd className="text-sm mt-1">{project.location.streetNumberAndName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">City</dt>
                    <dd className="text-sm mt-1">{project.location.city}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">State/Province</dt>
                    <dd className="text-sm mt-1">{project.location.stateOrProvince}</dd>
                  </div>
                  {project.location.postalOrZipCode && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Postal/Zip Code</dt>
                      <dd className="text-sm mt-1">{project.location.postalOrZipCode}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Country</dt>
                    <dd className="text-sm mt-1">{project.location.country}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>

          {/* Participants Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Project Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h3 className="text-sm font-semibold mb-2">Builder</h3>
                  <p className="text-sm text-muted-foreground">
                    User ID: {project.builderId}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Contact information will be displayed here in a future update.
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h3 className="text-sm font-semibold mb-2">Owner</h3>
                  <p className="text-sm text-muted-foreground">
                    User ID: {project.ownerId}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Contact information will be displayed here in a future update.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Future Tabs Section */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="estimates">Estimates</TabsTrigger>
                  <TabsTrigger value="workitems">Work Items</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="mb-2">Project overview summary will be displayed here.</p>
                    <p className="text-sm">
                      This section will include project statistics, recent activity, and key metrics.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="estimates" className="mt-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="mb-2">Project estimates will be displayed here.</p>
                    <p className="text-sm">
                      This section will show cost estimates, line items, and pricing details.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="workitems" className="mt-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="mb-2">Work items will be displayed here.</p>
                    <p className="text-sm">
                      This section will show tasks, schedules, and work assignments.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetails;
