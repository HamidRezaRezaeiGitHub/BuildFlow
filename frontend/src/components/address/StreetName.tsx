import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';
import { BaseFieldProps } from './Address';

// Street Name Field Component
export interface StreetNameFieldProps extends BaseFieldProps {
    placeholder?: string;
}

export const StreetNameField: React.FC<StreetNameFieldProps> = ({
    id = 'streetName',
    value,
    onChange,
    disabled = false,
    className = '',
    errors = [],
    placeholder = 'Bay Street'
}) => (
    <div className={`space-y-2 ${className}`}>
        <Label htmlFor={id} className="text-xs">Street Name</Label>
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

export default StreetNameField;