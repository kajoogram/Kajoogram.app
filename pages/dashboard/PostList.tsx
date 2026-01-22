
import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, Filter, ArrowUpDown, Calendar, Video, Image as ImageIcon, Film, Aperture, Check } from 'lucide-react';
import { DateFilter } from './Dashboard';
import { usePostContext } from '../../context/PostContext';

type ContentType = 'All' | 'Story' | 'Post' | 'Reel' | 'Video';
type SortOption = 'Recently Uploaded' | 'High to Low' | 'Low to High' | 'Date';

const PostList: React.FC = () => {
  const { metric } = useParams<{ metric: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { posts } = usePostContext();
  const { filter: dateFilter, customRange } = location.state as { filter: DateFilter, customRange: any } || { filter: '7 Days' };

  const [search, setSearch] = useState('');
  const [contentType, setContentType] = useState<ContentType>('All');
  const [sortOrder, setSortOrder] = useState<SortOption>('Recently Uploaded');
  
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  // Determine styling based on metric
  const metricLabel = metric ? metric.charAt(0).toUpperCase() + metric.slice(1) : 'Count';
  const metricKey = metric?.toLowerCase() as 'views' | 'likes' | 'comments' | 'shares' || 'views';

  const getTheme = () => {
    switch (metricKey) {
      case 'likes': return { bg: 'bg-rose-50', text: 'text-rose-500' };
      case 'comments': return { bg: 'bg-amber-50', text: 'text-amber-500' };
      case 'shares': return { bg: 'bg-emerald-50', text: 'text-emerald-500' };
      default: return { bg: 'bg-blue-50', text: 'text-blue-500' };
    }
  };
  const theme = getTheme();

  // Filter & Sort Logic
  const filteredPosts = posts
    .filter(p => {
      // 0. Date Filter
      const postDate = new Date(p.timestamp);
      const now = new Date();
      let matchesDate = true;
      if (dateFilter === 'Today') matchesDate = postDate.toDateString() === now.toDateString();
      if (dateFilter === '7 Days') matchesDate = postDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      if (dateFilter === '30 Days') matchesDate = postDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      if (dateFilter === '90 Days') matchesDate = postDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      if (dateFilter === 'Custom' && customRange.start && customRange.end) {
         const start = new Date(customRange.start);
         const end = new Date(customRange.end);
         end.setHours(23, 59, 59);
         matchesDate = postDate >= start && postDate <= end;
      }
      if (!matchesDate) return false;

      // 1. Search
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      
      // 2. Content Type
      if (contentType !== 'All') {
         if (contentType === 'Post' && p.type !== 'image') return false;
         if (contentType === 'Video' && p.type !== 'video') return false;
         // Note: Real app would need specific type field for Story/Reel if distinguishable
      }
      return true;
    })
    .sort((a, b) => {
      const valA = a[metricKey] || 0;
      const valB = b[metricKey] || 0;
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();

      switch (sortOrder) {
        case 'High to Low': return valB - valA;
        case 'Low to High': return valA - valB;
        case 'Date': return timeB - timeA;
        case 'Recently Uploaded': default: return timeB - timeA;
      }
    });

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center space-x-4 border-b border-slate-100 sticky top-0 z-40 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors">
          <ArrowLeft size={24} className="text-slate-800" />
        </button>
        <div className="flex-1">
           <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search posts..." 
                className="w-full bg-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white px-6 py-3 flex space-x-3 border-b border-slate-100 sticky top-[73px] z-30">
         <button 
           onClick={() => setShowTypeModal(true)}
           className="flex-1 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 flex items-center justify-center gap-2 active:bg-slate-50"
         >
           <Filter size={14} />
           <span>{contentType}</span>
         </button>
         <button 
           onClick={() => setShowSortModal(true)}
           className="flex-1 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 flex items-center justify-center gap-2 active:bg-slate-50"
         >
           <ArrowUpDown size={14} />
           <span>Sort</span>
         </button>
      </div>

      {/* List */}
      <div className="p-6 space-y-4 flex-1 overflow-y-auto">
         {filteredPosts.length > 0 ? (
           filteredPosts.map((post, index) => (
             <div key={index} className="bg-white p-3 rounded-2xl border border-slate-100 flex items-center space-x-4 shadow-sm">
                <div className="w-16 h-16 rounded-xl bg-slate-100 shrink-0 overflow-hidden relative">
                   <img src={post.mediaUrl} className="w-full h-full object-cover" />
                   <div className="absolute bottom-1 right-1 bg-black/60 rounded px-1 py-0.5">
                      {post.type === 'video' ? <Video size={10} className="text-white" /> : <ImageIcon size={10} className="text-white" />}
                   </div>
                </div>
                <div className="flex-1 min-w-0">
                   <h3 className="text-sm font-bold text-slate-800 truncate">{post.title}</h3>
                   <div className="flex items-center space-x-1 mt-1 text-slate-400">
                      <Calendar size={12} />
                      <span className="text-[10px] font-medium">{formatDate(post.timestamp)}</span>
                   </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                   <span className={`px-2 py-1 rounded-lg text-xs font-bold ${theme.bg} ${theme.text}`}>
                      {post[metricKey]}
                   </span>
                   <span className="text-[9px] text-slate-400 font-bold uppercase">{metricLabel}</span>
                </div>
             </div>
           ))
         ) : (
           <div className="text-center py-20 text-slate-400 text-sm">No posts found matching your criteria.</div>
         )}
      </div>

      {/* Content Type Modal */}
      {showTypeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setShowTypeModal(false)}>
           <div className="bg-white w-full max-w-[480px] rounded-t-[32px] sm:rounded-[32px] p-6 animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
              <h3 className="font-serif font-bold text-lg mb-4 text-center">Filter Content</h3>
              <div className="space-y-2">
                 {[
                   { id: 'All', icon: Filter },
                   { id: 'Story', icon: Aperture },
                   { id: 'Post', icon: ImageIcon },
                   { id: 'Reel', icon: Film },
                   { id: 'Video', icon: Video }
                 ].map((type) => (
                   <button 
                     key={type.id}
                     onClick={() => { setContentType(type.id as ContentType); setShowTypeModal(false); }}
                     className="w-full p-4 rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-colors"
                   >
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-full text-slate-600"><type.icon size={18} /></div>
                        <span className={`text-sm font-bold ${contentType === type.id ? 'text-slate-900' : 'text-slate-600'}`}>{type.id}</span>
                     </div>
                     {contentType === type.id && <Check size={20} className="text-sky-500" />}
                   </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* Sort Modal */}
      {showSortModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setShowSortModal(false)}>
           <div className="bg-white w-full max-w-[480px] rounded-t-[32px] sm:rounded-[32px] p-6 animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
              <h3 className="font-serif font-bold text-lg mb-4 text-center">Sort By</h3>
              <div className="space-y-2">
                 {['Recently Uploaded', 'High to Low', 'Low to High', 'Date'].map((opt) => (
                   <button 
                     key={opt}
                     onClick={() => { setSortOrder(opt as SortOption); setShowSortModal(false); }}
                     className="w-full p-4 rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-colors"
                   >
                     <span className={`text-sm font-bold ${sortOrder === opt ? 'text-slate-900' : 'text-slate-600'}`}>{opt}</span>
                     {sortOrder === opt && <Check size={20} className="text-sky-500" />}
                   </button>
                 ))}
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default PostList;
