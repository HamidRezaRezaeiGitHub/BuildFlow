import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';
import { Home, Plus, Settings } from 'lucide-react';
import React, { useCallback } from 'react';

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

export interface FlexibleBottomNavbarProps {
    className?: string;

    // Floating Action Button (FAB) configuration
    fab?: FloatingActionButton;
    showFab?: boolean;

    // Click handlers for default items
    onHomeClick?: () => void;
    onSettingsClick?: () => void;

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

    // Click handlers
    onHomeClick,
    onSettingsClick,

    // Visibility
    isVisible = true,
}) => {
    // Handle Home click with default behavior
    const handleHomeClick = useCallback(() => {
        if (onHomeClick) {
            onHomeClick();
        } else {
            console.log('Home clicked - no handler provided');
        }
    }, [onHomeClick]);

    // Handle Settings click with default behavior
    const handleSettingsClick = useCallback(() => {
        if (onSettingsClick) {
            onSettingsClick();
        } else {
            console.log('Settings clicked - no handler provided');
        }
    }, [onSettingsClick]);

    // Handle FAB click
    const handleFabClick = useCallback(() => {
        if (fab?.onClick) {
            fab.onClick();
        }
    }, [fab]);

    // Define default items: Home on left, Settings on right
    const leftItems = [
        {
            label: 'Home',
            icon: <Home className="h-5 w-5" />,
            onClick: handleHomeClick,
            isActive: false,
        }
    ];

    const rightItems = [
        {
            label: 'Settings',
            icon: <Settings className="h-5 w-5" />,
            onClick: handleSettingsClick,
            isActive: false,
        }
    ];

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
            {/* Floating Action Button - positioned half in/half out of bottom bar */}
            {showFab && (
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
            )}
            
            {/* Bottom Navigation Bar */}
            <div className={cn(
                "fixed bottom-0 left-0 right-0 z-[100] transition-transform duration-300 max-w-full",
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

                    {/* Border overlay - theme-aware */}
                    <div className="absolute inset-0 border-t border-border/50" />

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
                                {rightItems.map((item, index) => (
                                    <div key={`right-${index}`} className="flex-shrink-0">
                                        {renderNavItem(item, `right-${index}`)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FlexibleBottomNavbar;