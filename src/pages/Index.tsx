import React, { useEffect, useState, useMemo } from 'react';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { ProductGrid } from '../components/ProductGrid';
import { FilterSidebar } from '../components/FilterSidebar';
import { FeaturedCategories } from '../components/FeaturedCategories';
import { Cart } from '../components/Cart';
import { Button } from '../components/ui/button';
import { Filter, X } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { supabase } from '../lib/supabaseClient';
import ChatbotWidget from '../components/ChatbotWidget';

function getProductCategory(product: any): string {
  const name = (product.ProductName || '').toLowerCase();
  const desc = (product.Description || '').toLowerCase();
  const gender = (product.Gender || '').toLowerCase();

  // Shoes category
  if (name.includes('shoe') || name.includes('sneaker') || desc.includes('shoe') || desc.includes('sneaker')) {
    return 'Shoes';
  }

  // Gender-based categories
  if (gender === 'men' || gender === 'male' || gender === 'boys' || gender === 'boy') return 'Men';
  if (gender === 'women' || gender === 'female' || gender === 'girls' || gender === 'girl') return 'Women';
  if (gender === 'unisex') return 'Unisex';

  // Default to Accessories
  return 'Accessories';
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState<string[]>(['All Categories']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('fashionhub')
        .select('*');
      if (error) {
        setError(true);
        setLoading(false);
        return;
      }
      // Assign categories
      const productsWithCategory = data.map((p: any) => ({
        ...p,
        Category: getProductCategory(p)
      }));
      setProducts(productsWithCategory);

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(productsWithCategory.map((p: any) => p.Category))
      );
      setCategories(['All Categories', ...uniqueCategories]);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Memoize filtered products count for performance
  const filteredProductsCount = useMemo(() => {
    let filtered = products;
    
    if (searchTerm) {
      filtered = filtered.filter(product =>
        (product.ProductName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.Description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.Category || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory && selectedCategory !== 'All Categories') {
      filtered = filtered.filter(
        product =>
          (product.Category || '').toLowerCase().trim() === selectedCategory.toLowerCase().trim()
      );
    }
    
    return filtered.length;
  }, [searchTerm, selectedCategory]);

  // Get recommended products (featured or random)
  const recommendedProducts = useMemo(() => {
    const featured = products.filter(p => p.isFeatured);
    if (featured.length >= 4) return featured.slice(0, 4);
    // Fill with random products if not enough featured
    const others = products.filter(p => !p.isFeatured);
    while (featured.length < 4 && others.length > 0) {
      const idx = Math.floor(Math.random() * others.length);
      featured.push(others.splice(idx, 1)[0]);
    }
    return featured.slice(0, 4);
  }, []);

  const handleCategorySelect = (category: string) => {
    // Normalize 'All Categories' and 'All' to 'All'
    const normalized = category === 'All Categories' ? 'All' : category;
    setSelectedCategory(normalized);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('name');
    setSortOrder('asc');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'All' || sortBy !== 'name' || sortOrder !== 'asc';

  // Smooth scroll to product grid
  const handleCategoryClickScroll = () => {
    const gridSection = document.getElementById('products-section');
    if (gridSection) {
      gridSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Failed to load products. Please try again later.</div>;
  if (!Array.isArray(products)) return <div>No products available.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '-3s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300/10 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float" style={{ animationDelay: '-6s' }}></div>
      </div>

      <Header
        onCartClick={() => setIsCartOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <main className="pt-20">
        {/* Hero Section */}
        <HeroSection />

        {/* Featured Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <FeaturedCategories selectedCategory={selectedCategory} onCategorySelect={handleCategorySelect} onCategoryClickScroll={handleCategoryClickScroll} />
          </div>
        </section>

        {/* Recommended for you */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gradient mb-6">Recommended for you</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {recommendedProducts.map(product => (
                <ProductCard key={product.ProductID} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16" id="products-section">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gradient">Our Products</h2>
                  <Button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    variant="outline"
                    size="sm"
                    className="border-primary/20 hover:bg-accent"
                  >
                    <Filter size={16} className="mr-2" />
                    Filters
                    {hasActiveFilters && (
                      <span className="ml-2 w-2 h-2 bg-primary rounded-full"></span>
                    )}
                  </Button>
                </div>

                {/* Mobile Filter Panel */}
                {isFilterOpen && (
                  <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
                    <div className="absolute right-0 top-0 h-full w-80 bg-background border-l border-border shadow-xl">
                      <div className="p-4 border-b border-border">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">Filters</h3>
                          <button
                            onClick={() => setIsFilterOpen(false)}
                            className="p-2 hover:bg-accent rounded-full"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <FilterSidebar
                          categories={categories}
                          selectedCategory={selectedCategory === 'All' ? 'All Categories' : selectedCategory}
                          onCategoryChange={handleCategorySelect}
                          sortBy={sortBy}
                          onSortChange={setSortBy}
                          sortOrder={sortOrder}
                          onSortOrderChange={setSortOrder}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Sidebar */}
              <div className="hidden lg:block lg:w-64 flex-shrink-0">
                <div className="sticky top-24">
                  <div className="glass-morphism p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-foreground">Filters</h3>
                      {hasActiveFilters && (
                        <Button
                          onClick={clearFilters}
                          variant="ghost"
                          size="sm"
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          Clear All
                        </Button>
                      )}
                    </div>
                    <FilterSidebar
                      categories={categories}
                      selectedCategory={selectedCategory === 'All' ? 'All Categories' : selectedCategory}
                      onCategoryChange={handleCategorySelect}
                      sortBy={sortBy}
                      onSortChange={setSortBy}
                      sortOrder={sortOrder}
                      onSortOrderChange={setSortOrder}
                    />
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              <div className="flex-1">
                <div className="hidden lg:flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gradient">Our Products</h2>
                  {hasActiveFilters && (
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      size="sm"
                      className="border-primary/20 hover:bg-accent"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>

                <ProductGrid
                  products={products}
                  loading={isLoading}
                  searchTerm={searchTerm}
                  selectedCategory={selectedCategory}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <ChatbotWidget />
    </div>
  );
};

export default Index;
