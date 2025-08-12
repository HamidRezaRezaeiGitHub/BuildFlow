import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/cn';

interface TopBarProps {
  onMenuClick?: () => void;
  className?: string;
}

export function TopBar({ onMenuClick, className }: TopBarProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
      role="banner"
    >
      <div className="container flex h-14 items-center">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="mr-2 touch-target md:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* App title */}
        <div className="flex-1 flex justify-center md:justify-start">
          <h1 className="text-lg font-semibold">BuildFlow</h1>
        </div>

        {/* Profile button */}
        <Button variant="ghost" size="sm" className="touch-target" aria-label="User profile">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="">U</AvatarFallback>
          </Avatar>
        </Button>
      </div>
    </header>
  );
}
