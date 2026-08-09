import React from 'react';

type Variant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', size = 'sm', className = '' }) => {
  const variantStyles = {
    primary: 'bg-teal-50 text-teal-700 border border-teal-200/80 font-semibold',
    secondary: 'bg-slate-100 text-[#333333] border border-slate-200 font-semibold',
    success: 'bg-teal-50 text-teal-700 border border-teal-200 font-semibold',
    warning: 'bg-coral-50 text-coral-600 border border-coral-200 font-semibold',
    danger: 'bg-coral-100 text-coral-700 border border-coral-300 font-semibold',
    info: 'bg-teal-100 text-teal-800 border border-teal-200 font-semibold',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs font-semibold rounded-full',
    md: 'px-3 py-1 text-sm font-semibold rounded-md',
  };

  return (
    <span className={`inline-flex items-center gap-1 leading-none tracking-wide ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
};

