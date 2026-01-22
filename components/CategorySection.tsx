
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategoryContext } from '../context/CategoryContext';

const CategorySection: React.FC = () => {
  const navigate = useNavigate();
  const { categories } = useCategoryContext();

  return (
    <div className="py-6 animate-in fade-in slide-in-from-bottom duration-700 delay-100">
      <h2 className="text-lg font-medium text-slate-400 tracking-wide mb-5 pl-6">
        Categories
      </h2>
      
      <div className="flex overflow-x-auto px-6 space-x-5 pb-8 snap-x scroll-smooth no-scrollbar">
        {categories.map((cat) => (
          <button 
            key={cat.id}
            onClick={() => navigate(`/category/${cat.id}`)}
            className="flex flex-col items-center space-y-3 group cursor-pointer snap-start min-w-[100px] transition-transform active:scale-95 outline-none"
          >
            <div className="relative w-[100px] h-[100px] rounded-[24px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:shadow-[0_15px_35px_rgb(0,0,0,0.08)] border border-slate-50 overflow-hidden transition-all duration-300">
              <img 
                src={cat.image} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt={cat.name} 
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <span className="text-sm font-medium text-slate-600 text-center leading-tight tracking-wide group-hover:text-slate-800 transition-colors">
              {cat.name}
            </span>
          </button>
        ))}
        {/* Padding spacer for end of list */}
        <div className="w-1 shrink-0"></div>
      </div>
    </div>
  );
};

export default CategorySection;
