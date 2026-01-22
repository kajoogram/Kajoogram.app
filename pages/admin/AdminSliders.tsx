
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, ChevronUp, ChevronDown, Upload } from 'lucide-react';
import { useSliderContext } from '../../context/SliderContext';
import { Banner } from '../../types';

const AdminSliders: React.FC = () => {
  const navigate = useNavigate();
  const { banners, addBanner, deleteBanner, reorderBanner } = useSliderContext();
  
  const [view, setView] = useState<'list' | 'form'>('list');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | number | null>(null);

  // Form State
  const initialFormState: Banner = {
    id: '',
    image: '',
    link: ''
  };
  const [formData, setFormData] = useState<Banner>(initialFormState);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // --- ACTIONS ---

  const handleDeleteClick = (id: string | number) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm !== null) {
      deleteBanner(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  const handleAddNew = () => {
    setFormData({ ...initialFormState, id: `banner-${Date.now()}` });
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
    if (!formData.image) {
      alert("Slider image is required.");
      return;
    }

    addBanner(formData);
    setView('list');
  };

  // --- RENDER ---

  const renderForm = () => (
    <div className="pb-20">
       <div className="bg-white p-6 space-y-8">
          
          {/* Image Upload */}
          <div className="space-y-4">
             <label className="text-sm font-bold text-slate-800 uppercase tracking-widest">Slider Image (16:9)</label>
             <div className="flex flex-col items-center space-y-4">
                <div 
                  onClick={() => imageInputRef.current?.click()}
                  className="w-full aspect-[16/9] rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-sky-300 transition-colors overflow-hidden group relative shadow-sm"
                >
                  {formData.image ? (
                     <img src={formData.image} className="w-full h-full object-cover" alt="Slider Preview" />
                  ) : (
                     <div className="flex flex-col items-center text-slate-400 group-hover:text-sky-400">
                        <Upload size={24} />
                        <span className="text-[10px] font-bold mt-2">Upload</span>
                     </div>
                  )}
                  {formData.image && (
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-white text-xs font-bold">Change</span>
                     </div>
                  )}
                </div>
                <input type="file" ref={imageInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
             </div>
          </div>

          {/* Link */}
          <div className="space-y-2">
             <label className="text-sm font-bold text-slate-800 uppercase tracking-widest">Link (Optional)</label>
             <input 
               type="text" 
               className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 font-medium text-slate-700"
               placeholder="e.g. /category/women"
               value={formData.link}
               onChange={(e) => setFormData({...formData, link: e.target.value})}
             />
             <p className="text-[10px] text-slate-400 pl-2">Opens when banner is clicked.</p>
          </div>

          <button 
            onClick={handleSave}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl active:scale-95 transition-transform mt-4"
          >
            Save Slider Image
          </button>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-50 sticky top-0 z-40">
        <div className="flex items-center space-x-4">
           <button onClick={() => view === 'form' ? setView('list') : navigate('/admin')} className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors">
             <ArrowLeft size={24} className="text-slate-800" />
           </button>
           <h1 className="font-serif font-bold text-lg text-slate-800">
             {view === 'form' ? 'Add Slider Image' : 'Slider Manager'}
           </h1>
        </div>
        {view === 'list' && (
          <button 
            onClick={handleAddNew}
            className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide active:scale-95 transition-transform"
          >
            <Plus size={16} />
            <span>Add</span>
          </button>
        )}
      </div>

      {view === 'list' ? (
        <div className="p-6">
           <div className="space-y-4">
              {banners.map((banner, index) => (
                <div key={banner.id} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4 animate-in slide-in-from-bottom duration-300">
                   {/* Reorder Buttons */}
                   <div className="flex flex-col space-y-1">
                      <button 
                        disabled={index === 0}
                        onClick={() => reorderBanner(index, 'up')}
                        className="p-1 text-slate-300 hover:text-slate-600 disabled:opacity-30 disabled:hover:text-slate-300 transition-colors"
                      >
                         <ChevronUp size={16} strokeWidth={3} />
                      </button>
                      <button 
                        disabled={index === banners.length - 1} 
                        onClick={() => reorderBanner(index, 'down')}
                        className="p-1 text-slate-300 hover:text-slate-600 disabled:opacity-30 disabled:hover:text-slate-300 transition-colors"
                      >
                         <ChevronDown size={16} strokeWidth={3} />
                      </button>
                   </div>

                   <div className="w-24 aspect-[16/9] rounded-xl bg-slate-100 shrink-0 overflow-hidden border border-slate-50">
                      <img src={banner.image} className="w-full h-full object-cover" alt="Slider" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-slate-400 truncate">{banner.link || 'No link set'}</p>
                   </div>
                   <div className="flex items-center space-x-1">
                      <button onClick={() => handleDeleteClick(banner.id)} className="p-2 bg-red-50 text-red-600 rounded-lg active:scale-90 transition-transform"><Trash2 size={16} /></button>
                   </div>
                </div>
              ))}
              {banners.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-sm">No slider images found.</div>
              )}
           </div>
        </div>
      ) : (
        renderForm()
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
           <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-300">
              <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Delete Slider Image?</h3>
              <p className="text-sm text-slate-500 mb-6">Are you sure you want to delete this slider image? This will remove it from the Home Page immediately.</p>
              <div className="flex space-x-4">
                 <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold uppercase tracking-wide text-xs">Cancel</button>
                 <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold uppercase tracking-wide text-xs shadow-lg shadow-red-200">Delete</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default AdminSliders;
