
import React from 'react';
import { Bell, Heart, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { appLogo } = useAppContext();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-50">
      <div className="flex items-center space-x-2.5">
        {appLogo ? (
          <img 
            src={appLogo} 
            alt="App Logo" 
            className="h-10 w-auto object-contain max-w-[150px]" 
          />
        ) : (
          <>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-300 to-lavender-300 flex items-center justify-center shadow-sm">
              <span className="text-white font-serif font-bold text-lg italic">K</span>
            </div>
            <span className="font-instagram text-3xl text-instagram pt-1">Kajoogram</span>
          </>
        )}
      </div>

      <div className="flex items-center space-x-5 text-slate-500">
        <button className="relative transition-transform active:scale-95">
          <Bell size={24} strokeWidth={1.5} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-peach-400 rounded-full border-2 border-white"></span>
        </button>
        <button onClick={() => navigate('/wishlist')} className="transition-transform active:scale-95">
          <Heart size={24} strokeWidth={1.5} />
        </button>
        <button className="transition-transform active:scale-95">
          <MessageCircle size={24} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
};

export default Header;
