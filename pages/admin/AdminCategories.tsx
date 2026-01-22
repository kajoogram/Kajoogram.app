import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Link as LinkIcon, X, CheckCircle, XCircle, ChevronUp, ChevronDown, Check, Loader2 } from 'lucide-react';
import { useCategoryContext } from '../../context/CategoryContext';
import { useProductContext } from '../../context/ProductContext';
import { Category } from '../../types';

const AdminCategories: React.FC = () => {
  const navigate = useNavigate();
  const { categories, addCategory, updateCategory, deleteCategory, loading } = useCategoryContext();
  const { products, updateProduct } = useProductContext();
  
  const [view, setView] = useState<'list' | 'form'>('list');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const initialFormState: Omit<Category, 'id'> & { id?: string } = {
    name: '',
    image: '',
    isActive: true
  };
  const [formData, setFormData] = useState<typeof initialFormState>(initialFormState);
  const [originalName, setOriginalName] = useState<string>('');
  
  // Image URL State
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleEdit = (category: Category) => {
    setFormData(category);
    setOriginalName(category.name);
    setIsEditing(true);
    setView('form');
    setShowUrlInput(false);
    setUrlInput('');
  };

  const handleAddNew = () => {
    setFormData({ ...initialFormState });
    setIsEditing(false);
    setView('form');
    setShowUrlInput(false);
    setUrlInput('');
  };

  const handleAddImageUrl = () => {
    if (!urlInput.trim()) return;
    setFormData({ ...formData, image: urlInput.trim() });
    setShowUrlInput(false);
    setUrlInput('');
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.image) {
      alert("Category name and image URL are required.");
      return;
    }
    
    setIsSaving(true);
    try {
      if (isEditing && formData.id) {
        // Cast to Category because we know ID exists in edit mode
        await updateCategory(formData as Category);
        
        // Optional: Cascade update product categories if name changed
        if (originalName && originalName !== formData.name) {
            // Note: In a real app with many products, this should be done via a backend function
            products.filter(p => p.category === originalName).forEach(p => {
                updateProduct({ ...p, category: formData.name });
            });
        }
      } else {
        await addCategory(formData as Omit<Category, 'id'>);
      }
      setView('list');
    } catch (error) {
      alert("Failed to save category. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStatus = (cat: Category) => {
    updateCategory({ ...cat, isActive: !cat.isActive });
  };

  const renderForm = () => (
    <div className="pb-20 animate-in slide-in-from-bottom duration-500">
       <div className="bg-white p-6 space-y-8">
          
          {/* IMAGE SECTION */}
          <div className="space-y-4">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center block">Category Visual (1:1)</label>
             <div className="flex flex-col items-center gap-4">
                
                {/* Preview Container */}
                <div className="w-32 h-32 rounded-[40px] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative shadow-inner">
                  {formData.image ? (
                     <img 
                       src={formData.image} 
                       className="w-full h-full object-cover" 
                       alt="Preview" 
                       onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+URL'}
                     />
                  ) : (
                     <div className="flex flex-col items-center text-slate-300">
                        <LinkIcon size={24} />
                        <span className="text-[8px] font-bold mt-1 uppercase tracking-widest">No Image</span>
                     </div>
                  )}
                </div>

                {/* URL Input Logic */}
                {!showUrlInput ? (
                  <div className="flex flex-col items-center gap-2 w-full">
                    {formData.image ? (
                      <button 
                        onClick={() => { setFormData({...formData, image: ''}); setShowUrlInput(true); }}
                        className="text-xs font-bold text-slate-500 underline"
                      >
                        Change Image URL
                      </button>
                    ) : (
                      <button 
                        onClick={() => setShowUrlInput(true)}
                        className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={14} />
                        <span>Add Category Image URL</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="w-full space-y-2 animate-in fade-in zoom-in duration-200">
                    <input 
                      type="url" 
                      placeholder="Paste image link here..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setShowUrlInput(false); setUrlInput(''); }}
                        className="flex-1 py-2 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold uppercase"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleAddImageUrl}
                        className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase"
                      >
                        Add Image
                      </button>
                    </div>
                    <p className="text-[9px] text-slate-400 text-center">Supported: ImgBB, Unsplash, direct image links.</p>
                  </div>
                )}
             </div>
          </div>

          {/* DETAILS SECTION */}
          <div className="space-y-6">
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category Title</label>
                <input 
                  type="text" 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-100 font-bold text-slate-800"
                  placeholder="e.g. Accessories, Outerwear..."
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
             </div>

             <div className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-200">
                <span className="text-sm font-bold text-slate-800">Master Visibility</span>
                <button 
                  onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                  className={`w-14 h-7 rounded-full transition-all relative ${formData.isActive ? 'bg-sky-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${formData.isActive ? 'left-8' : 'left-1'}`}></div>
                </button>
             </div>

             <button 
               onClick={handleSave}
               disabled={isSaving}
               className="w-full py-5 bg-slate-900 text-white rounded-3xl font-bold uppercase tracking-[2px] shadow-xl active:scale-95 transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
             >
               {isSaving ? <Loader2 size={16} className="animate-spin" /> : (isEditing ? 'Save Changes' : 'Create Category')}
             </button>
          </div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-50 sticky top-0 z-40">
        <div className="flex items-center space-x-4">
           <button onClick={() => view === 'form' ? setView('list') : navigate('/admin')} className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors">
             <ArrowLeft size={24} className="text-slate-800" />
           </button>
           <h1 className="font-serif font-bold text-lg text-slate-800">
             {view === 'form' ? (isEditing ? 'Edit Category' : 'New Category') : 'Catalog Categories'}
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
        <div className="p-6 space-y-4">
           {loading ? (
             <div className="flex flex-col items-center justify-center py-20 text-slate-400">
               <Loader2 size={32} className="animate-spin mb-2" />
               <span className="text-xs font-bold uppercase tracking-widest">Loading...</span>
             </div>
           ) : categories.length === 0 ? (
             <div className="text-center py-20 text-slate-400 text-sm">No categories found. Create one!</div>
           ) : (
             categories.map((cat, index) => (
               <div key={cat.id} className={`bg-white p-3 rounded-3xl border flex items-center space-x-4 transition-all ${cat.isActive ? 'border-slate-100' : 'border-slate-100 opacity-60 bg-slate-50'}`}>
                  {/* Visual ID/Order */}
                  <div className="w-6 text-center text-xs font-bold text-slate-300">#{index + 1}</div>

                  <div className="w-14 h-14 rounded-2xl bg-slate-100 shrink-0 overflow-hidden shadow-inner border border-slate-50 relative">
                     <img src={cat.image} className="w-full h-full object-cover" alt={cat.name} onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Img'} />
                  </div>
                  <div className="flex-1 min-w-0">
                     <h3 className="text-sm font-bold text-slate-800 truncate">{cat.name}</h3>
                     <span className={`text-[8px] font-bold uppercase ${cat.isActive ? 'text-green-500' : 'text-slate-400'}`}>{cat.isActive ? 'Enabled' : 'Hidden'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                     <button onClick={() => toggleStatus(cat)} className="p-2 rounded-xl bg-slate-50 text-slate-400">
                        {cat.isActive ? <XCircle size={16} /> : <CheckCircle size={16} className="text-green-500" />}
                     </button>
                     <button onClick={() => handleEdit(cat)} className="p-2 bg-sky-50 text-sky-600 rounded-xl"><Edit2 size={16} /></button>
                     <button onClick={() => setShowDeleteConfirm(cat.id)} className="p-2 bg-rose-50 text-rose-600 rounded-xl"><Trash2 size={16} /></button>
                  </div>
               </div>
             ))
           )}
        </div>
      ) : renderForm()}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
           <div className="bg-white rounded-[40px] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-300">
              <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Delete Group?</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">This will permanently delete the category from the database.</p>
              <div className="flex space-x-4">
                 <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-3.5 bg-slate-50 text-slate-500 rounded-2xl font-bold uppercase tracking-widest text-[10px]">Cancel</button>
                 <button onClick={async () => { await deleteCategory(showDeleteConfirm); setShowDeleteConfirm(null); }} className="flex-1 py-3.5 bg-rose-500 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-rose-100">Delete</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;