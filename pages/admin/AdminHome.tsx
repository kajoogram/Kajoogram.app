import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Link as LinkIcon, Grid, Tag, Layers, ShoppingBag, Layout, FileText, Bell, BarChart, X, ChevronRight, User, Image as ImageIcon, Save, Check } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const AdminHome: React.FC = () => {
  const navigate = useNavigate();
  const { appLogo, setAppLogo } = useAppContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Logo Management State
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [logoInput, setLogoInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveLogo = async () => {
    if (!logoInput.trim()) return;
    
    setIsSaving(true);
    try {
      await setAppLogo(logoInput.trim());
      setShowUrlInput(false);
      setLogoInput('');
    } catch (error) {
      alert("Failed to save logo.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setShowUrlInput(false);
    setLogoInput('');
  };

  const menuItems = [
    { icon: User, label: 'Back to Profile', action: () => navigate('/profile') },
    { icon: Layout, label: 'Dashboard', action: () => setIsDrawerOpen(false) },
    { icon: ShoppingBag, label: 'Products', action: () => navigate('/admin/products') },
    { icon: Layers, label: 'Platform', action: () => navigate('/admin/platforms') },
    { icon: Grid, label: 'Category', action: () => navigate('/admin/categories') },
    { icon: ImageIcon, label: 'Slider', action: () => navigate('/admin/sliders') },
    { icon: Tag, label: 'Label', action: () => navigate('/admin/labels') },
    { icon: FileText, label: 'Menu Pages', action: () => navigate('/admin/menu-pages') },
    { icon: BarChart, label: 'Reports', action: () => navigate('/admin/reports') },
    { icon: Bell, label: 'Notification', action: () => navigate('/admin/notifications') },
  ];

  const dashboardGrid = [
    { icon: ShoppingBag, label: 'Products', action: () => navigate('/admin/products') },
    { icon: Layers, label: 'Platform', action: () => navigate('/admin/platforms') },
    { icon: Grid, label: 'Category', action: () => navigate('/admin/categories') },
    { icon: ImageIcon, label: 'Slider', action: () => navigate('/admin/sliders') },
    { icon: Tag, label: 'Label', action: () => navigate('/admin/labels') },
    { icon: FileText, label: 'Menu Pages', action: () => navigate('/admin/menu-pages') },
    { icon: BarChart, label: 'Reports', action: () => navigate('/admin/reports') },
    { icon: Bell, label: 'Notification', action: () => navigate('/admin/notifications') },
  ];

  // Preview logic: Show input value if typing, otherwise show saved appLogo
  const previewImage = logoInput.trim() || appLogo;

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <button onClick={() => setIsDrawerOpen(true)} className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors">
          <Menu size={24} className="text-slate-800" />
        </button>
        <h1 className="font-serif font-bold text-lg text-slate-800">Admin Panel</h1>
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
           <span className="font-bold text-xs text-slate-600">A</span>
        </div>
      </div>

      <div className="p-6 space-y-8 max-w-lg mx-auto">
        
        {/* Logo Management Section */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-slate-100 border border-slate-100">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">App Logo</h2>
              <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                {appLogo ? 'Active' : 'Not Set'}
              </span>
           </div>
           
           <div className="flex flex-col items-center space-y-6">
              {/* Logo Container - 16:9 Aspect Ratio Container for Contain Fit */}
              <div 
                className="w-full h-32 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative"
              >
                {previewImage ? (
                   <img 
                     src={previewImage} 
                     className="w-full h-full object-contain p-4" 
                     alt="Logo Preview" 
                     onError={(e) => {
                       (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+URL';
                     }}
                   />
                ) : (
                   <div className="flex flex-col items-center text-slate-400">
                      <ImageIcon size={24} />
                      <span className="text-[10px] font-bold mt-2 uppercase tracking-wide">No Logo</span>
                   </div>
                )}
              </div>

              {!showUrlInput ? (
                <button 
                  onClick={() => setShowUrlInput(true)}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-slate-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  <LinkIcon size={14} />
                  <span>Add Logo Image Link</span>
                </button>
              ) : (
                <div className="w-full space-y-3 animate-in fade-in zoom-in duration-300">
                  <div className="relative">
                    <input 
                      type="url" 
                      placeholder="Paste Image URL here..."
                      className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                      value={logoInput}
                      onChange={(e) => setLogoInput(e.target.value)}
                      autoFocus
                    />
                    {logoInput && (
                      <button 
                        onClick={() => setLogoInput('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={handleCancel}
                      className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveLogo}
                      disabled={!logoInput || isSaving}
                      className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wide shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Saving...' : 'Save Logo'}
                      {!isSaving && <Check size={14} />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 text-center px-4">
                    Use <a href="https://imgbb.com" target="_blank" rel="noreferrer" className="text-blue-500 underline font-bold">ImgBB</a> to convert your image to a direct link.
                  </p>
                </div>
              )}
           </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-2 gap-4">
           {dashboardGrid.map((item) => (
             <button 
               key={item.label}
               onClick={item.action}
               className="bg-white p-5 rounded-[24px] shadow-sm hover:shadow-md transition-all border border-slate-100 flex flex-col items-center justify-center space-y-3 aspect-square active:scale-95 group"
             >
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-sky-50 transition-colors">
                   <item.icon size={24} className="text-slate-600 group-hover:text-sky-500 transition-colors" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-bold text-slate-700">{item.label}</span>
             </button>
           ))}
        </div>
      </div>

      {/* Sidebar Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50">
           <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
           <div className="absolute top-0 left-0 h-full w-[280px] bg-white shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50">
                 <h2 className="font-serif font-bold text-xl text-slate-800">Menu</h2>
                 <button onClick={() => setIsDrawerOpen(false)} className="p-1"><X size={20} className="text-slate-500" /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-4">
                 {menuItems.map((item, index) => (
                   <button 
                     key={item.label} 
                     onClick={item.action}
                     className={`w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors ${index === 0 ? 'text-blue-600' : 'text-slate-600'}`}
                   >
                      <div className="flex items-center space-x-4">
                         <item.icon size={20} />
                         <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      <ChevronRight size={16} className="text-slate-300" />
                   </button>
                 ))}
              </div>

              <div className="p-6 border-t border-slate-50">
                 <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">A</div>
                    <div>
                       <p className="text-sm font-bold text-slate-800">Admin</p>
                       <p className="text-xs text-slate-400">patwaadmin@gmail.com</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default AdminHome;