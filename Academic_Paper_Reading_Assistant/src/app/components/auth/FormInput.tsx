import React, { useState } from 'react';
import { Eye, EyeOff, Check, X, AlertCircle, Info } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface FormInputProps {
  label: string;
  type?: 'text' | 'email' | 'password';
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  success?: string;
  info?: string;
  warning?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function FormInput({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required,
  error,
  success,
  info,
  warning,
  disabled,
  autoFocus,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${success ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''}
            ${warning ? 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500' : ''}
            ${isFocused && !error && !success && !warning ? 'border-[#2563EB] ring-2 ring-blue-100' : ''}
            pr-10 transition-all
          `}
        />
        
        {/* Password toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
        
        {/* Status icons for non-password inputs */}
        {type !== 'password' && (error || success || warning) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {error && <X className="w-4 h-4 text-red-500" />}
            {success && <Check className="w-4 h-4 text-green-500" />}
            {warning && <AlertCircle className="w-4 h-4 text-yellow-500" />}
          </div>
        )}
      </div>
      
      {/* Validation messages */}
      {error && (
        <div className="flex items-start gap-1.5 text-sm text-red-600">
          <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="flex items-start gap-1.5 text-sm text-green-600">
          <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}
      
      {warning && (
        <div className="flex items-start gap-1.5 text-sm text-yellow-600">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{warning}</span>
        </div>
      )}
      
      {info && !error && !success && !warning && (
        <div className="flex items-start gap-1.5 text-sm text-gray-600">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{info}</span>
        </div>
      )}
    </div>
  );
}
