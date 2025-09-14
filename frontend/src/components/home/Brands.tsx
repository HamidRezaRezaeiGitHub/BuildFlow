import { Quote, Star } from 'lucide-react';
import React from 'react';

interface BrandsSectionProps {
  className?: string;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
}

interface Brand {
  name: string;
  logo: string;
  description: string;
}

/**
 * Brands Section - Social proof through client testimonials and partner companies
 * 
 * Features:
 * - Client testimonials with ratings
 * - Partner company logos
 * - Social proof metrics
 */
const Brands: React.FC<BrandsSectionProps> = ({ className = '' }) => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Project Manager",
      company: "BuildCorp Construction",
      content: "BuildFlow has revolutionized how we manage our construction projects. The real-time tracking and budget management features have saved us countless hours and thousands of dollars.",
      rating: 5
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "General Contractor",
      company: "Chen & Associates",
      content: "The estimate generation feature is incredibly accurate. We've improved our bidding success rate by 40% since implementing BuildFlow into our workflow.",
      rating: 5
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Operations Director",
      company: "Summit Builders",
      content: "Team collaboration has never been easier. Our field teams can update project status in real-time, and we can respond to issues immediately.",
      rating: 5
    }
  ];

  const brands: Brand[] = [
    {
      name: "BuildCorp",
      logo: "BC",
      description: "Commercial Construction"
    },
    {
      name: "Summit Builders",
      logo: "SB",
      description: "Residential Development"
    },
    {
      name: "Urban Development",
      logo: "UD",
      description: "Mixed-Use Projects"
    },
    {
      name: "Green Construction",
      logo: "GC",
      description: "Sustainable Building"
    },
    {
      name: "Metro Contractors",
      logo: "MC",
      description: "Infrastructure"
    },
    {
      name: "Elite Renovations",
      logo: "ER",
      description: "Renovation Specialists"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
      />
    ));
  };

  return (
    <section id="brands" className={`py-24 bg-muted/30 ${className}`}>
      <div className="mx-auto max-w-screen-2xl px-4 lg:px-8">

        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join hundreds of construction companies that rely on BuildFlow to deliver
            exceptional projects on time and within budget.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">50+</div>
            <div className="text-sm text-muted-foreground">Active Teams</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">$2M+</div>
            <div className="text-sm text-muted-foreground">Projects Managed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">99%</div>
            <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-12">What Our Clients Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-background rounded-xl p-6 shadow-sm border border-border/40 relative"
              >
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 text-primary/20">
                  <Quote className="h-6 w-6" />
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Content */}
                <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <span className="text-primary font-semibold text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partner Companies */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-12">Trusted Partners</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="group flex flex-col items-center text-center space-y-3"
              >
                {/* Logo Placeholder */}
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                  <span className="text-xl font-bold text-muted-foreground group-hover:text-primary">
                    {brand.logo}
                  </span>
                </div>

                {/* Company Info */}
                <div>
                  <div className="font-semibold text-foreground text-sm mb-1">
                    {brand.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {brand.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-primary/5 rounded-xl p-8 max-w-2xl mx-auto">
            <h4 className="text-xl font-semibold text-foreground mb-2">
              Ready to Join Them?
            </h4>
            <p className="text-muted-foreground mb-4">
              Start your free trial today and see why construction professionals choose BuildFlow.
            </p>
            <button
              className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
              onClick={() => {
                const authSection = document.getElementById('auth');
                if (authSection) {
                  authSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Get started for free
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brands;