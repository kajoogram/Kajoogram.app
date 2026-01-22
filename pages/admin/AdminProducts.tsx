import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Plus, Edit2, Trash2, X, Image as ImageIcon, Check, Link as LinkIcon, AlertCircle, Loader2, DollarSign } from 'lucide-react';
import { useProductContext } from '../../context/ProductContext';
import { useLabelContext } from '../../context/LabelContext';
import { useCategoryContext } from '../../context/CategoryContext';
import { usePlatformContext } from '../../context/PlatformContext';
import { Product } from '../../types';

const AdminProducts: React.FC = () => {
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct, loading } = useProductContext();
  const { labels } = useLabelContext();
  const { categories } = useCategoryContext();
  const { platforms } = usePlatformContext();
  
  // -- Local State --
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  
  // -- Form State --
  // Initialize with proper defaults
  const initialFormState: Omit<Product, 'id'> = {
    title: '',
    price: 0,
    originalPrice: 0,
    image: '', // Main Image
    images: [],
    description: '',
    category: '',
    platform: '',
    affiliateLink: '',
    label: '',
    tryOnEnabled: false
  };

  // State
  const [formData, setFormData] = useState<Product | Omit<Product, 'id'>>(initialFormState);
  const [imageUrlInput, setImageUrlInput] = useState('');
  
  // Data Filters (Active Only)
  const activeCategories = categories.filter(c => c.isActive);
  const activePlatforms = platforms.filter(p => p.isActive);
  const activeLabels = labels.filter(l => l.isActive);

  // -- Helpers --
  const getWordCount = (str: string) => str.trim() === '' ? 0 : str.trim().split(/\s+/).length;

  const handleOpenAdd = () => {
    setFormData({
      ...initialFormState,
      category: activeCategories.length > 0 ? activeCategories[0].name : '',
      platform: activePlatforms.length > 0 ? activePlatforms[0].name : '',
    });
    setIsEditing(false);
    setIsModalOpen(true);
    setShowUrlInput(false);
    setImageUrlInput('');
  };

  const handleOpenEdit = (product: Product) => {
    setFormData({ ...product });
    setIsEditing(true);
    setIsModalOpen(true);
    setShowUrlInput(false);
    setImageUrlInput('');
  };

  // -- Image Logic (URL ONLY) --
  const handleAddImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    
    // Basic URL validation
    try {
      new URL(url);
    } catch (_) {
      alert("Please enter a valid URL.");
      return;
    }

    if (formData.images.length >= 10) {
      alert("Maximum 10 images allowed.");
      return;
    }
    
    const newImages = [...formData.images, url];
    
    // Auto-set main image if it's the first one
    let newMain = formData.image;
    if (!newMain) newMain = url;

    setFormData({ ...formData, images: newImages, image: newMain });
    setImageUrlInput('');
    setShowUrlInput(false);
  };

  const removeImage = (index: number) => {
    const imgToRemove = formData.images[index];
    const newImages = formData.images.filter((_, i) => i !== index);
    
    let newMain = formData.image;
    if (imgToRemove === newMain) {
      // If we deleted the main image, reset to first available or empty
      newMain = newImages.length > 0 ? newImages[0] : '';
    }
    
    setFormData({ ...formData, images: newImages, image: newMain });
  };

  const setMainImage = (img: string) => {
    setFormData({ ...formData, image: img });
  };

  // -- Text Handlers --
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (getWordCount(val) <= 50) {
      setFormData({ ...formData, title: val });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (getWordCount(val) <= 1000) {
      setFormData({ ...formData, description: val });
    }
  };

  // -- Save Logic --
  const handleConfirmSave = async () => {
    // 1. Validation
    if (formData.images.length < 2) {
      alert("Please add at least 2 images.");
      return;
    }
    if (!formData.image) {
      alert("Please select a main image.");
      return;
    }
    if (!formData.title.trim()) {
      alert("Title is required.");
      return;
    }
    // Price check: allow 0 if really free, but usually > 0.
    // Converting to number explicitly just in case.
    const priceVal = Number(formData.price);
    if (isNaN(priceVal) || priceVal < 0) {
      alert("Please enter a valid price.");
      return;
    }
    
    if (!formData.category) {
      alert("Category is required.");
      return;
    }
    if (!formData.platform) {
      alert("Platform is required.");
      return;
    }
    if (!formData.affiliateLink) {
      alert("Affiliate Buy Link is required.");
      return;
    }

    setSaving(true);
    try {
      // Prepare payload - force price to be number
      const payload = {
        ...formData,
        price: priceVal
      };

      if (isEditing && 'id' in formData) {
        await updateProduct(payload as Product);
      } else {
        await addProduct(payload as Omit<Product, 'id'>);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save product. Please check console for details.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (showDeleteConfirm) {
      await deleteProduct(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  // -- Filtered List --
  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 relative">
      
      {/* 1. Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center space-x-4">
           <button onClick={() => navigate('/admin')} className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors">
             <ArrowLeft size={24} className="text-slate-800" />
           </button>
           <h1 className="font-serif font-bold text-lg text-slate-800">
             Products Manager
           </h1>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-transform shadow-lg shadow-slate-200"
        >
          <Plus size={14} />
          <span>Add Product</span>
        </button>
      </div>

      {/* 2. Search & List */}
      <div className="p-6">
         {/* Search */}
         <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by title..."
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>

         {/* Product List */}
         {loading ? (
           <div className="flex flex-col items-center justify-center py-20 text-slate-400">
             <Loader2 size={32} className="animate-spin mb-2" />
             <span className="text-xs font-bold uppercase tracking-widest">Loading Inventory...</span>
           </div>
         ) : (
           <div className="space-y-4 pb-20">
              {filteredProducts.map((prod) => (
                <div key={prod.id} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4 group hover:shadow-md transition-all">
                   <div className="w-16 h-16 rounded-xl bg-slate-100 shrink-0 overflow-hidden border border-slate-50 relative">
                      <img src={prod.image} className="w-full h-full object-cover" loading="lazy" alt="Thumbnail" />
                      {!prod.tryOnEnabled && <div className="absolute inset-0 bg-black/10"></div>}
                   </div>
                   <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-800 truncate">{prod.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-bold uppercase tracking-wider">{prod.platform}</span>
                        <span className="text-[10px] font-bold text-slate-800">₹{prod.price}</span>
                      </div>
                   </div>
                   <div className="flex space-x-2 pr-1">
                      <button onClick={() => handleOpenEdit(prod)} className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-sky-50 hover:text-sky-600 transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => setShowDeleteConfirm(prod.id)} className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
                   </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-sm bg-white rounded-2xl border border-dashed border-slate-200">No products found.</div>
              )}
           </div>
         )}
      </div>

      {/* 3. ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-200">
           <div className="bg-white w-full h-[90vh] sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
              
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                 <h2 className="font-serif font-bold text-xl text-slate-800">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors"><X size={20} /></button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">
                 
                 {/* SECTION: IMAGES */}
                 <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                         <ImageIcon size={14} /> Product Images
                       </label>
                       <span className={`text-[10px] font-bold px-2 py-1 rounded ${formData.images.length >= 2 && formData.images.length <= 10 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {formData.images.length} / 10 (Min 2)
                       </span>
                    </div>

                    {/* Image Grid */}
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                         {formData.images.map((img, idx) => (
                           <div 
                             key={idx} 
                             onClick={() => setMainImage(img)}
                             className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${formData.image === img ? 'border-sky-500 ring-2 ring-sky-100' : 'border-slate-100'}`}
                           >
                              <img src={img} className="w-full h-full object-cover" alt={`Product ${idx}`} />
                              {formData.image === img && (
                                <div className="absolute inset-0 bg-sky-500/20 flex items-center justify-center">
                                   <div className="bg-sky-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">MAIN</div>
                                </div>
                              )}
                              <button 
                                onClick={(e) => { e.stopPropagation(); removeImage(idx); }} 
                                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                              >
                                <X size={10} />
                              </button>
                           </div>
                         ))}
                      </div>
                    )}

                    {/* Add Image URL Button */}
                    {!showUrlInput && formData.images.length < 10 && (
                      <button 
                        onClick={() => setShowUrlInput(true)}
                        className="w-full py-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-wide hover:bg-slate-100 hover:border-slate-400 transition-all flex items-center justify-center space-x-2"
                      >
                        <Plus size={16} />
                        <span>Add Image URL</span>
                      </button>
                    )}

                    {/* URL Input Field */}
                    {showUrlInput && (
                      <div className="flex gap-2 items-center animate-in fade-in zoom-in duration-200">
                         <input 
                           autoFocus
                           type="url" 
                           placeholder="Paste valid image URL..." 
                           className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-100 shadow-sm"
                           value={imageUrlInput}
                           onChange={(e) => setImageUrlInput(e.target.value)}
                           onKeyDown={(e) => { if (e.key === 'Enter') handleAddImageUrl(); }}
                         />
                         <button 
                           onClick={handleAddImageUrl}
                           className="px-4 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase shadow-lg active:scale-95 transition-transform"
                         >
                           Add
                         </button>
                         <button 
                           onClick={() => { setShowUrlInput(false); setImageUrlInput(''); }}
                           className="p-3 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 active:scale-95 transition-transform"
                         >
                           <X size={16} />
                         </button>
                      </div>
                    )}
                 </div>

                 {/* SECTION: DETAILS */}
                 <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-5">
                    
                    {/* Title */}
                    <div className="space-y-2">
                       <div className="flex justify-between">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Title</label>
                          <span className={`text-[10px] font-bold ${getWordCount(formData.title) > 50 ? 'text-red-500' : 'text-slate-400'}`}>
                             {getWordCount(formData.title)} / 50 Words
                          </span>
                       </div>
                       <input 
                         type="text" 
                         className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-100"
                         placeholder="Product Name"
                         value={formData.title}
                         onChange={handleTitleChange}
                       />
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Price (INR)</label>
                       <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            type="number"
                            min="0"
                            className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-100"
                            placeholder="0"
                            value={formData.price === 0 ? '' : formData.price} 
                            onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                          />
                       </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                       <div className="flex justify-between">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</label>
                          <span className={`text-[10px] font-bold ${getWordCount(formData.description || '') > 1000 ? 'text-red-500' : 'text-slate-400'}`}>
                             {getWordCount(formData.description || '')} / 1000 Words
                          </span>
                       </div>
                       <textarea 
                         rows={4}
                         className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-100 resize-none"
                         placeholder="Product details..."
                         value={formData.description}
                         onChange={handleDescriptionChange}
                       ></textarea>
                    </div>

                    {/* Selects */}
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
                          <select 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-100"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                          >
                             {activeCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Platform</label>
                          <select 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-100"
                            value={formData.platform}
                            onChange={(e) => setFormData({...formData, platform: e.target.value})}
                          >
                             {activePlatforms.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                          </select>
                       </div>
                    </div>

                    {/* Links */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                           <LinkIcon size={12} /> Affiliate Link
                        </label>
                        <input 
                          type="url"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-blue-600 focus:outline-none focus:ring-2 focus:ring-sky-100"
                          placeholder="https://..."
                          value={formData.affiliateLink}
                          onChange={(e) => setFormData({...formData, affiliateLink: e.target.value})}
                        />
                    </div>

                    {/* Label & Toggle */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Label (Optional)</label>
                           <select 
                             className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-100"
                             value={formData.label || ''}
                             onChange={(e) => setFormData({...formData, label: e.target.value})}
                           >
                              <option value="">None</option>
                              {activeLabels.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
                           </select>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 mt-6 sm:mt-0">
                           <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Try Now Button</span>
                           <button 
                             onClick={() => setFormData({...formData, tryOnEnabled: !formData.tryOnEnabled})}
                             className={`w-12 h-6 rounded-full transition-colors relative ${formData.tryOnEnabled ? 'bg-green-500' : 'bg-slate-300'}`}
                           >
                              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${formData.tryOnEnabled ? 'left-7' : 'left-1'}`}></div>
                           </button>
                        </div>
                    </div>

                 </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-100 bg-white shrink-0">
                 <button 
                   onClick={handleConfirmSave}
                   disabled={saving}
                   className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-transform flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                 >
                    {saving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <Check size={16} />
                        <span>{isEditing ? 'Save Changes' : 'Publish Product'}</span>
                      </>
                    )}
                 </button>
              </div>

           </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="bg-white rounded-[32px] p-8 w-full max-w-sm shadow-2xl animate-in zoom-in duration-300">
              <div className="text-center space-y-3 mb-6">
                 <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-500 mb-2">
                    <AlertCircle size={28} />
                 </div>
                 <h3 className="text-xl font-serif font-bold text-slate-900">Delete Product?</h3>
                 <p className="text-sm text-slate-500">This action cannot be undone. The product will be removed from Firestore immediately.</p>
              </div>
              <div className="flex space-x-3">
                 <button 
                   onClick={() => setShowDeleteConfirm(null)}
                   className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold uppercase tracking-wide text-xs"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={confirmDelete}
                   className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold uppercase tracking-wide text-xs shadow-lg shadow-red-200"
                 >
                   Delete
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default AdminProducts;