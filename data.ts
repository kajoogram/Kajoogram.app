
import { Product, Label, Video, Story, VideoCategory, Channel, UserPost, User } from './types';

// --- FRIEND SYSTEM MOCK DATABASE ---
export const MOCK_ALL_USERS: User[] = [
  { id: 'u-1', username: 'Ananya Sharma', email: 'ananya@example.com', profilePhoto: 'https://picsum.photos/id/1011/200/200', bio: 'Fashion Blogger', location: 'Mumbai', isLoggedIn: false },
  { id: 'u-2', username: 'Rahul Verma', email: 'rahul@example.com', profilePhoto: 'https://picsum.photos/id/1012/200/200', bio: 'Tech Enthusiast', location: 'Delhi', isLoggedIn: false },
  { id: 'u-3', username: 'Simran Kaur', email: 'simran@example.com', profilePhoto: 'https://picsum.photos/id/1027/200/200', bio: 'Traveler & Foodie', location: 'Chandigarh', isLoggedIn: false },
  { id: 'u-4', username: 'Aditya Roy', email: 'aditya@example.com', profilePhoto: 'https://picsum.photos/id/1005/200/200', bio: 'Photographer', location: 'Bangalore', isLoggedIn: false },
  { id: 'u-5', username: 'Priya Singh', email: 'priya@example.com', profilePhoto: 'https://picsum.photos/id/342/200/200', bio: 'Artist', location: 'Jaipur', isLoggedIn: false },
  { id: 'u-6', username: 'Kabir Khan', email: 'kabir@example.com', profilePhoto: 'https://picsum.photos/id/338/200/200', bio: 'Musician', location: 'Pune', isLoggedIn: false },
  { id: 'u-7', username: 'Zara Malik', email: 'zara@example.com', profilePhoto: 'https://picsum.photos/id/64/200/200', bio: 'Designer', location: 'Dubai', isLoggedIn: false },
  { id: 'u-8', username: 'Vikram Das', email: 'vikram@example.com', profilePhoto: 'https://picsum.photos/id/91/200/200', bio: 'Fitness Coach', location: 'Kolkata', isLoggedIn: false },
  { id: 'u-9', username: 'Neha Gupta', email: 'neha@example.com', profilePhoto: 'https://picsum.photos/id/83/200/200', bio: 'Developer', location: 'Hyderabad', isLoggedIn: false },
  { id: 'u-10', username: 'Rohan Mehta', email: 'rohan@example.com', profilePhoto: 'https://picsum.photos/id/75/200/200', bio: 'Entrepreneur', location: 'Ahmedabad', isLoggedIn: false },
];

export const CATEGORIES = [
  { id: 'women', name: 'Women', image: 'https://picsum.photos/id/1011/400/400' },
  { id: 'men', name: 'Men', image: 'https://picsum.photos/id/1005/400/400' },
  { id: 'accessories', name: 'Accessories', image: 'https://picsum.photos/id/1027/400/400' },
  { id: 'footwear', name: 'Footwear', image: 'https://picsum.photos/id/103/400/400' },
  { id: 'bags', name: 'Bags', image: 'https://picsum.photos/id/1024/400/400' },
  { id: 'beauty', name: 'Beauty', image: 'https://picsum.photos/id/366/400/400' },
  { id: 'home', name: 'Home', image: 'https://picsum.photos/id/364/400/400' },
];

export const PLATFORMS = [
  { name: 'Zara', image: 'https://picsum.photos/id/342/200/200' },
  { name: 'H&M', image: 'https://picsum.photos/id/352/200/200' },
  { name: 'Gucci', image: 'https://picsum.photos/id/362/200/200' },
  { name: 'Prada', image: 'https://picsum.photos/id/372/200/200' },
];

export const LABELS: Label[] = [
  // Fixed: Added 'isActive: true' to all label objects
  { id: 'trending', title: 'Trending Now', image: 'https://picsum.photos/id/435/800/450', subtitle: 'Viral Styles', isActive: true },
  { id: 'cute-fashion', title: 'Cute Girl Fashion', image: 'https://picsum.photos/id/338/800/450', subtitle: 'Sweet & Chic', isActive: true },
  { id: 'street-style', title: 'Men\'s Street Style', image: 'https://picsum.photos/id/1005/800/450', subtitle: 'Urban Aesthetics', isActive: true },
  { id: 'festive', title: 'Festive Wear', image: 'https://picsum.photos/id/65/800/450', subtitle: 'Celebrate in Style', isActive: true },
  { id: 'budget', title: 'Budget Picks', image: 'https://picsum.photos/id/835/800/450', subtitle: 'Under ₹999', isActive: true },
];

export const BANNERS = [
  { id: 1, image: 'https://picsum.photos/id/325/800/450', link: '/category/women' },
  { id: 2, image: 'https://picsum.photos/id/321/800/450', link: '/discover' },
  { id: 3, image: 'https://picsum.photos/id/319/800/450', link: '/category/accessories' }
];

export const MOCK_PRODUCTS: Product[] = Array.from({ length: 100 }, (_, i) => {
  const basePrice = [499, 799, 999, 1299, 1499, 1999, 2499, 3999, 4999, 7999][Math.floor(Math.random() * 10)];
  const hasDiscount = Math.random() > 0.4;
  const mainImage = `https://picsum.photos/id/${(i * 13) % 1000}/400/400`;
  
  return {
    id: `prod-${i}`,
    title: `${['Silk Dress', 'Leather Jacket', 'Designer Bag', 'Minimalist Watch', 'Premium Heels', 'Cotton Kurta', 'Sneakers', 'Sunglasses', 'Denim Jacket', 'Party Top'][i % 10]} ${i + 1}`,
    price: basePrice,
    originalPrice: hasDiscount ? basePrice + Math.floor(Math.random() * 2000) + 500 : undefined,
    image: mainImage,
    images: [mainImage, mainImage, mainImage, mainImage], // Default 4 images
    description: "Experience the epitome of luxury with this exquisitely crafted item. Designed for those who appreciate fine detail and premium quality. Perfect for any occasion.",
    affiliateLink: "https://example.com",
    category: CATEGORIES[i % CATEGORIES.length].name, 
    platform: PLATFORMS[i % PLATFORMS.length].name,
    label: LABELS[i % LABELS.length].id, 
    tryOnEnabled: i % 3 === 0
  };
});

// --- DISCOVER & YOUTUBE DATA ---

export const CHANNELS: Channel[] = [
  { id: 'ch-1', name: 'T-Series', avatar: 'https://picsum.photos/id/101/100/100', banner: 'https://picsum.photos/id/101/800/200', subscribers: '245M', description: 'Music can change the world. T-Series is India\'s largest Music Label & Movie Studio.' },
  { id: 'ch-2', name: 'MrBeast', avatar: 'https://picsum.photos/id/102/100/100', banner: 'https://picsum.photos/id/102/800/200', subscribers: '167M', description: 'I want to make the world a better place.' },
  { id: 'ch-3', name: 'Techno Gamerz', avatar: 'https://picsum.photos/id/103/100/100', banner: 'https://picsum.photos/id/103/800/200', subscribers: '35M', description: 'Gaming, Technology, and Fun!' },
  { id: 'ch-4', name: 'CarryMinati', avatar: 'https://picsum.photos/id/104/100/100', banner: 'https://picsum.photos/id/104/800/200', subscribers: '40M', description: 'Just a guy who loves to roast.' },
  { id: 'ch-5', name: 'Sandeep Maheshwari', avatar: 'https://picsum.photos/id/106/100/100', banner: 'https://picsum.photos/id/106/800/200', subscribers: '28M', description: 'Motivational Speaker and Entrepreneur.' },
  { id: 'ch-6', name: 'Flying Beast', avatar: 'https://picsum.photos/id/107/100/100', banner: 'https://picsum.photos/id/107/800/200', subscribers: '8M', description: 'Pilot, Vlogger, and Fitness Enthusiast.' },
  { id: 'ch-7', name: 'Technical Guruji', avatar: 'https://picsum.photos/id/108/100/100', banner: 'https://picsum.photos/id/108/800/200', subscribers: '23M', description: 'Tech News, Reviews, and Unboxings.' }
];

const VIDEO_TITLES = [
  "iPhone 16 Pro Max Review - The Truth!",
  "Top 10 Hindi Songs 2024 | Bollywood Hits",
  "Minecraft Hardcore Survival 100 Days",
  "Making Street Food in Mumbai - VLOG",
  "Learn React JS in 1 Hour | Full Course",
  "The Future of AI - Explained",
  "Standup Comedy - Bassi Live",
  "Cricket Highlights: IND vs AUS Final",
  "How to Cook Butter Chicken at Home",
  "Unboxing the New PS5 Pro",
  "Travel Guide to Goa 2024",
  "Stock Market for Beginners in Hindi",
  "The Dark Side of Space",
  "Best Budget Laptops Under ₹50,000",
  "Arijit Singh Live Concert Mumbai",
  "GTA 6 Leaked Gameplay Reaction",
  "Ancient History of India Documentary",
  "Funny Cat Videos 2024 Compilation",
  "Tesla Cybertruck vs Ford F150",
  "Morning Meditation for Positive Energy"
];

const CATEGORY_POOL: VideoCategory[] = ['Tech', 'Music', 'Gaming', 'Vlog', 'Education', 'Tech', 'Comedy', 'News', 'Vlog', 'Tech', 'Vlog', 'Education', 'Education', 'Tech', 'Music', 'Gaming', 'Education', 'Comedy', 'Tech', 'Education'];

export const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// Generate 200 Mock Videos linked to channels
export const MOCK_VIDEOS: Video[] = Array.from({ length: 200 }, (_, i) => {
  const channel = CHANNELS[i % CHANNELS.length];
  return {
    id: `vid-${i}`,
    title: VIDEO_TITLES[i % VIDEO_TITLES.length] + ` ${(i > 20 ? '#' + i : '')}`,
    thumbnail: `https://picsum.photos/id/${(i * 7 + 10) % 500}/640/360`,
    channelId: channel.id,
    channelName: channel.name,
    channelAvatar: channel.avatar,
    views: `${(Math.random() * 5 + 0.1).toFixed(1)}M views`,
    uploadedAt: `${Math.floor(Math.random() * 11) + 1} months ago`,
    description: `This is a sample description for the video titled "${VIDEO_TITLES[i % VIDEO_TITLES.length]}". It contains keywords, links, and timestamps. \n\n0:00 Intro\n1:05 Main Content\n5:30 Conclusion\n\nFollow us on Instagram!`,
    category: CATEGORY_POOL[i % CATEGORY_POOL.length],
    isShort: false,
    duration: Math.floor(Math.random() * 1200) + 60, // Random duration between 1 min and 21 mins
    localLikes: 0,
    localComments: 0,
    localShares: 0
  };
});

// Generate 100 Mock Shorts
export const MOCK_SHORTS: Video[] = Array.from({ length: 100 }, (_, i) => {
  const channel = CHANNELS[i % CHANNELS.length];
  return {
    id: `short-${i}`,
    title: `Amazing Short #${i}`,
    thumbnail: `https://picsum.photos/id/${(i * 9 + 20) % 600}/360/640`,
    channelId: channel.id,
    channelName: channel.name,
    channelAvatar: channel.avatar,
    views: `${(Math.random() * 10).toFixed(1)}M`,
    uploadedAt: '1 day ago',
    description: 'Shorts description.',
    category: 'Comedy',
    isShort: true,
    duration: 59,
    localLikes: 0,
    localComments: 0,
    localShares: 0
  };
});

// Initial User Posts - Empty to comply with "No fake posts" rule
export const USER_POSTS: UserPost[] = [
  // Example for testing logic, but keeping commented out or minimal as per "Only real posts" rule
  // If user creates a post, it goes here.
];

export const STORIES: Story[] = [
  { id: 'create', username: 'Create', avatar: '', image: '', isUser: true },
  { id: 'my-story', username: 'Your Story', avatar: 'https://picsum.photos/id/64/100/100', image: 'https://picsum.photos/id/64/400/600', isUser: true },
  { id: 's1', username: 'anushka_s', avatar: 'https://picsum.photos/id/65/100/100', image: 'https://picsum.photos/id/65/400/600' },
  { id: 's2', username: 'virat.kohli', avatar: 'https://picsum.photos/id/66/100/100', image: 'https://picsum.photos/id/66/400/600' },
  { id: 's3', username: 'travel_diaries', avatar: 'https://picsum.photos/id/67/100/100', image: 'https://picsum.photos/id/67/400/600' },
  { id: 's4', username: 'foodie_inc', avatar: 'https://picsum.photos/id/68/100/100', image: 'https://picsum.photos/id/68/400/600' },
  { id: 's5', username: 'tech_news', avatar: 'https://picsum.photos/id/69/100/100', image: 'https://picsum.photos/id/69/400/600' },
];

export const DISCOVER_TOPICS = ['All', 'Music', 'Trending', 'News', 'Cartoon', 'Tech', 'Gaming', 'Education', 'Movies', 'Comedy', 'Cricket', 'Food', 'Travel'];
