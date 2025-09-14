import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import React from 'react';

interface HeroSectionProps {
  className?: string;
}

/**
 * Hero Section - The main introduction section for BuildFlow
 * 
 * Features:
 * - Compelling headline and value proposition
 * - Call-to-action buttons
 * - Background image/gradient
 * - Responsive design
 */
const Hero: React.FC<HeroSectionProps> = ({ className = '' }) => {
  const handleGetStarted = () => {
    // Scroll to auth section
    const authSection = document.getElementById('auth');
    if (authSection) {
      authSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/register';
    }
  };

  const handleWatchDemo = () => {
    // Placeholder for demo video or tour
    console.log('Watch demo clicked');
  };

  return (
    <section id="hero" className={`relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      {/* Content Container */}
      <div className="relative mx-auto max-w-screen-2xl px-4 py-24 lg:px-8 lg:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">

          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Build Better.
                <span className="text-primary"> Manage Smarter.</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                StreamLine your construction projects with BuildFlow's comprehensive management platform.
                From estimates to completion, we've got you covered.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-primary rounded-full" />
                <span className="text-muted-foreground">Project Management</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-primary rounded-full" />
                <span className="text-muted-foreground">Cost Estimation</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-primary rounded-full" />
                <span className="text-muted-foreground">Team Collaboration</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-primary rounded-full" />
                <span className="text-muted-foreground">Real-time Tracking</span>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="text-base px-8 py-3 h-auto"
                onClick={handleGetStarted}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 py-3 h-auto"
                onClick={handleWatchDemo}
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Trusted by construction teams worldwide
              </p>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span>✓ 500+ Projects Completed</span>
                <span>✓ 50+ Teams</span>
                <span>✓ 99% Uptime</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Content */}
          <div className="relative">
            {/* Placeholder for hero image/illustration */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
              <div className="aspect-[4/3] bg-muted/20 flex items-center justify-center">
                {/* Placeholder for actual image */}
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Hero Image Placeholder
                    <br />
                    Dashboard Preview / Construction Image
                  </p>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                <p className="text-xs font-medium">Live Project Status</p>
                <p className="text-xs text-muted-foreground">On Track ✓</p>
              </div>

              <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                <p className="text-xs font-medium">Budget: $245,000</p>
                <p className="text-xs text-green-600">15% under budget</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;