import { FlexibleBottomNavbar } from '@/components/navbar/FlexibleBottomNavbar';
import React from 'react';

export const FlexibleBottomNavbarDemo: React.FC = () => {
    const handleHomeClick = () => {
        console.log('Demo: Home button clicked');
        alert('Home button clicked! Check console for more details.');
    };

    const handleSettingsClick = () => {
        console.log('Demo: Settings button clicked');
        alert('Settings button clicked! Check console for more details.');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20 p-8 transition-colors duration-300">
            <div className="max-w-md mx-auto">
                <h1 className="text-2xl font-bold text-center mb-8 text-foreground">Bottom Navbar Demo</h1>
                <div className="bg-card border border-border rounded-lg shadow-lg p-6 mb-8 transition-colors duration-300">
                    <h2 className="text-lg font-semibold mb-4 text-card-foreground">Test Content</h2>
                    <p className="text-muted-foreground mb-4">
                        This is a demo page for the FlexibleBottomNavbar component. 
                        Scroll down to see more content and test the navbar behavior.
                    </p>
                    {/* Theme Color Showcase */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-primary text-primary-foreground p-3 rounded-md text-center text-sm font-medium">
                            Primary
                        </div>
                        <div className="bg-secondary text-secondary-foreground p-3 rounded-md text-center text-sm font-medium">
                            Secondary
                        </div>
                        <div className="bg-accent text-accent-foreground p-3 rounded-md text-center text-sm font-medium">
                            Accent
                        </div>
                        <div className="bg-muted text-muted-foreground p-3 rounded-md text-center text-sm font-medium">
                            Muted
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        {Array.from({ length: 8 }, (_, i) => (
                            <div key={i} className="h-20 bg-muted/50 hover:bg-muted/70 border border-border/30 rounded-md flex items-center justify-center text-muted-foreground font-medium transition-all duration-200 hover:scale-[1.02]">
                                Content Block {i + 1}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mb-20">
                    <p className="text-center text-muted-foreground">
                        Bottom padding to ensure navbar visibility
                    </p>
                </div>
            </div>
            
            {/* The navbar component */}
            <FlexibleBottomNavbar
                onHomeClick={handleHomeClick}
                onSettingsClick={handleSettingsClick}
            />
        </div>
    );
};

export default FlexibleBottomNavbarDemo;