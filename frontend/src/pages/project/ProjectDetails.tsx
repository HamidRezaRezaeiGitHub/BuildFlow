import React, { useEffect, useState } from 'react';
import { useParams, useNavigate as useReactRouterNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectServiceWithAuth } from '@/services/project/projectServiceFactory';
import { Project } from '@/services/dtos';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, AlertCircle, Pencil, Trash2 } from 'lucide-react';

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'info' | 'error'; text: string } | null>(null);

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
    setActionMessage({ type: 'info', text: 'Edit functionality will be implemented in a future update.' });
    setTimeout(() => setActionMessage(null), 5000);
  };

  // Handle delete action (placeholder)
  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    setActionMessage({ type: 'info', text: 'Delete functionality will be implemented in a future update.' });
    setTimeout(() => setActionMessage(null), 5000);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // Retry mechanism for error state
  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    // Re-trigger the useEffect by changing a dependency (in this case, we'll refetch directly)
    if (!id || !token) {
      setError('Project ID or authentication is missing');
      setIsLoading(false);
      return;
    }
    
    const refetchProject = async () => {
      try {
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
    
    refetchProject();
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
                  <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
                  <h2 className="text-2xl font-semibold text-destructive">Error Loading Project</h2>
                  <p className="text-muted-foreground">{error}</p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={handleBack} variant="outline">
                      Back to Dashboard
                    </Button>
                    <Button onClick={handleRetry}>
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
          {/* Action Message Banner */}
          {actionMessage && (
            <div className={`mb-4 p-4 rounded-lg border ${
              actionMessage.type === 'info' 
                ? 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300' 
                : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
            }`}>
              <p className="text-sm">{actionMessage.text}</p>
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <Card className="max-w-md mx-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    Confirm Delete
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete this project? This action cannot be undone.
                  </p>
                  <div className="flex gap-2 justify-end">
                    <Button onClick={cancelDelete} variant="outline">
                      Cancel
                    </Button>
                    <Button onClick={confirmDelete} variant="destructive">
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

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
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleEdit} variant="outline" size="sm">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button onClick={handleDelete} variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
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
                    <dt className="text-sm font-medium text-muted-foreground">Main User ID</dt>
                    <dd className="text-sm mt-1">{project.userId}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Main User Role</dt>
                    <dd className="text-sm mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {project.role}
                      </span>
                    </dd>
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
              <div className="space-y-4">
                {/* Main User */}
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold">Main User</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {project.role}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    User ID: {project.userId}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Full contact information will be displayed here in a future update.
                  </p>
                </div>

                {/* Note: Additional participants are managed separately via ProjectParticipant API */}
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
