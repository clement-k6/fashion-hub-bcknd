import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, X } from 'lucide-react';
import { Product, useCart } from '../contexts/CartContext';
import { OptimizedImage } from './OptimizedImage';
import { Button } from './ui/button';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onImageLoad?: () => void;
  priority?: boolean;
  showRemoveFromWishlist?: boolean;
  showAddToCart?: boolean;
}

// Utility to map Supabase product to Product interface
function mapSupabaseProduct(p: any) {
  return {
    id: String(p.ProductID),
    name: p.name || p.ProductName,
    price: p["Price (INR)"] || p.price,
    image: p.Image || p.image,
    category: p.Category || p.category,
    description: p.Description || p.description,
    rating: p.rating || 4.5,
    reviews: p.reviews || 0,
    originalPrice: p.originalPrice,
    isNew: p.isNew,
    isFeatured: p.isFeatured
  };
}

export const ProductCard = ({ product, onImageLoad, priority = false, showRemoveFromWishlist = false, showAddToCart = true }: any) => {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, removeFromWishlist } = useCart();

  // Always use mapped product fields for display
  const mapped = mapSupabaseProduct(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(mapped);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(mapped);
  };

  const handleRemoveFromWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromWishlist(mapped.id);
  };

  const handleProductClick = () => {
    navigate(`/product/${mapped.id}`);
  };

  // No discount/originalPrice in backend, so skip discount logic

  return (
    <div 
      onClick={handleProductClick}
      className="group relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl cursor-pointer will-change-transform"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100">
        <OptimizedImage
          src={mapped.image || '/placeholder.svg'}
          alt={mapped.name}
          aspectRatio="square"
          priority={priority}
          onLoad={onImageLoad}
          className="transition-transform duration-500 group-hover:scale-110"
        />
        {/* No badges for isNew/discount, as not in backend */}
        {/* Wishlist Button */}
        {showRemoveFromWishlist ? (
          <button
            onClick={handleRemoveFromWishlist}
            className="absolute top-3 right-3 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-300 hover-lift z-10"
            title="Remove from Wishlist"
          >
            <X size={16} />
          </button>
        ) : (
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 hover-lift z-20 ${
              isInWishlist(mapped.id)
                ? 'bg-red-500 text-white scale-110'
                : 'bg-white/20 text-gray-700 hover:bg-white/40'
            }`}
            title={isInWishlist(mapped.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart size={16} className={isInWishlist(mapped.id) ? 'fill-current' : ''} />
          </button>
        )}
        {/* Quick Add Button */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            onClick={handleAddToCart}
            className="bg-white text-black hover:bg-gray-100 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover-lift"
          >
            <ShoppingCart size={16} className="mr-2" />
            Quick Add
          </Button>
        </div>
      </div>
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider">
          {mapped.category}
        </p>
        {/* Title */}
        <h3 className="text-gray-900 font-semibold text-lg leading-tight group-hover:text-purple-600 transition-colors line-clamp-2">
          {mapped.name}
        </h3>
        {/* Rating (not in backend, so use default) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={`transition-colors duration-200 ${
                  i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-400'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-300">
            4.5 (0)
          </span>
        </div>
        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">
            ₹{mapped.price}
          </span>
        </div>
        {/* Add to Cart Button */}
        {showAddToCart && (
          <Button
            onClick={e => {
              handleAddToCart(e);
              // Animate button bounce
              const btn = e.currentTarget;
              btn.classList.remove('animate-bounce-fast');
              void btn.offsetWidth; // force reflow
              btn.classList.add('animate-bounce-fast');
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all duration-300 hover-lift"
          >
            <ShoppingCart size={16} className="mr-2" />
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  );
};
