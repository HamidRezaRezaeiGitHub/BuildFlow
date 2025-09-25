import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';
import { BaseFieldProps } from './Address';

// Country Field Component
export interface CountryFieldProps extends BaseFieldProps {
    placeholder?: string;
}

export const CountryField: React.FC<CountryFieldProps> = ({
    id = 'country',
    value,
    onChange,
    disabled = false,
    className = '',
    errors = [],
    placeholder = 'Canada'
}) => (
    <div className={`space-y-2 ${className}`}>
        <Label htmlFor={id} className="text-xs">Country</Label>
        <Input
            id={id}
            type="text"
            placeholder={placeholder}
            className={errors.length ? 'border-red-500 focus:border-red-500' : ''}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
        />
        {errors.length > 0 && (
            <div className="space-y-1">
                {errors.map((error, index) => (
                    <p key={index} className="text-xs text-red-500">{error}</p>
                ))}
            </div>
        )}
    </div>
);

export default CountryField;