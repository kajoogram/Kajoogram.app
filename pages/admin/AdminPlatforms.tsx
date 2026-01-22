
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Plus, Edit2, Trash2, ChevronUp, ChevronDown, Upload, X, CheckCircle, XCircle } from 'lucide-react';
import { usePlatformContext } from '../../context/PlatformContext';
import { Platform } from '../../types';

const AdminPlatforms: React.FC = () => {
  const navigate = useNavigate();
  const { platforms, addPlatform, updatePlatform, deletePlatform, reorderPlatform } = usePlatformContext();
  
  const [view, setView] = useState<'list' | 'form'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Form State
  const initialFormState: Platform = {
    id: '',
    name: '',
    image: '',
    link: '',
    isActive: true
  };
  const [formData, setFormData] = useState<Platform>(initialFormState);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (platform: Platform) => {
    setFormData(platform);
    setIsEditing(true);
    setView('form');
  };

  const handleAddNew = () => {
    setFormData({ ...initialFormState, id: `plat-${Date.now()}` });
    setIsEditing(false);
    setView('form');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData({ ...formData, image: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.image) {
      alert("Name and Image are mandatory.");
      return;
    }
    if (isEditing) {
      updatePlatform(formData);
    } else {
      addPlatform(formData);
    }
    setView('list');
  };

  const toggleStatus = (plat: Platform) => {
    updatePlatform({ ...plat, isActive: !plat.isActive });
  };

  const renderForm = () => (
    <div className="pb-20 animate-in slide-in-from-bottom duration-500">
       <div className="bg-white p-6 space-y-8">
          <div className="space-y-4">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center block">Platform Aesthetic (1:1)</label>
             <div className="flex flex-col items-center">
                <div 
                  onClick={() => imageInputRef.current?.click()}
                  className="w-32 h-32 rounded-[40px] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-sky-300 transition-all overflow-hidden group relative shadow-inner"
                >
                  {formData.image ? (
                     <img src={formData.image} className="w-full h-full object-cover" alt="Platform" />
                  ) : (
                     <div className="flex flex-col items-center text-slate-300 group-hover:text-sky-400">
                        <Upload size={24} />
                        <span className="text-[8px] font-bold mt-1 uppercase tracking-widest">Select</span>
                     </div>
                  )}
                </div>
                <input type="file" ref={imageInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
             </div>
          </div>

          <div className="space-y-6">
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Display Name</label>
                <input 
                  type="text" 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-100 font-bold text-slate-800"
                  placeholder="e.g. Prada, Vogue Store..."
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
             </div>

             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Link</label>
                <input 
                  type="url" 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-100 font-medium text-slate-600"
                  placeholder="https://..."
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                />
             </div>

             <div className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-200">
                <span className="text-sm font-bold text-slate-800">Master Status</span>
                <button 
                  onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                  className={`w-14 h-7 rounded-full transition-all relative ${formData.isActive ? 'bg-sky-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${formData.isActive ? 'left-8' : 'left-1'}`}></div>
                </button>
             </div>

             <button 
               onClick={handleSave}
               className="w-full py-5 bg-slate-900 text-white rounded-3xl font-bold uppercase tracking-[2px] shadow-xl active:scale-95 transition-all text-xs"
             >
               {isEditing ? 'Save Platform' : 'Initialize Platform'}
             </button>
          </div>
       </div>
    </div>
  );

  const filteredPlatforms = platforms.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const isReorderEnabled = !searchQuery;

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-50 sticky top-0 z-40">
        <div className="flex items-center space-x-4">
           <button onClick={() => view === 'form' ? setView('list') : navigate('/admin')} className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors">
             <ArrowLeft size={24} className="text-slate-800" />
           </button>
           <h1 className="font-serif font-bold text-lg text-slate-800">
             {view === 'form' ? 'Modify Platform' : 'Marketplace Platforms'}
           </h1>
        </div>
        {view === 'list' && (
          <button onClick={handleAddNew} className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-transform">
            <Plus size={14} />
            <span>Create</span>
          </button>
        )}
      </div>

      {view === 'list' ? (
        <div className="p-6">
           <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Filter platforms..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
           </div>

           <div className="space-y-4">
              {filteredPlatforms.map((plat, index) => (
                <div key={plat.id} className={`bg-white p-3 rounded-3xl border shadow-sm flex items-center space-x-4 transition-all ${plat.isActive ? 'border-slate-100 opacity-100' : 'border-slate-100 opacity-60 bg-slate-50/50'}`}>
                   {/* Reorder Controls */}
                   <div className="flex flex-col space-y-1">
                      <button 
                        disabled={!isReorderEnabled || index === 0 || !plat.isActive}
                        onClick={() => reorderPlatform(index, 'up')}
                        className="p-1 text-slate-300 hover:text-slate-600 disabled:opacity-30 disabled:hover:text-slate-300 transition-colors"
                      >
                         <ChevronUp size={16} strokeWidth={3} />
                      </button>
                      <button 
                        disabled={!isReorderEnabled || index === filteredPlatforms.length - 1 || !plat.isActive}
                        onClick={() => reorderPlatform(index, 'down')}
                        className="p-1 text-slate-300 hover:text-slate-600 disabled:opacity-30 disabled:hover:text-slate-300 transition-colors"
                      >
                         <ChevronDown size={16} strokeWidth={3} />
                      </button>
                   </div>

                   <div className="w-14 h-14 rounded-2xl bg-slate-100 shrink-0 overflow-hidden shadow-inner border border-slate-50">
                      <img src={plat.image} className="w-full h-full object-cover" alt={plat.name} />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-800 truncate">{plat.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                         <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tighter ${plat.isActive ? 'bg-green-50 text-green-600' : 'bg-slate-200 text-slate-500'}`}>{plat.isActive ? 'Active' : 'Disabled'}</span>
                      </div>
                   </div>
                   <div className="flex items-center space-x-1">
                      <button onClick={() => toggleStatus(plat)} className={`p-2 rounded-xl transition-colors ${plat.isActive ? 'text-slate-400 hover:text-red-500 bg-slate-50' : 'text-green-500 bg-green-50'}`}>
                         {plat.isActive ? <XCircle size={16} /> : <CheckCircle size={16} />}
                      </button>
                      <button onClick={() => handleEdit(plat)} className="p-2 bg-sky-50 text-sky-600 rounded-xl"><Edit2 size={16} /></button>
                      <button onClick={() => setShowDeleteConfirm(plat.id)} className="p-2 bg-rose-50 text-rose-600 rounded-xl"><Trash2 size={16} /></button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      ) : renderForm()}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
           <div className="bg-white rounded-[40px] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-300">
              <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Delete Master Entry?</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">This will remove the platform from all existing records. We recommend just disabling it instead.</p>
              <div className="flex space-x-4">
                 <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-3.5 bg-slate-50 text-slate-500 rounded-2xl font-bold uppercase tracking-widest text-[10px]">Cancel</button>
                 <button onClick={() => { deletePlatform(showDeleteConfirm); setShowDeleteConfirm(null); }} className="flex-1 py-3.5 bg-rose-500 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-rose-100">Delete</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlatforms;
