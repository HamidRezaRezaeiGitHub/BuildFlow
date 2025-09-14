import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  MessageSquare,
  Users,
  Headphones
} from 'lucide-react';

interface ContactSectionProps {
  className?: string;
}

interface ContactForm {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
  inquiryType: string;
}

/**
 * Contact Section - Contact information and detailed contact form
 * 
 * Features:
 * - Contact information display
 * - Comprehensive contact form
 * - Multiple inquiry types
 * - Response time information
 */
const Contact: React.FC<ContactSectionProps> = ({ className = '' }) => {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual form submission
    console.log('Contact form submitted:', form);
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
    
    // Reset form
    setForm({
      name: '',
      email: '',
      company: '',
      phone: '',
      subject: '',
      message: '',
      inquiryType: 'general'
    });
  };

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Office Location",
      content: "123 Construction Way, Builder City, BC 12345",
      subtext: "Open Monday - Friday"
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Phone Support",
      content: "+1 (555) 123-4567",
      subtext: "9 AM - 6 PM PST"
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email Support",
      content: "support@buildflow.com",
      subtext: "24/7 Response"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Response Time",
      content: "Within 24 hours",
      subtext: "Typical response time"
    }
  ];

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry', icon: <MessageSquare className="h-4 w-4" /> },
    { value: 'sales', label: 'Sales & Pricing', icon: <Users className="h-4 w-4" /> },
    { value: 'support', label: 'Technical Support', icon: <Headphones className="h-4 w-4" /> },
    { value: 'partnership', label: 'Partnership', icon: <Users className="h-4 w-4" /> }
  ];

  return (
    <section id="contact" className={`py-24 bg-background ${className}`}>
      <div className="mx-auto max-w-screen-2xl px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Get in Touch
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about BuildFlow? Our team is here to help you get started 
            and make the most of our construction management platform.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Contact Information
              </h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      {info.icon}
                    </div>
                    <div>
                      <div className="font-medium text-foreground mb-1">
                        {info.title}
                      </div>
                      <div className="text-muted-foreground">
                        {info.content}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {info.subtext}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Link */}
            <div className="bg-muted/30 rounded-xl p-6">
              <h4 className="font-semibold text-foreground mb-2">
                Frequently Asked Questions
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Find answers to common questions about BuildFlow features, pricing, and implementation.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View FAQ
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-muted/20 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Send us a Message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Inquiry Type */}
                <div className="space-y-3">
                  <Label>Inquiry Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {inquiryTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleInputChange('inquiryType', type.value)}
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                          form.inquiryType === type.value
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-border/60 text-muted-foreground'
                        }`}
                      >
                        {type.icon}
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Full Name *</Label>
                    <Input
                      id="contactName"
                      type="text"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="john@company.com"
                      value={form.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Company and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactCompany">Company</Label>
                    <Input
                      id="contactCompany"
                      type="text"
                      placeholder="Your Construction Company"
                      value={form.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={form.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="contactSubject">Subject *</Label>
                  <Input
                    id="contactSubject"
                    type="text"
                    placeholder="How can we help you?"
                    value={form.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    required
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="contactMessage">Message *</Label>
                  <Textarea
                    id="contactMessage"
                    placeholder="Please provide details about your inquiry..."
                    rows={6}
                    value={form.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    * Required fields
                  </p>
                  <Button type="submit" size="lg" className="px-8">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Support */}
        <div className="mt-16 text-center">
          <div className="bg-primary/5 rounded-xl p-8 max-w-4xl mx-auto">
            <h4 className="text-xl font-semibold text-foreground mb-4">
              Need Immediate Help?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary">
                  <Phone className="h-6 w-6" />
                </div>
                <h5 className="font-medium text-foreground mb-1">Call Us</h5>
                <p className="text-sm text-muted-foreground">
                  Speak directly with our support team
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h5 className="font-medium text-foreground mb-1">Live Chat</h5>
                <p className="text-sm text-muted-foreground">
                  Get instant answers to your questions
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <h5 className="font-medium text-foreground mb-1">Schedule Demo</h5>
                <p className="text-sm text-muted-foreground">
                  Book a personalized walkthrough
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;