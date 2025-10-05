import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { config } from '@/config/environment';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/utils';
import { AlertTriangle, Bug, ChevronDown, ChevronUp, Code, Database, Monitor, Navigation, Settings, User, Zap } from 'lucide-react';
import React, { useState } from 'react';
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

    // Only render in development mode
    if (!config.isDevelopment) {
        return null;
    }

    return (
        <div className={cn("fixed bottom-4 right-4 z-50 max-w-md", className)}>
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                {/* Toggle Button */}
                <CollapsibleTrigger asChild>
                    <button className="mb-2 w-12 h-12 flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg border-2 border-orange-300 transition-all duration-200 hover:scale-105">
                        <Code className="h-5 w-5" />
                    </button>
                </CollapsibleTrigger>

                {/* Expanded Panel */}
                <CollapsibleContent>
                    <Card className="w-96 border-2 border-orange-200 shadow-xl bg-gradient-to-br from-orange-50 to-amber-50 max-h-[80vh]">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-orange-500" />
                                <CardTitle className="text-lg text-orange-800">
                                    Development Panel
                                </CardTitle>
                            </div>
                            <CardDescription className="flex items-center gap-2 text-orange-600">
                                <Monitor className="h-4 w-4" />
                                <span className="font-medium">
                                    Not visible in production
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
                </CollapsibleContent>
            </Collapsible>
        </div>
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