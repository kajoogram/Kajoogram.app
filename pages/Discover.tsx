
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { Search, Settings, Plus, Play, MoreVertical, Heart, MessageCircle, Share2, Copy, Link, PlusCircle, Check, X } from 'lucide-react';
import { STORIES, DISCOVER_TOPICS, MOCK_VIDEOS, MOCK_SHORTS, shuffleArray } from '../data';
import { Video, Story, UserPost } from '../types';
import { getDiscoverTopics } from '../services/gemini';
import { usePostContext } from '../context/PostContext'; // NEW IMPORT

// --- COMPONENTS ---

const UserPostCard: React.FC<{ post: UserPost }> = ({ post }) => {
  const navigate = useNavigate();
  const { sharePost, likePost } = usePostContext();
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleLike = () => {
    likePost(post.id);
  };

  const handleShareClick = () => {
    setShowShareMenu(true);
  };

  const triggerShareCount = () => {
    sharePost(post.id);
    setShowShareMenu(false);
  };

  const handleAddToStory = () => {
    // In a real app, this would add to the StoryContext
    triggerShareCount();
    setToastMessage("Added to your story");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyLink = () => {
    const dummyLink = `https://kajoogram.app/post/${post.id}`;
    navigator.clipboard.writeText(dummyLink);
    triggerShareCount();
    setToastMessage("Link copied");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSystemShare = async () => {
    const shareData = {
      title: `Check out ${post.username}'s post on Kajoogram`,
      text: post.title,
      url: `https://kajoogram.app/post/${post.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        triggerShareCount();
      } else {
        handleCopyLink(); // Fallback
      }
    } catch (err) {
      console.log('Share canceled');
    }
  };

  return (
    <div className="mb-4 bg-white border-b border-slate-100 pb-4 animate-in fade-in slide-in-from-bottom duration-500 relative">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate('/profile')} 
        >
          <img src={post.userAvatar} className="w-8 h-8 rounded-full object-cover border border-slate-100" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 leading-none">{post.username}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
               <span className="text-[10px] text-slate-400">{post.uploadedAt}</span>
               {post.privacy && post.privacy !== 'public' && (
                  <span className="text-[8px] bg-slate-100 px-1 rounded text-slate-500 font-bold uppercase">{post.privacy}</span>
               )}
            </div>
          </div>
        </div>
        <button className="text-slate-400"><MoreVertical size={16} /></button>
      </div>
      
      {/* Title & Description */}
      <div className="px-4 pb-2 space-y-1">
        <p className="text-sm font-bold text-slate-900">{post.title}</p>
        {post.description && <p className="text-xs text-slate-600 leading-relaxed">{post.description}</p>}
      </div>

      {/* Media */}
      <div 
        className={`w-full bg-slate-100 overflow-hidden relative ${post.type === 'video' ? 'aspect-[9/16]' : 'aspect-square'}`}
        onClick={() => { /* Open full view logic here */ }}
      >
        <img src={post.mediaUrl} className="w-full h-full object-cover" />
        {/* Gallery Indicator if multiple */}
        {post.mediaGallery && post.mediaGallery.length > 1 && (
           <div className="absolute top-3 right-3 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
             1 / {post.mediaGallery.length}
           </div>
        )}
      </div>
      
      {/* Links */}
      {post.links && post.links.length > 0 && (
         <div className="px-4 pt-3 flex flex-wrap gap-2">
            {post.links.map((link, i) => (
               <a key={i} href={link} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 bg-blue-50 px-2 py-1 rounded-full truncate max-w-[150px]">
                 {link}
               </a>
            ))}
         </div>
      )}

      {/* Actions */}
      <div className="px-4 pt-3 flex items-center space-x-6">
        <button onClick={handleLike} className="flex items-center space-x-1.5 group">
          <Heart size={22} className={`transition-colors ${post.likes > 0 ? 'text-red-500 fill-red-500' : 'text-slate-700 group-hover:text-red-500'}`} />
          <span className="text-xs font-bold text-slate-700">{post.likes}</span>
        </button>
        <button className="flex items-center space-x-1.5 group">
          <MessageCircle size={22} className="text-slate-700 group-hover:text-blue-500 transition-colors" />
          <span className="text-xs font-bold text-slate-700">{post.comments}</span>
        </button>
        <button onClick={handleShareClick} className="flex items-center space-x-1.5 group">
          <Share2 size={22} className="text-slate-700 group-hover:text-green-500 transition-colors" />
          <span className="text-xs font-bold text-slate-700">{post.shares}</span>
        </button>
      </div>

      {/* Share Menu Modal */}
      {showShareMenu && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end animate-in fade-in" onClick={() => setShowShareMenu(false)}>
           <div className="w-full bg-white rounded-t-[32px] p-6 animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
              
              <h3 className="text-lg font-serif font-bold text-slate-800 mb-6 text-center">Share to</h3>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                 <button onClick={handleAddToStory} className="flex flex-col items-center space-y-2 group">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400 p-[2px]">
                       <div className="w-full h-full bg-white rounded-full flex items-center justify-center group-active:scale-95 transition-transform">
                          <PlusCircle size={24} className="text-pink-500" />
                       </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600">My Story</span>
                 </button>

                 <button onClick={handleSystemShare} className="flex flex-col items-center space-y-2 group">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center group-active:scale-95 transition-transform">
                       <Share2 size={24} className="text-slate-700" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600">Share via...</span>
                 </button>

                 <button onClick={handleCopyLink} className="flex flex-col items-center space-y-2 group">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center group-active:scale-95 transition-transform">
                       <Link size={24} className="text-slate-700" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600">Copy Link</span>
                 </button>
              </div>

              <button 
                onClick={() => setShowShareMenu(false)}
                className="w-full py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl active:scale-95 transition-transform"
              >
                Cancel
              </button>
           </div>
        </div>
      )}

      {/* Success Toast */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-xl animate-in slide-in-from-bottom-2 fade-in">
           <Check size={14} className="text-green-400" />
           <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

const YouTubeVideoCard: React.FC<{ video: Video }> = ({ video }) => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPlaying(entry.intersectionRatio >= 0.95);
      },
      { threshold: [0.95] }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  return (
    <div ref={videoRef} className="mb-2 bg-white group cursor-pointer active:bg-slate-50 transition-colors">
      {/* Thumbnail container */}
      <div 
        className="relative w-full aspect-video bg-slate-100 overflow-hidden"
        onClick={() => navigate(`/video/${video.id}`)}
      >
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
        />
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
          {Math.floor(Math.random() * 10) + 1}:{Math.floor(Math.random() * 50) + 10}
        </div>
        
        {/* Autoplay Overlay Simulation */}
        {isPlaying && (
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center animate-in fade-in duration-300">
             {/* No Play Icon as per requirements "no play icon overlay" on main card, but for autoplay feedback small indicator is okay */}
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="px-4 py-3 flex gap-3">
        <img 
          src={video.channelAvatar} 
          className="w-9 h-9 rounded-full object-cover border border-slate-100 shrink-0" 
          onClick={(e) => { e.stopPropagation(); navigate(`/channel/${video.channelId}`); }}
        />
        <div className="flex-1 space-y-0.5">
           <h3 className="text-[15px] font-semibold text-slate-900 leading-snug line-clamp-2" onClick={() => navigate(`/video/${video.id}`)}>{video.title}</h3>
           <div className="flex items-center text-xs text-slate-500 mt-1" onClick={(e) => { e.stopPropagation(); navigate(`/channel/${video.channelId}`); }}>
              <span className="hover:text-slate-800 transition-colors">{video.channelName}</span>
              <span className="mx-1">•</span>
              <span>{video.uploadedAt}</span>
           </div>
        </div>
        <button className="text-slate-400 h-fit pt-1">
          <MoreVertical size={16} />
        </button>
      </div>
      
      {/* Interaction Bar (Kajoogram Local Stats) */}
      <div className="px-4 pb-4 flex items-center justify-between border-b border-slate-50">
         <div className="flex space-x-6">
            <button className="flex items-center space-x-1 text-slate-600">
               <Heart size={18} />
               <span className="text-xs font-medium">{video.localLikes}</span>
            </button>
            <button className="flex items-center space-x-1 text-slate-600">
               <MessageCircle size={18} />
               <span className="text-xs font-medium">{video.localComments}</span>
            </button>
         </div>
         <button className="text-slate-600">
           <Share2 size={18} />
         </button>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---

const Discover: React.FC = () => {
  const navigate = useNavigate();
  const { posts: userPosts } = usePostContext(); // Use Post Context
  
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [topics, setTopics] = useState<string[]>([]);
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // AI Topic Generation
  useEffect(() => {
    const initTopics = async () => {
      // Use fallback initially
      setTopics(DISCOVER_TOPICS);
      // Fetch from Gemini
      const aiTopics = await getDiscoverTopics();
      if (aiTopics && aiTopics.length > 0) {
        setTopics(['All', ...aiTopics]);
      }
    };
    initTopics();
  }, []);

  // Reload feed when topics or posts change
  useEffect(() => {
    loadFeed(1, selectedTopic);
  }, [userPosts, selectedTopic]); // Re-run when new posts are added

  const loadFeed = useCallback((pageNum: number, topic: string) => {
    // 1. Get YouTube Videos
    let pool = topic === 'All' 
      ? MOCK_VIDEOS 
      : MOCK_VIDEOS.filter(v => v.category.toLowerCase() === topic.toLowerCase() || topic === 'Trending');
    
    if (pool.length < 10) pool = MOCK_VIDEOS;
    const freshVideos = shuffleArray(pool).slice(0, 20);

    // 2. Combine Logic
    // Strategy: Interleave User Posts sparsely if they exist, else just videos
    const combined: any[] = [];
    
    // Add User Posts first if available (mimic "New" content)
    // In 'All' feed show all posts, otherwise filter (mock filter)
    if (topic === 'All') {
       userPosts.forEach(p => combined.push({ type: 'post', data: p }));
    }

    // Add Videos with Shorts Shelves
    freshVideos.forEach((vid, index) => {
      combined.push({ type: 'video', data: vid });
      if ((index + 1) % 5 === 0) {
         combined.push({ 
           type: 'shelf', 
           items: shuffleArray(MOCK_SHORTS).slice(0, 20) 
         });
      }
    });

    // If paging, append; else replace
    // Note: for this demo, since we re-shuffle, simple replacement on topic change is cleaner, 
    // but append on scroll.
    if (pageNum === 1) {
      setFeedItems(combined);
    } else {
      setFeedItems(prev => [...prev, ...combined]);
    }
  }, [userPosts]);

  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic);
    setPage(1);
    setFeedItems([]); 
    setTimeout(() => {
      loadFeed(1, topic);
    }, 100);
  };

  const handleSeeMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      const nextPage = page + 1;
      setPage(nextPage);
      loadFeed(nextPage, selectedTopic);
      setLoadingMore(false);
    }, 800);
  };

  return (
    <div className="bg-white min-h-screen pb-32">
      {/* 1. Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-50 shadow-sm">
        <div className="flex items-center gap-1">
          <div className="w-7 h-5 bg-red-600 rounded-lg flex items-center justify-center relative">
            <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[6px] border-l-white border-b-[3px] border-b-transparent ml-0.5"></div>
          </div>
          <span className="font-sans font-bold text-lg text-slate-800 tracking-tight">Discover</span>
        </div>
        <div className="flex items-center gap-5 text-slate-700">
          <button onClick={() => navigate('/create')} className="text-pink-500 active:scale-90 transition-transform">
             <Plus size={24} strokeWidth={2.5} />
          </button>
          <button onClick={() => navigate('/discover/search')} className="active:scale-90 transition-transform">
            <Search size={22} strokeWidth={2} />
          </button>
          <button className="active:scale-90 transition-transform">
            <Settings size={22} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* 2. Stories */}
      <div className="pt-4 pb-2 border-b border-slate-50">
        <div className="flex overflow-x-auto px-4 space-x-4 no-scrollbar">
           {/* Create Story */}
           <div className="flex flex-col items-center space-y-1 shrink-0" onClick={() => navigate('/create')}>
             <div className="relative w-[70px] h-[70px]">
               <div className="w-full h-full rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden">
                 <img src="https://picsum.photos/id/64/100/100" className="w-full h-full object-cover opacity-50" />
               </div>
               <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white">
                 <Plus size={14} strokeWidth={3} />
               </div>
             </div>
             <span className="text-[10px] font-medium text-slate-600">Create</span>
           </div>

           {/* Story Items */}
           {STORIES.filter(s => s.id !== 'create').map((story) => (
             <div key={story.id} className="flex flex-col items-center space-y-1 shrink-0 cursor-pointer">
               <div className={`w-[70px] h-[70px] rounded-full p-[2px] ${story.isUser ? 'border-2 border-slate-200' : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500'}`}>
                 <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                   <img src={story.avatar} className="w-full h-full object-cover" />
                 </div>
               </div>
               <span className="text-[10px] font-medium text-slate-600 max-w-[70px] truncate">{story.username}</span>
             </div>
           ))}
        </div>
      </div>

      {/* 3. AI Topic Chips */}
      <div className="sticky top-[60px] z-40 bg-white py-3 border-b border-slate-50 shadow-sm">
        <div className="flex overflow-x-auto px-4 space-x-2 no-scrollbar">
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => handleTopicChange(topic)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                selectedTopic === topic 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Feed */}
      <div className="pt-2 bg-slate-50 min-h-[500px]">
        {feedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
             <div className="w-10 h-10 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
          </div>
        ) : (
          feedItems.map((item: any, index) => {
             // User Post
             if (item.type === 'post') {
               return <UserPostCard key={`post-${item.data.id}-${index}`} post={item.data} />;
             }
             
             // Shorts Shelf
             if (item.type === 'shelf') {
               return (
                 <div key={`shelf-${index}`} className="bg-white py-6 mb-2">
                   <div className="px-4 mb-4 flex items-center gap-2">
                     <img src="https://upload.wikimedia.org/wikipedia/commons/f/fc/Youtube_shorts_icon.svg" className="w-6 h-6" alt="Shorts" />
                     <span className="text-xl font-bold text-slate-800 tracking-tight">Shorts</span>
                   </div>
                   <div className="flex overflow-x-auto px-4 gap-4 no-scrollbar snap-x">
                     {item.items.map((short: Video) => (
                       <div 
                         key={short.id}
                         onClick={() => navigate('/reels')}
                         className="w-[160px] shrink-0 snap-start space-y-2 cursor-pointer group"
                       >
                         <div className="relative aspect-[9/16] rounded-xl overflow-hidden shadow-sm">
                            <img src={short.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            <div className="absolute bottom-3 left-3 text-white">
                               <h4 className="font-bold text-sm leading-tight drop-shadow-md line-clamp-2 mb-1">{short.title}</h4>
                               <p className="text-[10px] font-medium opacity-90">{short.views} views</p>
                            </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               );
             }
  
             // YouTube Video Card
             if (item.type === 'video') {
               return <YouTubeVideoCard key={`vid-${item.data.id}-${index}`} video={item.data} />;
             }
             
             return null;
          })
        )}
      </div>

      {/* 5. See More */}
      <div className="bg-white py-8 flex justify-center">
        <button 
          onClick={handleSeeMore}
          disabled={loadingMore}
          className="px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-full font-bold text-sm hover:bg-slate-50 active:scale-95 transition-all shadow-sm flex items-center gap-2"
        >
          {loadingMore ? (
            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            'See More'
          )}
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default Discover;
