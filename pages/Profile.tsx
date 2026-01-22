
import React, { useState } from 'react';
import { User } from '../types';
import Footer from '../components/Footer';
import { MoreVertical, Users, MessageCircle, Plus, Menu, Camera, Video, Image as ImageIcon, Smile, Edit3, Info, Settings, LogOut, Shield, HelpCircle, Mail, UserPlus, FileText, LayoutDashboard, Heart, MessageSquare, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

type Tab = 'posts' | 'about' | 'photos' | 'reels';

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const [showFullBio, setShowFullBio] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const bioText = user.bio || "Fashion enthusiast & luxury collector. Living life in silver gradients. Exploring the world one outfit at a time. Lover of aesthetic cafes and vintage watches.";
  const isBioLong = bioText.length > 100;

  const MenuLink = ({ icon: Icon, label, onClick, isRed = false }: any) => (
    <button 
      onClick={onClick} 
      className={`w-full p-4 flex items-center justify-between group transition-all rounded-2xl ${isRed ? 'hover:bg-red-50' : 'hover:bg-slate-50'}`}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-2.5 rounded-xl transition-colors ${isRed ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-600 group-hover:bg-white group-hover:shadow-sm'}`}>
          <Icon size={20} strokeWidth={1.5} />
        </div>
        <span className={`text-sm font-bold ${isRed ? 'text-red-500' : 'text-slate-700'}`}>{label}</span>
      </div>
      {!isRed && <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500" />}
    </button>
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-32 overflow-hidden relative">
      
      {/* 1. STICKY HEADER */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-100 shadow-sm">
        {/* Left: Friends Button */}
        <button 
          onClick={() => navigate('/friends')}
          className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-full transition-colors active:scale-95"
        >
           <Users size={18} />
           <span className="text-xs font-bold uppercase tracking-wide">Friends</span>
        </button>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3">
           <button className="p-2.5 bg-slate-100 rounded-full text-slate-800 hover:bg-slate-200 active:scale-90 transition-transform">
              <MessageCircle size={20} />
           </button>
           <button onClick={() => navigate('/create')} className="p-2.5 bg-slate-100 rounded-full text-slate-800 hover:bg-slate-200 active:scale-90 transition-transform">
              <Plus size={20} />
           </button>
           <button onClick={() => setShowMenu(true)} className="p-2.5 bg-slate-100 rounded-full text-slate-800 hover:bg-slate-200 active:scale-90 transition-transform">
              <Menu size={20} />
           </button>
        </div>
      </div>

      {/* 2. COVER & AVATAR */}
      <div className="relative bg-white pb-4 mb-2">
        {/* Cover */}
        <div className="relative w-full aspect-[16/9] bg-slate-300 overflow-hidden">
           <img 
             src={user.coverImage || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop'} 
             className="w-full h-full object-cover" 
             alt="Cover"
           />
        </div>

        {/* Avatar */}
        <div className="relative flex flex-col items-center -mt-16 px-4">
           <div className="w-32 h-32 rounded-full p-1 bg-white shadow-md relative z-10">
              <img 
                src={user.profilePhoto || `https://ui-avatars.com/api/?name=${user.username}&background=random`} 
                className="w-full h-full rounded-full object-cover border-4 border-white"
                alt="Avatar"
              />
           </div>
           
           {/* Name & Headline */}
           <div className="text-center mt-3 space-y-1">
              <h1 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-1">
                {user.username || 'User Name'}
                {user.isAdmin && <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px]">✓</span>}
              </h1>
              {/* Friends Count (Clickable) */}
              <button 
                onClick={() => navigate('/friends')} 
                className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
              >
                Friends • {user.friendsCount || 1256}
              </button>
           </div>

           {/* 3. ACTION BUTTONS ROW */}
           <div className="flex w-full space-x-3 mt-5 px-2">
              <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-md active:scale-95 transition-transform flex items-center justify-center space-x-2">
                 <Plus size={16} />
                 <span>Add to Story</span>
              </button>
              <button onClick={() => navigate('/setup')} className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-200 active:scale-95 transition-transform flex items-center justify-center space-x-2">
                 <Edit3 size={16} />
                 <span>Edit Profile</span>
              </button>
              <button className="p-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 active:scale-95 transition-transform">
                 <MoreVertical size={20} />
              </button>
           </div>
        </div>
      </div>

      {/* 4. BIO & INFO SECTION */}
      <div className="bg-white p-4 mb-2 space-y-4 shadow-sm">
         <div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">Bio</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
               {showFullBio ? bioText : bioText.slice(0, 100) + (isBioLong ? '...' : '')}
            </p>
            {isBioLong && (
              <button 
                onClick={() => setShowFullBio(!showFullBio)}
                className="text-sm font-bold text-slate-800 mt-1 hover:underline"
              >
                {showFullBio ? 'Show less' : 'Read more'}
              </button>
            )}
         </div>
         
         {/* User Links Display */}
         {user.links && user.links.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
               {user.links.map((link, idx) => (
                  <a key={idx} href={link} target="_blank" rel="noreferrer" className="px-3 py-1 bg-sky-50 text-sky-600 text-xs font-medium rounded-full truncate max-w-[200px] border border-sky-100">
                     {link}
                  </a>
               ))}
            </div>
         )}

         <div className="space-y-3 pt-2 border-t border-slate-50">
            {/* Manual/Static Address Row */}
            <div className="flex items-start space-x-3 text-slate-600 p-2 -mx-2">
               <div className="mt-0.5"><Info size={20} className="text-slate-400" /></div>
               <div>
                  <span className="text-sm block font-medium">Address</span>
                  <span className="text-xs text-slate-500">
                     {user.fullAddress || 'No address added'}
                  </span>
               </div>
            </div>
         </div>
      </div>

      {/* 5. POST CREATION */}
      <div className="bg-white p-4 mb-2 shadow-sm">
         <div className="flex space-x-3 mb-4">
            <img src={user.profilePhoto || `https://ui-avatars.com/api/?name=${user.username}`} className="w-10 h-10 rounded-full object-cover" />
            <div 
              onClick={() => navigate('/create')}
              className="flex-1 bg-slate-100 rounded-full flex items-center px-4 cursor-pointer hover:bg-slate-200 transition-colors"
            >
               <span className="text-sm text-slate-500 font-medium">What's on your mind?</span>
            </div>
         </div>
         <div className="flex justify-between border-t border-slate-50 pt-3 px-2">
             <button onClick={() => navigate('/create')} className="flex items-center space-x-1.5 text-slate-600 active:scale-95 transition-transform">
                <ImageIcon size={18} className="text-green-500" />
                <span className="text-xs font-bold">Photo</span>
             </button>
             <button onClick={() => navigate('/reels')} className="flex items-center space-x-1.5 text-slate-600 active:scale-95 transition-transform">
                <Video size={18} className="text-red-500" />
                <span className="text-xs font-bold">Reel</span>
             </button>
             <button className="flex items-center space-x-1.5 text-slate-600 active:scale-95 transition-transform">
                <Smile size={18} className="text-yellow-500" />
                <span className="text-xs font-bold">Feeling</span>
             </button>
         </div>
      </div>

      {/* 6. NAVIGATION TABS */}
      <div className="sticky top-[60px] z-30 bg-white shadow-sm mb-2">
         <div className="flex">
            {['posts', 'about', 'photos', 'reels'].map((tab) => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab as Tab)}
                 className={`flex-1 py-3.5 text-sm font-bold uppercase tracking-wide relative transition-colors ${activeTab === tab ? 'text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
               >
                 {tab}
                 {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
                 )}
               </button>
            ))}
         </div>
      </div>

      {/* 7. CONTENT AREA */}
      <div className="pb-10">
         {activeTab === 'posts' && (
            <div className="px-4 py-8 text-center text-slate-400 bg-white">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText size={24} className="text-slate-300" />
               </div>
               <h3 className="font-bold text-slate-700">No Posts Yet</h3>
               <p className="text-xs mt-1">Share your first moment with friends.</p>
            </div>
         )}
         
         {activeTab === 'photos' && (
            <div className="bg-white p-1 grid grid-cols-3 gap-1">
               {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="aspect-square bg-slate-100 relative group">
                     <img src={`https://picsum.photos/id/${100+i}/300/300`} className="w-full h-full object-cover" />
                  </div>
               ))}
            </div>
         )}

         {activeTab === 'reels' && (
            <div className="bg-white p-1 grid grid-cols-3 gap-1">
               {[1,2,3].map(i => (
                  <div key={i} className="aspect-[9/16] bg-slate-100 relative group" onClick={() => navigate('/reels')}>
                     <img src={`https://picsum.photos/id/${200+i}/300/500`} className="w-full h-full object-cover" />
                     <div className="absolute bottom-2 left-2 flex items-center text-white text-[10px] font-bold space-x-1 drop-shadow-md">
                        <Video size={10} fill="currentColor" />
                        <span>2.1k</span>
                     </div>
                  </div>
               ))}
            </div>
         )}

         {activeTab === 'about' && (
            <div className="bg-white p-6 space-y-6">
               <div>
                  <h4 className="font-bold text-slate-800 mb-2">Basic Info</h4>
                  <div className="space-y-2 text-sm text-slate-600">
                     <p><span className="font-medium text-slate-900">Gender:</span> Female</p>
                     <p><span className="font-medium text-slate-900">Birthday:</span> Jan 12, 1998</p>
                  </div>
               </div>
               <div>
                  <h4 className="font-bold text-slate-800 mb-2">Contact Info</h4>
                  <div className="space-y-2 text-sm text-slate-600">
                     <p><span className="font-medium text-slate-900">Email:</span> {user.email}</p>
                     {user.businessEmail && <p><span className="font-medium text-slate-900">Business:</span> {user.businessEmail}</p>}
                     <p><span className="font-medium text-slate-900">Mobile:</span> {user.mobile || '+91 98765 43210'}</p>
                  </div>
               </div>
            </div>
         )}
      </div>

      {/* RIGHT SIDE MENU DRAWER */}
      {showMenu && (
        <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm" onClick={() => setShowMenu(false)}>
           <div 
             className="absolute top-0 right-0 h-full w-[85%] max-w-[320px] bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col"
             onClick={e => e.stopPropagation()}
           >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
                 <h2 className="font-serif font-bold text-xl text-slate-800">Menu</h2>
                 <button onClick={() => setShowMenu(false)} className="p-2 -mr-2 text-slate-400 hover:text-slate-800 active:scale-90 transition-transform">
                   <X size={24} />
                 </button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                 <MenuLink icon={LayoutDashboard} label="Dashboard" onClick={() => navigate('/dashboard')} />
                 <MenuLink icon={Edit3} label="Edit Profile" onClick={() => navigate('/setup')} />
                 {user.isAdmin && <MenuLink icon={Shield} label="Admin Panel" onClick={() => navigate('/admin')} />}
                 <MenuLink icon={Settings} label="Settings" onClick={() => {}} />
                 <MenuLink icon={MessageSquare} label="Chats" onClick={() => {}} />
                 <MenuLink icon={Heart} label="Wishlist" onClick={() => navigate('/wishlist')} />
                 
                 <div className="h-px bg-slate-100 my-2 mx-4"></div>
                 
                 <MenuLink icon={HelpCircle} label="Help & Support" onClick={() => navigate('/page/help')} />
                 <MenuLink icon={Shield} label="Reports" onClick={() => navigate('/admin/reports')} /> 
                 <MenuLink icon={Info} label="About Us" onClick={() => navigate('/page/about')} />
                 <MenuLink icon={Mail} label="Contact Us" onClick={() => navigate('/page/contact')} />
                 <MenuLink icon={UserPlus} label="Follow Us" onClick={() => navigate('/page/follow')} />
                 <MenuLink icon={Shield} label="Privacy Policy" onClick={() => navigate('/page/privacy')} />
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-slate-50">
                 <MenuLink icon={LogOut} label="Log Out" onClick={() => { onLogout(); setShowMenu(false); }} isRed />
              </div>
           </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Profile;
