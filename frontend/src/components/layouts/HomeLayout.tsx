import { cn } from '@/lib/utils';
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

            {/* Footer placeholder - can be expanded later */}
            <footer className="border-t border-border/40 bg-background/95">
                <div className="mx-auto max-w-screen-2xl px-4 py-6 lg:px-8">
                    <div className="text-center text-sm text-muted-foreground">
                        © 2025 BuildFlow. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomeLayout;