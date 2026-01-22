
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { Camera, MapPin, Mail, Phone, ArrowLeft, X, Check, Link as LinkIcon, Briefcase } from 'lucide-react';

interface ProfileSetupProps {
  user: User;
  onComplete: (user: User) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ user, onComplete }) => {
  const navigate = useNavigate();
  const fileInputCoverRef = useRef<HTMLInputElement>(null);
  const fileInputProfileRef = useRef<HTMLInputElement>(null);

  // --- STATE ---
  const [profilePhoto, setProfilePhoto] = useState(user.profilePhoto || '');
  const [coverImage, setCoverImage] = useState(user.coverImage || '');
  
  const [username, setUsername] = useState(user.username || '');
  const [bio, setBio] = useState(user.bio || '');
  
  const [links, setLinks] = useState<string[]>(user.links || []);
  const [newLink, setNewLink] = useState('');
  
  const [address, setAddress] = useState(user.fullAddress || '');
  const [email, setEmail] = useState(user.email || '');
  const [businessEmail, setBusinessEmail] = useState(user.businessEmail || '');
  const [mobile, setMobile] = useState(user.mobile || '');

  const [saving, setSaving] = useState(false);

  // --- HELPERS ---
  const getWordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

  const handleLinkAdd = () => {
    if (newLink && links.length < 5) {
       setLinks([...links, newLink]);
       setNewLink('');
    }
  };

  const handleLinkRemove = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'profile') => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      if (type === 'cover') setCoverImage(url);
      else setProfilePhoto(url);
    }
  };

  const handleSave = () => {
    if (getWordCount(username) > 20) {
      alert("Name exceeds 20 words.");
      return;
    }
    if (getWordCount(bio) > 200) {
      alert("Bio exceeds 200 words.");
      return;
    }

    setSaving(true);

    // Simulate API delay
    setTimeout(() => {
      const updatedUser: User = {
        ...user,
        profilePhoto,
        coverImage,
        username,
        bio,
        links,
        fullAddress: address,
        email,
        businessEmail,
        mobile,
        isLoggedIn: true
      };
      
      onComplete(updatedUser);
      setSaving(false);
      navigate('/profile'); // Redirect to profile
    }, 800);
  };

  // Determine if there are changes to enable save button (simplified logic)
  const hasChanges = true; // In real app, deep compare with initial user prop

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* 1. STICKY HEADER */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl px-6 py-4 flex items-center justify-between border-b border-slate-100 shadow-sm transition-all">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-full transition-all active:scale-90"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-serif font-bold text-lg text-slate-800">Edit Profile</h1>
        <button 
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="text-sm font-bold text-sky-600 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
        >
          {saving ? 'Saving...' : 'Save'}
          {!saving && <Check size={16} />}
        </button>
      </div>

      <div className="space-y-6">
        
        {/* SECTION 1: VISUALS */}
        <div className="bg-white pb-6 border-b border-slate-100">
           {/* Cover Image */}
           <div className="relative w-full aspect-[16/9] bg-slate-200 group cursor-pointer overflow-hidden" onClick={() => fileInputCoverRef.current?.click()}>
              {coverImage ? (
                <img src={coverImage} className="w-full h-full object-cover" alt="Cover" />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full text-slate-400">
                   <Camera size={32} />
                   <span className="text-[10px] font-bold uppercase mt-2">Upload Cover</span>
                </div>
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/50 text-white">
                    <Camera size={24} />
                 </div>
              </div>
              <input type="file" ref={fileInputCoverRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} />
           </div>

           {/* Profile Photo */}
           <div className="relative px-6 -mt-16 flex justify-center">
              <div className="relative w-32 h-32 rounded-full p-1.5 bg-white shadow-lg">
                 <div 
                   className="w-full h-full rounded-full bg-slate-100 overflow-hidden relative group cursor-pointer"
                   onClick={() => fileInputProfileRef.current?.click()}
                 >
                    {profilePhoto ? (
                       <img src={profilePhoto} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                       <div className="flex items-center justify-center w-full h-full text-slate-300">
                          <Camera size={24} />
                       </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <Camera size={20} className="text-white" />
                    </div>
                 </div>
                 <input type="file" ref={fileInputProfileRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'profile')} />
              </div>
           </div>
        </div>

        {/* SECTION 2: BASIC DETAILS */}
        <div className="px-6 space-y-6">
           <div className="space-y-2">
              <div className="flex justify-between items-center">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Display Name</label>
                 <span className={`text-[10px] font-bold ${getWordCount(username) > 20 ? 'text-red-500' : 'text-slate-300'}`}>
                    {getWordCount(username)}/20 Words
                 </span>
              </div>
              <input 
                type="text" 
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all shadow-sm"
                placeholder="Your Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
           </div>

           <div className="space-y-2">
              <div className="flex justify-between items-center">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bio</label>
                 <span className={`text-[10px] font-bold ${getWordCount(bio) > 200 ? 'text-red-500' : 'text-slate-300'}`}>
                    {getWordCount(bio)}/200 Words
                 </span>
              </div>
              <textarea 
                rows={4}
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all shadow-sm resize-none"
                placeholder="Tell the world about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
           </div>
        </div>

        {/* SECTION 3: LINKS */}
        <div className="px-6">
           <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <LinkIcon size={14} />
                 <span>Links ({links.length}/5)</span>
              </label>

              {/* Links List */}
              <div className="space-y-2">
                 {links.map((link, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                       <span className="text-xs font-medium text-blue-600 truncate max-w-[85%]">{link}</span>
                       <button onClick={() => handleLinkRemove(idx)} className="text-slate-400 hover:text-red-500 transition-colors">
                          <X size={16} />
                       </button>
                    </div>
                 ))}
              </div>
              
              {/* Add New Link */}
              {links.length < 5 && (
                 <div className="flex space-x-2">
                    <input 
                      type="url"
                      placeholder="https://website.com"
                      className="flex-1 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-100"
                      value={newLink}
                      onChange={(e) => setNewLink(e.target.value)}
                    />
                    <button 
                      onClick={handleLinkAdd}
                      disabled={!newLink}
                      className="px-4 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase disabled:opacity-50"
                    >
                       Add
                    </button>
                 </div>
              )}
           </div>
        </div>

        {/* SECTION 4: CONTACT & ADDRESS */}
        <div className="px-6 space-y-5 pb-6">
           <h3 className="text-sm font-serif font-bold text-slate-800 border-b border-slate-100 pb-2">Contact Details</h3>
           
           <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                 <MapPin size={12} /> Address
              </label>
              <textarea 
                rows={2}
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all resize-none shadow-sm"
                placeholder="Your full address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></textarea>
           </div>

           <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                 <Briefcase size={12} /> Business Email
              </label>
              <input 
                type="email"
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all shadow-sm"
                placeholder="contact@business.com"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
              />
           </div>

           <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                 <Phone size={12} /> Mobile Number
              </label>
              <input 
                type="tel"
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all shadow-sm"
                placeholder="+91 00000 00000"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
           </div>
        </div>

        {/* SECTION 5: FLOATING SAVE (Mobile-First UX) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-6 z-40 max-w-[480px] mx-auto">
           <button 
              onClick={handleSave}
              disabled={saving}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-slate-200 active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
           >
              {saving ? <span>Saving Profile...</span> : <span>Save Changes</span>}
           </button>
        </div>

      </div>
    </div>
  );
};

export default ProfileSetup;
