import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Switch } from '../ui/switch';
import { Toggle } from '../ui/toggle';
import { Button } from '../ui/button';

// Common interface for all theme toggle components
interface BaseThemeToggleProps {
  className?: string;
}

/**
 * Dropdown-based theme selector with all three options (Light/Dark/System)
 */
export const DropdownThemeToggle: React.FC<BaseThemeToggleProps & { showLabel?: boolean }> = ({ 
  className = '', 
  showLabel = false 
}) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-sm font-medium text-foreground">
          Theme:
        </span>
      )}
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
        className="px-3 py-2 text-sm border border-input bg-background text-foreground rounded-md 
                   focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                   hover:bg-accent transition-colors"
      >
        <option value="light">☀️ Light</option>
        <option value="dark">🌙 Dark</option>
        <option value="system">🖥️ System</option>
      </select>
    </div>
  );
};

/**
 * Switch-based theme toggle (Light/Dark only, ignores system)
 */
export const SwitchThemeToggle: React.FC<BaseThemeToggleProps & { showLabel?: boolean }> = ({ 
  className = '', 
  showLabel = false 
}) => {
  const { actualTheme, setTheme } = useTheme();

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showLabel && (
        <span className="text-sm font-medium text-foreground">
          Dark mode:
        </span>
      )}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">☀️</span>
        <Switch
          checked={actualTheme === 'dark'}
          onCheckedChange={handleToggle}
        />
        <span className="text-sm text-muted-foreground">🌙</span>
      </div>
    </div>
  );
};

/**
 * Single icon that changes based on current theme and toggles between light/dark
 */
export const SingleChangingIconThemeToggle: React.FC<BaseThemeToggleProps> = ({ 
  className = '' 
}) => {
  const { actualTheme, toggleTheme } = useTheme();

  const getIcon = () => {
    return actualTheme === 'light' ? '🌙' : '☀️';
  };

  const getTooltip = () => {
    return `Switch to ${actualTheme === 'light' ? 'dark' : 'light'} mode`;
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={`p-2 h-auto ${className}`}
      title={getTooltip()}
    >
      <span className="text-lg">{getIcon()}</span>
    </Button>
  );
};

/**
 * Toggle button group with three states (Light/Dark/System)
 */
export const ToggleGroupThemeToggle: React.FC<BaseThemeToggleProps> = ({ 
  className = '' 
}) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className={`flex items-center border border-input rounded-md ${className}`}>
      <Toggle
        pressed={theme === 'light'}
        onPressedChange={() => setTheme('light')}
        className="rounded-r-none border-r"
        size="sm"
      >
        ☀️
      </Toggle>
      <Toggle
        pressed={theme === 'dark'}
        onPressedChange={() => setTheme('dark')}
        className="rounded-none border-r"
        size="sm"
      >
        🌙
      </Toggle>
      <Toggle
        pressed={theme === 'system'}
        onPressedChange={() => setTheme('system')}
        className="rounded-l-none"
        size="sm"
      >
        🖥️
      </Toggle>
    </div>
  );
};

/**
 * Button-based theme selector with current theme indicator
 */
export const ButtonThemeToggle: React.FC<BaseThemeToggleProps & { showLabel?: boolean }> = ({ 
  className = '', 
  showLabel = false 
}) => {
  const { theme, actualTheme, setTheme } = useTheme();

  const getDisplayText = () => {
    if (theme === 'system') {
      return `🖥️ System (${actualTheme})`;
    }
    return theme === 'light' ? '☀️ Light' : '🌙 Dark';
  };

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-sm font-medium text-foreground">
          Theme:
        </span>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={cycleTheme}
        className="min-w-24"
      >
        {getDisplayText()}
      </Button>
    </div>
  );
};

/**
 * Segmented control style theme toggle
 */
export const SegmentedThemeToggle: React.FC<BaseThemeToggleProps> = ({ 
  className = '' 
}) => {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '🖥️' },
  ] as const;

  return (
    <div className={`inline-flex bg-muted rounded-lg p-1 ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => setTheme(option.value)}
          className={`px-3 py-1 text-sm rounded-md transition-all ${
            theme === option.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="mr-1">{option.icon}</span>
          {option.label}
        </button>
      ))}
    </div>
  );
};

/**
 * Compact icon-only theme toggle (for mobile/minimal UI)
 */
export const CompactThemeToggle: React.FC<BaseThemeToggleProps> = ({ 
  className = '' 
}) => {
  const { actualTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-1.5 rounded-full bg-muted hover:bg-accent text-foreground transition-colors ${className}`}
      title={`Switch to ${actualTheme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className="text-sm">
        {actualTheme === 'light' ? '🌙' : '☀️'}
      </span>
    </button>
  );
};

export default {
  DropdownThemeToggle,
  SwitchThemeToggle,
  SingleChangingIconThemeToggle,
  ToggleGroupThemeToggle,
  ButtonThemeToggle,
  SegmentedThemeToggle,
  CompactThemeToggle
};