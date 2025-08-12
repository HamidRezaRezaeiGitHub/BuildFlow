import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { TopBar } from './TopBar';
import { BottomTabs } from './BottomTabs';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/cn';

export function AppShell() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const handleSidebarToggle = (): void => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleMobileMenuClick = (): void => {
    setIsMobileMenuOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded"
      >
        Skip to content
      </a>

      {/* Mobile navigation sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <div className="hidden" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar
            isCollapsed={false}
            onToggle={() => setIsMobileMenuOpen(false)}
            className="w-full border-0"
          />
        </SheetContent>
      </Sheet>

      <div className="flex">
        {/* Desktop sidebar - hidden on mobile */}
        <div className="hidden md:block">
          <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Top bar - mobile only */}
          <div className="md:hidden">
            <TopBar onMenuClick={handleMobileMenuClick} />
          </div>

          {/* Main content */}
          <main
            id="main-content"
            className={cn(
              'flex-1 p-4',
              'pb-20 md:pb-4' // Extra bottom padding for mobile tabs
            )}
            role="main"
            tabIndex={-1}
          >
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile bottom tabs - hidden on desktop */}
      <div className="md:hidden">
        <BottomTabs />
      </div>
    </div>
  );
}
