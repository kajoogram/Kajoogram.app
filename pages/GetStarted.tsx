
import React from 'react';
// Fix: Standardize useNavigate import from react-router-dom
import { useNavigate } from 'react-router-dom';

const GetStarted: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-between p-10 overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-sky-50 rounded-full blur-[80px] opacity-60"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-peach-50 rounded-full blur-[80px] opacity-60"></div>

      <div className="mt-20 flex flex-col items-center text-center space-y-6 relative z-10">
        <div className="w-24 h-24 bg-gradient-to-tr from-white to-slate-50 rounded-full flex items-center justify-center shadow-lg border border-slate-100">
          <span className="text-sky-300 font-serif font-bold text-5xl italic">K</span>
        </div>
        <div className="space-y-2 flex flex-col items-center">
          <h1 className="font-instagram text-6xl text-instagram tracking-wide pb-1">Kajoogram</h1>
          <p className="text-slate-400 text-lg font-light tracking-wide px-4">Elevate your style with premium social commerce.</p>
        </div>
      </div>

      <div className="w-full relative z-10 mb-10">
        <button 
          onClick={() => navigate('/auth')}
          className="w-full py-5 rounded-full bg-white border border-transparent shadow-xl shadow-slate-200 relative group overflow-hidden transition-all active:scale-95"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-sky-400/5 via-lavender-400/5 to-peach-400/5 group-hover:opacity-100 transition-opacity"></div>
          <span className="relative font-bold text-slate-800 text-xl tracking-widest uppercase">Get Started</span>
          <div className="absolute inset-0 rounded-full border-[1.5px] border-sky-100 group-hover:border-sky-300 transition-colors"></div>
        </button>
      </div>
    </div>
  );
};

export default GetStarted;
