
import React, { useState, useCallback, memo } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'landscape' | 'portrait';
  priority?: boolean;
  onLoad?: () => void;
  fallback?: string;
}

export const OptimizedImage = memo(({ 
  src, 
  alt, 
  className, 
  aspectRatio = 'square',
  priority = false,
  onLoad,
  fallback = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop'
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    setImageSrc(fallback);
  }, [fallback]);

  const aspectRatioClass = {
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]'
  }[aspectRatio];

  return (
    <div className={cn('relative overflow-hidden', aspectRatioClass, className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      )}
      
      <img
        src={imageSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'w-full h-full object-cover transition-all duration-500',
          isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100',
          hasError && 'grayscale'
        )}
      />
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
          Failed to load image
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';
