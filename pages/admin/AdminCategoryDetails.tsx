
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { useCategoryContext } from '../../context/CategoryContext';
import { useProductContext } from '../../context/ProductContext';

const AdminCategoryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories } = useCategoryContext();
  const { products, updateProduct } = useProductContext();

  const category = categories.find(c => c.id === id);

  if (!category) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <p className="text-slate-500">Category not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 font-bold">Go Back</button>
      </div>
    );
  }

  // Filter products matching category NAME (since Product.category stores the name)
  const categoryProducts = products.filter(p => p.category === category.name);

  const removeProductFromCategory = (product: any) => {
    // Set category to 'Uncategorized' or just an empty string/different bucket. 
    // Since 'category' is a string field, we'll set it to 'Uncategorized'
    updateProduct({
      ...product,
      category: 'Uncategorized'
    });
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-50 sticky top-0 z-40">
         <div className="flex items-center space-x-4">
           <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors">
             <ArrowLeft size={24} className="text-slate-800" />
           </button>
           <h1 className="font-serif font-bold text-lg text-slate-800">
             {category.name} Products
           </h1>
         </div>
         <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{categoryProducts.length} ITEMS</div>
      </div>

      <div className="p-6 space-y-4">
        {categoryProducts.length > 0 ? (
          categoryProducts.map(prod => (
            <div key={prod.id} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
               <div className="w-16 h-16 rounded-xl bg-slate-100 shrink-0 overflow-hidden border border-slate-50">
                  <img src={prod.image} className="w-full h-full object-cover" alt={prod.title} />
               </div>
               <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-800 truncate">{prod.title}</h3>
                  <p className="text-xs text-slate-400 truncate">ID: {prod.id}</p>
               </div>
               <button 
                 onClick={() => removeProductFromCategory(prod)}
                 className="p-2 bg-red-50 text-red-500 rounded-lg active:scale-90 transition-transform"
                 title="Remove from Category"
               >
                 <X size={16} />
               </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-2">
             <p className="text-sm">No products in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategoryDetails;
