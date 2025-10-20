import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/utils';
import { useMediaQuery } from '@/utils/useMediaQuery';
import { FolderOpen, LogOut, Plus, MoreVertical, User, Settings, ChevronDown, PlusCircle, FileText } from 'lucide-react';
import React, { useCallback, useState } from 'react';

// Type for theme toggle component
export type ThemeToggleComponent = React.ComponentType<{
    showLabel?: boolean;
}>;

export interface BottomNavItem {
    label: string;
    icon: React.ReactNode;
    href?: string;
    onClick?: () => void;
    badge?: string | number;
    isActive?: boolean;
}

export interface FloatingActionButton {
    icon?: React.ReactNode;
    onClick?: () => void;
    'aria-label'?: string;
    className?: string;
}

export interface PlusMenuItem {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
}

export interface FlexibleBottomNavbarProps {
    className?: string;

    // Floating Action Button (FAB) configuration
    fab?: FloatingActionButton;
    showFab?: boolean;

    // Plus menu configuration
    showCreateNewProject?: boolean;
    onCreateNewProject?: () => void;
    showCreateNewEstimate?: boolean;
    onCreateNewEstimate?: () => void;
    plusMenuItems?: PlusMenuItem[];
    plusMenuVariant?: 'auto' | 'sheet' | 'dropdown';

    // More menu configuration
    moreMenuVariant?: 'auto' | 'sheet' | 'dropdown';

    // Click handlers for default items
    onProjectsClick?: () => void;
    onProfileClick?: () => void;
    onLogoutClick?: () => void;

    // Theme toggle configuration
    ThemeToggleComponent?: ThemeToggleComponent;
    showThemeToggle?: boolean;

    // Visibility control
    isVisible?: boolean;
}

/**
 * FlexibleBottomNavbar - A Material Design inspired bottom app bar with FAB cutout
 */
export const FlexibleBottomNavbar: React.FC<FlexibleBottomNavbarProps> = ({
    className = '',

    // FAB props
    fab,
    showFab = true,

    // Plus menu props
    showCreateNewProject = true,
    onCreateNewProject,
    showCreateNewEstimate = true,
    onCreateNewEstimate,
    plusMenuItems = [],
    plusMenuVariant = 'auto',

    // More menu props
    moreMenuVariant = 'auto',

    // Click handlers
    onProjectsClick,
    onProfileClick,
    onLogoutClick,

    // Theme toggle props
    ThemeToggleComponent,
    showThemeToggle = false,

    // Visibility
    isVisible = true,
}) => {
    // Get logout from AuthContext as fallback
    const { logout: authLogout } = useAuth();

    // State for collapsible preferences
    const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

    // State for plus menu
    const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);

    // State for more menu
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

    // Detect mobile for responsive behavior
    const isMobile = useMediaQuery('(max-width: 767px)');

    // Determine which variant to use for plus menu
    const effectivePlusMenuVariant = plusMenuVariant === 'auto' 
        ? (isMobile ? 'sheet' : 'dropdown')
        : plusMenuVariant;

    // Determine which variant to use for more menu
    const effectiveMoreMenuVariant = moreMenuVariant === 'auto' 
        ? (isMobile ? 'sheet' : 'dropdown')
        : moreMenuVariant;

    // Handle Projects click with default behavior
    const handleProjectsClick = useCallback(() => {
        if (onProjectsClick) {
            onProjectsClick();
        } else {
            console.log('Projects clicked - no handler provided');
        }
    }, [onProjectsClick]);

    // Settings menu handlers
    const handleProfile = useCallback(() => {
        if (onProfileClick) {
            onProfileClick();
        } else {
            console.log('Profile clicked - no handler provided');
        }
    }, [onProfileClick]);

    const handleLogout = useCallback(async () => {
        if (onLogoutClick) {
            onLogoutClick();
        } else {
            // Use AuthContext logout as fallback
            console.log('Logout clicked - using AuthContext logout');
            await authLogout();
        }
    }, [onLogoutClick, authLogout]);

    // Helper function to render theme toggle with appropriate props
    const renderThemeToggle = (showLabel: boolean = false) => {
        if (!ThemeToggleComponent) {
            return null;
        }
        return <ThemeToggleComponent showLabel={showLabel} />;
    };

    // Build preference items list - scalable for future additions
    const buildPreferenceItems = () => {
        const items: React.ReactNode[] = [];

        // Add theme toggle if enabled
        if (showThemeToggle) {
            items.push(
                <div key="theme-toggle" className="flex items-center justify-between py-2">
                    <span className="text-sm">Theme</span>
                    <div className="flex items-center">
                        {renderThemeToggle(false)}
                    </div>
                </div>
            );
        }

        // Future preference items can be added here
        // Example:
        // if (showNotifications) {
        //     items.push(<NotificationToggle key="notifications" />);
        // }

        return items;
    };

    const preferenceItems = buildPreferenceItems();
    const hasPreferences = preferenceItems.length > 0;

    // Handle Create New Project action
    const handleCreateNewProject = useCallback(() => {
        if (onCreateNewProject) {
            onCreateNewProject();
        }
        setIsPlusMenuOpen(false);
    }, [onCreateNewProject]);

    // Handle Create New Estimate action
    const handleCreateNewEstimate = useCallback(() => {
        if (onCreateNewEstimate) {
            onCreateNewEstimate();
        }
        setIsPlusMenuOpen(false);
    }, [onCreateNewEstimate]);

    // Build plus menu items
    const buildPlusMenuItems = useCallback(() => {
        const items: Array<PlusMenuItem & { key: string }> = [];

        // Add default "Create New Project" action
        if (showCreateNewProject) {
            items.push({
                key: 'create-project',
                label: 'Create New Project',
                icon: <PlusCircle className="h-5 w-5" />,
                onClick: handleCreateNewProject,
                disabled: !onCreateNewProject,
            });
        }

        // Add default "Create New Estimate" action
        if (showCreateNewEstimate) {
            items.push({
                key: 'create-estimate',
                label: 'Create New Estimate',
                icon: <FileText className="h-5 w-5" />,
                onClick: handleCreateNewEstimate,
                disabled: !onCreateNewEstimate,
            });
        }

        // Add custom items
        plusMenuItems.forEach((item, index) => {
            items.push({
                ...item,
                key: `custom-${index}`,
            });
        });

        return items;
    }, [showCreateNewProject, onCreateNewProject, handleCreateNewProject, showCreateNewEstimate, onCreateNewEstimate, handleCreateNewEstimate, plusMenuItems]);

    const plusItems = buildPlusMenuItems();

    // Render Preferences collapsible section
    const renderPreferences = () => {
        if (!hasPreferences) {
            return null;
        }

        return (
            <Collapsible
                open={isPreferencesOpen}
                onOpenChange={setIsPreferencesOpen}
            >
                <CollapsibleTrigger asChild>
                    <button
                        className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                        <div className="flex items-center">
                            <Settings className="mr-3 h-5 w-5" />
                            <span className="text-sm font-medium">Preferences</span>
                        </div>
                        <ChevronDown 
                            className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                isPreferencesOpen && "transform rotate-180"
                            )}
                        />
                    </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-11 pr-3 space-y-2">
                    {preferenceItems}
                </CollapsibleContent>
            </Collapsible>
        );
    };

    // Render Plus menu as Sheet (mobile)
    const renderPlusMenuSheet = () => (
        <Sheet open={isPlusMenuOpen} onOpenChange={setIsPlusMenuOpen}>
            <SheetTrigger asChild>
                <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[120]">
                    <Button
                        size="lg"
                        className={cn(
                            "w-14 h-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200",
                            "bg-primary hover:bg-primary/90 text-primary-foreground",
                            "ring-4 ring-primary/20 hover:ring-primary/30",
                            "border-2 border-primary/10 hover:border-primary/20",
                            fab?.className
                        )}
                        aria-label={fab?.['aria-label'] || 'Create new item'}
                    >
                        {fab?.icon || <Plus className="h-6 w-6" />}
                    </Button>
                </div>
            </SheetTrigger>
            <SheetContent 
                side="bottom" 
                className="max-h-[70vh] pb-[env(safe-area-inset-bottom)] z-[130]"
            >
                <SheetHeader>
                    <SheetTitle>Create New</SheetTitle>
                    <SheetDescription className="sr-only">
                        Select an action to create a new item
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-1">
                    {plusItems.map((item) => (
                        <button
                            key={item.key}
                            onClick={item.onClick}
                            disabled={item.disabled}
                            className={cn(
                                "flex items-center w-full p-3 rounded-lg transition-colors",
                                item.disabled
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-accent"
                            )}
                        >
                            {item.icon && <span className="mr-3">{item.icon}</span>}
                            <span className="text-sm font-medium">{item.label}</span>
                        </button>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );

    // Render Plus menu as Dropdown (desktop)
    const renderPlusMenuDropdown = () => (
        <DropdownMenu open={isPlusMenuOpen} onOpenChange={setIsPlusMenuOpen}>
            <DropdownMenuTrigger asChild>
                <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[120]">
                    <Button
                        size="lg"
                        className={cn(
                            "w-14 h-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200",
                            "bg-primary hover:bg-primary/90 text-primary-foreground",
                            "ring-4 ring-primary/20 hover:ring-primary/30",
                            "border-2 border-primary/10 hover:border-primary/20",
                            fab?.className
                        )}
                        aria-label={fab?.['aria-label'] || 'Create new item'}
                    >
                        {fab?.icon || <Plus className="h-6 w-6" />}
                    </Button>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                align="center" 
                side="top"
                className="w-56 mb-2"
                sideOffset={8}
            >
                {plusItems.map((item) => (
                    <DropdownMenuItem
                        key={item.key}
                        onClick={item.onClick}
                        disabled={item.disabled}
                        className="cursor-pointer"
                    >
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        <span>{item.label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );

    // Render Plus menu based on variant
    const renderPlusMenu = () => {
        if (effectivePlusMenuVariant === 'sheet') {
            return renderPlusMenuSheet();
        }
        return renderPlusMenuDropdown();
    };

    // Handle FAB click - legacy support
    const handleFabClick = useCallback(() => {
        if (fab?.onClick) {
            fab.onClick();
        } else {
            // If no custom FAB onClick, open plus menu
            setIsPlusMenuOpen(true);
        }
    }, [fab]);

    // Define default items: Projects on left, More on right
    const leftItems = [
        {
            label: 'Projects',
            icon: <FolderOpen className="h-5 w-5" />,
            onClick: handleProjectsClick,
            isActive: false,
        }
    ];

    // Render more options menu as Sheet (mobile)
    const renderMoreMenuSheet = () => (
        <Sheet open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
            <SheetTrigger asChild>
                <button
                    className={cn(
                        "flex flex-col items-center justify-center p-1 sm:p-2 min-w-0 max-w-16 relative",
                        "transition-all duration-200 ease-in-out",
                        "rounded-lg hover:bg-accent/50 active:bg-accent/70",
                        "text-muted-foreground hover:text-foreground"
                    )}
                    aria-label="More options menu"
                >
                    <div className="transition-transform duration-200">
                        <MoreVertical className="h-5 w-5" />
                    </div>
                    <span className="text-xs mt-1 truncate w-full text-center transition-colors duration-200 font-normal">
                        More
                    </span>
                </button>
            </SheetTrigger>
            <SheetContent 
                side="bottom" 
                className="max-h-[70vh] pb-[env(safe-area-inset-bottom)] z-[130]"
            >
                <SheetHeader>
                    <SheetTitle>My Account</SheetTitle>
                    <SheetDescription className="sr-only">
                        Manage your account settings and preferences
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-1">
                    {/* Profile */}
                    <button
                        onClick={handleProfile}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                        <User className="mr-3 h-5 w-5" />
                        <span className="text-sm font-medium">Profile</span>
                    </button>

                    {/* Preferences - Conditionally rendered based on available items */}
                    {renderPreferences()}

                    {/* Separator */}
                    <div className="my-2 border-t border-border" />

                    {/* Log out */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-accent transition-colors text-destructive"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        <span className="text-sm font-medium">Log out</span>
                    </button>
                </div>
            </SheetContent>
        </Sheet>
    );

    // Render more options menu as Dropdown (desktop)
    const renderMoreMenuDropdown = () => (
        <DropdownMenu open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
            <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                        "flex flex-col items-center justify-center p-1 sm:p-2 min-w-0 max-w-16 relative",
                        "transition-all duration-200 ease-in-out",
                        "rounded-lg hover:bg-accent/50 active:bg-accent/70",
                        "text-muted-foreground hover:text-foreground"
                    )}
                    aria-label="More options menu"
                >
                    <div className="transition-transform duration-200">
                        <MoreVertical className="h-5 w-5" />
                    </div>
                    <span className="text-xs mt-1 truncate w-full text-center transition-colors duration-200 font-normal">
                        More
                    </span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                align="end" 
                side="top"
                className="w-56 mb-2"
                sideOffset={8}
            >
                {/* Profile */}
                <DropdownMenuItem
                    onClick={handleProfile}
                    className="cursor-pointer"
                >
                    <User className="mr-2 h-5 w-5" />
                    <span>Profile</span>
                </DropdownMenuItem>

                {/* Settings with theme toggle if available */}
                {showThemeToggle && (
                    <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="cursor-pointer"
                    >
                        <Settings className="mr-2 h-5 w-5" />
                        <span className="flex-1">Theme</span>
                        {renderThemeToggle(false)}
                    </DropdownMenuItem>
                )}

                {/* Separator */}
                <div className="my-1 border-t border-border" />

                {/* Log out */}
                <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive focus:text-destructive"
                >
                    <LogOut className="mr-2 h-5 w-5" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    // Render more menu based on variant
    const renderMoreMenu = () => {
        if (effectiveMoreMenuVariant === 'sheet') {
            return renderMoreMenuSheet();
        }
        return renderMoreMenuDropdown();
    };

    // Generate cutout path based on style
    const getCutoutPath = () => {
        const centerX = 50; // Center percentage
        const cutoutWidth = 16; // Width percentage of the cutout

        return `M 0,0 L ${centerX - cutoutWidth / 2},0 
                A ${cutoutWidth / 2},${cutoutWidth / 2} 0 0,0 ${centerX + cutoutWidth / 2},0 
                L 100,0 L 100,100 L 0,100 Z`;
    }

    // Render navigation item
    const renderNavItem = (item: BottomNavItem, key: string) => (
        <button
            key={key}
            onClick={() => item.onClick?.()}
            className={cn(
                "flex flex-col items-center justify-center p-1 sm:p-2 min-w-0 max-w-16 relative",
                "transition-all duration-200 ease-in-out",
                "rounded-lg hover:bg-accent/50 active:bg-accent/70",
                item.isActive
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
            )}
            aria-label={item.label}
        >
            <div className="relative">
                <div className={cn(
                    "transition-transform duration-200",
                    item.isActive && "scale-110"
                )}>
                    {item.icon}
                </div>
                {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 font-semibold shadow-sm">
                        {item.badge}
                    </span>
                )}
            </div>
            <span className={cn(
                "text-xs mt-1 truncate w-full text-center transition-colors duration-200",
                item.isActive ? "font-medium text-primary" : "font-normal"
            )}>
                {item.label}
            </span>
        </button>
    );

    // Don't render if not visible
    if (!isVisible) return null;

    return (
        <>
            {/* Floating Action Button with Plus Menu */}
            {showFab && (fab?.onClick ? (
                // Legacy: Direct FAB with custom onClick
                <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[120]">
                    <Button
                        size="lg"
                        className={cn(
                            "w-14 h-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200",
                            "bg-primary hover:bg-primary/90 text-primary-foreground",
                            "ring-4 ring-primary/20 hover:ring-primary/30",
                            "border-2 border-primary/10 hover:border-primary/20",
                            fab?.className
                        )}
                        onClick={handleFabClick}
                        aria-label={fab?.['aria-label'] || 'Floating action button'}
                    >
                        {fab?.icon || <Plus className="h-6 w-6" />}
                    </Button>
                </div>
            ) : (
                // New: Plus menu with configurable actions
                renderPlusMenu()
            ))}
            
            {/* Bottom Navigation Bar */}
            <div className={cn(
                "fixed bottom-0 left-0 right-0 z-[100] transition-transform duration-300 max-w-full overflow-visible",
                isVisible ? "translate-y-0" : "translate-y-full"
            )}
                style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                
                {/* Background with cutout */}
                <div className="relative max-w-full overflow-hidden">
                    <svg
                        className="absolute inset-0 w-full h-full"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        <path
                            d={getCutoutPath()}
                            fill="hsl(var(--background))"
                            className="drop-shadow-lg"
                        />
                    </svg>

                    {/* Border overlay with shadow - theme-aware */}
                    <div className="absolute inset-0 border-t border-border shadow-sm" />

                    {/* Content */}
                    <div className={cn(
                        "relative px-2 py-2 h-16 flex items-center",
                        "backdrop-blur-md supports-[backdrop-filter]:bg-background/80 bg-background/95",
                        "transition-colors duration-200",
                        className
                    )}>
                        {/* Navigation Items */}
                        <div className="flex w-full items-center">
                            {/* Left side items */}
                            <div className="flex flex-1 justify-around min-w-0">
                                {leftItems.map((item, index) => (
                                    <div key={`left-${index}`} className="flex-shrink-0">
                                        {renderNavItem(item, `left-${index}`)}
                                    </div>
                                ))}
                            </div>

                            {/* Center space for FAB */}
                            <div className="w-16 flex-shrink-0" />

                            {/* Right side items */}
                            <div className="flex flex-1 justify-around min-w-0">
                                <div className="flex-shrink-0">
                                    {renderMoreMenu()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FlexibleBottomNavbar;