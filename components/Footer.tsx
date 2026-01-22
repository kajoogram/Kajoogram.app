
import React from 'react';
// Fix: Explicitly import Link and useLocation from react-router-dom
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Plus, PlayCircle, User } from 'lucide-react';

const Footer: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (p: string) => path === p;

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <Link to={to} className="flex flex-col items-center justify-center space-y-1 transition-all duration-300">
      <div className={`p-2 rounded-xl transition-all duration-300 ${isActive(to) ? 'bg-blue-50/50 scale-110' : ''}`}>
        <Icon size={24} className={isActive(to) ? 'text-blue-500' : 'text-slate-400'} strokeWidth={1.5} />
      </div>
    </Link>
  );

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 px-6 pb-6 pt-2">
      <div className="glass rounded-[32px] shadow-xl border border-white/50 px-6 py-3 flex items-center justify-between">
        <NavItem to="/home" icon={Home} label="Home" />
        <NavItem to="/discover" icon={Compass} label="Discover" />
        
        <Link to="/create" className="relative -top-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-sky-400 via-lavender-400 to-peach-400 rounded-full flex items-center justify-center shadow-lg shadow-sky-100 border-4 border-white transition-transform active:scale-90">
             <Plus size={32} className="text-white" />
          </div>
        </Link>
        
        <NavItem to="/reels" icon={PlayCircle} label="Reels" />
        <NavItem to="/profile" icon={User} label="Profile" />
      </div>
    </div>
  );
};

export default Footer;
