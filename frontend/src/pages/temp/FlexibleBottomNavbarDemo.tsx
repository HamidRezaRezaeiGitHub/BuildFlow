import { FlexibleBottomNavbar } from '@/components/navbar/FlexibleBottomNavbar';
import React, { useState } from 'react';

export const FlexibleBottomNavbarDemo: React.FC = () => {
    const [lastAction, setLastAction] = useState<string>('None');

    const handleCreateNewProject = () => {
        setLastAction('Create New Project clicked');
        console.log('Create New Project clicked');
    };

    const handleCreateNewEstimate = () => {
        setLastAction('Create New Estimate clicked');
        console.log('Create New Estimate clicked');
    };

    const handleProjectsClick = () => {
        setLastAction('Projects clicked');
        console.log('Projects clicked');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20 p-8 transition-colors duration-300">
            <div className="max-w-md mx-auto">
                <h1 className="text-2xl font-bold text-center mb-4 text-foreground">Bottom Navbar Demo</h1>
                <p className="text-center text-sm text-muted-foreground mb-8">
                    Test the new Plus menu functionality
                </p>
                
                {/* Last Action Display */}
                <div className="bg-card border-2 border-primary/20 rounded-lg shadow-lg p-4 mb-6 transition-colors duration-300">
                    <h2 className="text-sm font-semibold mb-2 text-card-foreground">Last Action:</h2>
                    <p className="text-primary font-medium">{lastAction}</p>
                </div>

                <div className="bg-card border border-border rounded-lg shadow-lg p-6 mb-8 transition-colors duration-300">
                    <h2 className="text-lg font-semibold mb-4 text-card-foreground">Features Demonstrated</h2>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span>Click the <strong className="text-foreground">+</strong> button to open the Plus menu</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span><strong className="text-foreground">Default actions:</strong> Create New Project and Create New Estimate</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span><strong className="text-foreground">Responsive:</strong> Bottom sheet on mobile, dropdown on desktop</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span>Click <strong className="text-foreground">Projects</strong> or <strong className="text-foreground">More</strong> buttons</span>
                        </li>
                    </ul>
                </div>

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
            
            {/* The navbar component with Plus menu configuration */}
            <FlexibleBottomNavbar
                onCreateNewProject={handleCreateNewProject}
                onCreateNewEstimate={handleCreateNewEstimate}
                onProjectsClick={handleProjectsClick}
            />
        </div>
    );
};

export default FlexibleBottomNavbarDemo;