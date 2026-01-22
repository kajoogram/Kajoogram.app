
import React from 'react';
import Footer from '../components/Footer';
import { Heart, MessageCircle, Share2, Music } from 'lucide-react';

const Reels: React.FC = () => {
  return (
    <div className="bg-white min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
         {/* Simulate a full screen video player */}
         <img src="https://picsum.photos/id/1012/800/1400" className="w-full h-full object-cover opacity-60" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>

      <div className="absolute bottom-32 left-6 right-20 space-y-4 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md p-0.5 border border-white/40">
            <div className="w-full h-full rounded-full bg-slate-400 overflow-hidden">
               <img src="https://picsum.photos/id/1025/100/100" />
            </div>
          </div>
          <span className="font-bold text-sm tracking-wide">@style_luxury</span>
          <button className="px-4 py-1.5 border border-white rounded-full text-[10px] font-bold uppercase tracking-widest">Follow</button>
        </div>
        <p className="text-xs font-light leading-relaxed">
           Winter layering essential guide. Stay chic, stay warm. #LuxuryFashion #WinterTrends
        </p>
        <div className="flex items-center space-x-2 text-[10px] font-medium bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full w-fit">
           <Music size={12} />
           <span className="truncate max-w-[120px]">Original Audio - Luxe Beats</span>
        </div>
      </div>

      <div className="absolute bottom-32 right-4 flex flex-col items-center space-y-6">
        <button className="flex flex-col items-center space-y-1">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 active:scale-90 transition-all">
            <Heart size={24} className="text-white" />
          </div>
          <span className="text-[10px] text-white font-bold">12.4K</span>
        </button>
        <button className="flex flex-col items-center space-y-1">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 active:scale-90 transition-all">
            <MessageCircle size={24} className="text-white" />
          </div>
          <span className="text-[10px] text-white font-bold">852</span>
        </button>
        <button className="flex flex-col items-center space-y-1">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 active:scale-90 transition-all">
            <Share2 size={24} className="text-white" />
          </div>
          <span className="text-[10px] text-white font-bold">Share</span>
        </button>
        <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 p-1 animate-spin-slow">
           <img src="https://picsum.photos/id/103/50/50" className="w-full h-full rounded-md object-cover" />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Reels;
