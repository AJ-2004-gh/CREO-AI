'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onDrag'> {
  variant?: 'default' | 'filled' | 'outlined';
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', error = false, ...props }, ref) => {
    const baseStyles = 'flex w-full rounded-xl border px-4 py-2.5 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation';
    
    const variants = {
      default: 'bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500/20',
      filled: 'bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-blue-500/20',
      outlined: 'bg-transparent border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'
    };
    
    const errorStyles = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '';

    const filteredProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => !key.startsWith('onDrag'))
    );

    return (
      <motion.input
        ref={ref}
        className={cn(baseStyles, variants[variant], errorStyles, className)}
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.15 }}
        {...filteredProps}
      />
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onDrag'> {
  variant?: 'default' | 'filled' | 'outlined';
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = 'default', error = false, ...props }, ref) => {
    const baseStyles = 'flex min-h-[80px] w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 resize-none touch-manipulation';
    
    const variants = {
      default: 'bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500/20',
      filled: 'bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-blue-500/20',
      outlined: 'bg-transparent border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'
    };
    
    const errorStyles = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '';

    const filteredProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => !key.startsWith('onDrag'))
    );

    return (
      <motion.textarea
        ref={ref}
        className={cn(baseStyles, variants[variant], errorStyles, className)}
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.15 }}
        {...filteredProps}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
