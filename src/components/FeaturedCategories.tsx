import React from 'react';

const categories = [
  {
    name: 'All',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=400&fit=crop',
    count: 'All Items',
  },
  {
    name: "Women's Fashion",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop",
    count: "2.5K+ Items"
  },
  {
    name: "Men's Fashion",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    count: "1.8K+ Items"
  },
  {
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=400&fit=crop",
    count: "850+ Items"
  },
  {
    name: "Shoes",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop",
    count: "1.2K+ Items"
  },
];

interface FeaturedCategoriesProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  onCategoryClickScroll?: () => void;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ selectedCategory, onCategorySelect, onCategoryClickScroll }) => {
  return (
    <section className="py-16 bg-white/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-4xl font-bold text-gradient mb-4">Shop by Category</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our curated collections powered by AI insights and trending fashion data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => {
            // Map display names to filter values
            let filterValue = category.name;
            if (filterValue === "Women's Fashion") filterValue = 'Women';
            if (filterValue === "Men's Fashion") filterValue = 'Men';
            if (filterValue === 'All') filterValue = 'All';
            const isActive = selectedCategory === filterValue || (selectedCategory === 'All' && filterValue === 'All');
            return (
              <div
                key={category.name}
                className={`group cursor-pointer animate-scale-in hover-lift border-2 transition-all duration-300 rounded-2xl relative overflow-hidden shadow-lg
                  ${isActive ? 'border-primary scale-105 shadow-xl ring-2 ring-primary/30' : 'border-transparent'}
                  hover:shadow-2xl hover:scale-105
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => {
                  onCategorySelect(filterValue);
                  if (onCategoryClickScroll) onCategoryClickScroll();
                }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{category.name === 'All' ? 'All Categories' : category.name}</h3>
                  <p className="text-sm opacity-90">{category.count}</p>
                </div>
                {category.name !== 'All' && (
                  <div className="absolute top-4 right-4 glass-morphism px-3 py-1 rounded-full">
                    <span className="text-xs text-white font-medium">AI Curated</span>
                  </div>
                )}
                {isActive && (
                  <div className="absolute inset-0 bg-primary/20 pointer-events-none animate-pulse rounded-2xl" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
