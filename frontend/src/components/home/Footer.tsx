import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Github,
  Facebook
} from 'lucide-react';

interface FooterProps {
  className?: string;
}

/**
 * Footer Component - Comprehensive footer with links, company info, and social media
 * 
 * Features:
 * - Company information and branding
 * - Navigation links organized by category
 * - Contact information
 * - Social media links
 * - Newsletter subscription
 * - Legal links and copyright
 */
const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    alert('Newsletter subscription will be implemented with backend integration');
  };

  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Demo", href: "#demo" },
        { label: "API", href: "#api" },
        { label: "Security", href: "#security" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#about" },
        { label: "Careers", href: "#careers" },
        { label: "Blog", href: "#blog" },
        { label: "Press", href: "#press" },
        { label: "Partners", href: "#partners" }
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "#help" },
        { label: "Documentation", href: "#docs" },
        { label: "Contact Us", href: "#contact" },
        { label: "Status", href: "#status" },
        { label: "Community", href: "#community" }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#privacy" },
        { label: "Terms of Service", href: "#terms" },
        { label: "Cookie Policy", href: "#cookies" },
        { label: "Data Processing", href: "#data" },
        { label: "Compliance", href: "#compliance" }
      ]
    }
  ];

  const socialLinks = [
    { 
      icon: <Twitter className="h-5 w-5" />, 
      href: "#twitter", 
      label: "Twitter",
      handle: "@buildflow" 
    },
    { 
      icon: <Linkedin className="h-5 w-5" />, 
      href: "#linkedin", 
      label: "LinkedIn",
      handle: "buildflow" 
    },
    { 
      icon: <Facebook className="h-5 w-5" />, 
      href: "#facebook", 
      label: "Facebook",
      handle: "buildflow" 
    },
    { 
      icon: <Github className="h-5 w-5" />, 
      href: "#github", 
      label: "GitHub",
      handle: "buildflow" 
    }
  ];

  // BuildFlow logo component (same as navbar)
  const BuildFlowLogo = () => (
    <svg 
      width='32' 
      height='32' 
      viewBox='0 0 324 323' 
      fill='currentColor' 
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect
        x='88.1023'
        y='144.792'
        width='151.802'
        height='36.5788'
        rx='18.2894'
        transform='rotate(-38.5799 88.1023 144.792)'
        fill='currentColor'
      />
      <rect
        x='85.3459'
        y='244.537'
        width='151.802'
        height='36.5788'
        rx='18.2894'
        transform='rotate(-38.5799 85.3459 244.537)'
        fill='currentColor'
      />
    </svg>
  );

  return (
    <footer className={`bg-muted/30 border-t border-border/40 ${className}`}>
      <div className="mx-auto max-w-screen-2xl px-4 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Company Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="text-primary">
                  <BuildFlowLogo />
                </div>
                <span className="text-xl font-bold text-foreground">BuildFlow</span>
              </div>
              
              <p className="text-muted-foreground leading-relaxed">
                The complete construction project management platform that helps teams 
                build better, faster, and more efficiently.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>123 Construction Way, Builder City, BC 12345</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>support@buildflow.com</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-300"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {footerSections.map((section, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-foreground mb-4">
                      {section.title}
                    </h3>
                    <ul className="space-y-3">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a
                            href={link.href}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="lg:col-span-1">
              <h3 className="font-semibold text-foreground mb-4">
                Stay Updated
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get the latest updates, tips, and insights from the construction industry.
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors duration-300"
                >
                  Subscribe
                </button>
              </form>

              <p className="text-xs text-muted-foreground mt-3">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/40 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-sm text-muted-foreground">
              © 2025 BuildFlow. All rights reserved.
            </div>

            {/* Quick Links */}
            <div className="flex items-center space-x-6 text-sm">
              <a href="#privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                Cookies
              </a>
              <a href="#accessibility" className="text-muted-foreground hover:text-foreground transition-colors">
                Accessibility
              </a>
            </div>

            {/* Build Info */}
            <div className="text-xs text-muted-foreground">
              Built with ❤️ for construction professionals
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;