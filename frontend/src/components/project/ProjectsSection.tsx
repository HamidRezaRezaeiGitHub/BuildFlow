import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from '@/contexts/NavigationContext';
import { ProjectServiceWithAuth } from '@/services/ProjectService';
import { ProjectDto, PagedResponse, PaginationParams } from '@/services/dtos';
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
  /** Initial number of items to display (default: 3) */
  initialDisplayCount?: number;
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
 * - Progressive loading with background prefetch
 * 
 * Data Flow:
 * 1. Uses useAuth() to get current user
 * 2. Calls ProjectService.getCombinedProjectsPaginated (both builder and owner)
 * 3. Stores projects and state (loading, empty, error) in local state
 * 4. Initially displays only first 3 items (progressive loading)
 * 5. Background prefetch triggered when displayed items reach (totalFetched - 3)
 * 6. Passes final projects[] array to ProjectList for rendering
 * 
 * Features:
 * - Auth-aware data fetching from AuthContext
 * - Combined builder + owner projects (de-duplicated, sorted by lastUpdatedAt DESC)
 * - Loading state with skeleton placeholders
 * - Empty state with call-to-action
 * - Error state with retry option
 * - Progressive loading with "Load More" button
 * - Background prefetch for smooth UX
 * - Export and Filter actions in header
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
  initialDisplayCount = 3,
}) => {
  const { user, token } = useAuth();
  const { navigateToNewProject } = useNavigate();
  const [allFetchedProjects, setAllFetchedProjects] = useState<ProjectDto[]>([]);
  const [displayedCount, setDisplayedCount] = useState(initialDisplayCount);
  const [pagination, setPagination] = useState<PagedResponse<ProjectDto>['pagination'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMore] = useState(false);
  const [filter, setFilter] = useState<ProjectFilter>({ scope: 'both' });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Extract fetch logic into a reusable function
  const fetchProjects = useCallback(async (isBackgroundFetch = false) => {
    if (!user || !token) {
      setIsLoading(false);
      return;
    }

    if (!isBackgroundFetch) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const projectService = new ProjectServiceWithAuth(() => token);
      let response: PagedResponse<ProjectDto>;

      // Determine which projects to fetch based on filter scope or legacy filterByRole
      const effectiveScope = filterByRole || filter.scope;
      
      // Convert date strings to ISO-8601 format if provided
      const createdAfter = filter.createdAfter ? new Date(filter.createdAfter).toISOString() : undefined;
      const createdBefore = filter.createdBefore ? new Date(filter.createdBefore).toISOString() : undefined;
      
      if (effectiveScope === 'builder') {
        response = await projectService.getCombinedProjectsPaginated(
          user.id, 
          'builder', 
          createdAfter, 
          createdBefore, 
          paginationParams
        );
      } else if (effectiveScope === 'owner') {
        response = await projectService.getCombinedProjectsPaginated(
          user.id, 
          'owner', 
          createdAfter, 
          createdBefore, 
          paginationParams
        );
      } else {
        // Default: fetch combined projects (both builder and owner)
        response = await projectService.getCombinedProjectsPaginated(
          user.id, 
          'both', 
          createdAfter, 
          createdBefore, 
          paginationParams
        );
      }

      // No client-side filtering needed - server handles it all
      setAllFetchedProjects(response.content);
      setPagination(response.pagination);
      
      // Reset displayed count to initial on non-background fetches
      if (!isBackgroundFetch) {
        setDisplayedCount(initialDisplayCount);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError('Failed to load projects. Please try again later.');
    } finally {
      if (!isBackgroundFetch) {
        setIsLoading(false);
      }
    }
  }, [user, token, filterByRole, filter, paginationParams, initialDisplayCount]);

  // Trigger background prefetch when we're near the end of current data
  useEffect(() => {
    const shouldPrefetch = 
      allFetchedProjects.length > 0 && 
      displayedCount >= (allFetchedProjects.length - 3) &&
      pagination?.hasNext;

    if (shouldPrefetch && !isLoadingMore) {
      // Trigger background fetch of next page
      // This is a placeholder - in a real implementation, you'd fetch the next page
      // and append to allFetchedProjects
      console.log('[ProjectsSection] Background prefetch triggered');
    }
  }, [displayedCount, allFetchedProjects.length, pagination?.hasNext, isLoadingMore]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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
        <Button onClick={() => fetchProjects()}>
          Retry
        </Button>
      }
    />
  );

  // Render empty state
  const renderEmptyState = () => {
    // Check if filters are applied (non-default values)
    const hasActiveFilters = 
      filter.scope !== 'both' || 
      filter.createdAfter !== undefined || 
      filter.createdBefore !== undefined;
    
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
                setFilter({ scope: 'both' });
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

  // Handle load more
  const handleLoadMore = () => {
    const newCount = Math.min(displayedCount + initialDisplayCount, allFetchedProjects.length);
    setDisplayedCount(newCount);
  };

  // Handle filter apply
  const handleApplyFilter = (newFilter: ProjectFilter) => {
    setFilter(newFilter);
    setIsFilterOpen(false);
  };

  // Handle export (placeholder)
  const handleExport = () => {
    alert('Export functionality will be implemented in a future update.');
  };

  // Get projects to display (progressive loading)
  const displayedProjects = allFetchedProjects.slice(0, displayedCount);
  const hasMoreToShow = displayedCount < allFetchedProjects.length;

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
                        checked={filter.scope === 'both'}
                        onChange={(e) => setFilter({ ...filter, scope: e.target.value as ProjectFilterScope })}
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
                        checked={filter.scope === 'builder'}
                        onChange={(e) => setFilter({ ...filter, scope: e.target.value as ProjectFilterScope })}
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
                        checked={filter.scope === 'owner'}
                        onChange={(e) => setFilter({ ...filter, scope: e.target.value as ProjectFilterScope })}
                        className="h-4 w-4 cursor-pointer"
                        aria-label="Show projects where I am owner"
                      />
                      <span className="text-sm">Owner only</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label htmlFor="created-after" className="text-sm font-medium mb-2 block">
                    Created between (start date)
                  </label>
                  <input
                    id="created-after"
                    type="date"
                    value={filter.createdAfter || ''}
                    onChange={(e) => setFilter({ ...filter, createdAfter: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                    aria-label="Filter by created after date"
                  />
                </div>
                <div>
                  <label htmlFor="created-before" className="text-sm font-medium mb-2 block">
                    Created between (end date)
                  </label>
                  <input
                    id="created-before"
                    type="date"
                    value={filter.createdBefore || ''}
                    onChange={(e) => setFilter({ ...filter, createdBefore: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                    aria-label="Filter by created before date"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={() => handleApplyFilter(filter)} className="flex-1">
                    Apply Filters
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setFilter({ scope: 'both' });
                      setIsFilterOpen(false);
                    }}
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
          <ProjectList projects={displayedProjects} />
          
          {/* Load More button */}
          {hasMoreToShow && (
            <div className="flex justify-center mt-4">
              <Button 
                onClick={handleLoadMore} 
                variant="outline"
                disabled={isLoadingMore}
              >
                {isLoadingMore ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}

          {/* Pagination info */}
          {pagination && pagination.totalElements > 0 && (
            <div className="text-center text-sm text-muted-foreground mt-4">
              Showing {displayedProjects.length} of {pagination.totalElements} project{pagination.totalElements !== 1 ? 's' : ''}
              {pagination.totalPages > 1 && ` • Page ${pagination.page + 1} of ${pagination.totalPages}`}
            </div>
          )}
        </>
      )}
    </DashboardSection>
  );
};

export default ProjectsSection;
