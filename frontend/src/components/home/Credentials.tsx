import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import React from 'react';

interface EmailFieldProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  errors?: string[];
  hasError?: boolean;
}

interface PasswordFieldProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  showPassword: boolean;
  onToggleVisibility: () => void;
  errors?: string[];
  hasError?: boolean;
}

// Reusable Email Field Component
export const EmailField: React.FC<EmailFieldProps> = ({ 
  id, 
  value, 
  onChange, 
  placeholder = "john@company.com", 
  errors = [],
  hasError = false
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>Email</Label>
    <div className="relative">
      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        id={id}
        type="email"
        placeholder={placeholder}
        className={`pl-10 ${hasError || errors.length > 0 ? 'border-red-500 focus:border-red-500' : ''}`}
        value={value}
        onChange={onChange}
        required
      />
    </div>
    {errors.length > 0 && (
      <div className="space-y-1">
        {errors.map((error, index) => (
          <p key={index} className="text-xs text-red-500">{error}</p>
        ))}
      </div>
    )}
  </div>
);

// Reusable Password Field Component
export const PasswordField: React.FC<PasswordFieldProps> = ({ 
  id, 
  value, 
  onChange, 
  placeholder, 
  showPassword, 
  onToggleVisibility, 
  errors = [],
  hasError = false
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>Password</Label>
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className={`pl-10 pr-10 ${hasError || errors.length > 0 ? 'border-red-500 focus:border-red-500' : ''}`}
        value={value}
        onChange={onChange}
        required
      />
      <button
        type="button"
        onClick={onToggleVisibility}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
    {errors.length > 0 && (
      <div className="space-y-1">
        {errors.map((error, index) => (
          <p key={index} className="text-xs text-red-500">{error}</p>
        ))}
      </div>
    )}
  </div>
);