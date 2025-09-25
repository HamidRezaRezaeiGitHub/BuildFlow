import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Address, Admin, Dashboard, Home, Theme } from '../pages';
import { useAuth } from './AuthContext';

// Protected Route component
interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

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

    return <>{children}</>;
};

// Admin Route component - for now just checks authentication, role check will be enhanced later
interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

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

    // TODO: Add role-based checking here once role information is available in auth context
    // For now, all authenticated users can access admin (will be restricted in backend)
    return <>{children}</>;
};

/**
 * AppRouter component that defines all application routes.
 * 
 * Route structure:
 * - / -> Home page (public)
 * - /theme -> Theme showcase page (public)
 * - /dashboard -> Dashboard (protected, requires authentication)
 * - /admin -> Admin panel (protected, requires admin role - backend enforced)
 * - * -> redirects to Home (catch-all for undefined paths)
 */
export const AppRouter: React.FC = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/theme" element={<Theme />} />
            <Route path="/temp/address" element={<Address />} />

            {/* Protected routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
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
    );
};

export default AppRouter;