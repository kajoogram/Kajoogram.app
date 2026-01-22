
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, MessageSquare, Share2, MoreVertical, Play } from 'lucide-react';
import { MOCK_VIDEOS, shuffleArray, DISCOVER_TOPICS } from '../data';
import { Video } from '../types';
import { getVideoTopics } from '../services/gemini';

const VideoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Simulate Fetch
    const foundVideo = MOCK_VIDEOS.find(v => v.id === id);
    if (foundVideo) {
      setVideo(foundVideo);
      // Generate related
      const related = shuffleArray(MOCK_VIDEOS).filter(v => v.id !== id).slice(0, 20);
      setRelatedVideos(related);
      
      // Generate AI topics
      setTopics(shuffleArray(DISCOVER_TOPICS).slice(0, 5)); // Initial placeholder
      
      getVideoTopics(foundVideo.title).then(aiTopics => {
         if (aiTopics && aiTopics.length > 0) {
           setTopics(aiTopics);
         }
      });
    }
    // Reset play state on id change
    setIsPlaying(false);
    window.scrollTo(0, 0);
  }, [id]);

  if (!video) return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;

  const handleTryYT = () => {
    window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
  };

  return (
    <div className="bg-white min-h-screen pb-10">
      {/* Sticky Header with Back Button */}
      <div className="sticky top-0 z-50 bg-white px-4 py-3 flex items-center border-b border-slate-100">
         <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full active:bg-slate-100">
           <ArrowLeft size={24} className="text-slate-800" />
         </button>
      </div>

      {/* Video Player (Simulated) */}
      <div className="w-full aspect-video bg-black relative group">
        {!isPlaying ? (
          <>
            <img src={video.thumbnail} className="w-full h-full object-contain opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center">
               <button 
                 onClick={() => setIsPlaying(true)}
                 className="w-16 h-16 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform"
               >
                 <Play size={32} className="text-white fill-white ml-1" />
               </button>
            </div>
          </>
        ) : (
           // In real app, iframe here. For now, show playing state.
           <div className="absolute inset-0 flex items-center justify-center text-white flex-col space-y-2">
              <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-bold uppercase tracking-widest">Loading Video...</span>
           </div>
        )}
      </div>

      {/* Info Section */}
      <div className="px-4 py-4 space-y-4">
        <h1 className="text-lg font-bold text-slate-900 leading-snug">{video.title}</h1>
        
        <div className="flex items-center text-xs text-slate-500 space-x-2">
           <span>{video.views}</span>
           <span>•</span>
           <span>{video.uploadedAt}</span>
        </div>

        {/* Description */}
        <div className="bg-slate-50 p-3 rounded-xl">
           <p className={`text-xs text-slate-700 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
             {video.description}
           </p>
           <button onClick={() => setIsExpanded(!isExpanded)} className="text-xs font-bold text-slate-900 mt-1">
             {isExpanded ? 'Show Less' : '...more'}
           </button>
        </div>

        {/* Channel Row */}
        <div className="flex items-center justify-between py-2">
           <div 
             className="flex items-center space-x-3 cursor-pointer"
             onClick={() => navigate(`/channel/${video.channelId}`)}
           >
              <img src={video.channelAvatar} className="w-10 h-10 rounded-full object-cover" />
              <div>
                 <h3 className="text-sm font-bold text-slate-900">{video.channelName}</h3>
                 <p className="text-[10px] text-slate-500">1.2M subscribers</p>
              </div>
           </div>
           
           <button 
             onClick={handleTryYT}
             className="px-4 py-2 bg-red-600 text-white rounded-full text-xs font-bold uppercase tracking-wide active:scale-95 transition-transform"
           >
             Try YT
           </button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar space-x-4 py-2">
           <button className="flex items-center space-x-2 bg-slate-100 px-4 py-2 rounded-full shrink-0">
              <ThumbsUp size={16} />
              <span className="text-xs font-bold">{video.localLikes}</span>
           </button>
           <button className="flex items-center space-x-2 bg-slate-100 px-4 py-2 rounded-full shrink-0">
              <MessageSquare size={16} />
              <span className="text-xs font-bold">{video.localComments}</span>
           </button>
           <button className="flex items-center space-x-2 bg-slate-100 px-4 py-2 rounded-full shrink-0">
              <Share2 size={16} />
              <span className="text-xs font-bold">Share</span>
           </button>
           <button className="bg-slate-100 p-2 rounded-full shrink-0">
              <MoreVertical size={16} />
           </button>
        </div>
      </div>

      {/* Topic Chips */}
      <div className="border-t border-b border-slate-100 py-3 mb-2">
        <div className="flex overflow-x-auto px-4 space-x-2 no-scrollbar">
           {topics.map((t, i) => (
             <span key={i} className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-700 whitespace-nowrap">
               {t}
             </span>
           ))}
        </div>
      </div>

      {/* Related Videos */}
      <div className="px-4 space-y-4 pt-2">
         {relatedVideos.map((rv) => (
           <div key={rv.id} className="flex space-x-3 cursor-pointer" onClick={() => navigate(`/video/${rv.id}`)}>
              <div className="w-40 aspect-video bg-slate-100 rounded-lg overflow-hidden shrink-0 relative">
                 <img src={rv.thumbnail} className="w-full h-full object-cover" />
                 <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1 rounded">
                   4:20
                 </div>
              </div>
              <div className="flex-1 py-1">
                 <h4 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-tight mb-1">{rv.title}</h4>
                 <p className="text-[10px] text-slate-500">{rv.channelName}</p>
                 <p className="text-[10px] text-slate-500">{rv.views} • {rv.uploadedAt}</p>
              </div>
              <button className="h-fit pt-1 text-slate-400">
                <MoreVertical size={14} />
              </button>
           </div>
         ))}
         
         <button className="w-full py-3 text-center text-sm font-bold text-slate-600 border border-slate-200 rounded-full mt-4">
            See More
         </button>
      </div>
    </div>
  );
};

export default VideoDetail;
