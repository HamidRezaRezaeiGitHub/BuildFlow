/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--bf-border))',
        input: 'hsl(var(--bf-input))',
        ring: 'hsl(var(--bf-ring))',
        background: 'hsl(var(--bf-background))',
        foreground: 'hsl(var(--bf-foreground))',
        primary: {
          DEFAULT: 'hsl(var(--bf-primary))',
          foreground: 'hsl(var(--bf-primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--bf-secondary))',
          foreground: 'hsl(var(--bf-secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--bf-destructive))',
          foreground: 'hsl(var(--bf-destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--bf-muted))',
          foreground: 'hsl(var(--bf-muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--bf-accent))',
          foreground: 'hsl(var(--bf-accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--bf-popover))',
          foreground: 'hsl(var(--bf-popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--bf-card))',
          foreground: 'hsl(var(--bf-card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--bf-radius)',
        md: 'calc(var(--bf-radius) - 2px)',
        sm: 'calc(var(--bf-radius) - 4px)',
      },
      spacing: {
        touch: '44px',
      },
    },
  },
  plugins: [],
};
