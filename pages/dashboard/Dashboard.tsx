
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Calendar, Eye, Heart, MessageCircle, Share2, X } from 'lucide-react';
import { usePostContext } from '../../context/PostContext';

export type DateFilter = 'Today' | '7 Days' | '30 Days' | '90 Days' | 'All Time' | 'Custom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { posts } = usePostContext();
  const [filter, setFilter] = useState<DateFilter>('7 Days');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  // --- REAL DATA AGGREGATION ---
  const getFilteredPosts = () => {
    const now = new Date();
    return posts.filter(post => {
      const postDate = new Date(post.timestamp);
      
      if (filter === 'Today') {
        return postDate.toDateString() === now.toDateString();
      }
      if (filter === '7 Days') {
        const past = new Date();
        past.setDate(now.getDate() - 7);
        return postDate >= past;
      }
      if (filter === '30 Days') {
        const past = new Date();
        past.setDate(now.getDate() - 30);
        return postDate >= past;
      }
      if (filter === '90 Days') {
        const past = new Date();
        past.setDate(now.getDate() - 90);
        return postDate >= past;
      }
      if (filter === 'Custom' && customRange.start && customRange.end) {
        const start = new Date(customRange.start);
        const end = new Date(customRange.end);
        end.setHours(23, 59, 59); // End of day
        return postDate >= start && postDate <= end;
      }
      return true; // All Time
    });
  };

  const filteredPosts = getFilteredPosts();

  const stats = {
    views: filteredPosts.reduce((acc, curr) => acc + (curr.views || 0), 0),
    likes: filteredPosts.reduce((acc, curr) => acc + (curr.likes || 0), 0),
    comments: filteredPosts.reduce((acc, curr) => acc + (curr.comments || 0), 0),
    shares: filteredPosts.reduce((acc, curr) => acc + (curr.shares || 0), 0),
  };

  const handleStatClick = (metric: string) => {
    navigate(`/dashboard/${metric.toLowerCase()}`, { 
      state: { filter, customRange } 
    });
  };

  const handleFilterSelect = (selected: DateFilter) => {
    if (selected === 'Custom') {
      setShowCustomDate(true);
      return; // Keep modal open
    }
    setFilter(selected);
    setShowFilterModal(false);
    setShowCustomDate(false);
  };

  const applyCustomDate = () => {
    if (customRange.start && customRange.end) {
      setFilter('Custom');
      setShowFilterModal(false);
      setShowCustomDate(false);
    }
  };

  const StatBox = ({ icon: Icon, label, value, color, onClick }: any) => (
    <button 
      onClick={onClick}
      className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start space-y-3 hover:shadow-md transition-all active:scale-95"
    >
      <div className={`p-3 rounded-xl ${color.bg} ${color.text}`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-slate-800">{value.toLocaleString()}</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{label}</p>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-100 sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/profile')} className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors">
            <ArrowLeft size={24} className="text-slate-800" />
          </button>
          <h1 className="font-serif font-bold text-lg text-slate-800">Professional Dashboard</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Filter Trigger */}
        <div className="flex justify-center">
          <button 
            onClick={() => setShowFilterModal(true)}
            className="flex items-center space-x-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-200 text-slate-700 text-sm font-bold active:scale-95 transition-transform"
          >
            <Calendar size={16} />
            <span>{filter === 'Custom' ? `${customRange.start} - ${customRange.end}` : `Last ${filter}`}</span>
            <ChevronDown size={16} className="text-slate-400" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom duration-500">
          <StatBox 
            icon={Eye} 
            label="Total Views" 
            value={stats.views} 
            color={{ bg: 'bg-blue-50', text: 'text-blue-500' }}
            onClick={() => handleStatClick('Views')}
          />
          <StatBox 
            icon={Heart} 
            label="Total Likes" 
            value={stats.likes} 
            color={{ bg: 'bg-rose-50', text: 'text-rose-500' }}
            onClick={() => handleStatClick('Likes')}
          />
          <StatBox 
            icon={MessageCircle} 
            label="Comments" 
            value={stats.comments} 
            color={{ bg: 'bg-amber-50', text: 'text-amber-500' }}
            onClick={() => handleStatClick('Comments')}
          />
          <StatBox 
            icon={Share2} 
            label="Shares" 
            value={stats.shares} 
            color={{ bg: 'bg-emerald-50', text: 'text-emerald-500' }}
            onClick={() => handleStatClick('Shares')}
          />
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl text-white shadow-xl">
           <h3 className="text-lg font-bold mb-2">Grow your impact</h3>
           <p className="text-sm text-slate-300 mb-4 leading-relaxed">Analyze your top performing content to understand what your audience loves.</p>
           <button onClick={() => handleStatClick('Views')} className="px-6 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold uppercase tracking-widest">
             View Insights
           </button>
        </div>

      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in" onClick={() => setShowFilterModal(false)}>
           <div 
             className="bg-white w-full max-w-[480px] rounded-t-[32px] sm:rounded-[32px] p-6 animate-in slide-in-from-bottom duration-300"
             onClick={e => e.stopPropagation()}
           >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 sm:hidden"></div>
              
              {!showCustomDate ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-serif font-bold text-xl">Select Date Range</h3>
                    <button onClick={() => setShowFilterModal(false)}><X size={24} className="text-slate-400" /></button>
                  </div>
                  <div className="space-y-2">
                    {['Today', '7 Days', '30 Days', '90 Days', 'All Time', 'Custom'].map((opt) => (
                      <button 
                        key={opt}
                        onClick={() => handleFilterSelect(opt as DateFilter)}
                        className={`w-full p-4 rounded-2xl font-bold text-sm text-left transition-all ${filter === opt ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                   <div className="flex items-center justify-between mb-6">
                    <h3 className="font-serif font-bold text-xl">Custom Range</h3>
                    <button onClick={() => setShowCustomDate(false)} className="text-sm font-bold text-slate-500">Back</button>
                  </div>
                  <div className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">From Date</label>
                        <input 
                          type="date" 
                          className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-slate-900"
                          value={customRange.start}
                          onChange={(e) => setCustomRange({...customRange, start: e.target.value})}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">To Date</label>
                        <input 
                          type="date" 
                          className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-slate-900"
                          value={customRange.end}
                          onChange={(e) => setCustomRange({...customRange, end: e.target.value})}
                        />
                     </div>
                     <button 
                       onClick={applyCustomDate}
                       disabled={!customRange.start || !customRange.end}
                       className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs disabled:opacity-50 mt-4"
                     >
                       Apply Filter
                     </button>
                  </div>
                </>
              )}
           </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
