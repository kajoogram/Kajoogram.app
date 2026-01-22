
import React, { useState } from 'react';
import Footer from '../components/Footer';
import { ShoppingBag, PlayCircle, Sparkles, Heart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'products' | 'posts' | 'try-on'>('products');

  const EmptyState = ({ icon: Icon, message }: any) => (
    <div className="flex flex-col items-center justify-center py-20 px-10 text-center space-y-4">
      <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
        <Icon size={40} strokeWidth={1} />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-serif font-bold text-slate-800">No {activeTab} yet</h3>
        <p className="text-sm text-slate-400">Items you {activeTab === 'products' ? 'wishlist' : 'like'} will appear here.</p>
      </div>
      <button className="px-8 py-3 bg-slate-900 text-white rounded-full text-xs font-bold tracking-widest uppercase shadow-lg shadow-slate-100 active:scale-95 transition-all">
        Explore Collection
      </button>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-32">
      {/* Custom Header with Back Button */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-full transition-all active:scale-90"
          >
            <ArrowLeft size={24} strokeWidth={1.5} />
          </button>
          <div className="flex items-center space-x-2">
             <Heart size={20} className="text-peach-400" fill="currentColor" />
             <h1 className="text-xl font-serif font-bold text-slate-800">My Favorites</h1>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-6 space-y-6">
        <div className="flex p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
          {[
            { id: 'products', label: 'Products', icon: ShoppingBag },
            { id: 'posts', label: 'Posts', icon: PlayCircle },
            { id: 'try-on', label: 'Try On', icon: Sparkles }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 flex items-center justify-center space-x-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
                activeTab === tab.id ? 'bg-white shadow-sm text-slate-800 ring-1 ring-slate-100' : 'text-slate-400'
              }`}
            >
              <tab.icon size={14} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {activeTab === 'products' ? (
             <EmptyState icon={ShoppingBag} />
          ) : activeTab === 'posts' ? (
             <EmptyState icon={PlayCircle} />
          ) : (
             <EmptyState icon={Sparkles} />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;
