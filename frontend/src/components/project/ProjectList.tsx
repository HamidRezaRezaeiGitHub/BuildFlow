import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '@/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface ProjectListProps {
  /** Array of projects to display */
  projects: Project[];
  /** Optional callback when a project is selected */
  onProjectSelect?: (projectId: string) => void;
  /** Optional callback when edit is requested */
  onProjectEdit?: (projectId: string) => void;
  /** Optional callback when delete is requested */
  onProjectDelete?: (projectId: string) => void;
}

/**
 * ProjectList Component
 * 
 * Pure presentational component responsible for:
 * - Displaying a list (or grid) of projects as cards
 * - Handling responsive layout details and item rendering
 * - Being reusable anywhere — not just the Dashboard (e.g., in a full Projects page later)
 * 
 * Features:
 * - Responsive grid layout (mobile-first)
 * - Project cards with location, timestamps, and actions
 * - Action dropdown menu for each project (Open, Edit, Delete)
 * - Mobile-friendly touch targets
 * - Clean separation from data fetching logic
 */
export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onProjectSelect,
  onProjectEdit,
  onProjectDelete,
}) => {
  const navigate = useNavigate();

  // Handle project actions
  const handleOpen = (projectId: string) => {
    if (onProjectSelect) {
      onProjectSelect(projectId);
    } else {
      // Default behavior: navigate to project details page
      navigate(`/projects/${projectId}`);
    }
  };

  const handleEdit = (projectId: string) => {
    if (onProjectEdit) {
      onProjectEdit(projectId);
    } else {
      console.log('Edit project:', projectId);
    }
  };

  const handleDelete = (projectId: string) => {
    if (onProjectDelete) {
      onProjectDelete(projectId);
    } else {
      console.log('Delete project:', projectId);
    }
  };

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
  const formatLocation = (project: Project): string => {
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card 
          key={project.id} 
          className="hover:shadow-md transition-shadow cursor-pointer focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
          role="button"
          tabIndex={0}
          onClick={() => handleOpen(project.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleOpen(project.id);
            }
          }}
          aria-label={`Open project at ${formatLocation(project)}`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate">
                  {formatLocation(project)}
                </CardTitle>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
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
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(project.id);
                  }}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    handleOpen(project.id);
                  }}>
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(project.id);
                    }}
                    className="text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Updated: {formatDate(project.lastUpdatedAt)} • Created: {formatDate(project.createdAt)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectList;
