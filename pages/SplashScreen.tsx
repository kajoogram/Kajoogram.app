
import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[999] bg-white flex items-center justify-center overflow-hidden">
      <div className="galaxy-bg absolute inset-0 opacity-40"></div>
      
      <div className="relative z-10 flex flex-col items-center space-y-5 animate-pulse">
        <div className="w-20 h-20 bg-gradient-to-br from-sky-300 to-lavender-300 rounded-[28%] flex items-center justify-center shadow-2xl shadow-sky-100 border border-white">
          <span className="text-white font-serif font-bold text-4xl italic">K</span>
        </div>
        <h1 className="font-instagram text-5xl text-instagram tracking-wide pb-1">Kajoogram</h1>
        <div className="w-1 h-1 bg-sky-200 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
