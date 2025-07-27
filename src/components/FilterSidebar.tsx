
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterSidebarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: 'name' | 'price' | 'rating';
  onSortChange: (sortBy: 'name' | 'price' | 'rating') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
}

export const FilterSidebar = ({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
}: FilterSidebarProps) => {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Sort By</h3>
        <div className="space-y-2">
          {[
            { value: 'name', label: 'Name' },
            { value: 'price', label: 'Price' },
            { value: 'rating', label: 'Rating' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value as 'name' | 'price' | 'rating')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                sortBy === option.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Order */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Sort Order</h3>
        <div className="space-y-2">
          <button
            onClick={() => onSortOrderChange('asc')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              sortOrder === 'asc'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            Ascending
          </button>
          <button
            onClick={() => onSortOrderChange('desc')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              sortOrder === 'desc'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            Descending
          </button>
        </div>
      </div>
    </div>
  );
};
