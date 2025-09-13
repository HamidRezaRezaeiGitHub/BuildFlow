import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Dashboard, Home, Theme } from '../pages';

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

/**
 * AppRouter component that defines all application routes.
 * 
 * Route structure:
 * - / -> Home page (public)
 * - /theme -> Theme showcase page (public)
 * - /dashboard -> Dashboard (protected, requires authentication)
 * - * -> redirects to Home (catch-all for undefined paths)
 */
export const AppRouter: React.FC = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/theme" element={<Theme />} />

            {/* Protected routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            {/* Catch-all route - redirect any undefined path to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRouter;