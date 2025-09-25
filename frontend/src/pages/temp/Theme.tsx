import React from 'react';
import { ThemeShowcase } from '@/components/theme';

/**
 * Theme page - public page to showcase the theme system
 */
export const Theme: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4">
            Theme Showcase
          </h1>
          <p className="text-muted-foreground">
            Explore BuildFlow's design system and theme capabilities
          </p>
        </div>
        <ThemeShowcase showHeader={false} />
      </div>
    </div>
  );
};

export default Theme;