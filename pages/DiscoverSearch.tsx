import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, SlidersHorizontal, X, Compass, Check, Youtube, User } from 'lucide-react';
import { MOCK_VIDEOS, MOCK_SHORTS, CHANNELS, USER_POSTS, shuffleArray } from '../data';
import { Video, Channel, UserPost, SearchFilters } from '../types';

type SearchTab = 'All' | 'Reels' | 'Video' | 'Profile' | 'Channel';

// --- SUB-COMPONENTS ---

const ChannelCard: React.FC<{ channel: Channel }> = ({ channel }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-none">
     <div className="flex items-center space-x-3">
        <img src={channel.avatar} className="w-12 h-12 rounded-full object-cover" />
        <div>
           <h4 className="font-bold text-slate-900 text-sm">{channel.name}</h4>
           <p className="text-xs text-slate-500">{channel.subscribers} subscribers</p>
        </div>
     </div>
     <button 
       onClick={() => window.open(`https://www.youtube.com/results?search_query=${channel.name}`, '_blank')}
       className="px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-wide"
     >
       View Channel
     </button>
  </div>
);

const ProfileCard: React.FC<{ profile: UserPost }> = ({ profile }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-none">
       <div className="flex items-center space-x-3">
          <img src={profile.userAvatar} className="w-12 h-12 rounded-full object-cover" />
          <div>
             <h4 className="font-bold text-slate-900 text-sm">{profile.username}</h4>
             <p className="text-xs text-slate-500">TryKaro User</p>
          </div>
       </div>
       <button 
         onClick={() => navigate('/profile')}
         className="px-4 py-2 bg-gradient-to-r from-sky-400 to-indigo-500 text-white rounded-full text-[10px] font-bold uppercase tracking-wide"
       >
         View Profile
       </button>
    </div>
  );
};

const VideoListCard: React.FC<{ video: Video }> = ({ video }) => {
  const navigate = useNavigate();
  return (
    <div className="flex space-x-3 mb-4 cursor-pointer" onClick={() => navigate(`/video/${video.id}`)}>
      <div className="w-40 aspect-video bg-slate-100 rounded-xl overflow-hidden relative shrink-0">
         <img src={video.thumbnail} className="w-full h-full object-cover" />
         <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1 rounded">
            {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
         </div>
      </div>
      <div className="flex-1 py-0.5">
         <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-tight mb-1">{video.title}</h3>
         <div className="flex items-center text-[10px] text-slate-500 space-x-1">
            <span>{video.channelName || 'TryKaro'}</span>
            <span>•</span>
            <span>{video.views}</span>
         </div>
         <p className="text-[10px] text-slate-400 mt-1">{video.uploadedAt}</p>
      </div>
      <div className="w-6 shrink-0 flex justify-end">
         {/* Menu icon placeholder */}
      </div>
    </div>
  );
};

const DiscoverSearch: React.FC = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  // Results
  const [videoResults, setVideoResults] = useState<Video[]>([]);
  const [shortsResults, setShortsResults] = useState<Video[]>([]);
  const [channelResults, setChannelResults] = useState<Channel[]>([]);
  const [profileResults, setProfileResults] = useState<UserPost[]>([]); // Derived from posts for demo

  // Filters
  const [filters, setFilters] = useState<SearchFilters>({
    date: 'any',
    duration: 'any',
    type: 'any' // youtube or trykaro
  });

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Reset Filters on Query Change
  useEffect(() => {
    setFilters({ date: 'any', duration: 'any', type: 'any' });
  }, [query]);

  // Search Logic
  useEffect(() => {
    if (!query) {
      setVideoResults([]);
      setShortsResults([]);
      setChannelResults([]);
      setProfileResults([]);
      return;
    }

    const delay = setTimeout(() => {
      // 1. Filter Raw Data
      const rawVideos = MOCK_VIDEOS.filter(v => v.title.toLowerCase().includes(query.toLowerCase()) || v.channelName.toLowerCase().includes(query.toLowerCase()));
      const rawShorts = MOCK_SHORTS.filter(s => s.title.toLowerCase().includes(query.toLowerCase()));
      const rawChannels = CHANNELS.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
      // Mock profiles from user posts or specific users logic (using posts to derive users for demo)
      const rawProfiles = USER_POSTS.filter(p => p.username.toLowerCase().includes(query.toLowerCase()));

      // 2. Apply Filters
      const filteredVideos = rawVideos.filter(v => {
        // Source Filter
        if (filters.type === 'youtube' && !v.channelId) return false; // Assumption: YT has channelId
        if (filters.type === 'trykaro' && v.channelId) return false; 
        
        // Duration Filter
        if (filters.duration === 'short' && v.duration > 240) return false; // < 4 min
        if (filters.duration === 'medium' && (v.duration <= 240 || v.duration > 1200)) return false; // 4-20 min
        if (filters.duration === 'long' && v.duration <= 1200) return false; // > 20 min

        // Date Filter (Simple string match approximation for mock data)
        if (filters.date !== 'any') {
           const time = v.uploadedAt.toLowerCase();
           if (filters.date === 'today' && !time.includes('hour') && !time.includes('minute')) return false;
           if (filters.date === 'week' && !time.includes('day') && !time.includes('hour')) return false;
           if (filters.date === 'month' && !time.includes('week') && !time.includes('day')) return false;
           // 'year' essentially includes everything in our mock data
        }
        return true;
      });

      setVideoResults(filteredVideos);
      setShortsResults(rawShorts); // Filters mostly apply to long form in UI, but could extend
      setChannelResults(rawChannels);
      setProfileResults(rawProfiles);

      // Update History if query is substantial
      if (query.length > 2 && !searchHistory.includes(query)) {
        setSearchHistory(prev => [query, ...prev].slice(0, 5));
      }

    }, 300);

    return () => clearTimeout(delay);
  }, [query, filters]);

  const handleBack = () => {
    // If history exists, pop (simulated), else go back to discover
    if (searchHistory.length > 0 && query !== searchHistory[0]) {
       setQuery(searchHistory[0]);
    } else {
       navigate(-1);
    }
  };

  // --- VIEWS ---

  const renderAllTab = () => (
    <div className="pb-20">
      {/* 1. Related Channels */}
      {channelResults.length > 0 && (
        <div className="py-4 border-b border-slate-50">
          <h3 className="px-6 mb-3 text-sm font-bold text-slate-800">Related Channels</h3>
          <div className="flex overflow-x-auto px-6 space-x-4 no-scrollbar">
            {channelResults.map(ch => (
              <div key={ch.id} className="flex flex-col items-center space-y-2 shrink-0 w-24">
                 <img src={ch.avatar} className="w-16 h-16 rounded-full object-cover border border-slate-100" />
                 <span className="text-xs font-medium text-center line-clamp-1 w-full">{ch.name}</span>
                 <button 
                   onClick={() => window.open(`https://www.youtube.com/results?search_query=${ch.name}`, '_blank')}
                   className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[9px] font-bold"
                 >
                   View
                 </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. TryKaro Profiles */}
      {profileResults.length > 0 && (
        <div className="py-4 border-b border-slate-50">
          <h3 className="px-6 mb-3 text-sm font-bold text-slate-800">TryKaro Profiles</h3>
          <div className="flex overflow-x-auto px-6 space-x-4 no-scrollbar">
            {profileResults.map(p => (
              <div key={p.id} className="flex flex-col items-center space-y-2 shrink-0 w-24">
                 <img src={p.userAvatar} className="w-16 h-16 rounded-full object-cover border border-slate-100" />
                 <span className="text-xs font-medium text-center line-clamp-1 w-full">{p.username}</span>
                 <button onClick={() => navigate('/profile')} className="px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-[9px] font-bold">
                   Visit
                 </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Reels Section */}
      {shortsResults.length > 0 && (
        <div className="py-4 border-b border-slate-50">
           <h3 className="px-6 mb-3 text-sm font-bold text-slate-800 flex items-center gap-2">
             <span className="w-4 h-4 rounded bg-red-500 flex items-center justify-center text-white text-[8px] font-bold">S</span>
             Shorts & Reels
           </h3>
           <div className="flex overflow-x-auto px-6 space-x-3 no-scrollbar">
              {shortsResults.map(s => (
                <div key={s.id} onClick={() => navigate('/reels')} className="w-32 aspect-[9/16] bg-slate-100 rounded-xl overflow-hidden relative shrink-0">
                   <img src={s.thumbnail} className="w-full h-full object-cover" />
                   <div className="absolute bottom-2 left-2 text-white text-[10px] font-bold drop-shadow-md">{s.views}</div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* 4. Videos List */}
      <div className="px-6 py-4">
        {videoResults.map(v => <VideoListCard key={v.id} video={v} />)}
        {videoResults.length === 0 && <p className="text-center text-slate-400 text-xs py-10">No videos found.</p>}
      </div>
    </div>
  );

  const renderReelsTab = () => (
    <div className="p-2 grid grid-cols-2 gap-2">
      {shortsResults.map(s => (
        <div key={s.id} onClick={() => navigate('/reels')} className="aspect-[9/16] bg-slate-100 rounded-xl overflow-hidden relative">
            <img src={s.thumbnail} className="w-full h-full object-cover" />
            <div className="absolute bottom-3 left-3">
               <h4 className="text-white text-xs font-bold line-clamp-2 drop-shadow-md">{s.title}</h4>
               <p className="text-white/80 text-[10px] font-medium">{s.views}</p>
            </div>
        </div>
      ))}
    </div>
  );

  const renderVideoTab = () => (
    <div className="p-6">
       {videoResults.length > 0 
         ? videoResults.map(v => <VideoListCard key={v.id} video={v} />)
         : <div className="text-center py-20 text-slate-400">No videos match your search.</div>
       }
    </div>
  );

  const renderProfileTab = () => (
    <div className="p-6">
       {profileResults.length > 0 
         ? profileResults.map(p => <ProfileCard key={p.id} profile={p} />)
         : <div className="text-center py-20 text-slate-400">No TryKaro profiles found.</div>
       }
    </div>
  );

  const renderChannelTab = () => (
    <div className="p-6">
       {channelResults.length > 0 
         ? channelResults.map(c => <ChannelCard key={c.id} channel={c} />)
         : <div className="text-center py-20 text-slate-400">No channels found.</div>
       }
    </div>
  );

  return (
    <div className="bg-white min-h-screen relative">
      {/* A. Search Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-50">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={handleBack} className="p-2 -ml-2 text-slate-600 rounded-full active:bg-slate-50">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1 relative">
            <input 
              ref={inputRef}
              type="text" 
              placeholder="Search..." 
              className="w-full bg-slate-100 text-slate-900 rounded-full py-2.5 pl-4 pr-10 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-slate-300"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <X size={16} />
              </button>
            )}
          </div>
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="p-2 bg-slate-100 rounded-full text-slate-600 relative"
          >
            <SlidersHorizontal size={20} />
            {(filters.date !== 'any' || filters.duration !== 'any' || filters.type !== 'any') && (
               <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-sky-500 rounded-full border-2 border-white"></span>
            )}
          </button>
        </div>

        {/* D. Tabs */}
        {query && (
          <div className="flex overflow-x-auto px-4 space-x-2 pb-2 no-scrollbar">
            {['All', 'Reels', 'Video', 'Profile', 'Channel'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as SearchTab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-colors ${
                  activeTab === tab 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content Area */}
      {!query ? (
         <div className="flex flex-col items-center justify-center pt-32 opacity-50">
            <Compass size={48} className="text-slate-300 mb-4" strokeWidth={1} />
            <p className="text-sm font-medium text-slate-400">Explore videos, people, and styles.</p>
         </div>
      ) : (
        <div className="animate-in fade-in duration-300">
          {activeTab === 'All' && renderAllTab()}
          {activeTab === 'Reels' && renderReelsTab()}
          {activeTab === 'Video' && renderVideoTab()}
          {activeTab === 'Profile' && renderProfileTab()}
          {activeTab === 'Channel' && renderChannelTab()}
        </div>
      )}

      {/* C. Filter Panel */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm flex justify-end">
           <div className="w-[80%] max-w-[320px] bg-white h-full shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                 <h2 className="font-bold text-lg text-slate-800">Search Filters</h2>
                 <button onClick={() => setIsFilterOpen(false)} className="p-1 rounded-full hover:bg-slate-100"><X size={20} /></button>
              </div>
              
              <div className="p-6 space-y-8 flex-1 overflow-y-auto">
                 {/* Upload Date */}
                 <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upload Date</h3>
                    <div className="flex flex-wrap gap-2">
                       {['any', 'today', 'week', 'month', 'year'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => setFilters({...filters, date: opt as any})}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${filters.date === opt ? 'bg-sky-50 border-sky-200 text-sky-600' : 'border-slate-100 text-slate-600'}`}
                          >
                            {opt === 'any' ? 'Any time' : opt.charAt(0).toUpperCase() + opt.slice(1)}
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* Duration */}
                 <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Duration</h3>
                    <div className="flex flex-wrap gap-2">
                       <button onClick={() => setFilters({...filters, duration: 'any'})} className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${filters.duration === 'any' ? 'bg-sky-50 border-sky-200 text-sky-600' : 'border-slate-100 text-slate-600'}`}>Any</button>
                       <button onClick={() => setFilters({...filters, duration: 'short'})} className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${filters.duration === 'short' ? 'bg-sky-50 border-sky-200 text-sky-600' : 'border-slate-100 text-slate-600'}`}>Under 4 min</button>
                       <button onClick={() => setFilters({...filters, duration: 'medium'})} className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${filters.duration === 'medium' ? 'bg-sky-50 border-sky-200 text-sky-600' : 'border-slate-100 text-slate-600'}`}>4 - 20 min</button>
                       <button onClick={() => setFilters({...filters, duration: 'long'})} className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${filters.duration === 'long' ? 'bg-sky-50 border-sky-200 text-sky-600' : 'border-slate-100 text-slate-600'}`}>Over 20 min</button>
                    </div>
                 </div>

                 {/* Content Type */}
                 <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Content Source</h3>
                    <div className="space-y-2">
                       <button 
                         onClick={() => setFilters({...filters, type: 'any'})}
                         className={`w-full p-3 rounded-xl border flex items-center justify-between ${filters.type === 'any' ? 'bg-sky-50 border-sky-200 text-sky-700' : 'border-slate-100 text-slate-600'}`}
                       >
                         <div className="flex items-center gap-2"><Compass size={18} /> <span className="text-sm font-medium">All Content</span></div>
                         {filters.type === 'any' && <Check size={16} />}
                       </button>
                       <button 
                         onClick={() => setFilters({...filters, type: 'youtube'})}
                         className={`w-full p-3 rounded-xl border flex items-center justify-between ${filters.type === 'youtube' ? 'bg-red-50 border-red-200 text-red-700' : 'border-slate-100 text-slate-600'}`}
                       >
                         <div className="flex items-center gap-2"><Youtube size={18} /> <span className="text-sm font-medium">YouTube Only</span></div>
                         {filters.type === 'youtube' && <Check size={16} />}
                       </button>
                       <button 
                         onClick={() => setFilters({...filters, type: 'trykaro'})}
                         className={`w-full p-3 rounded-xl border flex items-center justify-between ${filters.type === 'trykaro' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-slate-100 text-slate-600'}`}
                       >
                         <div className="flex items-center gap-2"><User size={18} /> <span className="text-sm font-medium">TryKaro Only</span></div>
                         {filters.type === 'trykaro' && <Check size={16} />}
                       </button>
                    </div>
                 </div>
              </div>

              <div className="p-5 border-t border-slate-100">
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs"
                >
                  Apply Filters
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DiscoverSearch;