
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, HelpCircle, Info, Mail, UserPlus, Shield } from 'lucide-react';

const AdminMenuPages: React.FC = () => {
  const navigate = useNavigate();

  const pages = [
    { id: 'help', label: 'Help & Support', icon: HelpCircle, color: 'text-blue-500 bg-blue-50' },
    { id: 'about', label: 'About Us', icon: Info, color: 'text-purple-500 bg-purple-50' },
    { id: 'contact', label: 'Contact Us', icon: Mail, color: 'text-green-500 bg-green-50' },
    { id: 'follow', label: 'Follow Us', icon: UserPlus, color: 'text-pink-500 bg-pink-50' },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield, color: 'text-slate-500 bg-slate-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-100 sticky top-0 z-40">
        <div className="flex items-center space-x-4">
           <button onClick={() => navigate('/admin')} className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors">
             <ArrowLeft size={24} className="text-slate-800" />
           </button>
           <h1 className="font-serif font-bold text-lg text-slate-800">Menu Pages</h1>
        </div>
      </div>

      <div className="p-6">
        <p className="text-sm text-slate-500 mb-6 font-medium">Select a page to edit content. Changes will reflect immediately in the app.</p>
        
        <div className="space-y-4">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => navigate(`/admin/menu-pages/${page.id}`)}
              className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group active:scale-[0.98] transition-all hover:shadow-md"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${page.color}`}>
                  <page.icon size={24} />
                </div>
                <span className="text-sm font-bold text-slate-700">{page.label}</span>
              </div>
              <ChevronRight size={20} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminMenuPages;
