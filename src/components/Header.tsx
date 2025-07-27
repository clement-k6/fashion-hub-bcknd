import React, { useState } from 'react';
import { ShoppingCart, Heart, Menu, User, Star, LogOut } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { EnhancedSearch } from './EnhancedSearch';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import AuthModal from './AuthModal';
// import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onCartClick: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const Header = ({ onCartClick, searchTerm, onSearchChange }: HeaderProps) => {
  const { getTotalItems, wishlistItems } = useCart();
  // const { user, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass-morphism border-b border-primary/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg animate-glow">
              <Star className="text-white" size={20} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-gradient">FashionHub</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Fashion</p>
            </div>
          </div>

          {/* Enhanced Search Bar */}
          <div className="flex-1 max-w-lg mx-4">
            <EnhancedSearch
              value={searchTerm}
              onChange={onSearchChange}
              placeholder="Search fashion items..."
              showSuggestions={true}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 relative">
            {/* AI Status Indicator */}
            <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>AI Active</span>
            </div>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative text-primary hover:text-primary/80 transition-colors hover-lift p-2 rounded-full hover:bg-accent/50">
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative text-primary hover:text-primary/80 transition-colors hover-lift p-2 rounded-full hover:bg-accent/50"
            >
              <ShoppingCart size={20} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* User Account */}
            {/* {user ? ( */}
            {/*   <div className="relative"> */}
            {/*     <button */}
            {/*       className={`flex items-center gap-2 px-3 py-1 rounded-full ${user.avatarColor} text-white font-semibold shadow hover:opacity-90`} */}
            {/*       onClick={() => setDropdown(d => !d)} */}
            {/*       onBlur={() => setTimeout(() => setDropdown(false), 150)} */}
            {/*     > */}
            {/*       <span className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-lg bg-white/20 border border-white/30">{user.name[0]?.toUpperCase()}</span> */}
            {/*       <span className="hidden sm:block max-w-[80px] truncate">{user.name}</span> */}
            {/*     </button> */}
            {/*     {dropdown && ( */}
            {/*       <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-50 animate-fade-in"> */}
            {/*         <div className="px-4 py-2 text-gray-700 text-sm border-b">{user.email}</div> */}
            {/*         <button */}
            {/*           className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-gray-50 text-sm" */}
            {/*           onClick={() => { logout(); setDropdown(false); }} */}
            {/*         > */}
            {/*           <LogOut size={16} /> Logout */}
            {/*         </button> */}
            {/*       </div> */}
            {/*     )} */}
            {/*   </div> */}
            {/* ) : ( */}
              <Button 
                onClick={() => setAuthOpen(true)}
                size="sm"
                className="fashion-gradient hover:opacity-90 text-white shadow-lg hover-lift hidden sm:flex"
              >
                <User size={16} className="mr-2" />
                Account
              </Button>
            {/* )} */}

            {/* Mobile Menu Toggle */}
            <button className="sm:hidden text-primary hover:text-primary/80 transition-colors hover-lift p-2 rounded-full hover:bg-accent/50">
              <Menu size={20} />
            </button>
            <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
          </div>
        </div>
      </div>
    </header>
  );
};
