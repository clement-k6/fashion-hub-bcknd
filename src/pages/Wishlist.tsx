import React from 'react';
import { useCart } from '../contexts/CartContext';
import { ProductCard } from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Wishlist: React.FC = () => {
  const { wishlistItems } = useCart();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-12">
      {/* Hero Banner */}
      <section className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 py-12 mb-10 rounded-b-3xl shadow-lg animate-fade-in">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart size={40} className="text-white animate-pulse drop-shadow-lg" fill="#fff" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2 drop-shadow">Your Wishlist</h1>
          <p className="text-lg text-white/90 mb-2">All your favorite products in one place. Add them to your cart or keep browsing for more inspiration!</p>
          <Link to="/" className="inline-block mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full shadow transition">← Back to Shop</Link>
        </div>
      </section>
      <div className="container mx-auto px-4">
        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <Heart size={64} className="text-pink-400 mb-6 animate-bounce" fill="#f472b6" />
            <div className="text-2xl font-semibold text-gray-500 mb-2">Your wishlist is empty.</div>
            <p className="text-gray-400 mb-6">Start adding products you love and they'll show up here!</p>
            <Link to="/" className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-full shadow hover:from-purple-600 hover:to-indigo-600 transition">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-fade-in">
            {wishlistItems.map(product => (
              <ProductCard key={product.id} product={product} showRemoveFromWishlist showAddToCart />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist; 