
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MoreVertical, Bell } from 'lucide-react';
import { CHANNELS, MOCK_VIDEOS, MOCK_SHORTS, shuffleArray } from '../data';
import { Video } from '../types';

const ChannelPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'videos' | 'shorts' | 'about'>('videos');

  const channel = CHANNELS.find(c => c.id === id);

  // Filter content for this channel (simulated)
  const channelVideos = MOCK_VIDEOS.filter(v => v.channelId === id).length > 0 
    ? MOCK_VIDEOS.filter(v => v.channelId === id)
    : shuffleArray(MOCK_VIDEOS).slice(0, 10); // Fallback to random if exact match scarce in mock

  const channelShorts = shuffleArray(MOCK_SHORTS).slice(0, 10);

  if (!channel) return <div className="p-10 text-center">Channel not found</div>;

  return (
    <div className="bg-white min-h-screen">
      {/* Banner */}
      <div className="relative w-full h-32 sm:h-40 bg-slate-200">
         <img src={channel.banner} className="w-full h-full object-cover" />
         <button 
           onClick={() => navigate(-1)} 
           className="absolute top-4 left-4 p-2 bg-black/40 text-white rounded-full backdrop-blur-md"
         >
           <ArrowLeft size={20} />
         </button>
         <div className="absolute top-4 right-4 flex space-x-3">
            <button className="p-2 bg-black/40 text-white rounded-full backdrop-blur-md"><Search size={20} /></button>
            <button className="p-2 bg-black/40 text-white rounded-full backdrop-blur-md"><MoreVertical size={20} /></button>
         </div>
      </div>

      {/* Info */}
      <div className="px-4 py-4 flex flex-col items-center -mt-10 relative z-10">
         <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-sm">
            <img src={channel.avatar} className="w-full h-full object-cover" />
         </div>
         <h1 className="text-xl font-bold text-slate-900 mt-2">{channel.name}</h1>
         <p className="text-xs text-slate-500 font-medium">{channel.subscribers} subscribers • {channelVideos.length} videos</p>
         <p className="text-xs text-slate-500 mt-2 text-center max-w-xs line-clamp-2">{channel.description}</p>
         
         <button className="mt-4 w-full max-w-[200px] py-2 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-2">
            <Bell size={14} />
            <span>Subscribe</span>
         </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 mt-2">
         {['videos', 'shorts', 'about'].map(tab => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab as any)}
             className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide relative ${activeTab === tab ? 'text-slate-900' : 'text-slate-400'}`}
           >
             {tab}
             {activeTab === tab && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-slate-900"></div>}
           </button>
         ))}
      </div>

      {/* Content */}
      <div className="pb-10 min-h-[400px]">
         {activeTab === 'videos' && (
           <div className="p-4 space-y-6 animate-in fade-in">
             {channelVideos.map((vid) => (
                <div key={vid.id} className="flex flex-col space-y-2 cursor-pointer" onClick={() => navigate(`/video/${vid.id}`)}>
                   <div className="w-full aspect-video bg-slate-100 rounded-xl overflow-hidden relative">
                      <img src={vid.thumbnail} className="w-full h-full object-cover" />
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">10:05</div>
                   </div>
                   <div>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2">{vid.title}</h3>
                      <p className="text-[10px] text-slate-500">{vid.views} • {vid.uploadedAt}</p>
                   </div>
                </div>
             ))}
           </div>
         )}

         {activeTab === 'shorts' && (
           <div className="grid grid-cols-3 gap-2 p-2 animate-in fade-in">
             {channelShorts.map((short) => (
                <div key={short.id} className="aspect-[9/16] bg-slate-100 rounded-lg overflow-hidden relative cursor-pointer" onClick={() => navigate('/reels')}>
                   <img src={short.thumbnail} className="w-full h-full object-cover" />
                   <div className="absolute bottom-2 left-2 text-white font-bold text-[10px] drop-shadow-md">{short.views}</div>
                </div>
             ))}
           </div>
         )}
         
         {activeTab === 'about' && (
            <div className="p-6 text-sm text-slate-600 leading-relaxed animate-in fade-in">
               <p>{channel.description}</p>
               <div className="mt-6 space-y-2">
                  <h4 className="font-bold text-slate-900">Details</h4>
                  <p>Location: India</p>
                  <p>Joined: Jan 12, 2015</p>
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default ChannelPage;
