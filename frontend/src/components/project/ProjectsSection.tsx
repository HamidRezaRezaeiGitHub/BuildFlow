import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from '@/contexts/NavigationContext';
import { ProjectServiceWithAuth } from '@/services/project/projectServiceFactory';
import { Project, PagedResponse, PaginationParams, DateFilterParams } from '@/services';
import { DashboardSection } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Empty } from '@/components/ui/empty';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { ProjectList } from './ProjectList';

export type ProjectFilterScope = 'builder' | 'owner' | 'both';

export interface ProjectFilter {
  scope: ProjectFilterScope;
  createdAfter?: string;
  createdBefore?: string;
}

/** Default filter configuration */
const DEFAULT_FILTER: ProjectFilter = { scope: 'both' };

/**
 * Helper function to check if a filter has non-default values
 * @param filter The filter to check
 * @returns true if the filter has any non-default values
 */
const isDefaultFilter = (filter: ProjectFilter): boolean => {
  return filter.scope === DEFAULT_FILTER.scope &&
    !filter.createdAfter &&
    !filter.createdBefore;
};

export interface ProjectsSectionProps {
  /** Optional filter to show only projects for a specific user role */
  filterByRole?: 'builder' | 'owner';
  /** Section title (default: "My Projects") */
  title?: string;
  /** Section description */
  description?: string;
  /** Show "Create Project" action button (default: true) */
  showCreateAction?: boolean;
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
 * 2. Calls ProjectService.getProjectsByUserId with pagination and date filters
 * 3. Initial fetch retrieves first page (3 items)
 * 4. "Load More" button fetches next page and appends to existing projects
 * 5. Passes accumulated projects array to ProjectList for rendering
 * 
 * Features:
 * - Auth-aware data fetching from AuthContext
 * - True backend pagination with accumulation (3 items per page)
 * - "Load More" button (shown when hasNext from pagination metadata)
 * - Date filtering (createdAfter, createdBefore) via backend
 * - Role-based filtering (builder/owner) applied client-side
 * - Loading state with skeleton placeholders
 * - Empty state with call-to-action
 * - Error state with retry option
 * - Export and Filter actions in header
 * - Responsive mobile-first design
 * - Auto-reset to page 0 when filters change
 */
export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  filterByRole,
  title = 'Projects',
  description,
  showCreateAction = true,
  className,
}) => {
  const { user, token } = useAuth();
  const { navigateToNewProject } = useNavigate();
  const [allFetchedProjects, setAllFetchedProjects] = useState<Project[]>([]);
  const [pagination, setPagination] = useState<PagedResponse<Project>['pagination'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedFilter, setAppliedFilter] = useState<ProjectFilter>(DEFAULT_FILTER);
  const [pendingFilter, setPendingFilter] = useState<ProjectFilter>(DEFAULT_FILTER);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Internal pagination state - mutable for true backend pagination
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 0,
    size: 3,
    orderBy: 'lastUpdatedAt',
    direction: 'DESC'
  });

  // Internal date filter state (managed separately from UI filter)
  const [dateFilterParams, setDateFilterParams] = useState<DateFilterParams | undefined>(undefined);

  // Memoized project service - only recreated when token changes
  const projectService = useMemo(() => {
    return new ProjectServiceWithAuth(() => token);
  }, [token]);

  // Memoized filter function - applies role-based filtering
  const filterProjects = useCallback((projects: Project[]): Project[] => {
    const effectiveScope = filterByRole || appliedFilter.scope;

    if (effectiveScope === 'builder') {
      return projects.filter((p: Project) => p.role === 'BUILDER');
    } else if (effectiveScope === 'owner') {
      return projects.filter((p: Project) => p.role === 'OWNER');
    }

    return projects;
  }, [filterByRole, appliedFilter.scope]);

  // Extract fetch logic into a reusable function
  const fetchProjects = useCallback(async (appendResults = false) => {
    if (!user || !token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch all projects for the user with pagination and date filters
      const response = await projectService.getProjectsByUserId(user.id, paginationParams, dateFilterParams);

      // Apply client-side role filtering
      const filteredProjects = filterProjects(response.content);

      if (appendResults) {
        // Append new page results to existing projects
        setAllFetchedProjects(prev => [...prev, ...filteredProjects]);
      } else {
        // Replace with new results (initial fetch or filter change)
        setAllFetchedProjects(filteredProjects);
      }

      setPagination(response.pagination);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [user, token, projectService, paginationParams, dateFilterParams, filterProjects]);

  // Effect for initial fetch and filter changes (page 0)
  useEffect(() => {
    // Reset pagination and fetch fresh results
    setPaginationParams(prev => ({ ...prev, page: 0 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, filterByRole, appliedFilter.scope, dateFilterParams]);

  // Effect for pagination changes (fetch and append)
  useEffect(() => {
    if (paginationParams.page === 0) {
      // Initial fetch or after filter change - replace results
      fetchProjects(false);
    } else {
      // Load more - append results
      fetchProjects(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams.page]);

  // Render loading state
  const renderLoadingState = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
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
        <Button onClick={() => fetchProjects()}>
          Retry
        </Button>
      }
    />
  );

  // Render empty state
  const renderEmptyState = () => {
    // Check if filters are applied (non-default values)
    const hasActiveFilters = !isDefaultFilter(appliedFilter);

    if (hasActiveFilters) {
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          }
          title="No Projects Match Your Filter"
          description="Try adjusting your filter criteria to see more results."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setAppliedFilter(DEFAULT_FILTER);
                setPendingFilter(DEFAULT_FILTER);
                setDateFilterParams(undefined);
                setIsFilterOpen(false);
              }}
            >
              Clear Filters
            </Button>
          }
        />
      );
    }

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
  };

  // Handle filter apply - only applies when "Apply Filters" is clicked
  const handleApplyFilter = (newFilter: ProjectFilter) => {
    setAppliedFilter(newFilter);

    // Update date filter params for backend
    const newDateFilter: DateFilterParams = {};
    if (newFilter.createdAfter) {
      newDateFilter.createdAfter = new Date(newFilter.createdAfter).toISOString();
    }
    if (newFilter.createdBefore) {
      newDateFilter.createdBefore = new Date(newFilter.createdBefore).toISOString();
    }

    // Only set if there are actual date filters
    setDateFilterParams(Object.keys(newDateFilter).length > 0 ? newDateFilter : undefined);

    // Reset to first page when filters change
    setPaginationParams(prev => ({ ...prev, page: 0 }));
    setIsFilterOpen(false);
  };

  // Handle filter cancel - reverts to currently applied filter
  const handleCancelFilter = () => {
    setPendingFilter(appliedFilter);
    setIsFilterOpen(false);
  };

  // Handle export (placeholder)
  const handleExport = () => {
    alert('Export functionality will be implemented in a future update.');
  };

  // Handle load more - fetch next page and append results
  const handleLoadMore = () => {
    // Increment page number
    setPaginationParams(prev => ({ ...prev, page: (prev.page ?? 0) + 1 }));
  };

  // Section actions - Export and Filter (no Create Project when items exist)
  const actions = (
    <div className="flex items-center gap-2">
      {allFetchedProjects.length > 0 && (
        <>
          <Button variant="outline" size="sm" onClick={handleExport}>
            Export
          </Button>
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Projects</SheetTitle>
                <SheetDescription>
                  Refine the displayed projects by role and creation date range.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Show projects where I am...
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="scope"
                        value="both"
                        checked={pendingFilter.scope === 'both'}
                        onChange={(e) => setPendingFilter({ ...pendingFilter, scope: e.target.value as ProjectFilterScope })}
                        className="h-4 w-4 cursor-pointer"
                        aria-label="Show projects where I am builder or owner"
                      />
                      <span className="text-sm">Builder or Owner</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="scope"
                        value="builder"
                        checked={pendingFilter.scope === 'builder'}
                        onChange={(e) => setPendingFilter({ ...pendingFilter, scope: e.target.value as ProjectFilterScope })}
                        className="h-4 w-4 cursor-pointer"
                        aria-label="Show projects where I am builder"
                      />
                      <span className="text-sm">Builder only</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="scope"
                        value="owner"
                        checked={pendingFilter.scope === 'owner'}
                        onChange={(e) => setPendingFilter({ ...pendingFilter, scope: e.target.value as ProjectFilterScope })}
                        className="h-4 w-4 cursor-pointer"
                        aria-label="Show projects where I am owner"
                      />
                      <span className="text-sm">Owner only</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label htmlFor="created-after" className="text-sm font-medium mb-2 block">
                    Created after
                  </label>
                  <input
                    id="created-after"
                    type="date"
                    value={pendingFilter.createdAfter || ''}
                    onChange={(e) => setPendingFilter({ ...pendingFilter, createdAfter: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                    aria-label="Filter by created after date"
                  />
                </div>
                <div>
                  <label htmlFor="created-before" className="text-sm font-medium mb-2 block">
                    Created before
                  </label>
                  <input
                    id="created-before"
                    type="date"
                    value={pendingFilter.createdBefore || ''}
                    onChange={(e) => setPendingFilter({ ...pendingFilter, createdBefore: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                    aria-label="Filter by created before date"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={() => handleApplyFilter(pendingFilter)} className="flex-1">
                    Apply Filters
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancelFilter}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </>
      )}
    </div>
  );

  return (
    <DashboardSection
      title={title}
      description={description}
      actions={actions}
      className={className}
    >
      {isLoading && renderLoadingState()}
      {!isLoading && error && renderErrorState()}
      {!isLoading && !error && allFetchedProjects.length === 0 && renderEmptyState()}
      {!isLoading && !error && allFetchedProjects.length > 0 && (
        <>
          <ProjectList projects={allFetchedProjects} />

          {/* Load More button - shown if there are more pages to fetch */}
          {pagination && pagination.hasNext && (
            <div className="flex justify-center mt-4">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}

          {/* Pagination info */}
          {pagination && pagination.totalElements > 0 && (
            <div className="text-center text-sm text-muted-foreground mt-4">
              Showing {allFetchedProjects.length} of {pagination.totalElements} project{pagination.totalElements !== 1 ? 's' : ''}
              {pagination.totalPages > 1 && ` • Page ${(pagination.page ?? 0) + 1} of ${pagination.totalPages}`}
            </div>
          )}
        </>
      )}
    </DashboardSection>
  );
};

export default ProjectsSection;
