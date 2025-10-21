import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from '@/contexts/NavigationContext';
import { ProjectServiceWithAuth } from '@/services/ProjectService';
import { ProjectDto, PagedResponse, PaginationParams } from '@/services/dtos';
import { DashboardSection } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Empty } from '@/components/ui/empty';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ProjectList } from './ProjectList';

export interface ProjectsSectionProps {
  /** Optional filter to show only projects for a specific user role */
  filterByRole?: 'builder' | 'owner';
  /** Section title (default: "My Projects") */
  title?: string;
  /** Section description */
  description?: string;
  /** Show "Create Project" action button (default: true) */
  showCreateAction?: boolean;
  /** Optional pagination parameters */
  paginationParams?: PaginationParams;
  /** Optional custom class name */
  className?: string;
}

/**
 * ProjectsSection Component
 * 
 * Container/section-level component responsible for:
 * - Fetching and managing project data via ProjectService
 * - Handling loading, empty, and error states
 * - Passing ready-to-render data to ProjectList presentational component
 * - Integrating section header UI (title, actions)
 * - Fitting visually and functionally inside DashboardLayout
 * 
 * Data Flow:
 * 1. Uses useAuth() to get current user
 * 2. Calls ProjectService.getProjectsByOwnerId/BuilderId with pagination
 * 3. Stores projects and state (loading, empty, error) in local state
 * 4. Passes final projects[] array to ProjectList for rendering
 * 
 * Features:
 * - Auth-aware data fetching from AuthContext
 * - Loading state with skeleton placeholders
 * - Empty state with call-to-action
 * - Error state with retry option
 * - Responsive mobile-first design
 * - Pagination support (metadata available, UI controls can be added later)
 */
export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  filterByRole,
  title = 'My Projects',
  description,
  showCreateAction = true,
  paginationParams,
  className,
}) => {
  const { user, token } = useAuth();
  const { navigateToNewProject } = useNavigate();
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [pagination, setPagination] = useState<PagedResponse<ProjectDto>['pagination'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract fetch logic into a reusable function
  const fetchProjects = async () => {
    if (!user || !token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const projectService = new ProjectServiceWithAuth(() => token);
      let response: PagedResponse<ProjectDto>;

      // Determine which projects to fetch based on user role or filter
      if (filterByRole === 'builder') {
        response = await projectService.getProjectsByBuilderIdPaginated(user.id, paginationParams);
      } else if (filterByRole === 'owner') {
        response = await projectService.getProjectsByOwnerIdPaginated(user.id, paginationParams);
      } else {
        // Default: fetch projects where user is the builder
        response = await projectService.getProjectsByBuilderIdPaginated(user.id, paginationParams);
      }

      setProjects(response.content);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user, token, filterByRole, paginationParams?.page, paginationParams?.size]);

  // Render loading state
  const renderLoadingState = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Render error state
  const renderErrorState = () => (
    <Empty
      title="Error Loading Projects"
      description={error || 'An unexpected error occurred.'}
      action={
        <Button onClick={fetchProjects}>
          Retry
        </Button>
      }
    />
  );

  // Render empty state
  const renderEmptyState = () => (
    <Empty
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      }
      title="No Projects Yet"
      description="Get started by creating your first construction project. Click the button below to begin."
      action={
        showCreateAction ? (
          <Button onClick={navigateToNewProject}>
            Create Project
          </Button>
        ) : undefined
      }
    />
  );

  // Section actions
  const actions = showCreateAction && projects.length > 0 ? (
    <Button onClick={navigateToNewProject}>
      Create Project
    </Button>
  ) : undefined;

  return (
    <DashboardSection
      title={title}
      description={description}
      actions={actions}
      className={className}
    >
      {isLoading && renderLoadingState()}
      {!isLoading && error && renderErrorState()}
      {!isLoading && !error && projects.length === 0 && renderEmptyState()}
      {!isLoading && !error && projects.length > 0 && (
        <>
          <ProjectList projects={projects} />
          {/* Pagination info (UI controls not yet implemented) */}
          {pagination && pagination.totalElements > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              Showing {projects.length} of {pagination.totalElements} project{pagination.totalElements !== 1 ? 's' : ''}
              {pagination.totalPages > 1 && ` (Page ${pagination.page + 1} of ${pagination.totalPages})`}
            </div>
          )}
        </>
      )}
    </DashboardSection>
  );
};

export default ProjectsSection;
