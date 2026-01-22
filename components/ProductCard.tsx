import React, { useState } from 'react';
import { Product } from '../types';
import { ShoppingBag, Sparkles, ImageOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  isLoggedIn?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isLoggedIn = false }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);

  // -- Event Handlers --
  const handleTryNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      navigate('/auth');
    } else {
      navigate('/create');
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.affiliateLink) {
      window.open(product.affiliateLink, '_blank');
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // -- Image Source Logic --
  const displayImage = imgError || !product.image 
    ? 'https://via.placeholder.com/400x400?text=No+Image' 
    : product.image;

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-[20px] overflow-hidden shadow-sm border border-slate-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full flex flex-col"
    >
      {/* 1. IMAGE CONTAINER */}
      <div className="relative w-full h-[220px] bg-slate-100 shrink-0 overflow-hidden">
        {/* Loading Skeleton */}
        {imgLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 animate-pulse z-10">
            <Sparkles className="text-slate-200" size={24} />
          </div>
        )}

        {/* Fallback Icon */}
        {imgError && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 text-slate-300">
            <ImageOff size={24} />
          </div>
        )}

        {/* Main Image */}
        <img 
          src={displayImage} 
          alt={product.title} 
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setImgLoading(false)}
          onError={() => {
            setImgError(true);
            setImgLoading(false);
          }}
          loading="lazy"
        />

        {/* Platform Badge */}
        {product.platform && (
          <div className="absolute top-2 left-2 z-20">
            <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-[9px] font-bold text-slate-700 uppercase tracking-wider shadow-sm border border-white/50">
              {product.platform}
            </span>
          </div>
        )}

        {/* Discount Badge - Check strictly for > 0 */}
        {product.originalPrice !== undefined && product.originalPrice > product.price && (
          <div className="absolute bottom-2 right-2 z-20 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </div>
        )}
      </div>
      
      {/* 2. PRODUCT INFO */}
      <div className="p-3 flex flex-col flex-1 justify-between gap-3 bg-white">
        
        {/* Text Details */}
        <div className="flex flex-col gap-1">
          <h3 className="text-xs font-semibold text-slate-800 line-clamp-1 leading-snug" title={product.title}>
            {product.title}
          </h3>
          
          {/* Price Logic */}
          <div className="flex items-baseline gap-1.5">
            {product.price !== undefined && (
              <span className="text-sm font-bold text-slate-900">{formatINR(product.price)}</span>
            )}
            {/* Fix: Check strict greater than 0 to prevent rendering '0' */}
            {product.originalPrice !== undefined && product.originalPrice > 0 && (
              <span className="text-[10px] text-slate-400 line-through decoration-slate-400">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
        
        {/* Buttons Row */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button 
            onClick={handleBuyNow}
            className={`py-2 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-wide flex items-center justify-center space-x-1 transition-all active:scale-95 hover:bg-black ${!product.tryOnEnabled ? 'col-span-2' : ''}`}
          >
            <ShoppingBag size={12} />
            <span>Buy</span>
          </button>
          
          {product.tryOnEnabled && (
            <button 
              onClick={handleTryNow}
              className="py-2 bg-gradient-to-r from-sky-50 to-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg text-[10px] font-bold uppercase tracking-wide flex items-center justify-center space-x-1 transition-all active:scale-95 hover:shadow-sm"
            >
              <Sparkles size={12} />
              <span>Try</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;