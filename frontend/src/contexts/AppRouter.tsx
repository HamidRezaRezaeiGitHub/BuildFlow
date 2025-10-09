import { DevPanel } from '@/components/dev';
import { config } from '@/config/environment';
import React from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AddressPage, Admin, DashboardPage, FlexibleSignUpPage, HomePage, LoginPage, Theme } from '../pages';
import { NewProject } from '../pages/project';
import { Role } from '../services/dtos';
import { useAuth } from './AuthContext';

// Define access levels for routes
export type AccessLevel = 'public' | 'protected' | 'admin';

// Route definition interface
export interface RouteDefinition {
    path: string;
    name: string;
    description: string;
    accessLevel: AccessLevel;
    component: React.ComponentType<any>;
}

// Complete list of available routes with access levels
export const AVAILABLE_ROUTES: RouteDefinition[] = [
    // Public routes
    {
        path: '/',
        name: 'Home',
        description: 'Landing page with login and app overview',
        accessLevel: 'public',
        component: HomePage
    },
    {
        path: '/temp/theme',
        name: 'Theme Demo',
        description: 'Theme and styling demonstration page',
        accessLevel: 'public',
        component: Theme
    },
    {
        path: '/temp/address',
        name: 'Address Demo',
        description: 'Address form components demonstration',
        accessLevel: 'public',
        component: AddressPage
    },
    {
        path: '/temp/login',
        name: 'Login Demo',
        description: 'Login component demonstration',
        accessLevel: 'public',
        component: LoginPage
    },
    {
        path: '/temp/flexible-sign-up',
        name: 'Sign Up Demo',
        description: 'Flexible sign-up form demonstration',
        accessLevel: 'public',
        component: FlexibleSignUpPage
    },

    // Protected routes (requires authentication)
    {
        path: '/dashboard',
        name: 'Dashboard',
        description: 'Main user dashboard with project overview',
        accessLevel: 'protected',
        component: DashboardPage
    },
    {
        path: '/projects/new',
        name: 'New Project',
        description: 'Create a new construction project',
        accessLevel: 'protected',
        component: NewProject
    },

    // Admin routes (requires admin privileges)
    {
        path: '/admin',
        name: 'Admin Panel',
        description: 'Administrative interface for user management',
        accessLevel: 'admin',
        component: Admin
    }
];

// Helper function to get routes by access level
export const getRoutesByAccessLevel = (accessLevel: AccessLevel): RouteDefinition[] => {
    return AVAILABLE_ROUTES.filter(route => route.accessLevel === accessLevel);
};

// Helper function to get accessible routes for current user
export const getAccessibleRoutes = (isAuthenticated: boolean, isAdmin: boolean = false): RouteDefinition[] => {
    if (!isAuthenticated) {
        return getRoutesByAccessLevel('public');
    }

    if (isAdmin) {
        return AVAILABLE_ROUTES; // Admin can access all routes
    }

    // Authenticated user can access public and protected routes
    return AVAILABLE_ROUTES.filter(route =>
        route.accessLevel === 'public' || route.accessLevel === 'protected'
    );
};

// DevPanel wrapper that provides routing context and navigation
const DevPanelWithRouting: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, role } = useAuth();

    const shouldShowDevPanel = config.isDevelopment;
    const isAdmin = isAuthenticated && role === Role.ADMIN;

    // Debug logging
    React.useEffect(() => {
        if (config.enableConsoleLogs) {
            console.group('🔧 DevPanel Debug Info');
            console.log('config.isDevelopment:', config.isDevelopment);
            console.log('config.environment:', config.environment);
            console.log('shouldShowDevPanel:', shouldShowDevPanel);
            console.log('isAuthenticated:', isAuthenticated);
            console.log('role:', role);
            console.log('isAdmin:', isAdmin);
            console.log('currentPath:', location.pathname);
            console.groupEnd();
        }
    }, [shouldShowDevPanel, isAuthenticated, role, isAdmin, location.pathname]);

    if (!shouldShowDevPanel) {
        return null;
    }

    const accessibleRoutes = getAccessibleRoutes(isAuthenticated, isAdmin);
    const currentRoute = AVAILABLE_ROUTES.find(route => route.path === location.pathname);

    return (
        <DevPanel
            availableRoutes={accessibleRoutes}
            currentRoute={currentRoute}
            onNavigate={navigate}
        />
    );
};

// Protected Route component
interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Store the intended destination in state for redirect after login
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

// Admin Route component - checks authentication and admin role
interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading, role } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Check if user has admin role
    if (role !== Role.ADMIN) {
        // Redirect non-admin users to dashboard
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

export const AppRouter: React.FC = () => {
    return (
        <>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/temp/theme" element={<Theme />} />
                <Route path="/temp/address" element={<AddressPage />} />
                <Route path="/temp/login" element={<LoginPage />} />
                <Route path="/temp/flexible-sign-up" element={<FlexibleSignUpPage />} />

                {/* Protected routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />

                {/* Project routes */}
                <Route
                    path="/projects/new"
                    element={
                        <ProtectedRoute>
                            <NewProject />
                        </ProtectedRoute>
                    }
                />

                {/* Admin routes */}
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <Admin />
                        </AdminRoute>
                    }
                />

                {/* Catch-all route - redirect any undefined path to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Development Panel - Has access to routing context */}
            <DevPanelWithRouting />
        </>
    );
};

export default AppRouter;