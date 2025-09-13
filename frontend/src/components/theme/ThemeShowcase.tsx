import React from 'react';
import { Button } from "../ui/button";
import {
  DropdownThemeToggle,
  SwitchThemeToggle,
  SingleChangingIconThemeToggle,
  ToggleGroupThemeToggle,
  ButtonThemeToggle,
  SegmentedThemeToggle,
  CompactThemeToggle
} from './ThemeToggle';

interface ThemeShowcaseProps {
  className?: string;
  showHeader?: boolean;
}

/**
 * Comprehensive theme showcase component demonstrating all theme toggle variants
 * and the design system in action.
 */
export const ThemeShowcase: React.FC<ThemeShowcaseProps> = ({ 
  className = '', 
  showHeader = true 
}) => {
  return (
    <div className={`bg-background text-foreground transition-colors duration-300 ${className}`}>
      {/* Header with title */}
      {showHeader && (
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-primary">Theme System Showcase</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Demonstrating all theme toggle variants and design tokens
            </p>
          </div>
        </header>
      )}

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Theme Toggle Variants Section */}
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-foreground">
                Theme Toggle Variants
              </h2>
              <p className="text-muted-foreground">
                Choose your preferred theme control style
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Dropdown Toggle */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-3">
                  Dropdown Toggle
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Full control with all three options
                </p>
                <DropdownThemeToggle showLabel={true} />
              </div>

              {/* Switch Toggle */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-3">
                  Switch Toggle
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Simple light/dark switch
                </p>
                <SwitchThemeToggle showLabel={true} />
              </div>

              {/* Single Icon Toggle */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-3">
                  Single Icon Toggle
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Minimal changing icon
                </p>
                <SingleChangingIconThemeToggle />
              </div>

              {/* Toggle Group */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-3">
                  Toggle Group
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Button group with three states
                </p>
                <ToggleGroupThemeToggle />
              </div>

              {/* Button Toggle */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-3">
                  Button Toggle
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Cycling button with indicator
                </p>
                <ButtonThemeToggle showLabel={true} />
              </div>

              {/* Segmented Toggle */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-3">
                  Segmented Toggle
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  iOS-style segmented control
                </p>
                <SegmentedThemeToggle />
              </div>
            </div>

            {/* Additional variants */}
            <div className="flex items-center justify-center gap-6 p-6 bg-muted/50 rounded-lg">
              <div className="text-center">
                <p className="text-sm font-medium text-foreground mb-2">Compact</p>
                <CompactThemeToggle />
              </div>
            </div>
          </section>

          {/* UI Components showcase */}
          <section className="grid md:grid-cols-2 gap-6">
            {/* Interactive Elements */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-card-foreground mb-4">
                Interactive Elements
              </h3>
              <div className="space-y-3">
                <Button className="w-full">Primary Button</Button>
                <Button variant="secondary" className="w-full">Secondary Button</Button>
                <Button variant="outline" className="w-full">Outline Button</Button>
                <Button variant="ghost" className="w-full">Ghost Button</Button>
                <Button variant="destructive" className="w-full">Destructive Button</Button>
              </div>
            </div>

            {/* Form Elements */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-card-foreground mb-4">
                Form Elements
              </h3>
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Text input"
                  className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <select className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Select option</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
                <textarea 
                  placeholder="Textarea"
                  rows={3}
                  className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
            </div>
          </section>

          {/* Status indicators */}
          <section className="grid md:grid-cols-3 gap-4">
            <div className="bg-muted border border-border rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">Success State</h4>
              <p className="text-sm text-muted-foreground mb-2">Operation completed successfully</p>
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <span>✅</span>
                <span className="text-sm font-medium">Success</span>
              </div>
            </div>

            <div className="bg-muted border border-border rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">Warning State</h4>
              <p className="text-sm text-muted-foreground mb-2">Please review this information</p>
              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                <span>⚠️</span>
                <span className="text-sm font-medium">Warning</span>
              </div>
            </div>

            <div className="bg-muted border border-border rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">Error State</h4>
              <p className="text-sm text-muted-foreground mb-2">Something went wrong</p>
              <div className="flex items-center gap-2 text-destructive">
                <span>❌</span>
                <span className="text-sm font-medium">Error</span>
              </div>
            </div>
          </section>

          {/* Design Token Showcase */}
          <section className="bg-card border border-border rounded-lg p-6 space-y-6">
            <h3 className="text-xl font-semibold text-card-foreground">
              Design Token Showcase
            </h3>
            
            {/* Primary Colors */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Primary Colors</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="p-4 bg-background border border-border rounded-lg">
                  <div className="font-medium text-foreground">Background</div>
                  <div className="text-muted-foreground">Main surface</div>
                </div>
                <div className="p-4 bg-primary text-primary-foreground rounded-lg">
                  <div className="font-medium">Primary</div>
                  <div className="opacity-80">Brand color</div>
                </div>
                <div className="p-4 bg-secondary text-secondary-foreground rounded-lg">
                  <div className="font-medium">Secondary</div>
                  <div className="opacity-80">Alt color</div>
                </div>
                <div className="p-4 bg-accent text-accent-foreground rounded-lg">
                  <div className="font-medium">Accent</div>
                  <div className="opacity-80">Highlight</div>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Typography</h4>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">Heading 1</h1>
                <h2 className="text-2xl font-semibold text-foreground">Heading 2</h2>
                <h3 className="text-xl font-medium text-foreground">Heading 3</h3>
                <p className="text-base text-foreground">Regular paragraph text with normal weight and size.</p>
                <p className="text-sm text-muted-foreground">Small muted text for secondary information.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                💡 Try different theme toggle variants above to see the design system in action.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ThemeShowcase;