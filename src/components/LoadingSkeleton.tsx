
import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'product' | 'card' | 'list' | 'hero';
  count?: number;
}

export const LoadingSkeleton = ({ variant = 'card', count = 1 }: LoadingSkeletonProps) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div key={index} className="animate-pulse">
      {variant === 'product' && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 space-y-4">
          <div className="aspect-square bg-gray-300 rounded-xl"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      )}
      
      {variant === 'card' && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden">
          <div className="aspect-square bg-gray-300"></div>
          <div className="p-4 space-y-3">
            <div className="h-3 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      )}
      
      {variant === 'list' && (
        <div className="flex gap-4 p-4">
          <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      )}
      
      {variant === 'hero' && (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="h-12 bg-gray-300 rounded w-3/4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          </div>
          <div className="flex gap-4">
            <div className="h-12 bg-gray-300 rounded w-32"></div>
            <div className="h-12 bg-gray-300 rounded w-40"></div>
          </div>
        </div>
      )}
    </div>
  ));

  return variant === 'card' ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {skeletons}
    </div>
  ) : (
    <>{skeletons}</>
  );
};
