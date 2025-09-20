import React from 'react';
import { cn } from '@/utils/utils';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
  sidebar?: React.ReactNode;
  showSidebar?: boolean;
}

/**
 * AppLayout - Layout component for authenticated user pages
 * 
 * This layout provides:
 * - Resizable sidebar panel for navigation/tools
 * - Main content area for application pages
 * - Responsive design that adapts to different screen sizes
 * - Optional sidebar visibility control
 */
const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  className, 
  sidebar,
  showSidebar = true 
}) => {
  if (!showSidebar || !sidebar) {
    // Single panel layout when sidebar is not shown
    return (
      <div className={cn("h-screen bg-background", className)}>
        <main className="h-full overflow-auto">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className={cn("h-screen bg-background", className)}>
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Sidebar Panel */}
        <ResizablePanel
          defaultSize={20}
          minSize={15}
          maxSize={35}
          className="border-r border-border/40"
        >
          <div className="h-full overflow-auto bg-muted/30">
            {sidebar}
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Main Content Panel */}
        <ResizablePanel defaultSize={80} minSize={65}>
          <main className="h-full overflow-auto">
            {children}
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default AppLayout;