import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';
import { BaseFieldProps } from './Address';

// Street Number Field Component
export interface StreetNumberFieldProps extends BaseFieldProps {
    placeholder?: string;
}

export const StreetNumberField: React.FC<StreetNumberFieldProps> = ({
    id = 'streetNumber',
    value,
    onChange,
    disabled = false,
    className = '',
    errors = [],
    placeholder = '123'
}) => {
    const hasErrors = errors.length > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <Label htmlFor={id} className="text-xs">Street Number</Label>
            <Input
                id={id}
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                className={hasErrors ? 'border-red-500 focus:border-red-500' : ''}
                disabled={disabled}
            />
            {hasErrors && (
                <div className="space-y-1">
                    {errors.map((error, index) => (
                        <p key={index} className="text-xs text-red-500">{error}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StreetNumberField;