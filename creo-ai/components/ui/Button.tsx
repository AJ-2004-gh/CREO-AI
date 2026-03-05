'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    disabled,
    icon,
    iconPosition = 'left',
    children,
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden touch-manipulation';
    
    const variants = {
      primary: 'btn-gradient border border-white/20 text-white',
      secondary: 'bg-white/80 backdrop-blur-md text-gray-800 border border-white/50 hover:bg-white hover:border-white shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]',
      outline: 'border-2 border-blue-200/50 bg-white/50 backdrop-blur-md text-blue-700 hover:bg-white hover:border-blue-400 focus:ring-blue-500 shadow-sm hover:shadow-md',
      ghost: 'text-gray-600 hover:bg-white/60 hover:text-blue-600 focus:ring-gray-500 transition-colors cursor-pointer',
      danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 focus:ring-red-500 shadow-md hover:shadow-lg border border-red-400/30'
    };
    
    const sizes = {
      xs: 'px-2.5 py-1.5 text-xs rounded-lg',
      sm: 'px-3 py-2 text-sm rounded-lg',
      md: 'px-4 py-2.5 text-sm rounded-xl',
      lg: 'px-5 py-3 text-base rounded-xl',
      xl: 'px-6 py-3.5 text-lg rounded-2xl'
    };
    
    const iconSizes = {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
      xl: 'h-6 w-6'
    };

    const filteredProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => !key.startsWith('onDrag'))
    );

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        {...filteredProps}
      >
        {loading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 className={cn('animate-spin', iconSizes[size])} />
          </motion.div>
        )}
        
        <motion.div
          className={cn('flex items-center gap-2', loading && 'opacity-0')}
          animate={{ opacity: loading ? 0 : 1 }}
        >
          {icon && iconPosition === 'left' && (
            <span className={cn('flex-shrink-0', iconSizes[size])}>{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className={cn('flex-shrink-0', iconSizes[size])}>{icon}</span>
          )}
        </motion.div>
        
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
