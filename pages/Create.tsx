
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Image as ImageIcon, Video, Aperture, Film, ArrowLeft, Plus, Link, Globe, Lock, Users, User, Trash2, CheckCircle, ChevronRight, Share2 } from 'lucide-react';
import { usePostContext } from '../context/PostContext';
import { UserPost } from '../types';

type CreateMode = 'select' | 'post';
type PrivacyType = 'public' | 'friends_of_friends' | 'friends' | 'private';

const Create: React.FC = () => {
  const navigate = useNavigate();
  const { addPost } = usePostContext();
  const [mode, setMode] = useState<CreateMode>('select');
  
  // Post Form State
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [links, setLinks] = useState<string[]>([]);
  const [privacy, setPrivacy] = useState<PrivacyType>('public');
  const [shareToStory, setShareToStory] = useState(false);
  
  // Modals
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [newLink, setNewLink] = useState('');
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- HELPERS ---

  const getWordCount = (text: string) => {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages: string[] = [];
      const files = e.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (file) {
          newImages.push(URL.createObjectURL(file));
        }
      }
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddLink = () => {
    if (newLink && links.length < 5) {
      setLinks([...links, newLink]);
      setNewLink('');
      setShowLinkModal(false);
    }
  };

  const removeLink = (index: number) => {
    setLinks(prev => prev.filter((_, i) => i !== index));
  };

  const handlePublish = () => {
    if (images.length === 0 || !title.trim()) return;

    const newPost: UserPost = {
      id: `post-${Date.now()}`,
      userId: 'current-user',
      username: 'You', // In real app get from Auth
      userAvatar: 'https://ui-avatars.com/api/?name=You&background=random',
      type: 'image',
      mediaUrl: images[0],
      mediaGallery: images,
      title: title,
      description: description,
      uploadedAt: 'Just now',
      timestamp: new Date().toISOString(), // Real timestamp for analytics
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      links: links,
      privacy: privacy
    };

    addPost(newPost);
    
    if (shareToStory) {
      // Mock sharing to story
      console.log("Shared to story");
    }

    // Success and Redirect
    navigate('/discover');
  };

  // --- RENDER SELECTION MENU ---
  if (mode === 'select') {
    return (
      <div className="bg-white min-h-screen relative flex flex-col justify-end">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10" onClick={() => navigate(-1)}></div>

        {/* Content Sheet */}
        <div className="bg-white rounded-t-[40px] z-20 w-full animate-in slide-in-from-bottom duration-300 p-8 pb-12 shadow-2xl relative">
          
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8"></div>
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-slate-800">Create New</h2>
            <button onClick={() => navigate(-1)} className="p-2 bg-slate-50 rounded-full text-slate-500 hover:bg-slate-100">
               <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setMode('post')}
              className="bg-gradient-to-br from-sky-50 to-indigo-50 border border-slate-100 p-6 rounded-[32px] flex flex-col items-center justify-center space-y-3 active:scale-95 transition-all shadow-sm group hover:shadow-md"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-sky-500 shadow-sm group-hover:scale-110 transition-transform">
                 <ImageIcon size={32} />
              </div>
              <span className="font-bold text-slate-700">Post</span>
            </button>

            <button className="bg-gradient-to-br from-pink-50 to-rose-50 border border-slate-100 p-6 rounded-[32px] flex flex-col items-center justify-center space-y-3 active:scale-95 transition-all shadow-sm group hover:shadow-md">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-pink-500 shadow-sm group-hover:scale-110 transition-transform">
                 <Aperture size={32} />
              </div>
              <span className="font-bold text-slate-700">Story</span>
            </button>

            <button className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border border-slate-100 p-6 rounded-[32px] flex flex-col items-center justify-center space-y-3 active:scale-95 transition-all shadow-sm group hover:shadow-md">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-purple-500 shadow-sm group-hover:scale-110 transition-transform">
                 <Film size={32} />
              </div>
              <span className="font-bold text-slate-700">Reel</span>
            </button>

            <button className="bg-gradient-to-br from-orange-50 to-amber-50 border border-slate-100 p-6 rounded-[32px] flex flex-col items-center justify-center space-y-3 active:scale-95 transition-all shadow-sm group hover:shadow-md">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm group-hover:scale-110 transition-transform">
                 <Video size={32} />
              </div>
              <span className="font-bold text-slate-700">Video</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER POST FORM ---
  const isPostValid = images.length > 0 && title.trim().length > 0 && title.trim().split(/\s+/).length <= 100 && (!description || description.trim().split(/\s+/).length <= 1500);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* 1. HEADER */}
      <div className="px-6 py-4 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-slate-50">
         <button onClick={() => setMode('select')} className="text-slate-500 font-bold text-sm">Cancel</button>
         <h1 className="font-serif font-bold text-lg text-slate-800">Create Post</h1>
         <button 
           onClick={handlePublish}
           disabled={!isPostValid}
           className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${
             isPostValid 
               ? 'bg-slate-900 text-white shadow-lg active:scale-95' 
               : 'bg-slate-100 text-slate-300 cursor-not-allowed'
           }`}
         >
           Post
         </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-32 space-y-8">
        
        {/* 2. IMAGE UPLOAD */}
        <div className="space-y-4">
           {images.length > 0 ? (
             <div className="flex overflow-x-auto space-x-3 pb-2 no-scrollbar">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-64 aspect-square shrink-0 rounded-2xl overflow-hidden group">
                     <img src={img} className="w-full h-full object-cover" />
                     <button 
                       onClick={() => removeImage(idx)}
                       className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                     >
                       <X size={14} />
                     </button>
                  </div>
                ))}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 aspect-square shrink-0 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-sky-400 hover:text-sky-400 transition-colors"
                >
                   <Plus size={24} />
                </div>
             </div>
           ) : (
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="w-full aspect-video rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-sky-300 transition-colors group"
             >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400 group-hover:text-sky-500 transition-colors mb-3">
                   <ImageIcon size={32} />
                </div>
                <h3 className="font-bold text-slate-600">Upload Photos</h3>
                <p className="text-xs text-slate-400">High resolution recommended</p>
             </div>
           )}
           <input type="file" multiple accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
        </div>

        {/* 3. TITLE INPUT */}
        <div className="space-y-2">
           <div className="flex justify-between">
              <label className="text-sm font-bold text-slate-800 uppercase tracking-widest">Title</label>
              <span className={`text-xs font-bold ${getWordCount(title) > 100 ? 'text-red-500' : 'text-slate-300'}`}>
                {getWordCount(title)} / 100
              </span>
           </div>
           <input 
             type="text" 
             placeholder="Write a catchy title..."
             className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
             value={title}
             onChange={(e) => setTitle(e.target.value)}
           />
        </div>

        {/* 4. DESCRIPTION INPUT */}
        <div className="space-y-2">
           <div className="flex justify-between">
              <label className="text-sm font-bold text-slate-800 uppercase tracking-widest">Description</label>
              <span className={`text-xs font-bold ${getWordCount(description) > 1500 ? 'text-red-500' : 'text-slate-300'}`}>
                {getWordCount(description)} / 1500
              </span>
           </div>
           <textarea 
             rows={6}
             placeholder="Tell your story..."
             className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all resize-none"
             value={description}
             onChange={(e) => setDescription(e.target.value)}
           ></textarea>
        </div>

        {/* 5. LINKS */}
        <div className="space-y-3">
           <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800 uppercase tracking-widest">Links</label>
              <button 
                 onClick={() => setShowLinkModal(true)}
                 disabled={links.length >= 5}
                 className="text-xs font-bold text-sky-500 uppercase tracking-wide disabled:text-slate-300"
              >
                 + Add Link
              </button>
           </div>
           
           {links.length > 0 ? (
             <div className="flex flex-wrap gap-2">
                {links.map((link, idx) => (
                   <div key={idx} className="flex items-center bg-slate-50 border border-slate-200 rounded-full pl-3 pr-1 py-1">
                      <span className="text-xs text-slate-600 max-w-[150px] truncate">{link}</span>
                      <button onClick={() => removeLink(idx)} className="ml-2 p-1 text-slate-400 hover:text-red-500">
                         <X size={14} />
                      </button>
                   </div>
                ))}
             </div>
           ) : (
              <p className="text-xs text-slate-400 italic">No links added (Max 5)</p>
           )}
        </div>

        {/* 6. PRIVACY & STORY */}
        <div className="space-y-4 pt-4 border-t border-slate-50">
           
           {/* Privacy Selector */}
           <button 
             onClick={() => setShowPrivacyModal(true)}
             className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl active:bg-slate-50 transition-colors"
           >
              <div className="flex items-center space-x-3">
                 <div className="p-2 bg-slate-100 rounded-full text-slate-600">
                    {privacy === 'public' && <Globe size={20} />}
                    {privacy === 'friends' && <Users size={20} />}
                    {privacy === 'friends_of_friends' && <Share2 size={20} />}
                    {privacy === 'private' && <Lock size={20} />}
                 </div>
                 <div className="text-left">
                    <p className="text-sm font-bold text-slate-800">Who can see this?</p>
                    <p className="text-xs text-slate-500">
                       {privacy === 'public' && 'Anyone on Kajoogram'}
                       {privacy === 'friends' && 'Only your friends'}
                       {privacy === 'friends_of_friends' && 'Friends of friends'}
                       {privacy === 'private' && 'Only me'}
                    </p>
                 </div>
              </div>
              <ChevronRight size={20} className="text-slate-300" />
           </button>

           {/* Share to Story Toggle */}
           <div className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl">
              <div className="flex items-center space-x-3">
                 <div className="p-2 bg-pink-50 rounded-full text-pink-500">
                    <Aperture size={20} />
                 </div>
                 <div className="text-left">
                    <p className="text-sm font-bold text-slate-800">Share to Story</p>
                    <p className="text-xs text-slate-500">Visible for 24 hours</p>
                 </div>
              </div>
              
              <button 
                onClick={() => setShareToStory(!shareToStory)}
                className={`w-12 h-6 rounded-full relative transition-colors ${shareToStory ? 'bg-pink-500' : 'bg-slate-200'}`}
              >
                 <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${shareToStory ? 'left-7' : 'left-1'}`}></div>
              </button>
           </div>

        </div>

      </div>

      {/* --- MODALS --- */}

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
           <div className="bg-white rounded-[32px] p-6 w-full max-w-xs shadow-2xl">
              <h3 className="font-serif font-bold text-lg mb-4">Add Link</h3>
              <input 
                type="url" 
                placeholder="https://..." 
                autoFocus
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-sky-200"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
              />
              <div className="flex space-x-3">
                 <button onClick={() => setShowLinkModal(false)} className="flex-1 py-3 bg-slate-100 rounded-xl text-xs font-bold uppercase text-slate-600">Cancel</button>
                 <button onClick={handleAddLink} className="flex-1 py-3 bg-sky-500 text-white rounded-xl text-xs font-bold uppercase shadow-lg shadow-sky-200">Add</button>
              </div>
           </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in" onClick={() => setShowPrivacyModal(false)}>
           <div className="bg-white w-full max-w-[480px] rounded-t-[32px] sm:rounded-[32px] p-6 animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 sm:hidden"></div>
              <h3 className="font-serif font-bold text-xl mb-6 text-center">Post Privacy</h3>
              
              <div className="space-y-2">
                 {[
                   { id: 'public', label: 'Public', desc: 'Anyone on Kajoogram', icon: Globe },
                   { id: 'friends_of_friends', label: 'Friends of Friends', desc: 'Your friends and their friends', icon: Share2 },
                   { id: 'friends', label: 'My Friends', desc: 'Only people you follow', icon: Users },
                   { id: 'private', label: 'Only Me', desc: 'Private to you', icon: Lock },
                 ].map((opt) => (
                    <button 
                      key={opt.id}
                      onClick={() => { setPrivacy(opt.id as any); setShowPrivacyModal(false); }}
                      className={`w-full p-4 rounded-2xl flex items-center justify-between border transition-all ${privacy === opt.id ? 'bg-sky-50 border-sky-200 ring-1 ring-sky-200' : 'bg-white border-slate-100'}`}
                    >
                       <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-full ${privacy === opt.id ? 'bg-sky-100 text-sky-600' : 'bg-slate-50 text-slate-400'}`}>
                             <opt.icon size={20} />
                          </div>
                          <div className="text-left">
                             <p className={`text-sm font-bold ${privacy === opt.id ? 'text-sky-900' : 'text-slate-700'}`}>{opt.label}</p>
                             <p className="text-xs text-slate-400">{opt.desc}</p>
                          </div>
                       </div>
                       {privacy === opt.id && <CheckCircle size={20} className="text-sky-500" />}
                    </button>
                 ))}
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default Create;
