import { FolderOpen, Calculator, Package, Settings, ChevronLeft } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/cn';
import { LucideIcon } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  className?: string;
}

const navItems: NavItem[] = [
  { id: 'projects', label: 'Projects', icon: FolderOpen, path: '/projects' },
  { id: 'estimates', label: 'Estimates', icon: Calculator, path: '/estimates' },
  { id: 'catalog', label: 'Catalog', icon: Package, path: '/catalog' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

export function Sidebar({ isCollapsed, onToggle, className }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r bg-muted/40 transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Sidebar header */}
      <div className="flex h-14 items-center justify-between px-3">
        {!isCollapsed && <h2 className="text-lg font-semibold">BuildFlow</h2>}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="touch-target"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            className={cn('h-4 w-4 transition-transform', isCollapsed && 'rotate-180')}
          />
        </Button>
      </div>

      <Separator className="" />

      {/* Navigation items */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);

          return (
            <Button
              key={item.id}
              variant={isActive ? 'secondary' : 'ghost'}
              size="sm"
              className={cn(
                'w-full justify-start touch-target',
                isCollapsed && 'justify-center px-2'
              )}
              asChild
            >
              <Link to={item.path} aria-label={item.label}>
                <Icon className={cn('h-5 w-5', !isCollapsed && 'mr-3')} />
                {!isCollapsed && (
                  <span className={cn(isActive && 'font-medium')}>{item.label}</span>
                )}
              </Link>
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}
