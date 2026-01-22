import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Sparkles, Heart, Share2, MapPin } from 'lucide-react';
import { useProductContext } from '../context/ProductContext';
import Footer from '../components/Footer';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProductContext();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const product = products.find(p => p.id === id);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/home');
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-slate-300">Product Not Found</h2>
        <button onClick={handleBack} className="text-sm font-bold text-slate-800 border-b border-black">Go Back</button>
      </div>
    );
  }

  // Ensure we have an array of images; fallback to main image if gallery is empty
  const displayImages = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.offsetWidth;
    const index = Math.round(scrollLeft / width);
    setCurrentImageIndex(index);
  };

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-32">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-100 shadow-sm">
        <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-all active:scale-90">
          <ArrowLeft size={24} className="text-slate-800" />
        </button>
        <span className="font-bold text-slate-800 truncate px-4">{product.title}</span>
        <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Share2 size={22} className="text-slate-800" />
        </button>
      </div>

      {/* Advanced Image Gallery - 9:16 Full Cover Layout */}
      <div className="bg-white">
        <div className="relative w-full aspect-[9/16] bg-slate-100 overflow-hidden">
          {/* Gallery Track */}
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex h-full overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
          >
            {displayImages.length > 0 ? (
              displayImages.map((img, idx) => (
                <div key={idx} className="w-full h-full shrink-0 snap-center relative">
                  {/* Image strictly covers the container */}
                  <img 
                    src={img} 
                    alt={`${product.title} ${idx + 1}`} 
                    className="w-full h-full object-cover block"
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                </div>
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <span>No Image Available</span>
              </div>
            )}
          </div>

          {/* Image Counter Badge */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-6 right-6 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-full border border-white/20 pointer-events-none">
              {currentImageIndex + 1} / {displayImages.length}
            </div>
          )}

          {/* Dots Indicator */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-1.5 pointer-events-none">
              {displayImages.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${currentImageIndex === i ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="p-6 bg-white space-y-6 animate-in slide-in-from-bottom duration-500">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-500 uppercase tracking-widest">{product.platform}</span>
            <div className="flex items-center space-x-1 text-slate-400">
              <ShoppingBag size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Premium Selection</span>
            </div>
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 leading-tight">{product.title}</h1>
          
          <div className="flex items-center space-x-3 pt-1">
            {product.price !== undefined && (
              <span className="text-2xl font-bold text-slate-900">{formatINR(product.price)}</span>
            )}
            
            {/* Discount Logic */}
            {product.originalPrice !== undefined && product.originalPrice > 0 && (
              <>
                <span className="text-sm text-slate-400 line-through">{formatINR(product.originalPrice)}</span>
                <span className="text-sm font-bold text-red-500">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex space-x-3">
          <button 
            onClick={() => window.open(product.affiliateLink, '_blank')}
            className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-[2px] text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            <ShoppingBag size={18} />
            <span>Buy Now</span>
          </button>
          
          {product.tryOnEnabled && (
            <button 
              onClick={() => navigate('/create')}
              className="flex-1 py-4 bg-gradient-to-r from-sky-100 to-lavender-100 text-slate-700 rounded-2xl font-bold uppercase tracking-[2px] text-xs active:scale-95 transition-all flex items-center justify-center space-x-2 border border-white shadow-sm"
            >
              <Sparkles size={18} className="text-sky-500" />
              <span>Try On</span>
            </button>
          )}

          <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl active:scale-95 transition-all border border-slate-100">
            <Heart size={20} />
          </button>
        </div>

        <div className="h-px bg-slate-100 w-full"></div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Description</h3>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
            {product.description || "Experience the epitome of luxury with this exquisitely crafted item. Designed for those who appreciate fine detail and premium quality. Perfect for any occasion."}
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm">
            <MapPin size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Available Platform</p>
            <p className="text-sm font-bold text-slate-800">{product.platform}</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;