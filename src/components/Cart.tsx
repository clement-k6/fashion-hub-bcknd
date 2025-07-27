import React, { useState } from 'react';
import { ShoppingCart, X, Plus, Minus, CreditCard, Truck, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import { toast } from '../hooks/use-toast';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Cart = ({ isOpen, onClose }: CartProps) => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // TODO: Connect to payment backend (Stripe)
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      // Backend connection point for payment processing
      console.log('Checkout initiated - connect to Stripe backend');
      console.log('Cart items:', cartItems);
      console.log('Total price:', getTotalPrice());
      
      // Example API call structure:
      // const response = await fetch('/api/create-payment-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     items: cartItems,
      //     total: getTotalPrice()
      //   })
      // });
      
      alert('Checkout functionality ready for backend integration!');
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleUpdateQuantity = (id: string, quantity: number, name: string) => {
    updateQuantity(id, quantity);
    toast({ title: 'Cart Updated', description: `Quantity for ${name} updated to ${quantity}` });
  };

  const handleRemoveFromCart = (id: string, name: string) => {
    removeFromCart(id);
    toast({ title: 'Removed from Cart', description: `${name} was removed from your cart.` });
  };

  const handleContinueShopping = () => {
    onClose();
    setTimeout(() => {
      const gridSection = document.getElementById('products-section');
      if (gridSection) {
        gridSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  if (!isOpen) return null;

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white/10 backdrop-blur-md border-l border-white/20">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="flex items-center gap-3">
              <ShoppingCart className="text-white" size={24} />
              <h2 className="text-xl font-semibold text-white">Shopping Cart</h2>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-300">
              <X size={24} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-400 text-lg">Your cart is empty</p>
                <p className="text-gray-500 text-sm mt-2">Add some products to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-sm">{item.name}</h3>
                        <p className="text-purple-300 text-xs mt-1">{item.category}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-white">${item.price}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.name)}
                              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-white font-semibold w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.name)}
                              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item.id, item.name)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-white/20 space-y-4">
              {/* Order Summary */}
              <div className="space-y-2 text-white">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Truck size={14} />
                    Shipping:
                  </span>
                  <span className={shipping === 0 ? 'text-green-400' : ''}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping === 0 ? (
                  <p className="text-xs text-green-400">Free shipping on orders over $50!</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-white/20 pt-2">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  <CreditCard size={16} className="mr-2" />
                  {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={clearCart}
                  className="w-full text-red-600 hover:text-white hover:bg-red-500/80"
                >
                  <Trash2 size={16} className="mr-2" />
                  Clear Cart
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleContinueShopping}
                  className="w-full text-primary hover:bg-primary/10"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
