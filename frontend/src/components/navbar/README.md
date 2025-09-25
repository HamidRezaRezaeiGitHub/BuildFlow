# Navbar Components - Configurable Navigation System

This directory contains a comprehensive suite of navbar components designed to provide a flexible and highly configurable navigation experience for the BuildFlow application.

## 🏗️ Architecture Overview

The navbar system follows a modular architecture pattern similar to the address components, where small, focused components are composed into a larger, configurable component:

### Small Components → Configurable Component
- **SignUpButton** + **LoginButton** + **Logo** + **Avatar** → **ConfigurableNavbar**

This approach ensures:
- **Reusability**: Individual components can be used independently
- **Testability**: Each component can be tested in isolation
- **Maintainability**: Clear separation of concerns
- **Flexibility**: Easy to extend and modify

## 🧩 Core Components

### Individual Navbar Components

| Component | Purpose | Key Features | Test Coverage |
|-----------|---------|--------------|---------------|
| **Logo** | Brand identity display | Size variants (sm/md/lg), optional text | ✓ |
| **LoginButton** | User authentication entry | Configurable variants and sizes | ✓ |
| **SignUpButton** | User registration entry | Configurable variants and sizes | ✓ |
| **Avatar** | User profile display | User initials fallback, clickable | ✓ |

#### **Logo Component** (`Logo.tsx`)
- **Purpose**: Displays BuildFlow brand identity with SVG logo and optional text
- **Features**:
  - Size variants: `sm`, `md`, `lg`
  - Optional brand text display
  - Responsive sizing
  - Consistent brand colors
- **Use Cases**: Brand identification in navbar, footer, loading states

#### **LoginButton Component** (`LoginButton.tsx`)
- **Purpose**: Provides login functionality trigger
- **Features**:
  - Multiple visual variants (`default`, `outline`, `ghost`, `secondary`)
  - Size options (`default`, `sm`, `lg`)
  - Custom text support
  - Click handler integration
- **Use Cases**: Authentication flows, guest user actions

#### **SignUpButton Component** (`SignUpButton.tsx`)
- **Purpose**: Provides registration functionality trigger
- **Features**:
  - Multiple visual variants with default styling
  - Size options for different layouts
  - Custom text support
  - Call-to-action styling
- **Use Cases**: User acquisition, registration flows

#### **Avatar Component** (`Avatar.tsx`)
- **Purpose**: Displays authenticated user profile representation
- **Features**:
  - User initials fallback when no image available
  - Size variants (`sm`, `md`, `lg`)
  - Click handler for profile actions
  - Accessible with proper alt text
  - Hover effects for interactivity
- **Use Cases**: User profile access, authenticated state indication

### Composite Component

#### **ConfigurableNavbar** (`ConfigurableNavbar.tsx`)
- **Purpose**: Main navigation component that combines all navbar elements
- **Features**:
  - **Authentication State Handling**: Shows login/signup buttons OR user avatar
  - **Theme Toggle Integration**: Supports all theme toggle variants
  - **Navigation Items**: Configurable menu items with click handlers
  - **Mobile Responsive**: Collapsible mobile menu with hamburger button
  - **Logo & Branding**: Configurable logo display and sizing
  - **Accessibility**: Proper ARIA labels and keyboard navigation

## 🎛️ ConfigurableNavbar Configuration

### Authentication Configuration
```typescript
// For unauthenticated users
<ConfigurableNavbar 
  isAuthenticated={false}
  showAuthButtons={true}
  onLoginClick={() => navigate('/login')}
  onSignUpClick={() => navigate('/signup')}
  loginButtonText="Sign In"
  signUpButtonText="Get Started"
/>

// For authenticated users
<ConfigurableNavbar 
  isAuthenticated={true}
  user={currentUser}
  onAvatarClick={() => setShowUserMenu(true)}
/>
```

### Navigation Configuration
```typescript
<ConfigurableNavbar 
  navItems={[
    { label: 'Dashboard', onClick: () => navigate('/dashboard') },
    { label: 'Projects', onClick: () => navigate('/projects') },
    { label: 'Settings', onClick: () => navigate('/settings') }
  ]}
/>
```

### Theme Toggle Configuration
```typescript
<ConfigurableNavbar 
  themeToggleType="dropdown"  // compact | dropdown | switch | singleIcon | toggleGroup | button | segmented
  showThemeToggle={true}
/>
```

### Branding Configuration
```typescript
<ConfigurableNavbar 
  showLogo={true}
  logoSize="md"
  showBrandText={true}
/>
```

## 🎯 Theme Toggle Integration

The ConfigurableNavbar integrates seamlessly with the theme system by mapping theme toggle types to their respective components:

### Theme Toggle Mapping
```typescript
const themeToggleComponents = {
  compact: CompactThemeToggle,           // Default - minimal icon
  dropdown: DropdownThemeToggle,         // Full control dropdown
  switch: SwitchThemeToggle,             // Light/Dark switch
  singleIcon: SingleChangingIconThemeToggle, // Single changing icon
  toggleGroup: ToggleGroupThemeToggle,   // Button group
  button: ButtonThemeToggle,             // Cycling button
  segmented: SegmentedThemeToggle,       // iOS-style control
};
```

### Responsive Theme Toggle Behavior
- **Desktop**: Shows theme toggle without labels (compact)
- **Mobile**: Shows theme toggle with labels (when applicable)
- **Automatic Props**: Properly handles `showLabel` prop based on component capabilities

## 📱 Mobile Responsiveness

### Mobile Menu Features
- **Hamburger Button**: Three-line menu icon that transforms to X when open
- **Slide-down Menu**: Smooth animation for mobile menu appearance
- **Navigation Items**: Full-width buttons in mobile menu
- **Theme Toggle**: Mobile-optimized with labels
- **Auth Buttons**: Stack vertically in mobile menu
- **Auto-close**: Menu closes after navigation item selection

### Responsive Breakpoints
- **Desktop**: `md:` and above - full horizontal layout
- **Mobile**: Below `md` - collapsed hamburger menu
- **Theme Toggle**: Hidden on small screens (`sm:block`), visible on larger screens

## 🧪 Testing Strategy

### Test Coverage: 15 Test Scenarios
The ConfigurableNavbar has comprehensive test coverage ensuring reliability:

#### Core Functionality Tests
- ✅ Renders with default props
- ✅ Shows user avatar when authenticated
- ✅ Renders navigation items correctly
- ✅ Calls navigation item onClick handlers
- ✅ Calls authentication button callbacks
- ✅ Calls avatar click callback

#### Configuration Tests
- ✅ Hides logo when `showLogo={false}`
- ✅ Hides auth buttons when `showAuthButtons={false}`
- ✅ Hides theme toggle when `showThemeToggle={false}`
- ✅ Uses custom button text
- ✅ Shows dropdown theme toggle correctly
- ✅ Applies custom className

#### Edge Case Tests
- ✅ Handles user without contact information
- ✅ Renders with all theme toggle types
- ✅ Shows mobile menu functionality

### Test Patterns
- **Isolated Component Testing**: Each small component tested independently
- **Integration Testing**: ConfigurableNavbar tested with various configurations
- **User Interaction Testing**: Click handlers and state changes verified
- **Accessibility Testing**: Proper ARIA labels and keyboard navigation
- **Responsive Testing**: Mobile menu functionality verified

## 🔄 Integration Patterns

### Home Page Integration
```typescript
<ConfigurableNavbar 
  navItems={[
    { label: 'Features', onClick: () => scrollToSection('features') },
    { label: 'About', onClick: () => scrollToSection('about') },
    { label: 'Contact', onClick: () => scrollToSection('contact') }
  ]}
  themeToggleType="compact"
  isAuthenticated={false}
  onLoginClick={handleLogin}
  onSignUpClick={handleSignUp}
/>
```

### Dashboard Integration
```typescript
<ConfigurableNavbar 
  navItems={[
    { label: 'Dashboard', onClick: () => navigate('/dashboard') },
    { label: 'Projects', onClick: () => navigate('/projects') },
    { label: 'Reports', onClick: () => navigate('/reports') }
  ]}
  themeToggleType="dropdown"
  isAuthenticated={true}
  user={currentUser}
  onAvatarClick={handleUserMenu}
/>
```

### Admin Panel Integration
```typescript
<ConfigurableNavbar 
  navItems={[
    { label: 'Dashboard', onClick: () => navigate('/dashboard') },
    { label: 'Admin Panel', onClick: () => console.log('Current page') },
    { label: 'Home', onClick: () => navigate('/') }
  ]}
  themeToggleType="compact"
  isAuthenticated={true}
  user={currentUser}
  onAvatarClick={handleAdminMenu}
/>
```

## 🎨 Design System Integration

### Theme-Aware Styling
All components use theme-aware CSS classes:
- `bg-background` / `bg-card` for surfaces
- `text-foreground` / `text-muted-foreground` for text
- `border-border` for borders
- `hover:bg-accent` for interactive states

### Consistent Spacing
- `gap-2` / `gap-4` / `gap-6` for consistent spacing
- `px-4` / `py-2` for padding consistency
- `h-16` for navbar height standardization

### Typography Scale
- Logo: `text-lg` (medium), `text-xl` (large)
- Navigation: `text-sm font-medium`
- Buttons: Consistent with UI button system

## 🚀 Usage Examples

### Basic Navbar (Unauthenticated)
```typescript
import { ConfigurableNavbar } from '@/components/navbar';

<ConfigurableNavbar />
```

### Advanced Configuration
```typescript
import { ConfigurableNavbar } from '@/components/navbar';
import { useAuth } from '@/contexts/AuthContext';

const MyPage = () => {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <ConfigurableNavbar 
      isAuthenticated={isAuthenticated}
      user={user}
      navItems={[
        { label: 'Home', onClick: () => navigate('/') },
        { label: 'Dashboard', onClick: () => navigate('/dashboard') }
      ]}
      themeToggleType="dropdown"
      showLogo={true}
      logoSize="md"
      onAvatarClick={() => setShowUserMenu(true)}
      onLoginClick={() => navigate('/login')}
      onSignUpClick={() => navigate('/signup')}
      className="border-b-2"
    />
  );
};
```

### Individual Component Usage
```typescript
import { Logo, LoginButton, SignUpButton, Avatar } from '@/components/navbar';

// Use components individually
<Logo size="lg" showText={true} />
<LoginButton onClick={handleLogin} variant="outline" />
<SignUpButton onClick={handleSignUp} />
<Avatar user={currentUser} onClick={handleProfile} />
```

## 🔧 Maintenance Guidelines

### Adding New Navigation Features
1. Create small, focused components first
2. Add comprehensive tests for new components
3. Update ConfigurableNavbar to integrate new features
4. Update this README with new functionality
5. Add usage examples and integration patterns

### Modifying Existing Components
1. Ensure backward compatibility
2. Update tests to reflect changes
3. Test integration with ConfigurableNavbar
4. Update documentation and examples

### Theme Integration
1. Use theme-aware CSS classes
2. Test with all theme variants
3. Ensure proper contrast ratios
4. Verify mobile responsiveness

This navbar system provides a robust, flexible, and maintainable navigation solution that adapts to different authentication states, page contexts, and user preferences while maintaining consistent design and functionality across the BuildFlow application.