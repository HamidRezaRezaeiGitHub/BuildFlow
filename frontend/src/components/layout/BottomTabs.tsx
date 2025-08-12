import { FolderOpen, Calculator, Package, Settings } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { LucideIcon } from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

interface BottomTabsProps {
  className?: string;
}

const tabs: TabItem[] = [
  { id: 'projects', label: 'Projects', icon: FolderOpen, path: '/projects' },
  { id: 'estimates', label: 'Estimates', icon: Calculator, path: '/estimates' },
  { id: 'catalog', label: 'Catalog', icon: Package, path: '/catalog' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

export function BottomTabs({ className }: BottomTabsProps) {
  const location = useLocation();

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden',
        className
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="grid grid-cols-4 h-16">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = location.pathname.startsWith(tab.path);

          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              className={cn(
                'touch-target h-full flex-col gap-1 rounded-none',
                isActive && 'bg-accent text-accent-foreground'
              )}
              asChild
            >
              <Link to={tab.path} aria-label={tab.label}>
                <Icon className={cn('h-5 w-5', isActive && 'text-primary')} />
                <span className={cn('text-xs', isActive && 'font-medium')}>{tab.label}</span>
              </Link>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
