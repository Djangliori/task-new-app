'use client';

import { useState } from 'react';

interface UnifiedFormProps {
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  className?: string;
}

export function UnifiedForm({
  title,
  children,
  onSubmit,
  isLoading = false,
  className = '',
}: UnifiedFormProps) {
  return (
    <div
      className={`unified-form-container ${className}`}
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        border: '1px solid #e9ecef',
        maxWidth: '450px',
        width: '100%',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2
          style={{
            color: '#2c3e50',
            marginBottom: '8px',
            fontSize: '28px',
            fontWeight: '700',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h2>
      </div>

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {children}
      </form>
    </div>
  );
}

interface UnifiedInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  success?: string;
}

export function UnifiedInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  success,
}: UnifiedInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? '#e74c3c'
    : success
    ? '#27ae60'
    : isFocused
    ? '#4da8da'
    : '#e9ecef';

  const labelColor = error
    ? '#e74c3c'
    : success
    ? '#27ae60'
    : '#2c3e50';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label
        style={{
          fontWeight: '600',
          color: labelColor,
          fontSize: '14px',
          transition: 'color 0.2s ease',
        }}
      >
        {label}
        {required && <span style={{ color: '#e74c3c', marginLeft: '4px' }}>*</span>}
      </label>
      
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          padding: '14px 16px',
          border: `2px solid ${borderColor}`,
          borderRadius: '10px',
          fontSize: '16px',
          transition: 'all 0.2s ease',
          outline: 'none',
          backgroundColor: isFocused ? '#fafbfc' : 'white',
          boxShadow: isFocused ? `0 0 0 3px ${borderColor}20` : 'none',
        }}
      />
      
      {error && (
        <span
          style={{
            color: '#e74c3c',
            fontSize: '13px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          ⚠ {error}
        </span>
      )}
      
      {success && (
        <span
          style={{
            color: '#27ae60',
            fontSize: '13px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          ✓ {success}
        </span>
      )}
    </div>
  );
}

interface UnifiedButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  onClick?: () => void;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function UnifiedButton({
  children,
  type = 'button',
  variant = 'primary',
  disabled = false,
  onClick,
  isLoading = false,
  fullWidth = true,
}: UnifiedButtonProps) {
  const getButtonStyles = () => {
    const baseStyles = {
      padding: '14px 24px',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '600',
      border: 'none',
      cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      width: fullWidth ? '100%' : 'auto',
      opacity: disabled || isLoading ? 0.7 : 1,
      transform: disabled || isLoading ? 'none' : 'translateY(0)',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          background: disabled || isLoading 
            ? '#bdc3c7' 
            : 'linear-gradient(135deg, #4da8da 0%, #80d8c3 100%)',
          color: 'white',
          boxShadow: disabled || isLoading 
            ? 'none' 
            : '0 4px 12px rgba(77, 168, 218, 0.3)',
        };
      case 'secondary':
        return {
          ...baseStyles,
          background: '#f8f9fa',
          color: '#6c757d',
          border: '2px solid #e9ecef',
        };
      case 'danger':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
          color: 'white',
          boxShadow: disabled || isLoading 
            ? 'none' 
            : '0 4px 12px rgba(231, 76, 60, 0.3)',
        };
      default:
        return baseStyles;
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      style={getButtonStyles()}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isLoading) {
          (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
        }
      }}
    >
      {isLoading && (
        <div
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid transparent',
            borderTop: '2px solid currentColor',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      )}
      {children}
    </button>
  );
}

// Add CSS animation for loading spinner
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}