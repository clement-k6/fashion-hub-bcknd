
import React, { useState, useMemo, useCallback } from 'react';
import { ProductCard } from './ProductCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import { OptimizedImage } from './OptimizedImage';
import { Product } from '../contexts/CartContext';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  searchTerm?: string;
  selectedCategory?: string;
  sortBy?: 'name' | 'price' | 'rating';
  sortOrder?: 'asc' | 'desc';
  className?: string;
}

export const ProductGrid = ({ 
  products, 
  loading = false,
  searchTerm = '',
  selectedCategory = '',
  sortBy = 'name',
  sortOrder = 'asc',
  className 
}: ProductGridProps) => {
  const [imageLoadCount, setImageLoadCount] = useState(0);

  // Memoized filtered and sorted products for performance
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        (product.ProductName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.Description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.Category || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All Categories') {
      filtered = filtered.filter(product =>
        (product.Category || '').toLowerCase().trim() === selectedCategory.toLowerCase().trim()
      );
    }

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return sorted;
  }, [products, searchTerm, selectedCategory, sortBy, sortOrder]);

  const handleImageLoad = useCallback(() => {
    setImageLoadCount(prev => prev + 1);
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className={cn('w-full', className)}>
        <LoadingSkeleton variant="card" count={8} />
      </div>
    );
  }

  // Show empty state
  if (filteredAndSortedProducts.length === 0) {
    return (
      <div className={cn('w-full', className)}>
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-500 opacity-50"></div>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm 
              ? `No products match "${searchTerm}"` 
              : selectedCategory 
                ? `No products in "${selectedCategory}" category`
                : 'No products available'
            }
          </p>
          <div className="text-sm text-muted-foreground">
            Try adjusting your search or filter criteria
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Results header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary/10">
        <div className="text-sm text-muted-foreground">
          Showing {filteredAndSortedProducts.length} of {products.length} products
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory && selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </div>
        <div className="text-xs text-muted-foreground">
          {imageLoadCount > 0 && `${imageLoadCount} images loaded`}
        </div>
      </div>

      {/* Product grid with staggered animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedProducts.map((product, index) => (
          <div
            key={product.ProductID}
            className="fade-in-up hover-lift"
            style={{ 
              animationDelay: `${Math.min(index * 0.05, 0.5)}s`,
              animationFillMode: 'both'
            }}
          >
            <ProductCard 
              product={product} 
              onImageLoad={handleImageLoad}
              priority={index < 4} // Prioritize first 4 images
            />
          </div>
        ))}
      </div>

      {/* Load more indicator for future pagination */}
      {filteredAndSortedProducts.length > 12 && (
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 glass-morphism rounded-xl text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            All products loaded
          </div>
        </div>
      )}
    </div>
  );
};
