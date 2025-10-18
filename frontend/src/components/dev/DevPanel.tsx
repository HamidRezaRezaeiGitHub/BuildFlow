import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { config } from '@/config/environment';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/utils';
import { AlertTriangle, Bug, ChevronDown, ChevronUp, Code, Database, Monitor, Navigation, Settings, User, Zap } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { NavigateFunction } from 'react-router-dom';

// Import RouteDefinition type from AppRouter
export interface RouteDefinition {
    path: string;
    name: string;
    description: string;
    accessLevel: 'public' | 'protected' | 'admin';
    component: React.ComponentType<any>;
}

interface DevPanelProps {
    className?: string;
    availableRoutes?: RouteDefinition[];
    currentRoute?: RouteDefinition;
    onNavigate?: NavigateFunction;
}

// Custom hook for drag functionality
const useDraggable = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const dragRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = useCallback((e: React.MouseEvent, allowOnButton = false) => {
        if (!dragRef.current) return;

        // Don't start dragging if clicking on interactive elements (unless explicitly allowed on buttons)
        const target = e.target as HTMLElement;
        const isButton = target.tagName === 'BUTTON' || target.closest('button');
        const isOtherInteractive = target.tagName === 'INPUT' || target.tagName === 'SELECT' ||
            target.tagName === 'TEXTAREA' || target.closest('input') ||
            target.closest('select') || target.closest('textarea');

        if (isOtherInteractive || (isButton && !allowOnButton)) {
            return;
        }

        const rect = dragRef.current.getBoundingClientRect();
        setIsDragging(true);
        setDragStart({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
        e.preventDefault();
    }, []);

    const handleTouchStart = useCallback((e: React.TouchEvent, allowOnButton = false) => {
        if (!dragRef.current || e.touches.length !== 1) return;

        // Don't start dragging if touching interactive elements (unless explicitly allowed on buttons)
        const target = e.target as HTMLElement;
        const isButton = target.tagName === 'BUTTON' || target.closest('button');
        const isOtherInteractive = target.tagName === 'INPUT' || target.tagName === 'SELECT' ||
            target.tagName === 'TEXTAREA' || target.closest('input') ||
            target.closest('select') || target.closest('textarea');

        if (isOtherInteractive || (isButton && !allowOnButton)) {
            return;
        }

        const rect = dragRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        });
        e.preventDefault();
    }, []);

    const updatePosition = useCallback((clientX: number, clientY: number) => {
        const newX = clientX - dragStart.x;
        const newY = clientY - dragStart.y;

        // Allow dragging anywhere on the page with minimal constraints
        // Only ensure the button doesn't go completely off-screen
        const buttonSize = 48; // w-12 h-12 = 48px
        const minPadding = 8; // Smaller padding for more freedom

        setPosition({
            x: Math.max(-buttonSize + minPadding, Math.min(newX, window.innerWidth - minPadding)),
            y: Math.max(-buttonSize + minPadding, Math.min(newY, window.innerHeight - minPadding))
        });
    }, [dragStart]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return;
        updatePosition(e.clientX, e.clientY);
    }, [isDragging, updatePosition]);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!isDragging || e.touches.length !== 1) return;
        const touch = e.touches[0];
        updatePosition(touch.clientX, touch.clientY);
        e.preventDefault();
    }, [isDragging, updatePosition]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleMouseUp);
            document.body.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

    // Initialize position to bottom-right corner with mobile-friendly constraints
    useEffect(() => {
        const initializePosition = () => {
            const buttonSize = 48; // w-12 h-12 = 48px
            const minPadding = 16;
            
            // On mobile, position slightly higher to avoid overlap with bottom navigation
            // Bottom navigation typically takes 64-80px (16-20 in Tailwind units)
            const isMobile = window.innerWidth < 768;
            const bottomOffset = isMobile ? 80 : minPadding; // Extra clearance on mobile
            
            setPosition({
                x: window.innerWidth - buttonSize - minPadding,
                y: window.innerHeight - buttonSize - bottomOffset
            });
        };

        // Only initialize if position is at default (0,0)
        if (position.x === 0 && position.y === 0) {
            initializePosition();
        }
    }, [position.x, position.y]);

    // Handle window resize to keep button in bounds with mobile-aware constraints
    useEffect(() => {
        const handleResize = () => {
            const buttonSize = 48;
            const minPadding = 8;
            const isMobile = window.innerWidth < 768;
            const bottomClearance = isMobile ? 80 : minPadding; // Extra space for mobile nav

            setPosition(prev => ({
                x: Math.max(-buttonSize + minPadding, Math.min(prev.x, window.innerWidth - minPadding)),
                y: Math.max(-buttonSize + minPadding, Math.min(prev.y, window.innerHeight - bottomClearance))
            }));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const resetPosition = useCallback(() => {
        const buttonSize = 48;
        const minPadding = 16;
        const isMobile = window.innerWidth < 768;
        const bottomOffset = isMobile ? 80 : minPadding; // Extra clearance on mobile
        
        setPosition({
            x: window.innerWidth - buttonSize - minPadding,
            y: window.innerHeight - buttonSize - bottomOffset
        });
    }, []);

    // Position detection functions
    const getQuadrant = useCallback(() => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const isLeft = position.x < centerX;
        const isTop = position.y < centerY;

        if (isTop && isLeft) return 'top-left';
        if (isTop && !isLeft) return 'top-right';
        if (!isTop && isLeft) return 'bottom-left';
        return 'bottom-right';
    }, [position.x, position.y]);

    const calculatePanelPosition = useCallback(() => {
        const quadrant = getQuadrant();
        const buttonSize = 48; // w-12 h-12 = 48px
        const panelWidth = 384; // w-96 = 384px
        const panelHeight = 600; // Approximate max panel height
        const gap = 8; // Gap between button and panel
        const isMobile = window.innerWidth < 768;
        
        // On mobile, use smaller panel width if needed
        const effectivePanelWidth = isMobile && window.innerWidth < panelWidth + 32 
            ? window.innerWidth - 32 // Leave 16px padding on each side
            : panelWidth;

        let panelX = position.x;
        let panelY = position.y;

        switch (quadrant) {
            case 'top-left':
                // Panel opens to the right and down from button
                panelX = position.x + buttonSize + gap;
                panelY = position.y;
                break;
            case 'top-right':
                // Panel opens to the left and down from button
                panelX = position.x - effectivePanelWidth - gap;
                panelY = position.y;
                break;
            case 'bottom-left':
                // Panel opens to the right and up from button
                panelX = position.x + buttonSize + gap;
                panelY = position.y - panelHeight + buttonSize;
                break;
            case 'bottom-right':
                // Panel opens to the left and up from button
                panelX = position.x - effectivePanelWidth - gap;
                panelY = position.y - panelHeight + buttonSize;
                break;
        }

        // Ensure panel stays within viewport bounds with mobile-aware constraints
        const minPadding = 16;
        const maxPaddingBottom = isMobile ? 80 : minPadding; // Extra clearance for mobile nav
        
        panelX = Math.max(minPadding, Math.min(panelX, window.innerWidth - effectivePanelWidth - minPadding));
        panelY = Math.max(minPadding, Math.min(panelY, window.innerHeight - panelHeight - maxPaddingBottom));

        return { x: panelX, y: panelY, quadrant, effectivePanelWidth };
    }, [position.x, position.y, getQuadrant]);

    // Button-specific drag handlers that allow dragging on buttons
    const handleButtonMouseDown = useCallback((e: React.MouseEvent) => {
        handleMouseDown(e, true);
    }, [handleMouseDown]);

    const handleButtonTouchStart = useCallback((e: React.TouchEvent) => {
        handleTouchStart(e, true);
    }, [handleTouchStart]);

    return {
        position,
        isDragging,
        dragRef,
        handleMouseDown,
        handleTouchStart,
        handleButtonMouseDown,
        handleButtonTouchStart,
        resetPosition,
        getQuadrant,
        calculatePanelPosition
    };
};

/**
 * DevPanel - Development tools and debugging information panel
 * 
 * This component is only available in development mode and provides:
 * - Environment configuration display
 * - Debug information
 * - Development tools and shortcuts
 * - System status monitoring
 * - Navigation between available routes
 * 
 * Note: This component should only be rendered when config.isDevelopment is true
 */
export const DevPanel: React.FC<DevPanelProps> = ({
    className,
    availableRoutes = [],
    currentRoute,
    onNavigate
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { position, isDragging, dragRef, handleMouseDown, handleTouchStart, handleButtonMouseDown, handleButtonTouchStart, resetPosition, getQuadrant, calculatePanelPosition } = useDraggable();

    const panelPosition = calculatePanelPosition();
    const currentQuadrant = getQuadrant();

    return (
        <>
            {/* Toggle Button */}
            <div
                ref={dragRef}
                className="fixed z-[150]"
                style={{
                    left: position.x,
                    top: position.y,
                    cursor: isDragging ? 'grabbing' : 'grab'
                }}
            >
                <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                    <CollapsibleTrigger asChild>
                        <button
                            className={cn(
                                "w-12 h-12 flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg border-2 border-orange-300 transition-all duration-200 select-none",
                                isDragging ? "scale-105" : "hover:scale-105"
                            )}
                            onMouseDown={handleButtonMouseDown}
                            onTouchStart={handleButtonTouchStart}
                            title={`Drag to move panel • Currently in ${currentQuadrant}`}
                        >
                            <Code className="h-5 w-5" />
                        </button>
                    </CollapsibleTrigger>
                </Collapsible>
            </div>

            {/* Expanded Panel */}
            {isExpanded && (
                <div
                    className={cn("fixed z-[140]", className)}
                    style={{
                        left: panelPosition.x,
                        top: panelPosition.y,
                        width: panelPosition.effectivePanelWidth
                    }}
                >
                    <Card className={cn(
                        "border-2 border-orange-200 shadow-xl bg-gradient-to-br from-orange-50 to-amber-50 max-h-[80vh] transition-shadow duration-200 w-full",
                        isDragging && "shadow-2xl ring-2 ring-orange-300 ring-opacity-50"
                    )}>
                        <CardHeader
                            className="pb-2 cursor-grab active:cursor-grabbing select-none"
                            onMouseDown={handleMouseDown}
                            onTouchStart={handleTouchStart}
                            title="Drag to move panel"
                        >
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-orange-500" />
                                <CardTitle className="text-lg text-orange-800">
                                    Development Panel
                                </CardTitle>
                                <div className="ml-auto flex items-center gap-2">
                                    <button
                                        onClick={resetPosition}
                                        className="w-6 h-6 flex items-center justify-center rounded-full bg-orange-200 hover:bg-orange-300 transition-colors"
                                        title="Reset position"
                                    >
                                        <Navigation className="w-3 h-3 text-orange-700" />
                                    </button>
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-orange-400 rounded-full opacity-60"></div>
                                        <div className="w-2 h-2 bg-orange-400 rounded-full opacity-60"></div>
                                        <div className="w-2 h-2 bg-orange-400 rounded-full opacity-60"></div>
                                    </div>
                                </div>
                            </div>
                            <CardDescription className="flex items-center gap-2 text-orange-600">
                                <Monitor className="h-4 w-4" />
                                <span className="font-medium">
                                    Position: {currentQuadrant} • Drag to move
                                </span>
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4 overflow-y-auto max-h-[calc(80vh-120px)]">
                            <UserSection />
                            {availableRoutes.length > 0 && (
                                <NavigationSection
                                    availableRoutes={availableRoutes}
                                    currentRoute={currentRoute}
                                    onNavigate={onNavigate}
                                />
                            )}
                            <ConfigSection />
                            <DebugSection />
                            <ToolsSection />
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
};

/**
 * UserSection - Display current user information in collapsible card
 */
const UserSection: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, token, isAuthenticated, isLoading } = useAuth();

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
                <button className="flex items-center justify-between w-full p-3 bg-white rounded-lg border border-orange-200 hover:bg-orange-50 transition-colors">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-orange-600" />
                        <span className="font-medium text-orange-800">Authentication</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                        </span>
                    </div>
                    {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-orange-600" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-orange-600" />
                    )}
                </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
                <div className="p-3 bg-white rounded-lg border border-orange-100 space-y-3">
                    <div className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
                        Authentication Status
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                        <ConfigItem label="Is Authenticated" value={isAuthenticated ? 'Yes' : 'No'} />
                        <ConfigItem label="Is Loading" value={isLoading ? 'Yes' : 'No'} />
                        <ConfigItem label="Has Token" value={token ? 'Yes' : 'No'} />
                        <ConfigItem label="Token Length" value={token ? token.length.toString() : '0'} />
                    </div>

                    {user && (
                        <>
                            <div className="text-xs font-semibold text-orange-700 uppercase tracking-wider mt-4">
                                User Details
                            </div>
                            <div className="grid grid-cols-1 gap-2 text-xs">
                                <ConfigItem label="User ID" value={user.id || 'N/A'} />
                                <ConfigItem label="Username" value={user.username || 'N/A'} />
                                <ConfigItem label="Email" value={user.email || 'N/A'} />
                                <ConfigItem label="Registered" value={user.registered ? 'Yes' : 'No'} />
                            </div>

                            {user.contactDto && (
                                <>
                                    <div className="text-xs font-semibold text-orange-700 uppercase tracking-wider mt-4">
                                        Contact Information
                                    </div>
                                    <div className="grid grid-cols-1 gap-2 text-xs">
                                        <ConfigItem label="First Name" value={user.contactDto.firstName || 'N/A'} />
                                        <ConfigItem label="Last Name" value={user.contactDto.lastName || 'N/A'} />
                                        <ConfigItem label="Contact Email" value={user.contactDto.email || 'N/A'} />
                                        <ConfigItem label="Phone" value={user.contactDto.phone || 'N/A'} />
                                        <ConfigItem label="Labels" value={user.contactDto.labels?.join(', ') || 'None'} />
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {!isAuthenticated && (
                        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="text-xs text-orange-800">
                                No user is currently authenticated. Use login form to authenticate.
                            </div>
                        </div>
                    )}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};

/**
 * NavigationSection - Display available routes with navigation capabilities
 */
const NavigationSection: React.FC<{
    availableRoutes: RouteDefinition[];
    currentRoute?: RouteDefinition;
    onNavigate?: NavigateFunction;
}> = ({ availableRoutes, currentRoute, onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleNavigate = (path: string) => {
        if (onNavigate) {
            onNavigate(path);
        }
    };

    // Group routes by access level for better organization
    const routesByAccess = {
        public: availableRoutes.filter(route => route.accessLevel === 'public'),
        protected: availableRoutes.filter(route => route.accessLevel === 'protected'),
        admin: availableRoutes.filter(route => route.accessLevel === 'admin')
    };

    const getAccessLevelColor = (accessLevel: string) => {
        switch (accessLevel) {
            case 'public': return 'bg-green-100 text-green-800';
            case 'protected': return 'bg-blue-100 text-blue-800';
            case 'admin': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
                <button className="flex items-center justify-between w-full p-3 bg-white rounded-lg border border-orange-200 hover:bg-orange-50 transition-colors">
                    <div className="flex items-center gap-2">
                        <Navigation className="h-4 w-4 text-orange-600" />
                        <span className="font-medium text-orange-800">Navigation</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800">
                            {availableRoutes.length} routes
                        </span>
                    </div>
                    {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-orange-600" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-orange-600" />
                    )}
                </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
                <div className="p-3 bg-white rounded-lg border border-orange-100 h-80 flex flex-col">
                    <div className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-3">
                        Available Routes
                    </div>

                    {availableRoutes.length === 0 ? (
                        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="text-xs text-orange-800">
                                No routes available. Check your authentication status.
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                            {/* Available Routes by Access Level */}
                            {Object.entries(routesByAccess).map(([accessLevel, routes]) => {
                                if (routes.length === 0) return null;

                                return (
                                    <div key={accessLevel}>
                                        <div className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-2 sticky top-0 bg-white py-1 z-10">
                                            {accessLevel.charAt(0).toUpperCase() + accessLevel.slice(1)} Routes ({routes.length})
                                        </div>
                                        <div className="space-y-1 mb-4">
                                            {routes.map((route) => (
                                                <button
                                                    key={route.path}
                                                    onClick={() => handleNavigate(route.path)}
                                                    className={`w-full text-left p-2 rounded border transition-colors text-xs ${currentRoute?.path === route.path
                                                        ? 'bg-orange-100 border-orange-300 text-orange-900 shadow-sm'
                                                        : 'bg-gray-50 border-gray-200 hover:bg-orange-50 hover:border-orange-200 text-gray-700'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-medium">{route.name}</span>
                                                        <div className="flex items-center gap-1">
                                                            {currentRoute?.path === route.path && (
                                                                <span className="text-xs px-1.5 py-0.5 rounded bg-orange-200 text-orange-800 font-medium">
                                                                    Current
                                                                </span>
                                                            )}
                                                            <span className={`text-xs px-1.5 py-0.5 rounded ${getAccessLevelColor(route.accessLevel)}`}>
                                                                {route.accessLevel}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="font-mono text-xs text-blue-600 mb-1">{route.path}</div>
                                                    <div className="text-xs text-gray-500">{route.description}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};

/**
 * ConfigSection - Display environment configuration in collapsible card
 */
const ConfigSection: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
                <button className="flex items-center justify-between w-full p-3 bg-white rounded-lg border border-orange-200 hover:bg-orange-50 transition-colors">
                    <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-orange-600" />
                        <span className="font-medium text-orange-800">Configuration</span>
                    </div>
                    {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-orange-600" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-orange-600" />
                    )}
                </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
                <div className="p-3 bg-white rounded-lg border border-orange-100 space-y-3">
                    <div className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
                        Environment
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                        <ConfigItem label="App Mode" value={config.appMode} />
                        <ConfigItem label="Environment" value={config.environment} />
                        <ConfigItem label="API Base URL" value={config.apiBaseUrl} />
                        <ConfigItem label="Base Path" value={config.basePath} />
                        <ConfigItem label="Backend Enabled" value={config.backendEnabled ? 'Yes' : 'No'} />
                        <ConfigItem label="Mock Auth" value={config.enableMockAuth ? 'Yes' : 'No'} />
                        <ConfigItem label="Mock Data" value={config.enableMockData ? 'Yes' : 'No'} />
                    </div>

                    <div className="text-xs font-semibold text-orange-700 uppercase tracking-wider mt-4">
                        Build Info
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                        <ConfigItem label="Node Env" value={process.env.NODE_ENV || 'unknown'} />
                        <ConfigItem label="Timestamp" value={new Date().toLocaleString()} />
                    </div>
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};

/**
 * DebugSection - Display browser storage and memory info in collapsible card
 */
const DebugSection: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [storageOpen, setStorageOpen] = useState({ local: false, session: false });

    const getStorageItems = (storage: Storage) => {
        const items: { [key: string]: string } = {};
        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            if (key) {
                items[key] = storage.getItem(key) || '';
            }
        }
        return items;
    };

    const localStorageItems = typeof window !== 'undefined' ? getStorageItems(window.localStorage) : {};
    const sessionStorageItems = typeof window !== 'undefined' ? getStorageItems(window.sessionStorage) : {};

    const debugInfo = {
        localStorage: Object.keys(localStorageItems).length,
        sessionStorage: Object.keys(sessionStorageItems).length,
        memory: (performance as any)?.memory ? {
            used: Math.round((performance as any).memory.usedJSHeapSize / (1024 * 1024)),
            total: Math.round((performance as any).memory.totalJSHeapSize / (1024 * 1024)),
            limit: Math.round((performance as any).memory.jsHeapSizeLimit / (1024 * 1024))
        } : null
    };

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
                <button className="flex items-center justify-between w-full p-3 bg-white rounded-lg border border-orange-200 hover:bg-orange-50 transition-colors">
                    <div className="flex items-center gap-2">
                        <Bug className="h-4 w-4 text-orange-600" />
                        <span className="font-medium text-orange-800">Debug Information</span>
                    </div>
                    {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-orange-600" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-orange-600" />
                    )}
                </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
                <div className="p-3 bg-white rounded-lg border border-orange-100 space-y-3">
                    {/* Storage Information */}
                    <div className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
                        Browser Storage
                    </div>
                    <div className="space-y-2">
                        {/* Local Storage */}
                        <Collapsible open={storageOpen.local} onOpenChange={(open) => setStorageOpen(prev => ({ ...prev, local: open }))}>
                            <CollapsibleTrigger asChild>
                                <button className="flex items-center justify-between w-full text-xs p-2 bg-orange-50 hover:bg-orange-100 rounded border border-orange-200">
                                    <span>Local Storage ({debugInfo.localStorage} items)</span>
                                    {storageOpen.local ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                </button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-1">
                                <div className="p-2 bg-gray-50 rounded border max-h-32 overflow-y-auto">
                                    {Object.entries(localStorageItems).length === 0 ? (
                                        <div className="text-xs text-gray-500">No items in localStorage</div>
                                    ) : (
                                        <div className="space-y-1">
                                            {Object.entries(localStorageItems).map(([key, value]) => (
                                                <div key={key} className="text-xs">
                                                    <div className="font-mono font-semibold text-blue-700">{key}:</div>
                                                    <div className="font-mono text-gray-600 ml-2 break-all">{value.length > 100 ? value.substring(0, 100) + '...' : value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Session Storage */}
                        <Collapsible open={storageOpen.session} onOpenChange={(open) => setStorageOpen(prev => ({ ...prev, session: open }))}>
                            <CollapsibleTrigger asChild>
                                <button className="flex items-center justify-between w-full text-xs p-2 bg-orange-50 hover:bg-orange-100 rounded border border-orange-200">
                                    <span>Session Storage ({debugInfo.sessionStorage} items)</span>
                                    {storageOpen.session ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                </button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-1">
                                <div className="p-2 bg-gray-50 rounded border max-h-32 overflow-y-auto">
                                    {Object.entries(sessionStorageItems).length === 0 ? (
                                        <div className="text-xs text-gray-500">No items in sessionStorage</div>
                                    ) : (
                                        <div className="space-y-1">
                                            {Object.entries(sessionStorageItems).map(([key, value]) => (
                                                <div key={key} className="text-xs">
                                                    <div className="font-mono font-semibold text-blue-700">{key}:</div>
                                                    <div className="font-mono text-gray-600 ml-2 break-all">{value.length > 100 ? value.substring(0, 100) + '...' : value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>

                    {/* Memory Information */}
                    {debugInfo.memory && (
                        <>
                            <div className="text-xs font-semibold text-orange-700 uppercase tracking-wider mt-4">
                                Memory Usage (MB)
                            </div>
                            <div className="grid grid-cols-1 gap-2 text-xs">
                                <ConfigItem label="Used" value={`${debugInfo.memory.used} MB`} />
                                <ConfigItem label="Total" value={`${debugInfo.memory.total} MB`} />
                                <ConfigItem label="Limit" value={`${debugInfo.memory.limit} MB`} />
                            </div>
                        </>
                    )}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};

/**
 * ToolsSection - Development tools and actions in collapsible card
 */
const ToolsSection: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
                <button className="flex items-center justify-between w-full p-3 bg-white rounded-lg border border-orange-200 hover:bg-orange-50 transition-colors">
                    <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-orange-600" />
                        <span className="font-medium text-orange-800">Development Tools</span>
                    </div>
                    {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-orange-600" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-orange-600" />
                    )}
                </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
                <div className="p-3 bg-white rounded-lg border border-orange-100 space-y-2">
                    <DevButton
                        icon={Database}
                        label="Clear Local Storage"
                        onClick={() => {
                            localStorage.clear();
                            console.log('LocalStorage cleared');
                        }}
                    />

                    <DevButton
                        icon={Database}
                        label="Clear Session Storage"
                        onClick={() => {
                            sessionStorage.clear();
                            console.log('SessionStorage cleared');
                        }}
                    />

                    <DevButton
                        icon={Bug}
                        label="Log Config to Console"
                        onClick={() => {
                            console.log('BuildFlow Config:', config);
                        }}
                    />

                    <DevButton
                        icon={Monitor}
                        label="Reload Page"
                        onClick={() => {
                            window.location.reload();
                        }}
                    />
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};

/**
 * ConfigItem - Display configuration key-value pair
 */
const ConfigItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-1 border-b border-orange-100 last:border-b-0">
        <span className="text-orange-600 text-xs">{label}:</span>
        <span className="font-mono text-orange-800 text-xs font-medium">{value}</span>
    </div>
);

/**
 * DevButton - Development action button
 */
const DevButton: React.FC<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    onClick: () => void;
}> = ({ icon: Icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center gap-2 p-3 text-xs text-left bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors"
    >
        <Icon className="h-3 w-3 text-orange-600" />
        <span className="text-orange-800 font-medium">{label}</span>
    </button>
);

export default DevPanel;