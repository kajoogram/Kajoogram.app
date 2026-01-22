
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Calendar, ChevronRight } from 'lucide-react';
import { DateFilter } from './Dashboard';
import { usePostContext } from '../../context/PostContext';

// Simple SVG Area Chart Component
const SimpleAreaChart = ({ data, color }: { data: number[], color: string }) => {
  if (data.length === 0 || data.every(v => v === 0)) return null;

  const height = 200;
  const width = 100; // Percentage
  const max = Math.max(...data) * 1.1; // Add padding
  const min = 0;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / (max - min || 1)) * 100; // Avoid div by zero
    return `${x},${y}`;
  }).join(' ');

  const areaPath = `0,100 ${points} 100,100`;

  return (
    <div className="w-full h-48 relative overflow-hidden">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={areaPath} fill={`url(#gradient-${color})`} />
        <polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
};

const Analytics: React.FC = () => {
  const { metric } = useParams<{ metric: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { posts } = usePostContext();
  const { filter, customRange } = location.state as { filter: DateFilter, customRange: any } || { filter: '7 Days' };
  
  const [chartData, setChartData] = useState<number[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);

  useEffect(() => {
    const now = new Date();
    // 1. Filter Posts by Date
    const currentFilteredPosts = posts.filter(post => {
      const postDate = new Date(post.timestamp);
      if (filter === 'Today') return postDate.toDateString() === now.toDateString();
      if (filter === '7 Days') return postDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      if (filter === '30 Days') return postDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      if (filter === '90 Days') return postDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      if (filter === 'Custom' && customRange.start && customRange.end) {
        const start = new Date(customRange.start);
        const end = new Date(customRange.end);
        end.setHours(23, 59, 59);
        return postDate >= start && postDate <= end;
      }
      return true;
    });

    setFilteredPosts(currentFilteredPosts);

    // 2. Generate Chart Data (Group by Day)
    // Create a map of date -> metric sum
    const dailyData: Record<string, number> = {};
    const metricKey = metric?.toLowerCase() as 'views' | 'likes' | 'comments' | 'shares' || 'views';

    currentFilteredPosts.forEach(post => {
      const dateKey = new Date(post.timestamp).toLocaleDateString();
      dailyData[dateKey] = (dailyData[dateKey] || 0) + (post[metricKey] || 0);
    });

    // Fill strictly for available days or just use object values sorted by date
    // For simple viz, we just sort keys
    const sortedDates = Object.keys(dailyData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const dataPoints = sortedDates.map(d => dailyData[d]);

    // If no data points, default to empty array
    setChartData(dataPoints);

  }, [filter, posts, metric]);

  // Determine theme based on metric
  const getTheme = () => {
    switch (metric?.toLowerCase()) {
      case 'likes': return { color: '#f43f5e', bg: 'bg-rose-50', text: 'text-rose-500', hex: '#f43f5e' }; // rose-500
      case 'comments': return { color: '#f59e0b', bg: 'bg-amber-50', text: 'text-amber-500', hex: '#f59e0b' }; // amber-500
      case 'shares': return { color: '#10b981', bg: 'bg-emerald-50', text: 'text-emerald-500', hex: '#10b981' }; // emerald-500
      default: return { color: '#3b82f6', bg: 'bg-blue-50', text: 'text-blue-500', hex: '#3b82f6' }; // blue-500
    }
  };

  const theme = getTheme();
  const metricName = metric ? metric.charAt(0).toUpperCase() + metric.slice(1) : 'Metric';
  
  // Top 5 posts by metric
  const topPosts = [...filteredPosts]
    .sort((a, b) => {
        const key = metric?.toLowerCase() as keyof typeof a;
        return (b[key] as number) - (a[key] as number);
    })
    .slice(0, 5);

  const handleSeeMore = () => {
    navigate(`/dashboard/${metric}/posts`, { state: { filter, customRange } });
  };

  const totalCount = chartData.reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-100 sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors">
            <ArrowLeft size={24} className="text-slate-800" />
          </button>
          <h1 className="font-serif font-bold text-lg text-slate-800">{metricName} Analytics</h1>
        </div>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Graph Card */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 overflow-hidden">
           <div className="flex items-center justify-between mb-6">
              <div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{filter === 'Custom' ? 'Custom Range' : filter} Trend</p>
                 <h2 className="text-3xl font-bold text-slate-800 mt-1">
                   {totalCount.toLocaleString()}
                 </h2>
              </div>
              <div className={`p-3 rounded-xl ${theme.bg} ${theme.text}`}>
                 <TrendingUp size={24} />
              </div>
           </div>
           
           <div className="-mx-6 -mb-6">
              {totalCount > 0 ? (
                 <SimpleAreaChart data={chartData} color={theme.hex} />
              ) : (
                 <div className="h-32 flex items-center justify-center text-slate-300 text-sm font-medium">
                    No data for this period
                 </div>
              )}
           </div>
        </div>

        {/* Recent Posts Section */}
        <div className="space-y-4">
           <div className="flex items-center justify-between px-1">
              <h3 className="font-bold text-slate-800 text-lg">Top Posts</h3>
              {filteredPosts.length > 0 && (
                <button onClick={handleSeeMore} className="text-xs font-bold text-sky-500 uppercase tracking-wide">See More</button>
              )}
           </div>
           
           <div className="space-y-3">
              {topPosts.length > 0 ? (
                topPosts.map((post, index) => (
                  <div 
                    key={index} 
                    onClick={handleSeeMore}
                    className="bg-white p-3 rounded-2xl border border-slate-100 flex items-center space-x-4 active:scale-[0.98] transition-all cursor-pointer"
                  >
                     <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden">
                        <img src={post.mediaUrl} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 truncate">{post.title}</h4>
                        <div className="flex items-center space-x-1 mt-1 text-slate-400">
                           <Calendar size={12} />
                           <span className="text-[10px] font-medium">{post.uploadedAt}</span>
                        </div>
                     </div>
                     <div className={`px-3 py-1.5 rounded-lg ${theme.bg} ${theme.text} text-xs font-bold`}>
                        {post[metric?.toLowerCase() as keyof typeof post]}
                     </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm">No posts found in this period.</div>
              )}
           </div>

           {filteredPosts.length > 0 && (
             <button 
               onClick={handleSeeMore}
               className="w-full py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold uppercase tracking-widest text-slate-600 shadow-sm active:scale-95 transition-all flex items-center justify-center space-x-2"
             >
                <span>View All Analytics</span>
                <ChevronRight size={14} />
             </button>
           )}
        </div>

      </div>
    </div>
  );
};

export default Analytics;
