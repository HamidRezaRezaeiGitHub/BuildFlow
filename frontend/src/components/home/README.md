# Home Components

This directory contains all components for the BuildFlow landing page - the public-facing homepage that introduces the platform and provides user authentication entry points.

## Summary

The home components directory contains modular sections of the landing page, each focused on a specific purpose: showcasing features, displaying hero content, providing authentication, and more. These components are composed together in the HomePage to create a cohesive marketing and onboarding experience.

## Files Structure

```
home/
├── AuthSection.tsx      # Login/signup authentication section
├── Brands.tsx           # Partner/client brand showcase
├── Contact.tsx          # Contact information section
├── Features.tsx         # Feature highlights and benefits
├── Footer.tsx           # Page footer with links and info
├── Hero.tsx             # Landing page hero section
├── Navbar.tsx           # Home page navigation bar
└── index.ts             # Component exports
```

## Component Details

### AuthSection.tsx
**Purpose:** Provides authentication options for users to log in or sign up.

**Features:**
- Dual-mode display (login/signup)
- Tab or card-based layout options
- Integrates with AuthContext for authentication
- Redirects to dashboard after successful authentication

**Props:**
```typescript
interface AuthSectionProps {
  className?: string;
  layout?: 'tabs' | 'cards';
  showSignup?: boolean;
}
```

**Usage:**
```typescript
<AuthSection layout="tabs" showSignup={true} />
```

### Brands.tsx
**Purpose:** Displays a showcase of partner brands or client logos.

**Features:**
- Grid or carousel layout for brand logos
- Responsive design for different screen sizes
- Optional brand descriptions or tooltips

**Props:**
```typescript
interface BrandsProps {
  className?: string;
  brands?: BrandInfo[];
  layout?: 'grid' | 'carousel';
}
```

**Usage:**
```typescript
<Brands brands={partnerBrands} layout="grid" />
```

### Contact.tsx
**Purpose:** Provides contact information and methods to reach the team.

**Features:**
- Contact form integration
- Email, phone, and social media links
- Address and location information
- Optional map integration

**Props:**
```typescript
interface ContactProps {
  className?: string;
  showForm?: boolean;
  showMap?: boolean;
}
```

**Usage:**
```typescript
<Contact showForm={true} showMap={false} />
```

### Features.tsx
**Purpose:** Highlights key features and benefits of the BuildFlow platform.

**Features:**
- Feature cards with icons and descriptions
- Responsive grid layout
- Animated entrance effects (optional)
- Links to detailed feature pages

**Props:**
```typescript
interface FeaturesProps {
  className?: string;
  features?: FeatureInfo[];
  columns?: 2 | 3 | 4;
}
```

**Usage:**
```typescript
<Features columns={3} features={platformFeatures} />
```

**Highlighted Features:**
- Project Analytics - Real-time insights and reporting
- Smart Estimates - Intelligent pricing and material database
- Team Collaboration - Real-time communication and task assignment
- Mobile-First Design - Responsive design for all devices
- Role-Based Access - Secure authentication hierarchy
- Theme System - Light/dark mode with multiple variants

### Footer.tsx
**Purpose:** Page footer with navigation links, branding, and legal information.

**Features:**
- Multi-column link organization
- Social media links
- Copyright and legal information
- Newsletter subscription (optional)
- Responsive mobile layout

**Props:**
```typescript
interface FooterProps {
  className?: string;
  showNewsletter?: boolean;
  links?: FooterLinkGroup[];
}
```

**Usage:**
```typescript
<Footer showNewsletter={true} />
```

### Hero.tsx
**Purpose:** Landing page hero section with main value proposition.

**Features:**
- Bold headline and subheadline
- Call-to-action buttons
- Hero image or animation
- Background effects (gradients, patterns)
- Responsive typography and layout

**Props:**
```typescript
interface HeroProps {
  className?: string;
  title?: string;
  subtitle?: string;
  ctaButtons?: CTAButton[];
  backgroundImage?: string;
}
```

**Usage:**
```typescript
<Hero 
  title="Build Better, Build Faster" 
  subtitle="Complete construction management platform"
  ctaButtons={[
    { label: 'Get Started', onClick: handleSignup },
    { label: 'Learn More', onClick: scrollToFeatures }
  ]}
/>
```

### Navbar.tsx
**Purpose:** Navigation bar specifically designed for the home page.

**Features:**
- Scroll-aware styling (transparent to solid)
- Smooth scrolling to page sections
- Mobile hamburger menu
- Theme toggle integration
- Login/signup buttons

**Props:**
```typescript
interface NavbarProps {
  className?: string;
  transparent?: boolean;
  fixed?: boolean;
}
```

**Usage:**
```typescript
<Navbar transparent={true} fixed={true} />
```

**Note:** This is different from the FlexibleNavbar in components/navbar/ which is used for authenticated pages.

## Design Patterns

### Section Components
Each component represents a distinct section of the landing page:
- Self-contained functionality
- Configurable via props
- Responsive design built-in
- Theme-aware styling

### Composition Pattern
Components are designed to be composed together:
```typescript
<HomePage>
  <Navbar />
  <Hero />
  <Features />
  <Brands />
  <AuthSection />
  <Contact />
  <Footer />
</HomePage>
```

### Responsive Design
- Mobile-first approach
- Breakpoint-based layouts
- Touch-friendly interactions
- Optimized images and assets

## Styling Approach

### Tailwind CSS
All components use Tailwind utility classes:
- `bg-background`, `text-foreground` for theme support
- Responsive modifiers (`sm:`, `md:`, `lg:`)
- Hover and focus states
- Animation utilities

### Theme Integration
Components respect the theme system:
- Light/dark mode support
- Theme color variables
- Smooth theme transitions

## Integration Points

### AuthContext
Authentication section integrates with:
- `useAuth()` hook for login/signup
- `isAuthenticated` state checking
- User session management

### NavigationContext
Components use navigation for:
- Smooth scrolling to sections
- Routing to other pages
- Hash-based navigation

### ThemeContext
Components adapt to:
- Current theme (light/dark)
- Theme toggle interactions
- Theme color schemes

## Testing Considerations

While test files are not present in this directory, components should be tested for:
- Proper rendering with default props
- Responsive behavior across breakpoints
- User interactions (clicks, scrolls)
- Authentication flow integration
- Theme switching

## Usage Example

```typescript
import { 
  Hero, 
  Features, 
  AuthSection, 
  Contact, 
  Footer 
} from '@/components/home';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Hero 
        title="BuildFlow"
        subtitle="Construction Management Made Simple"
      />
      <Features columns={3} />
      <AuthSection layout="tabs" />
      <Contact showForm={true} />
      <Footer />
    </div>
  );
};
```

## Related Documentation

- [HomePage](../../pages/HomePage.tsx) - Landing page composition
- [Navbar Components](../navbar/README.md) - FlexibleNavbar for authenticated pages
- [Auth Components](../auth/README.md) - Authentication forms and fields
- [Theme Components](../theme/README.md) - Theme system integration
