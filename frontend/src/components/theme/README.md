# Theme Components

This directory contains components for the theme system, providing light/dark mode switching and theme customization functionality.

## Summary

The theme components provide a flexible theme management system with multiple toggle variants and a comprehensive showcase page. The theme system integrates with React Context for global theme state management and supports smooth transitions between themes.

## Files Structure

```
theme/
├── ThemeShowcase.tsx    # Theme demonstration and testing page
├── ThemeToggle.tsx      # Theme toggle component with variants
└── index.ts             # Component exports
```

## Component Details

### ThemeToggle.tsx
**Purpose:** Provides theme switching functionality with multiple visual variants.

**Features:**
- **7+ Toggle Variants:**
  - `compact` - Minimal icon toggle (default)
  - `dropdown` - Full theme selection dropdown
  - `switch` - Light/Dark switch control
  - `singleIcon` - Single changing icon
  - `toggleGroup` - Button group selector
  - `button` - Cycling button
  - `segmented` - iOS-style segmented control

**Theme Options:**
- Light mode
- Dark mode
- System preference (auto)

**Props:**
```typescript
interface ThemeToggleProps {
  variant?: 'compact' | 'dropdown' | 'switch' | 'singleIcon' | 'toggleGroup' | 'button' | 'segmented';
  showLabel?: boolean;
  className?: string;
}
```

**Usage:**
```typescript
// Compact variant (default - minimal icon)
<ThemeToggle variant="compact" />

// Dropdown variant (full control)
<ThemeToggle variant="dropdown" showLabel={true} />

// Switch variant (toggle switch)
<ThemeToggle variant="switch" showLabel={true} />

// Single icon variant (changes based on theme)
<ThemeToggle variant="singleIcon" />

// Toggle group variant (button group)
<ThemeToggle variant="toggleGroup" />

// Button variant (cycles through themes)
<ThemeToggle variant="button" showLabel={true} />

// Segmented variant (iOS-style)
<ThemeToggle variant="segmented" />
```

**Integration:**
- Uses `useTheme()` hook from ThemeContext
- Automatically applies theme to document root
- Persists theme selection to localStorage
- Syncs with system preferences when set to "system"

### ThemeShowcase.tsx
**Purpose:** Demonstration page displaying all theme toggle variants and theme effects.

**Features:**
- Visual showcase of all toggle variants
- Live theme switching demonstration
- Component examples in different themes
- Theme color palette display
- Code examples for each variant

**Props:**
```typescript
interface ThemeShowcaseProps {
  className?: string;
}
```

**Usage:**
```typescript
<ThemeShowcase />
```

**Demonstrated Elements:**
- All 7+ theme toggle variants
- UI components in different themes
- Color palette samples
- Typography examples
- Interactive component states

## Theme System Architecture

### Theme Values
```typescript
type Theme = 'light' | 'dark' | 'system';
```

### ThemeContext Integration
```typescript
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark';  // Resolved from system if theme is 'system'
}
```

### Implementation Pattern
```typescript
import { useTheme } from '@/contexts/ThemeContext';

const MyComponent = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  );
};
```

## Styling Approach

### CSS Variables
Theme colors are managed via CSS custom properties:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... more variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  /* ... more variables */
}
```

### Tailwind Integration
Components use theme-aware Tailwind classes:
- `bg-background` / `bg-foreground`
- `text-foreground` / `text-muted-foreground`
- `border-border`
- `ring-ring`

### Smooth Transitions
Theme changes include smooth transitions:
```css
* {
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

## Toggle Variant Details

### Compact Variant
- Minimal design
- Single icon (sun/moon)
- No labels
- Best for: Navbar, toolbar, space-constrained areas

### Dropdown Variant
- Full theme selection menu
- All options visible (Light, Dark, System)
- Optional labels
- Best for: Settings pages, preference panels

### Switch Variant
- Toggle switch UI
- Light ↔ Dark switching
- Visual on/off state
- Best for: Mobile interfaces, simple toggles

### Single Icon Variant
- Icon changes based on current theme
- Sun for light, Moon for dark
- Minimal footprint
- Best for: Simple theme indicators

### Toggle Group Variant
- Button group selector
- All options as buttons
- Active state indication
- Best for: Desktop interfaces, clear selection

### Button Variant
- Single button that cycles themes
- Shows current theme
- Click to cycle through options
- Best for: Quick switching, mobile apps

### Segmented Variant
- iOS-style segmented control
- Smooth sliding indicator
- Modern appearance
- Best for: Modern UIs, preference screens

## Responsive Behavior

### Mobile
- Larger touch targets (48px minimum)
- Simplified variants (compact, switch)
- Bottom sheet selectors for dropdown

### Tablet
- Medium-sized controls
- Full variant support
- Hover states enabled

### Desktop
- All variants available
- Hover effects
- Keyboard navigation
- Tooltips and labels

## Accessibility

### Keyboard Navigation
- All toggles are keyboard accessible
- Tab to focus, Enter/Space to activate
- Arrow keys for dropdown navigation

### Screen Readers
- Proper ARIA labels
- State announcements
- Role attributes

### Focus Indicators
- Visible focus rings
- High contrast focus states
- Respects system preferences

## Testing Considerations

Components should be tested for:
- Theme switching functionality
- Variant rendering
- localStorage persistence
- System preference synchronization
- Accessibility compliance
- Keyboard navigation

## Usage Examples

### In Navbar
```typescript
import { ThemeToggle } from '@/components/theme';

<FlexibleNavbar
  ThemeToggleComponent={() => <ThemeToggle variant="compact" />}
  showThemeToggle={true}
/>
```

### In Settings Page
```typescript
import { ThemeToggle } from '@/components/theme';

<div className="settings-section">
  <h3>Appearance</h3>
  <ThemeToggle variant="dropdown" showLabel={true} />
</div>
```

### Showcase Route
```typescript
import { ThemeShowcase } from '@/components/theme';

<Route path="/theme-demo" element={<ThemeShowcase />} />
```

## Related Documentation

- [ThemeContext](../../contexts/README.md#themecontext) - Global theme state management
- [Navbar Components](../navbar/README.md) - NavBar theme integration
- [UI Components](../ui/) - Base components that respect theme
- [Tailwind Config](../../../tailwind.config.js) - Theme color definitions
