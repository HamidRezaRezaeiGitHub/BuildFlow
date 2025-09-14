import React from 'react';
import { 
  BarChart3, 
  Users, 
  Clock, 
  FileText, 
  DollarSign, 
  Shield,
  Smartphone,
  Globe
} from 'lucide-react';

interface FeaturesSectionProps {
  className?: string;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
}

/**
 * Features Section - Showcase BuildFlow's main capabilities
 * 
 * Highlights key features and benefits of the construction management platform
 */
const Features: React.FC<FeaturesSectionProps> = ({ className = '' }) => {
  const features: Feature[] = [
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Project Analytics",
      description: "Real-time insights and reporting to keep your projects on track and within budget.",
      benefits: ["Progress tracking", "Budget analysis", "Performance metrics"]
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Smart Estimates",
      description: "Create detailed, accurate estimates with our intelligent pricing and material database.",
      benefits: ["Material cost tracking", "Labor calculations", "Profit margin analysis"]
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Collaboration",
      description: "Connect your entire team with seamless communication and task management tools.",
      benefits: ["Real-time messaging", "Task assignments", "Document sharing"]
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Schedule Management",
      description: "Plan, track, and optimize project timelines with intelligent scheduling tools.",
      benefits: ["Gantt charts", "Milestone tracking", "Resource allocation"]
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Financial Control",
      description: "Comprehensive budgeting and expense tracking to maximize profitability.",
      benefits: ["Cost monitoring", "Invoice management", "Profit tracking"]
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Security & Compliance",
      description: "Enterprise-grade security with industry compliance and data protection.",
      benefits: ["Data encryption", "Access controls", "Audit trails"]
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Mobile Access",
      description: "Access your projects anywhere with our responsive web application.",
      benefits: ["Mobile-friendly", "Offline support", "Real-time sync"]
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Multi-Project Support",
      description: "Manage multiple construction projects simultaneously with ease.",
      benefits: ["Project portfolios", "Resource sharing", "Cross-project insights"]
    }
  ];

  return (
    <section id="features" className={`py-24 bg-muted/30 ${className}`}>
      <div className="mx-auto max-w-screen-2xl px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need to Build Better
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive tools designed specifically for construction professionals to streamline 
            workflows, improve efficiency, and deliver projects on time and within budget.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-background rounded-xl p-6 shadow-sm border border-border/40 hover:shadow-md transition-all duration-300 hover:border-primary/20"
            >
              {/* Icon */}
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Benefits List */}
                <ul className="space-y-1">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-xs text-muted-foreground">
                      <div className="h-1.5 w-1.5 bg-primary rounded-full mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Want to see these features in action?</span>
            <button 
              className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
              onClick={() => {
                const signUpSection = document.getElementById('signup');
                if (signUpSection) {
                  signUpSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Start your free trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;