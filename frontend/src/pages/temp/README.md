# Temporary Demo Pages

This directory contains temporary pages used for testing, demonstration, and development purposes. These pages are not part of the main application flow.

## Summary

The temp directory houses demo and test pages for component showcases, development testing, and feature exploration. These pages help developers test components in isolation and demonstrate features without affecting the production application.

## Files Structure

```
temp/
├── AddressPage.tsx                  # Address components demo
├── FlexibleBottomNavbarDemo.tsx    # Bottom navbar variants demo
├── FlexibleSignUpPage.tsx          # Signup form variants demo
└── Theme.tsx                        # Theme system showcase
```

## ⚠️ Important Note

**These pages are for development and testing only:**
- Not included in production routes
- May be removed or significantly changed
- Used for component development and testing
- Useful for demonstrating features to stakeholders

## Page Details

### AddressPage.tsx
**Purpose:** Demonstration and testing page for address components.

**Features:**
- FlexibleAddressForm in different configurations
- Field validation testing
- Different address presets (full, shipping, billing)
- Address data display
- Form state management examples

**Demo Scenarios:**
```typescript
// Full address configuration
<FlexibleAddressForm fieldsConfig="full" />

// Shipping address (no unit number)
<FlexibleAddressForm fieldsConfig="shipping" />

// Billing address with optional fields
<FlexibleAddressForm fieldsConfig="billing" />

// Custom field configuration
<FlexibleAddressForm fieldsConfig={customFields} />
```

**Use Cases:**
- Testing address validation
- Demonstrating address form flexibility
- Component development
- Visual regression testing

### FlexibleBottomNavbarDemo.tsx
**Purpose:** Demonstration page for bottom navigation component variants.

**Features:**
- Different bottom navbar layouts
- Icon variations
- Active state examples
- Theme integration
- Mobile-optimized navigation

**Demo Scenarios:**
```typescript
// Icon-only variant
<BottomNavbar variant="icons" />

// Icon + label variant
<BottomNavbar variant="labeled" />

// Compact variant
<BottomNavbar variant="compact" />
```

**Use Cases:**
- Testing mobile navigation
- Evaluating different navbar styles
- Client demonstrations
- Design decision making

### FlexibleSignUpPage.tsx
**Purpose:** Demonstration and testing page for signup form configurations.

**Features:**
- All signup form presets (minimal, essential, full, extended)
- Field validation scenarios
- Address integration testing
- Form submission simulation
- Different layout configurations (inline vs card)

**Demo Scenarios:**
```typescript
// Minimal signup (email + password only)
<FlexibleSignUpForm fieldsConfig="minimal" />

// Essential signup (name + email + password)
<FlexibleSignUpForm fieldsConfig="essential" />

// Full signup (all fields)
<FlexibleSignUpForm fieldsConfig="full" />

// With address section
<FlexibleSignUpForm 
  fieldsConfig="full"
  includeAddress={true}
  addressCollapsible={true}
/>

// Custom field configuration
<FlexibleSignUpForm fieldsConfig={customFields} />
```

**Use Cases:**
- Testing signup form flexibility
- Validation scenario testing
- User experience evaluation
- Form layout comparison

### Theme.tsx
**Purpose:** Comprehensive theme system demonstration and testing page.

**Features:**
- All theme toggle variants (7+ variants)
- Theme color palette display
- Component examples in different themes
- Live theme switching
- Code examples for each variant

**Demonstrated Elements:**
```typescript
// All toggle variants
<ThemeToggle variant="compact" />
<ThemeToggle variant="dropdown" />
<ThemeToggle variant="switch" />
<ThemeToggle variant="singleIcon" />
<ThemeToggle variant="toggleGroup" />
<ThemeToggle variant="button" />
<ThemeToggle variant="segmented" />

// Components in current theme
<Card>...</Card>
<Button>...</Button>
<Input>...</Input>
```

**Color Palette Display:**
- Background colors
- Foreground colors
- Primary/secondary colors
- Accent colors
- Muted colors
- Border colors

**Use Cases:**
- Theme development and testing
- Visual consistency checking
- Client presentations
- Design system documentation

## Accessing Demo Pages

### Development Routes
These pages can be accessed during development:

```typescript
// In development router configuration
{
  path: '/demo/address',
  element: <AddressPage />
},
{
  path: '/demo/navbar',
  element: <FlexibleBottomNavbarDemo />
},
{
  path: '/demo/signup',
  element: <FlexibleSignUpPage />
},
{
  path: '/demo/theme',
  element: <Theme />
}
```

### Production Exclusion
Demo routes should be excluded from production builds:
```typescript
const isDevelopment = import.meta.env.MODE === 'development';

// Only include demo routes in development
{isDevelopment && (
  <>
    <Route path="/demo/address" element={<AddressPage />} />
    <Route path="/demo/navbar" element={<FlexibleBottomNavbarDemo />} />
    <Route path="/demo/signup" element={<FlexibleSignUpPage />} />
    <Route path="/demo/theme" element={<Theme />} />
  </>
)}
```

## Development Workflow

### Component Development
1. Create component in appropriate directory
2. Add demo page in temp/ for testing
3. Test different configurations
4. Refine component based on demo feedback
5. Remove or update demo page

### Feature Demonstration
1. Create demo page showcasing feature
2. Prepare presentation scenarios
3. Demonstrate to stakeholders
4. Gather feedback
5. Update based on feedback

## Best Practices

### Demo Page Structure
```typescript
const DemoPage = () => {
  const [state, setState] = useState(initialState);
  
  return (
    <div className="container mx-auto p-6">
      <h1>Component Demo</h1>
      
      <section>
        <h2>Scenario 1</h2>
        <ComponentUnderTest config={config1} />
      </section>
      
      <section>
        <h2>Scenario 2</h2>
        <ComponentUnderTest config={config2} />
      </section>
      
      <section>
        <h2>Current State</h2>
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </section>
    </div>
  );
};
```

### State Inspection
Include state display for debugging:
```typescript
<Card>
  <CardHeader>
    <CardTitle>Current State</CardTitle>
  </CardHeader>
  <CardContent>
    <pre className="bg-muted p-4 rounded">
      {JSON.stringify(formData, null, 2)}
    </pre>
  </CardContent>
</Card>
```

### Console Logging
Enable verbose logging in demo pages:
```typescript
const handleChange = (value) => {
  console.log('Demo: Value changed', value);
  setValue(value);
};
```

## Maintenance

### Regular Cleanup
- Review temp pages quarterly
- Remove obsolete demos
- Update demos for new features
- Archive useful demos for future reference

### Documentation
- Keep this README updated
- Document demo scenarios
- Note any special setup requirements
- Link to related components

## Related Documentation

- [Address Components](../../components/address/README.md) - AddressPage demos
- [Auth Components](../../components/auth/README.md) - FlexibleSignUpPage demos
- [Theme Components](../../components/theme/README.md) - Theme.tsx demos
- [Navbar Components](../../components/navbar/README.md) - FlexibleBottomNavbarDemo
