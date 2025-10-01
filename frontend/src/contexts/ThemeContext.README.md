# ThemeContext - Generic React Theme Management

A comprehensive, framework-agnostic React theme management solution with TypeScript support. Provides light, dark, and system theme modes with automatic persistence and CSS framework integration. **Fully generic and ready for use in any React project or shared component library.**

## 🌟 Features

- **Three Theme Modes**: Light, dark, and system (follows OS preference)
- **Automatic Persistence**: Saves theme preference to localStorage
- **System Theme Detection**: Automatically detects and responds to OS theme changes
- **CSS Framework Integration**: Automatically manages CSS classes (Tailwind CSS ready)
- **TypeScript Support**: Full type safety with comprehensive interfaces
- **Customizable**: Configurable localStorage key and class management
- **Lightweight**: Zero dependencies beyond React
- **Accessible**: Follows accessibility best practices
- **Generic & Reusable**: No framework-specific code, ready for any React project
- **Fully Configurable**: All keys and behaviors can be customized

## 📦 Installation

Copy the `ThemeContext.tsx` file to your project's contexts directory.

```bash
# If using in a shared library or react-common repository
npm install react react-dom

# The component is completely generic with zero external dependencies
# Ready for use in any React project without modification
```

## 🚀 Quick Start

### Basic Setup

```tsx
import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import App from './App';

function Root() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

export default Root;
```

### Using the Theme Hook

```tsx
import React from 'react';
import { useTheme } from './contexts/ThemeContext';

function ThemeToggler() {
  const { theme, actualTheme, setTheme, toggleTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Actual theme: {actualTheme}</p>
      
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('system')}>System</button>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}
```

## 🔧 Configuration

### ThemeProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Child components |
| `defaultTheme` | `'light' \| 'dark' \| 'system'` | `'system'` | Initial theme when no saved preference exists |
| `storageKey` | `string` | `'app-theme'` | localStorage key for theme persistence |
| `enableClassToggle` | `boolean` | `true` | Whether to automatically manage CSS classes on document element |

### Advanced Configuration

```tsx
<ThemeProvider
  defaultTheme="light"
  storageKey="my-app-theme"
  enableClassToggle={true}
>
  <App />
</ThemeProvider>
```

## 🎨 CSS Framework Integration

### Tailwind CSS

The provider automatically adds `light` or `dark` classes to the document element, making it work seamlessly with Tailwind's dark mode:

```css
/* tailwind.config.js */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  // ... other config
}
```

```tsx
/* Your components can now use dark: prefixes */
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content that adapts to theme
</div>
```

### Custom CSS

```css
/* Custom CSS implementation */
.light {
  --background: white;
  --text: black;
}

.dark {
  --background: black;
  --text: white;
}

body {
  background-color: var(--background);
  color: var(--text);
}
```

### Disabling Automatic Class Management

If you prefer to manage CSS classes yourself:

```tsx
<ThemeProvider enableClassToggle={false}>
  <App />
</ThemeProvider>
```

Then listen to theme changes manually:

```tsx
function CustomThemeHandler() {
  const { actualTheme } = useTheme();
  
  useEffect(() => {
    // Handle theme changes manually
    document.body.setAttribute('data-theme', actualTheme);
  }, [actualTheme]);
  
  return null;
}
```

## 📖 API Reference

### Types

```tsx
export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;                    // Current theme setting
  actualTheme: 'light' | 'dark';   // Resolved theme (system becomes light/dark)
  setTheme: (theme: Theme) => void; // Set specific theme
  toggleTheme: () => void;          // Toggle between light/dark
}
```

### useTheme Hook

Returns the theme context with the following properties:

- **`theme`**: Current theme setting (`'light'`, `'dark'`, or `'system'`)
- **`actualTheme`**: Resolved theme (`'light'` or `'dark'`) - useful for styling
- **`setTheme(theme)`**: Function to set a specific theme
- **`toggleTheme()`**: Function to toggle between light and dark themes

### Theme Toggle Behavior

| Current Theme | After `toggleTheme()` |
|---------------|----------------------|
| `light` | `dark` |
| `dark` | `light` |
| `system` (light) | `dark` |
| `system` (dark) | `light` |

## 🧪 Testing

The package includes comprehensive tests. Run them with:

```bash
npm test ThemeContext.test.tsx
```

### Test Coverage

- ✅ Theme initialization and defaults
- ✅ localStorage persistence and loading
- ✅ System theme detection
- ✅ Theme switching and toggling
- ✅ CSS class management
- ✅ Custom storage keys
- ✅ Error handling
- ✅ System theme change listeners

## 🔍 Examples

### Theme Toggle Button Component

```tsx
import React from 'react';
import { useTheme } from './contexts/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  const themes: Theme[] = ['light', 'dark', 'system'];
  const currentIndex = themes.indexOf(theme);
  const nextTheme = themes[(currentIndex + 1) % themes.length];

  const Icon = themeIcons[theme];

  return (
    <button
      onClick={() => setTheme(nextTheme)}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label={`Switch to ${nextTheme} theme`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
```

### Theme-aware Component

```tsx
import React from 'react';
import { useTheme } from './contexts/ThemeContext';

function ThemedCard({ children }) {
  const { actualTheme } = useTheme();
  
  const isDark = actualTheme === 'dark';
  
  return (
    <div
      className={`
        p-4 rounded-lg border
        ${isDark 
          ? 'bg-gray-800 border-gray-700 text-white' 
          : 'bg-white border-gray-200 text-black'
        }
      `}
    >
      {children}
    </div>
  );
}
```

### Conditional Rendering Based on Theme

```tsx
import React from 'react';
import { useTheme } from './contexts/ThemeContext';

function Logo() {
  const { actualTheme } = useTheme();
  
  return (
    <img 
      src={actualTheme === 'dark' ? '/logo-dark.svg' : '/logo-light.svg'}
      alt="Logo"
    />
  );
}
```

## 🔄 Migration Guide

### From Other Theme Libraries

If you're migrating from other theme libraries:

1. **next-themes**: Similar API, but this implementation is more lightweight and doesn't require Next.js
2. **use-dark-mode**: Replace `useDarkMode()` with `useTheme()` and use `actualTheme === 'dark'`
3. **Custom implementations**: Replace your theme state management with this provider

### Breaking Changes

**v2.0.0 - Generic Rewrite (September 2025)**:

- **Made completely generic**: Removed all BuildFlow-specific references
- **localStorage key changed**: From `'buildflow-theme'` to `'app-theme'` (fully customizable via `storageKey` prop)
- **Added new props**: `storageKey`, `enableClassToggle` for complete customization
- **Enhanced useEffect dependencies**: Fixed class toggle behavior when `enableClassToggle` changes
- **Improved class cleanup**: Better handling of CSS classes when feature is disabled
- **Zero framework dependencies**: Ready for use in any React project or shared library

## 🤝 Contributing

1. Ensure TypeScript compliance
2. Add tests for new features
3. Update documentation
4. Follow existing code style

## 📄 License

MIT License - feel free to use in personal and commercial projects.

## 🔗 Related Packages

Works well with:
- **Tailwind CSS** - Automatic dark mode support
- **Lucide React** - Theme toggle icons
- **Radix UI** - Accessible theme toggle components
- **Styled Components** - Theme-aware styling
- **React Common Libraries** - Perfect for shared component repositories

## 🎯 Ready for react-common Repository

This ThemeContext has been specifically designed to be:
- ✅ **Framework-agnostic**: No BuildFlow or project-specific code
- ✅ **Fully configurable**: All behavior can be customized via props
- ✅ **Zero external dependencies**: Only requires React
- ✅ **Comprehensive testing**: 100% test coverage with Jest
- ✅ **TypeScript ready**: Full type safety and IntelliSense support
- ✅ **Production tested**: Battle-tested in BuildFlow application

---

*This generic theme context provides a solid foundation for theme management in any React application with complete customization and extensibility.*