
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, MessageCircle, MoreVertical, UserPlus, UserCheck, UserMinus, FileText, Video, Image as ImageIcon, X } from 'lucide-react';
import { useFriendContext } from '../context/FriendContext';
import Footer from '../components/Footer';

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { getUserById, sendRequest, acceptRequest, removeFriend } = useFriendContext();
  const [activeTab, setActiveTab] = useState<'posts' | 'photos'>('posts');
  const [showFriendMenu, setShowFriendMenu] = useState(false);
  const [showUnfriendConfirm, setShowUnfriendConfirm] = useState(false);

  const user = userId ? getUserById(userId) : undefined;

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
        <p className="text-slate-500">User not found.</p>
        <button onClick={() => navigate(-1)} className="font-bold border-b border-black">Go Back</button>
      </div>
    );
  }

  const handleFriendAction = () => {
    if (user.friendStatus === 'none') {
      sendRequest(user.id!);
    } else if (user.friendStatus === 'request_received') {
      acceptRequest(user.id!);
    } else if (user.friendStatus === 'friend') {
      setShowFriendMenu(true);
    }
  };

  const handleUnfriendConfirm = () => {
    if (user.id) {
      removeFriend(user.id);
      setShowUnfriendConfirm(false);
      setShowFriendMenu(false);
    }
  };

  const renderFriendButton = () => {
    switch (user.friendStatus) {
      case 'friend':
        return (
          <button onClick={handleFriendAction} className="flex-1 py-2.5 bg-green-500 text-white rounded-lg font-bold text-sm shadow-md active:scale-95 transition-transform flex items-center justify-center space-x-2">
             <UserCheck size={18} />
             <span>Friends</span>
          </button>
        );
      case 'request_sent':
        return (
          <button disabled className="flex-1 py-2.5 bg-slate-200 text-slate-500 rounded-lg font-bold text-sm flex items-center justify-center space-x-2 cursor-default">
             <UserPlus size={18} />
             <span>Requested</span>
          </button>
        );
      case 'request_received':
        return (
          <button onClick={handleFriendAction} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-md active:scale-95 transition-transform flex items-center justify-center space-x-2">
             <UserCheck size={18} />
             <span>Accept</span>
          </button>
        );
      default:
        return (
          <button onClick={handleFriendAction} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-md active:scale-95 transition-transform flex items-center justify-center space-x-2">
             <UserPlus size={18} />
             <span>Add Friend</span>
          </button>
        );
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-32">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-100 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft size={24} className="text-slate-800" />
        </button>
        <span className="font-bold text-slate-800">{user.username}</span>
        <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <MoreVertical size={24} className="text-slate-800" />
        </button>
      </div>

      {/* Cover & Avatar */}
      <div className="relative bg-white pb-4 mb-2">
        <div className="relative w-full aspect-[16/9] bg-slate-300 overflow-hidden">
           <img src={user.coverImage || 'https://picsum.photos/800/450'} className="w-full h-full object-cover" />
        </div>
        <div className="relative flex flex-col items-center -mt-16 px-4">
           <div className="w-32 h-32 rounded-full p-1 bg-white shadow-md relative z-10">
              <img src={user.profilePhoto} className="w-full h-full rounded-full object-cover border-4 border-white" />
           </div>
           
           <div className="text-center mt-3 space-y-1">
              <h1 className="text-2xl font-bold text-slate-900">{user.username}</h1>
              <p className="text-sm text-slate-500">{user.bio || 'Kajoogram User'}</p>
              {user.location && (
                <div className="flex items-center justify-center gap-1 text-xs text-slate-400 font-medium">
                  <MapPin size={12} />
                  <span>{user.location}</span>
                </div>
              )}
           </div>

           {/* Actions */}
           <div className="flex w-full space-x-3 mt-5 px-6">
              {renderFriendButton()}
              <button className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-200 active:scale-95 transition-transform flex items-center justify-center space-x-2">
                 <MessageCircle size={18} />
                 <span>Message</span>
              </button>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-[60px] z-40 bg-white shadow-sm mb-2">
         <div className="flex">
            {['posts', 'photos'].map((tab) => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab as any)}
                 className={`flex-1 py-3.5 text-sm font-bold uppercase tracking-wide relative transition-colors ${activeTab === tab ? 'text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
               >
                 {tab}
                 {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>}
               </button>
            ))}
         </div>
      </div>

      {/* Content */}
      <div className="pb-10">
         {activeTab === 'posts' && (
            <div className="px-4 py-16 text-center text-slate-400 bg-white">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText size={24} className="text-slate-300" />
               </div>
               <h3 className="font-bold text-slate-700">No Posts Yet</h3>
            </div>
         )}
         
         {activeTab === 'photos' && (
            <div className="bg-white p-1 grid grid-cols-3 gap-1">
               {[1,2,3].map(i => (
                  <div key={i} className="aspect-square bg-slate-100 relative group">
                     <img src={`https://picsum.photos/id/${(parseInt(user.id!.split('-')[1] || '1') * 10 + i)}/300/300`} className="w-full h-full object-cover" />
                  </div>
               ))}
            </div>
         )}
      </div>

      {/* Friend Options Bottom Sheet */}
      {showFriendMenu && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-end animate-in fade-in duration-200" onClick={() => setShowFriendMenu(false)}>
           <div className="w-full bg-white rounded-t-[32px] p-6 animate-in slide-in-from-bottom duration-300" onClick={(e) => e.stopPropagation()}>
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
              
              <div className="flex flex-col space-y-2">
                 <button 
                   onClick={() => { setShowFriendMenu(false); setShowUnfriendConfirm(true); }}
                   className="w-full py-4 text-red-500 font-bold text-sm bg-red-50 rounded-2xl flex items-center justify-center space-x-2 active:scale-95 transition-transform"
                 >
                    <UserMinus size={20} />
                    <span>Unfriend</span>
                 </button>
                 <button 
                   onClick={() => setShowFriendMenu(false)}
                   className="w-full py-4 text-slate-600 font-bold text-sm bg-slate-50 rounded-2xl active:scale-95 transition-transform"
                 >
                    Cancel
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showUnfriendConfirm && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="bg-white rounded-[32px] p-8 w-full max-w-xs shadow-2xl animate-in zoom-in duration-300">
              <div className="text-center mb-6">
                 <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Unfriend?</h3>
                 <p className="text-sm text-slate-500 leading-relaxed">
                   Are you sure you want to remove this friend?
                 </p>
              </div>
              <div className="flex space-x-3">
                 <button 
                   onClick={() => setShowUnfriendConfirm(false)}
                   className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-wider"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={handleUnfriendConfirm}
                   className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-200 active:scale-95 transition-transform"
                 >
                   Unfriend
                 </button>
              </div>
           </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default UserProfile;
