import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from '@/contexts/NavigationContext';
import { ProjectServiceWithAuth } from '@/services/ProjectService';
import { ProjectDto, PagedResponse } from '@/services/dtos';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Empty } from '@/components/ui/empty';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface ProjectListProps {
  /** Optional filter to show only projects for a specific user role */
  filterByRole?: 'builder' | 'owner';
}

/**
 * ProjectList Component
 * 
 * Displays a responsive grid of project cards for the authenticated user.
 * Handles loading, empty, and error states gracefully.
 * 
 * Features:
 * - Fetches projects based on user ID and role
 * - Shows loading skeletons during data fetch
 * - Displays empty state when no projects exist
 * - Responsive grid layout (mobile-first)
 * - Action buttons for each project (Open, Edit, Delete)
 * - Supports pagination metadata (UI pagination controls not yet implemented)
 */
export const ProjectList: React.FC<ProjectListProps> = ({ filterByRole }) => {
  const { user, token } = useAuth();
  const { navigateToNewProject } = useNavigate();
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [pagination, setPagination] = useState<PagedResponse<ProjectDto>['pagination'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
        if (filterByRole === 'builder' || !filterByRole) {
          response = await projectService.getProjectsByBuilderIdPaginated(user.id);
        } else {
          response = await projectService.getProjectsByOwnerIdPaginated(user.id);
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

    fetchProjects();
  }, [user, token, filterByRole]);

  // Loading state
  if (isLoading) {
    return (
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
  }

  // Error state
  if (error) {
    return (
      <Empty
        title="Error Loading Projects"
        description={error}
        action={
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        }
      />
    );
  }

  // Empty state
  if (projects.length === 0) {
    return (
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
        description="Get started by creating your first construction project. Click the + button in the bottom navigation to begin."
        action={
          <Button onClick={navigateToNewProject}>
            Create Project
          </Button>
        }
      />
    );
  }

  // Format timestamp for display
  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
      });
    }
  };

  // Format project location for display
  const formatLocation = (project: ProjectDto): string => {
    const { location } = project;
    const parts = [];
    
    if (location.unitNumber) {
      parts.push(`Unit ${location.unitNumber}`);
    }
    if (location.streetNumberAndName) {
      parts.push(location.streetNumberAndName);
    }
    if (location.city) {
      parts.push(location.city);
    }
    if (location.stateOrProvince) {
      parts.push(location.stateOrProvince);
    }
    
    return parts.join(', ') || 'No location specified';
  };

  // Project list with cards
  return (
    <div className="space-y-4">
      {/* Projects grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">
                    {formatLocation(project)}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Updated {formatDate(project.lastUpdatedAt)}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => console.log('Edit project:', project.id)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log('View details:', project.id)}>
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => console.log('Delete project:', project.id)}
                      className="text-destructive"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Project ID:</span>
                  <span className="font-mono text-xs">#{project.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{formatDate(project.createdAt)}</span>
                </div>
              </div>
              <Button className="w-full mt-4" onClick={() => console.log('Open project:', project.id)}>
                Open Project
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination info (UI controls not yet implemented) */}
      {pagination && pagination.totalElements > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {projects.length} of {pagination.totalElements} project{pagination.totalElements !== 1 ? 's' : ''}
          {pagination.totalPages > 1 && ` (Page ${pagination.page + 1} of ${pagination.totalPages})`}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
