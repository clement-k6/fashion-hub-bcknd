import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Minus, Plus, ArrowLeft, Truck, Shield, RotateCcw } from 'lucide-react';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { Cart } from '../components/Cart';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabaseClient';
import { Button } from '../components/ui/button';
import ProductReviews from '../components/ProductReviews';

// Utility to map Supabase product to Product interface
function mapSupabaseProduct(p: any) {
  return {
    id: String(p.ProductID),
    name: p.ProductName,
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

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('fashionhub')
        .select('*')
        .eq('ProductID', id)
        .single();
      setProduct(data);
        setLoading(false);
      }
    fetchProduct();
  }, [id]);

  useEffect(() => {
    console.log('URL id:', id);
    console.log('All ProductIDs:', product?.ProductID);
  }, [product, id]);

  if (loading) return <div>Loading...</div>;
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <Button onClick={() => navigate('/')} className="fashion-gradient">
            <ArrowLeft size={16} className="mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Navy', 'Gray', 'Brown'];
  const productImages = [product.image, product.image, product.image]; // Mock multiple images

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(mapSupabaseProduct(product));
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '-3s' }}></div>
      </div>

      <Header
        onCartClick={() => setIsCartOpen(true)}
        searchTerm=""
        onSearchChange={() => {}}
      />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 fade-in-up">
            <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">
              Home
            </button>
            <span>/</span>
            <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">
              {product.category}
            </button>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <div className="fade-in-up">
              <div className="aspect-square mb-4 rounded-2xl overflow-hidden bg-white/20 backdrop-blur-md border border-white/20">
                <img
                  src={productImages[activeImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="flex gap-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIndex === index ? 'border-primary' : 'border-white/20'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="glass-morphism p-8 rounded-2xl">
                {/* Product Title & Rating */}
                <div className="mb-6">
                  <p className="text-sm text-primary font-semibold uppercase tracking-wider mb-2">
                    {product.category}
                  </p>
                  <h1 className="text-3xl font-bold text-foreground mb-4">{product.ProductName}</h1>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={`transition-colors duration-200 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-300">
                      4.5 (0)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-3xl font-bold text-foreground">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <>
                        <span className="text-xl text-muted-foreground line-through">
                          ${product.originalPrice}
                        </span>
                        <span className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full">
                          -{discountPercentage}% OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Product Description */}
                <div className="mb-8">
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </div>

                {/* Size Selection */}
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-3">Size</h3>
                  <div className="flex gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-lg border-2 transition-all font-semibold ${
                          selectedSize === size
                            ? 'border-primary bg-primary text-white'
                            : 'border-border bg-background hover:border-primary'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-3">Color</h3>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          selectedColor === color
                            ? 'border-primary bg-primary text-white'
                            : 'border-border bg-background hover:border-primary'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity & Actions */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">Quantity:</span>
                    <div className="flex items-center border-2 border-border rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-accent transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-2 font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 hover:bg-accent transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 fashion-gradient text-white py-3 text-lg font-semibold"
                  >
                    <ShoppingCart size={20} className="mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => toggleWishlist(mapSupabaseProduct(product))}
                    variant="outline"
                    className={`p-3 ${
                      isInWishlist(product.id)
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    <Heart size={20} className={isInWishlist(product.id) ? 'fill-current' : ''} />
                  </Button>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Truck size={16} />
                    <span>Free shipping on orders over $50</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <RotateCcw size={16} />
                    <span>30-day return policy</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Shield size={16} />
                    <span>2-year warranty included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add reviews section below product info */}
          <ProductReviews productId={product.id} />

          {/* AI Recommendations Section */}
          {/* Removed AI Recommendations Section */}
        </div>
      </div>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default ProductDetail;