import { cn } from '@/utils/utils';
import React from 'react';

interface HomeLayoutProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * HomeLayout - Layout component for public pages (primarily home page)
 * 
 * This layout is designed for unauthenticated users and provides:
 * - Full-height responsive container
 * - Clean, minimal structure for landing/marketing pages
 * - Flexible content area that can accommodate various home page sections
 */
const HomeLayout: React.FC<HomeLayoutProps> = ({ children, className }) => {
    return (
        <div className={cn("min-h-screen bg-background", className)}>
            {/* Main content area */}
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
};

export default HomeLayout;