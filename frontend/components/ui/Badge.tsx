import React from 'react';
import { cn } from '@/lib/utils/formatters';
import { RiskLevel } from '@/types';
import { constants } from '@/lib/utils/constants';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  riskLevel?: RiskLevel;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default',
  riskLevel,
  className 
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  let variantStyles = '';
  
  if (riskLevel) {
    const riskColors = {
      green: 'bg-green-100 text-green-800',
      amber: 'bg-amber-100 text-amber-800',
      red: 'bg-red-100 text-red-800',
    };
    variantStyles = riskColors[riskLevel];
  } else {
    const variants = {
      default: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800',
    };
    variantStyles = variants[variant];
  }

  return (
    <span className={cn(baseStyles, variantStyles, className)}>
      {children}
    </span>
  );
};
