
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, UserPlus, Check, X, UserMinus, UserCheck, MessageCircle, Users } from 'lucide-react';
import { useFriendContext } from '../context/FriendContext';
import { User } from '../types';

type Tab = 'friends' | 'requests' | 'suggestions';

const FriendsList: React.FC = () => {
  const navigate = useNavigate();
  const { friends, requests, suggestions, acceptRequest, deleteRequest, sendRequest, removeFriend } = useFriendContext();
  const [activeTab, setActiveTab] = useState<Tab>('friends');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering logic
  const filterList = (list: User[]) => {
    if (!searchQuery) return list;
    return list.filter(u => 
      u.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const displayedFriends = filterList(friends);
  const displayedRequests = filterList(requests);
  const displayedSuggestions = filterList(suggestions);

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
        <Users size={32} />
      </div>
      <p className="text-slate-400 font-medium text-sm">{message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 1. HEADER */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-50">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-50 active:scale-90 transition-transform">
            <ArrowLeft size={24} className="text-slate-800" />
          </button>
          <h1 className="text-xl font-bold text-slate-900 font-serif">Friends</h1>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search people..."
              className="w-full bg-slate-100 rounded-full py-2.5 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-4 space-x-1 pb-2 overflow-x-auto no-scrollbar">
           <button 
             onClick={() => setActiveTab('friends')}
             className={`flex-1 py-2 px-4 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-colors ${activeTab === 'friends' ? 'bg-sky-500 text-white shadow-md shadow-sky-200' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
           >
             Your Friends
           </button>
           <button 
             onClick={() => setActiveTab('requests')}
             className={`flex-1 py-2 px-4 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-colors relative ${activeTab === 'requests' ? 'bg-sky-500 text-white shadow-md shadow-sky-200' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
           >
             Requests
             {requests.length > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>}
           </button>
           <button 
             onClick={() => setActiveTab('suggestions')}
             className={`flex-1 py-2 px-4 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-colors ${activeTab === 'suggestions' ? 'bg-sky-500 text-white shadow-md shadow-sky-200' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
           >
             Suggestions
           </button>
        </div>
      </div>

      {/* 2. LISTS */}
      <div className="pt-2 animate-in fade-in duration-300">
        
        {/* YOUR FRIENDS */}
        {activeTab === 'friends' && (
          <div className="divide-y divide-slate-50">
            {displayedFriends.length > 0 ? (
              displayedFriends.map((user) => (
                <div 
                  key={user.id} 
                  className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/user/${user.id}`)}
                >
                  <div className="flex items-center space-x-3">
                    <img src={user.profilePhoto} className="w-12 h-12 rounded-full object-cover border border-slate-100" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{user.username}</h3>
                      <p className="text-[10px] text-slate-400 font-medium">{user.location || 'Kajoogram User'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); /* Message Logic */ }} 
                      className="p-2 bg-slate-100 text-slate-600 rounded-full active:scale-90 transition-transform"
                    >
                      <MessageCircle size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState message={searchQuery ? "No friends found." : "No friends yet. Add some!"} />
            )}
          </div>
        )}

        {/* REQUESTS */}
        {activeTab === 'requests' && (
          <div className="divide-y divide-slate-50">
            {displayedRequests.length > 0 ? (
              displayedRequests.map((user) => (
                <div key={user.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div 
                    className="flex items-center space-x-3 cursor-pointer"
                    onClick={() => navigate(`/user/${user.id}`)}
                  >
                    <img src={user.profilePhoto} className="w-12 h-12 rounded-full object-cover border border-slate-100" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{user.username}</h3>
                      <p className="text-[10px] text-slate-400 font-medium">Sent you a request</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => acceptRequest(user.id!)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-200 active:scale-95 transition-transform"
                    >
                      Confirm
                    </button>
                    <button 
                      onClick={() => deleteRequest(user.id!)}
                      className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold active:scale-95 transition-transform"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState message="No new friend requests." />
            )}
          </div>
        )}

        {/* SUGGESTIONS */}
        {activeTab === 'suggestions' && (
          <div className="divide-y divide-slate-50">
            {displayedSuggestions.length > 0 ? (
              displayedSuggestions.map((user) => (
                <div key={user.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div 
                    className="flex items-center space-x-3 cursor-pointer"
                    onClick={() => navigate(`/user/${user.id}`)}
                  >
                    <img src={user.profilePhoto} className="w-12 h-12 rounded-full object-cover border border-slate-100" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{user.username}</h3>
                      <p className="text-[10px] text-slate-400 font-medium">Suggested for you</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => sendRequest(user.id!)}
                    disabled={false /* In real context we check if sent */}
                    className="px-4 py-2 bg-sky-50 text-sky-600 border border-sky-100 rounded-lg text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform hover:bg-sky-100"
                  >
                    <UserPlus size={14} />
                    <span>Add</span>
                  </button>
                </div>
              ))
            ) : (
              <EmptyState message="No suggestions available." />
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default FriendsList;
