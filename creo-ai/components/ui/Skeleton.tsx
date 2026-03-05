'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag'> {
  variant?: 'default' | 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({ 
  className, 
  variant = 'default', 
  animation = 'pulse', 
  ...props 
}: SkeletonProps) {
  const variantStyles = {
    default: 'rounded-lg',
    text: 'rounded-md h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none'
  };

  const animationVariants = {
    pulse: {
      animate: {
        opacity: [0.4, 0.8, 0.4],
      },
      transition: {
        duration: 1.5,
        ease: [0.4, 0, 0.2, 1] as const,
        repeat: Infinity,
      }
    },
    wave: {
      animate: {
        x: ['-100%', '100%'],
      },
      transition: {
        duration: 1.2,
        ease: [0.4, 0, 0.2, 1] as const,
        repeat: Infinity,
      }
    },
    none: {}
  };

  const filteredProps = Object.fromEntries(
    Object.entries(props).filter(([key]) => !key.startsWith('onDrag'))
  );

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className={cn(
          'bg-gray-200',
          variantStyles[variant],
          className
        )}
        {...(animation !== 'none' && animationVariants[animation])}
        {...filteredProps}
      />
      
      {animation === 'wave' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.2,
            ease: [0.4, 0, 0.2, 1] as const,
            repeat: Infinity,
          }}
        />
      )}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-8 circular" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex items-center justify-between pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-8 circular" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 circular" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-8 circular" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
