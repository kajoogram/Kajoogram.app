
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Label, Product } from '../types';
import ProductCard from './ProductCard';

interface LabelSectionProps {
  labels: Label[];
  products: Product[];
  isLoggedIn?: boolean;
}

const LabelSection: React.FC<LabelSectionProps> = ({ labels, products, isLoggedIn }) => {
  const navigate = useNavigate();

  return (
    <div className="py-4 space-y-10">
      {labels.map((label) => {
        // Filter products for this label
        const labelProducts = products.filter((p) => p.label === label.id);

        // Hide label block if no products exist
        if (labelProducts.length === 0) return null;

        return (
          <div key={label.id} className="space-y-4">
            {/* Label Banner */}
            <div className="px-6">
              <div 
                onClick={() => navigate(`/label/${label.id}`)}
                className="relative aspect-[16/9] w-full rounded-[24px] overflow-hidden shadow-md group cursor-pointer"
              >
                <img 
                  src={label.image} 
                  alt={label.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-5 left-5 text-white">
                  <h3 className="text-2xl font-serif font-bold tracking-wide drop-shadow-md">{label.title}</h3>
                  {label.subtitle && (
                    <p className="text-xs font-medium text-white/90 uppercase tracking-[2px] mt-1">{label.subtitle}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Horizontal Product List */}
            <div className="flex overflow-x-auto px-6 space-x-4 pb-4 snap-x scroll-smooth no-scrollbar">
              {labelProducts.slice(0, 8).map((prod) => (
                <div key={prod.id} className="w-[42%] shrink-0 snap-start">
                  <ProductCard product={prod} isLoggedIn={isLoggedIn} />
                </div>
              ))}
              {/* View All Card */}
              <div className="shrink-0 snap-start flex items-center justify-center">
                 <button 
                   onClick={() => navigate(`/label/${label.id}`)}
                   className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 uppercase tracking-widest active:scale-95 transition-all"
                 >
                   View All
                 </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LabelSection;
