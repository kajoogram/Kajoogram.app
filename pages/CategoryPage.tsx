
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProductContext } from '../context/ProductContext';
import { useCategoryContext } from '../context/CategoryContext';

interface CategoryPageProps {
  isLoggedIn?: boolean;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ isLoggedIn = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProductContext();
  const { categories } = useCategoryContext();

  // Find the category object based on the URL parameter (Dynamic)
  const category = categories.find(c => c.id === id);

  // Filter products that belong to this category
  const categoryProducts = useMemo(() => {
    if (!category) return [];
    return products.filter(p => p.category === category.name);
  }, [category, products]);

  if (!category) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-slate-300">Category Not Found</h2>
        <button 
          onClick={() => navigate(-1)}
          className="text-sm font-bold text-slate-800 border-b border-slate-800 pb-0.5"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl px-6 py-4 flex items-center space-x-4 border-b border-slate-50 transition-all">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-full transition-all active:scale-90"
        >
          <ArrowLeft size={24} strokeWidth={1.5} />
        </button>
        <h1 className="text-xl font-serif font-bold text-slate-800 tracking-tight">{category.name}</h1>
      </div>

      <div className="p-6">
        <div className="mb-8 flex items-center justify-between">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{categoryProducts.length} Items</span>
           <button className="text-xs font-bold text-slate-800 uppercase tracking-widest">Sort By</button>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 animate-in fade-in slide-in-from-bottom duration-700">
            {categoryProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 animate-in zoom-in duration-500">
            <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-2">
              <ShoppingBag size={32} className="text-slate-300" strokeWidth={1} />
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-800">No products available</h3>
            <p className="text-sm text-slate-400 max-w-[200px]">
              We are curating new items for the {category.name} collection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
