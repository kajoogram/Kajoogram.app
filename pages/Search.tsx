
import React, { useState } from 'react';
import { Search as SearchIcon, X, ArrowLeft, Filter } from 'lucide-react';
// Fix: Standardize useNavigate import from react-router-dom
import { useNavigate } from 'react-router-dom';

const Search: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const RecentSearch = ({ text }: { text: string }) => (
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50 last:border-none active:bg-slate-50 transition-colors">
      <span className="text-sm font-medium text-slate-600">{text}</span>
      <X size={16} className="text-slate-300" />
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center space-x-4 border-b border-slate-50">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-400 active:scale-95 transition-all">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 relative">
           <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
           <input 
             autoFocus
             type="text" 
             placeholder="Search Products..."
             className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-100"
             value={query}
             onChange={(e) => setQuery(e.target.value)}
           />
           {query && (
             <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
               <X size={16} />
             </button>
           )}
        </div>
        <button className="p-2 bg-slate-50 rounded-xl text-slate-400 active:scale-95 transition-all">
           <Filter size={20} />
        </button>
      </div>

      <div className="py-6">
        <div className="px-6 mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Recent Searches</h2>
          <button className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">Clear All</button>
        </div>
        
        <div className="bg-white">
          <RecentSearch text="Prada Leather Jacket" />
          <RecentSearch text="Summer Silk Dresses" />
          <RecentSearch text="Minimalist Watches" />
          <RecentSearch text="Gucci Accessories" />
        </div>
      </div>

      <div className="px-6 py-6">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6">Trending Categories</h2>
        <div className="grid grid-cols-2 gap-4">
          {['Nightwear', 'Evening Gowns', 'Workwear', 'Streetstyle'].map((cat) => (
            <div key={cat} className="aspect-[4/3] rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center p-4 relative group overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all">
               <div className="absolute inset-0 bg-gradient-to-tr from-sky-50 to-peach-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <span className="relative text-sm font-bold text-slate-700 tracking-tight">{cat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
