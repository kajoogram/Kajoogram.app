
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProductContext } from '../context/ProductContext';
import { useLabelContext } from '../context/LabelContext';

interface LabelPageProps {
  isLoggedIn?: boolean;
}

const LabelPage: React.FC<LabelPageProps> = ({ isLoggedIn = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProductContext();
  const { labels } = useLabelContext();

  const label = labels.find(l => l.id === id);

  const labelProducts = useMemo(() => {
    if (!label) return [];
    return products.filter(p => p.label === label.id);
  }, [label, products]);

  if (!label) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-slate-300">Label Not Found</h2>
        <button onClick={() => navigate(-1)} className="text-sm font-bold text-slate-800 border-b border-slate-800 pb-0.5">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-10">
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl px-6 py-4 flex items-center space-x-4 border-b border-slate-50 transition-all">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-full transition-all active:scale-90">
          <ArrowLeft size={24} strokeWidth={1.5} />
        </button>
        <h1 className="text-xl font-serif font-bold text-slate-800 tracking-tight">{label.title}</h1>
      </div>

      <div className="relative aspect-[21/9] w-full bg-slate-100 mb-6">
        <img src={label.image} className="w-full h-full object-cover" alt={label.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-4 left-6 text-white">
           <h2 className="text-2xl font-serif font-bold">{label.title}</h2>
           <p className="text-xs font-medium uppercase tracking-widest opacity-90">{label.subtitle}</p>
        </div>
      </div>

      <div className="px-6">
        <div className="mb-6 flex items-center justify-between">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{labelProducts.length} Collections</span>
           <button className="text-xs font-bold text-slate-800 uppercase tracking-widest">Sort By</button>
        </div>

        {labelProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 animate-in fade-in slide-in-from-bottom duration-700">
            {labelProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 animate-in zoom-in duration-500">
            <ShoppingBag size={32} className="text-slate-300" strokeWidth={1} />
            <h3 className="text-lg font-serif font-bold text-slate-800">No items yet</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabelPage;
