
import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import CategorySection from '../components/CategorySection';
import LabelSection from '../components/LabelSection';
import { User } from '../types';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProductContext } from '../context/ProductContext';
import { usePlatformContext } from '../context/PlatformContext';
import { useSliderContext } from '../context/SliderContext';
import { useLabelContext } from '../context/LabelContext';

interface HomeProps {
  user: User;
}

const Home: React.FC<HomeProps> = ({ user }) => {
  const navigate = useNavigate();
  const { products } = useProductContext(); // Use Product Context
  const { platforms } = usePlatformContext(); // Use Platform Context
  const { banners } = useSliderContext(); // Use Slider Context
  const { labels } = useLabelContext(); // Use Label Context
  const [currentBanner, setCurrentBanner] = useState(0);
  const [visibleProducts, setVisibleProducts] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  // --- SLIDER LOGIC START ---
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const autoPlayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-slide effect
  useEffect(() => {
    if (isAutoPlaying && banners.length > 0) {
      autoPlayIntervalRef.current = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 4500); // 4.5 seconds interval
    }
    return () => {
      if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
    };
  }, [isAutoPlaying, banners.length]);

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  };

  const resumeAutoPlay = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 7500); // Resume after 7.5 seconds
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    pauseAutoPlay();
    touchStartX.current = e.targetTouches[0].clientX;
    isDragging.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
    // Mark as dragging if moved more than 5px to prevent accidental clicks
    if (Math.abs(touchStartX.current - touchEndX.current) > 5) {
      isDragging.current = true;
    }
  };

  const handleTouchEnd = () => {
    if (isDragging.current && touchStartX.current && touchEndX.current) {
      const distance = touchStartX.current - touchEndX.current;
      const minSwipeDistance = 50;

      if (Math.abs(distance) > minSwipeDistance) {
        if (distance > 0) {
          // Swipe Left -> Next Slide
          setCurrentBanner((prev) => (prev + 1) % banners.length);
        } else {
          // Swipe Right -> Prev Slide
          setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
        }
      }
    }
    
    // Resume auto-play after interaction
    resumeAutoPlay();
    
    // Reset refs
    touchStartX.current = 0;
    touchEndX.current = 0;
    // Note: isDragging stays true briefly to block onClick, cleared on next start
    setTimeout(() => { isDragging.current = false; }, 100); 
  };

  const handleSlideClick = (link: string) => {
    if (!isDragging.current) {
      navigate(link);
    }
  };
  // --- SLIDER LOGIC END ---

  const loadMore = () => {
    if (visibleProducts < products.length) {
      setIsLoading(true);
      setTimeout(() => {
        setVisibleProducts((prev) => Math.min(prev + 20, products.length));
        setIsLoading(false);
      }, 800);
    }
  };

  const handlePlatformClick = (plat: any) => {
    // If a link exists, open it (priority). Otherwise navigate to platform page.
    if (plat.link) {
      window.open(plat.link, '_blank');
    } else {
      navigate(`/platform/${plat.name}`);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-32">
      <Header />
      
      {/* Hero Slider Section */}
      {banners.length > 0 && (
        <div className="px-6 py-4 animate-in fade-in duration-700">
          <div 
            className="relative aspect-[16/9] w-full rounded-[32px] overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] group touch-pan-y bg-slate-100"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Slides Track */}
            <div 
              className="absolute inset-0 flex transition-transform duration-500 ease-in-out will-change-transform" 
              style={{ transform: `translateX(-${currentBanner * 100}%)` }}
            >
              {banners.map((banner, i) => (
                <div 
                  key={banner.id} 
                  className="w-full h-full shrink-0 relative cursor-pointer"
                  onClick={() => handleSlideClick(banner.link)}
                >
                  <img 
                    src={banner.image} 
                    className="w-full h-full object-cover select-none pointer-events-none" 
                    alt={`Banner ${i + 1}`}
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                  {/* Premium Overlay Gradient for Depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
                </div>
              ))}
            </div>
            
            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-1.5 z-10 pointer-events-none">
              <div className="flex bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full space-x-1.5 pointer-events-auto">
                {banners.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={(e) => {
                      e.stopPropagation();
                      pauseAutoPlay();
                      setCurrentBanner(i);
                      resumeAutoPlay();
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ease-out ${
                      currentBanner === i 
                        ? 'w-6 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' 
                        : 'w-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
            
            {/* Inner Border Ring for Premium Finish */}
            <div className="absolute inset-0 pointer-events-none rounded-[32px] ring-1 ring-inset ring-black/5"></div>
          </div>
        </div>
      )}

      {/* Get Started Section (Visible only if NOT logged in) */}
      {!user.isLoggedIn && (
        <div className="mx-6 mt-4 mb-2 p-6 bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-50 text-center space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
          <div className="space-y-1">
            <h2 className="text-2xl font-serif font-bold text-slate-800">Start Your Journey</h2>
            <p className="text-sm text-slate-400 font-medium">Unlock exclusive access to premium collections.</p>
          </div>
          <button 
            onClick={() => navigate('/auth')}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-300 via-orange-200 to-amber-100 text-slate-900 font-bold uppercase tracking-widest shadow-xl shadow-orange-100 active:scale-95 hover:shadow-2xl transition-all duration-300"
          >
            Get Started
          </button>
        </div>
      )}

      {/* Search Trigger */}
      <div className="px-6 py-4">
        <button 
          onClick={() => navigate('/search')}
          className="w-full flex items-center space-x-3 bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl text-slate-400 text-sm transition-all active:scale-[0.98]"
        >
          <Search size={20} strokeWidth={1.5} />
          <span>Search Luxury Collection...</span>
        </button>
      </div>

      {/* Category Section */}
      <CategorySection />

      {/* Trusted Platforms Section */}
      {platforms.length > 0 && (
        <div className="py-6 bg-white w-full">
          <div className="px-6 mb-4">
            <h2 className="text-lg font-semibold text-slate-800 tracking-tight">Trusted Platforms</h2>
            <div className="w-8 h-0.5 bg-slate-100 mt-2"></div>
          </div>
          
          <div className="flex overflow-x-auto px-6 space-x-4 pb-4 no-scrollbar snap-x scroll-smooth">
            {platforms.map((plat, i) => (
              <button 
                key={plat.id}
                onClick={() => handlePlatformClick(plat)}
                className="flex flex-col items-center space-y-3 shrink-0 snap-start group transition-transform active:scale-95 outline-none"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-slate-50 relative group-hover:shadow-[0_8px_25px_rgb(0,0,0,0.1)] transition-all">
                   <img 
                     src={plat.image} 
                     className="w-full h-full object-cover" 
                     alt={plat.name}
                     loading="lazy" 
                   />
                </div>
                <span className="text-xs font-medium text-slate-600 text-center max-w-[80px] leading-tight line-clamp-2">
                  {plat.name}
                </span>
              </button>
            ))}
            <div className="w-2 shrink-0"></div>
          </div>
        </div>
      )}

      {/* Label Sections (Trending, Festive, etc.) */}
      <LabelSection labels={labels} products={products} isLoggedIn={user.isLoggedIn} />

      {/* Marketplace */}
      <div className="py-8 px-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-slate-800">Kajoogram Market</h2>
          <span className="text-xs text-slate-400 font-medium">New Arrivals</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {products.slice(0, visibleProducts).map((prod) => (
            <ProductCard key={prod.id} product={prod} isLoggedIn={user.isLoggedIn} />
          ))}
        </div>

        {visibleProducts < products.length && (
          <div className="pt-8 flex justify-center">
            <button 
              onClick={loadMore}
              disabled={isLoading}
              className="px-10 py-4 bg-white border border-slate-100 rounded-2xl text-slate-600 font-bold tracking-widest shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'LOADING...' : 'SEE MORE'}
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Home;
