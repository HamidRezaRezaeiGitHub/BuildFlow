import React from 'react';
import { cn } from '@/utils/utils';

/**
 * DashboardSection Props
 * Defines the contract for a dashboard section
 */
export interface DashboardSectionProps {
  /** Section title displayed in the header */
  title?: string;
  /** Optional subtitle or description */
  description?: string;
  /** Optional action buttons or controls displayed in header */
  actions?: React.ReactNode;
  /** Section content */
  children: React.ReactNode;
  /** Optional additional CSS classes */
  className?: string;
  /** Optional ID for the section */
  id?: string;
}

/**
 * DashboardSection - Reusable section wrapper with consistent styling
 * Provides header with title/actions and body slot for content
 */
export const DashboardSection: React.FC<DashboardSectionProps> = ({
  title,
  description,
  actions,
  children,
  className,
  id,
}) => {
  return (
    <section id={id} className={cn('space-y-4', className)}>
      {/* Section Header - only render if title, description, or actions exist */}
      {(title || description || actions) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* Title and description */}
          {(title || description) && (
            <div className="space-y-1">
              {title && (
                <h2 className="text-2xl font-semibold text-primary tracking-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          )}
          
          {/* Action buttons */}
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}
      
      {/* Section Body */}
      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
};

/**
 * DashboardLayout Props
 */
export interface DashboardLayoutProps {
  /** Main dashboard title */
  title?: string;
  /** Optional subtitle or welcome message */
  subtitle?: React.ReactNode;
  /** Dashboard sections/content */
  children: React.ReactNode;
  /** Optional additional CSS classes */
  className?: string;
  /** Layout variant - single column or grid */
  variant?: 'single' | 'grid';
  /** Custom grid columns for md+ breakpoint (1-4, default: 2) */
  gridCols?: 1 | 2 | 3 | 4;
}

/**
 * DashboardLayout - Mobile-first responsive layout for dashboard pages
 * 
 * Features:
 * - Mobile-first single column layout
 * - Optional grid layout at md+ breakpoint
 * - Safe-area padding for iOS notch support
 * - Bottom navbar separation with adequate spacing
 * - Consistent vertical rhythm
 * - Section slots with reusable wrapper
 * - Progressive enhancement for larger screens
 * 
 * Usage:
 * ```tsx
 * <DashboardLayout
 *   title="Dashboard"
 *   subtitle={<p>Welcome back, {user.username}!</p>}
 *   variant="single"
 * >
 *   <DashboardSection title="Projects" actions={<Button>New</Button>}>
 *     <ProjectList />
 *   </DashboardSection>
 * </DashboardLayout>
 * ```
 */
// Predefined mapping for grid column classes
// Tailwind JIT requires complete class names to be present in source code
const GRID_COLS_CLASSES: Record<number, string> = {
  1: 'md:grid md:grid-cols-1 md:gap-6',
  2: 'md:grid md:grid-cols-2 md:gap-6',
  3: 'md:grid md:grid-cols-3 md:gap-6',
  4: 'md:grid md:grid-cols-4 md:gap-6',
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  subtitle,
  children,
  className,
  variant = 'single',
  gridCols = 2,
}) => {
  // Get grid classes from predefined mapping
  const gridClasses = variant === 'grid' 
    ? GRID_COLS_CLASSES[gridCols] || GRID_COLS_CLASSES[2]
    : '';

  return (
    <div 
      className={cn(
        'min-h-screen bg-background',
        // Bottom padding for navbar clearance (h-16 = 4rem = 64px + extra spacing)
        // Using pb-24 (6rem = 96px) to provide comfortable clearance beyond navbar height
        'pb-24',
        className
      )}
      style={{
        // Add safe-area padding for iOS notch support
        paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))',
      }}
    >
      {/* Content container with responsive padding */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Dashboard Header */}
        {(title || subtitle) && (
          <div className="mb-8 space-y-2">
            {title && (
              <h1 className="text-3xl font-bold text-primary tracking-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <div className="text-muted-foreground">
                {subtitle}
              </div>
            )}
          </div>
        )}

        {/* Dashboard Sections */}
        <div className={cn('space-y-8', gridClasses)}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
