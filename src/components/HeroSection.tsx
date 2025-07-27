
import React from 'react';
import { Button } from './ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 glass-morphism px-4 py-2 rounded-full text-sm text-primary">
                <Sparkles size={16} className="animate-pulse" />
                AI-Powered Fashion Discovery
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="text-gradient">Discover</span>
                <br />
                <span className="text-foreground">Your Perfect</span>
                <br />
                <span className="text-gradient">Style</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg">
                Experience fashion like never before with our AI-powered recommendations. 
                Find clothes that match your style, personality, and preferences.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="fashion-gradient text-white shadow-lg hover-lift px-8 py-6"
              >
                Shop Now
                <ArrowRight size={20} className="ml-2" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary text-primary hover:bg-accent px-8 py-6 hover-lift"
              >
                Explore AI Features
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">50K+</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">10K+</div>
                <div className="text-sm text-muted-foreground">Fashion Items</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">95%</div>
                <div className="text-sm text-muted-foreground">AI Accuracy</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-float">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop"
                alt="Fashion Model"
                className="w-full rounded-2xl shadow-2xl hover-lift"
              />
              
              {/* Floating AI Badge */}
              <div className="absolute top-6 right-6 glass-morphism px-4 py-2 rounded-full">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-primary font-medium">AI Styled</span>
                </div>
              </div>

              {/* Floating Recommendation Card */}
              <div className="absolute bottom-6 left-6 glass-morphism p-4 rounded-xl max-w-xs animate-scale-in">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=50&h=50&fit=crop"
                    alt="Recommended Item"
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">Perfect Match!</p>
                    <p className="text-xs text-muted-foreground">AI Recommendation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
