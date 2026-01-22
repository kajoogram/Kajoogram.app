
import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Upload, X, Image as ImageIcon, Video, User } from 'lucide-react';
import { useNotificationContext } from '../../context/NotificationContext';
import { Notification } from '../../types';

interface Props {
  mode: 'broadcast' | 'personal';
}

const AdminNotificationSend: React.FC<Props> = ({ mode }) => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { getUser, sendNotification } = useNotificationContext();
  
  // Resolve target user if personal
  const targetUser = mode === 'personal' && userId ? getUser(userId) : null;
  
  if (mode === 'personal' && !targetUser) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <p className="text-slate-500 mb-4">User not found.</p>
        <button onClick={() => navigate('/admin/notifications')} className="font-bold">Go Back</button>
      </div>
    );
  }

  const [message, setMessage] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setImage(event.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setVideo(event.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = () => {
    if (!message.trim()) {
      alert("Please enter a notification message.");
      return;
    }

    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: mode,
      message,
      image: image || undefined,
      video: video || undefined,
      timestamp: new Date().toISOString(),
      isRead: false,
      targetUserId: targetUser?.id,
      targetUserName: mode === 'broadcast' ? 'All Users' : targetUser?.username
    };

    sendNotification(newNotification);
    alert("Notification Sent Successfully!");
    navigate('/admin/notifications');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center space-x-4 border-b border-slate-200 sticky top-0 z-40">
        <button onClick={() => navigate('/admin/notifications')} className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors">
          <ArrowLeft size={24} className="text-slate-800" />
        </button>
        <h1 className="font-serif font-bold text-lg text-slate-800">
          {mode === 'broadcast' ? 'Broadcast Notification' : 'Personal Notification'}
        </h1>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Target Info */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center space-x-3 shadow-sm">
           {mode === 'broadcast' ? (
             <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <Send size={20} />
             </div>
           ) : (
             <img src={targetUser?.avatar} className="w-10 h-10 rounded-full object-cover" />
           )}
           <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Sending To</p>
              <p className="text-sm font-bold text-slate-800">
                {mode === 'broadcast' ? 'All Users' : targetUser?.username}
              </p>
           </div>
        </div>

        {/* Message Input */}
        <div className="space-y-2">
           <label className="text-sm font-bold text-slate-800 uppercase tracking-widest">Message</label>
           <textarea 
             rows={5}
             className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 shadow-sm resize-none"
             placeholder="Write your notification here..."
             value={message}
             onChange={(e) => setMessage(e.target.value)}
           ></textarea>
        </div>

        {/* Media Uploads */}
        <div className="grid grid-cols-2 gap-4">
           {/* Image Upload */}
           <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 uppercase tracking-widest">Image (Optional)</label>
              <div 
                onClick={() => imageInputRef.current?.click()}
                className="aspect-square bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-sky-400 transition-colors relative overflow-hidden group"
              >
                 {image ? (
                   <>
                     <img src={image} className="w-full h-full object-cover" />
                     <button 
                       onClick={(e) => { e.stopPropagation(); setImage(null); }}
                       className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"
                     >
                       <X size={12} />
                     </button>
                   </>
                 ) : (
                   <div className="flex flex-col items-center text-slate-400 group-hover:text-sky-400">
                      <ImageIcon size={24} />
                      <span className="text-[10px] font-bold mt-2">Upload</span>
                   </div>
                 )}
              </div>
              <input type="file" ref={imageInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
           </div>

           {/* Video Upload */}
           <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 uppercase tracking-widest">Video (Optional)</label>
              <div 
                onClick={() => videoInputRef.current?.click()}
                className="aspect-square bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-sky-400 transition-colors relative overflow-hidden group"
              >
                 {video ? (
                   <>
                     <video src={video} className="w-full h-full object-cover" muted />
                     <button 
                       onClick={(e) => { e.stopPropagation(); setVideo(null); }}
                       className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full z-10"
                     >
                       <X size={12} />
                     </button>
                   </>
                 ) : (
                   <div className="flex flex-col items-center text-slate-400 group-hover:text-sky-400">
                      <Video size={24} />
                      <span className="text-[10px] font-bold mt-2">Upload</span>
                   </div>
                 )}
              </div>
              <input type="file" ref={videoInputRef} accept="video/*" className="hidden" onChange={handleVideoUpload} />
           </div>
        </div>

        {/* Preview Box */}
        {(message || image || video) && (
           <div className="space-y-2 pt-4">
              <label className="text-sm font-bold text-slate-800 uppercase tracking-widest">Preview</label>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-3">
                 <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="font-serif font-bold text-slate-800">K</span>
                 </div>
                 <div className="flex-1 space-y-2">
                    <p className="text-xs font-bold text-slate-900">Kajoogram</p>
                    {message && <p className="text-sm text-slate-600 leading-snug">{message}</p>}
                    {image && <img src={image} className="w-full rounded-lg border border-slate-100" />}
                    {video && <video src={video} className="w-full rounded-lg border border-slate-100" controls />}
                 </div>
              </div>
           </div>
        )}

      </div>

      {/* Footer Action */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-slate-200 p-6 z-40">
        <button 
          onClick={handleSend}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-transform flex items-center justify-center space-x-2"
        >
           <Send size={16} />
           <span>Send Notification</span>
        </button>
      </div>

    </div>
  );
};

export default AdminNotificationSend;
