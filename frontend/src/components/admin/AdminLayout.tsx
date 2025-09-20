import React from 'react';
import { cn } from '@/utils/utils';

interface AdminLayoutProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * AdminLayout - Layout component specifically for admin pages
 * 
 * This layout provides:
 * - Admin-specific styling and structure
 * - Clean, professional layout for administrative interfaces
 * - Full-height container with admin navigation context
 * - Consistent styling for all admin pages
 */
const AdminLayout: React.FC<AdminLayoutProps> = ({ children, className }) => {
    return (
        <div className={cn("min-h-screen bg-gray-50", className)}>
            {/* Admin Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-lg font-semibold text-gray-900">
                                BuildFlow Admin
                            </h1>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Admin Panel
                            </span>
                        </div>
                        
                        {/* Admin Navigation */}
                        <nav className="flex items-center space-x-6">
                            <a 
                                href="/dashboard" 
                                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                            >
                                Back to Dashboard
                            </a>
                            <a 
                                href="/" 
                                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                            >
                                Home
                            </a>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main content area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>

            {/* Admin Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>BuildFlow Admin Panel</span>
                        <span>Restricted Access - Admin Only</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AdminLayout;