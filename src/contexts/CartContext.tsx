import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from '../hooks/use-toast';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  originalPrice?: number;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  wishlistItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  clearCart: () => void;
  removeFromWishlist: (productId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Utility to map Supabase product to Product interface
function mapSupabaseProduct(p: any) {
  return {
    id: String(p.ProductID || p.id),
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

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('wishlistItems');
    if (stored) {
      try {
        setWishlistItems(JSON.parse(stored));
      } catch {}
    }
  }, []);

  // Save wishlist to localStorage on change
  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const toggleWishlist = (product: Product) => {
    setWishlistItems(prev => {
      const mappedProduct = mapSupabaseProduct(product);
      const isInWishlist = prev.some(item => item.id === mappedProduct.id);
      if (isInWishlist) {
        toast({ title: 'Removed from Wishlist', description: `${mappedProduct.name} was removed from your wishlist.` });
        return prev.filter(item => item.id !== mappedProduct.id);
      }
      toast({ title: 'Added to Wishlist', description: `${mappedProduct.name} was added to your wishlist!` });
      return [...prev, mappedProduct];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        isInWishlist,
        getTotalPrice,
        getTotalItems,
        clearCart,
        removeFromWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
