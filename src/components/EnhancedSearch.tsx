
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchSuggestion {
  id: string;
  term: string;
  category?: string;
  trending?: boolean;
}

interface EnhancedSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
}

export const EnhancedSearch = ({ 
  value, 
  onChange, 
  placeholder = "Search fashion items...",
  className,
  showSuggestions = true
}: EnhancedSearchProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Mock suggestions - in real app, this would come from API
  const mockSuggestions: SearchSuggestion[] = [
    { id: '1', term: 'summer dresses', category: 'Dresses', trending: true },
    { id: '2', term: 'casual sneakers', category: 'Shoes' },
    { id: '3', term: 'vintage jackets', category: 'Outerwear', trending: true },
    { id: '4', term: 'minimalist jewelry', category: 'Accessories' },
    { id: '5', term: 'comfortable jeans', category: 'Bottoms' },
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Debounced search suggestions
  const debouncedSearch = useCallback((searchTerm: string) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (searchTerm.length > 0) {
        const filtered = mockSuggestions.filter(s => 
          s.term.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSuggestions(filtered);
      } else {
        setSuggestions([]);
      }
    }, 150);
  }, []);

  useEffect(() => {
    debouncedSearch(value);
    return () => clearTimeout(debounceRef.current);
  }, [value, debouncedSearch]);

  const handleSearchSelect = (searchTerm: string) => {
    onChange(searchTerm);
    setIsFocused(false);
    
    // Add to recent searches
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const clearSearch = () => {
    onChange('');
    searchRef.current?.focus();
  };

  const showDropdown = isFocused && showSuggestions;
  const hasContent = value.length > 0;
  const displaySuggestions = hasContent ? suggestions : [];
  const displayRecent = !hasContent && recentSearches.length > 0;

  return (
    <div className={cn('relative w-full max-w-md', className)}>
      <div className={cn(
        'relative transition-all duration-300',
        isFocused && 'transform scale-105'
      )}>
        <Search className={cn(
          'absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200',
          isFocused ? 'text-primary' : 'text-muted-foreground'
        )} size={20} />
        
        <input
          ref={searchRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          className={cn(
            'w-full pl-10 pr-10 py-3 glass-morphism border-2 rounded-xl transition-all duration-300',
            'text-foreground placeholder-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary/20',
            isFocused 
              ? 'border-primary shadow-lg shadow-primary/10' 
              : 'border-primary/20 hover:border-primary/40'
          )}
        />
        
        {hasContent && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-accent"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-morphism border border-primary/20 rounded-xl overflow-hidden z-50 shadow-xl animate-scale-in">
          {displaySuggestions.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-primary/10">
                Suggestions
              </div>
              {displaySuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSearchSelect(suggestion.term)}
                  className="w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors flex items-center gap-3 group"
                >
                  <Search size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{suggestion.term}</span>
                      {suggestion.trending && (
                        <TrendingUp size={12} className="text-green-500" />
                      )}
                    </div>
                    {suggestion.category && (
                      <div className="text-xs text-muted-foreground">in {suggestion.category}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {displayRecent && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-primary/10">
                Recent Searches
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearchSelect(search)}
                  className="w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors flex items-center gap-3 group"
                >
                  <Clock size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-sm">{search}</span>
                </button>
              ))}
            </div>
          )}
          
          {!displaySuggestions.length && !displayRecent && hasContent && (
            <div className="px-4 py-8 text-center text-muted-foreground">
              <Search size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No suggestions found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
