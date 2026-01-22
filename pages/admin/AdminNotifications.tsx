
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Plus, Bell, User as UserIcon, Clock, ChevronRight, X } from 'lucide-react';
import { useNotificationContext } from '../../context/NotificationContext';

const AdminNotifications: React.FC = () => {
  const navigate = useNavigate();
  const { users, notifications } = useNotificationContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter users based on search
  const filteredUsers = searchQuery 
    ? users.filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-200 sticky top-0 z-40">
        <div className="flex items-center space-x-4">
           <button onClick={() => navigate('/admin')} className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors">
             <ArrowLeft size={24} className="text-slate-800" />
           </button>
           <h1 className="font-serif font-bold text-lg text-slate-800">Notifications</h1>
        </div>
        <button 
          onClick={() => navigate('/admin/notifications/broadcast')}
          className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide active:scale-95 transition-transform shadow-lg"
        >
          <Plus size={16} />
          <span>Broadcast</span>
        </button>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Search User Section */}
        <div className="space-y-4">
           <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <UserIcon size={16} />
              <span>Search User</span>
           </h2>
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Type username..."
                className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                   <X size={16} />
                </button>
              )}
           </div>

           {/* User Results List */}
           {searchQuery && (
             <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden animate-in slide-in-from-bottom duration-300">
               {filteredUsers.length > 0 ? (
                 filteredUsers.map(user => (
                   <button 
                     key={user.id}
                     onClick={() => navigate(`/admin/notifications/user/${user.id}`)}
                     className="w-full p-4 flex items-center justify-between border-b border-slate-50 last:border-none hover:bg-slate-50 transition-colors text-left"
                   >
                      <div className="flex items-center space-x-3">
                         <img src={user.avatar} className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                         <div>
                            <h3 className="text-sm font-bold text-slate-800">{user.username}</h3>
                            <p className="text-[10px] text-slate-400">{user.email}</p>
                         </div>
                      </div>
                      <ChevronRight size={16} className="text-slate-300" />
                   </button>
                 ))
               ) : (
                 <div className="p-6 text-center text-slate-400 text-sm">No users found.</div>
               )}
             </div>
           )}
        </div>

        {/* Recent History Section */}
        <div className="space-y-4">
           <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                 <Clock size={16} />
                 <span>Recent History</span>
              </h2>
           </div>

           <div className="space-y-3">
              {notifications.map((notif) => (
                <div key={notif.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                   <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                         <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${notif.type === 'broadcast' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                           {notif.type}
                         </span>
                         <span className="text-[10px] text-slate-400">{formatDate(notif.timestamp)}</span>
                      </div>
                   </div>
                   
                   <p className="text-sm font-medium text-slate-800 mb-2 line-clamp-2">{notif.message}</p>
                   
                   <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                      <div className="flex items-center space-x-1 text-xs text-slate-500">
                         <span>To:</span>
                         <span className="font-bold text-slate-700">{notif.targetUserName || 'Unknown'}</span>
                      </div>
                      <div className="flex space-x-2">
                         {notif.image && <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">IMG</span>}
                         {notif.video && <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">VID</span>}
                      </div>
                   </div>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-sm bg-white rounded-2xl border border-dashed border-slate-200">
                  No notifications sent yet.
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminNotifications;
