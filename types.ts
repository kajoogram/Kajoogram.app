
export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string; // Main Display Image
  images: string[]; // Gallery of 4-10 images
  description?: string;
  affiliateLink?: string;
  category: string;
  platform: string;
  label?: string;
  tryOnEnabled: boolean;
}

export interface Label {
  id: string;
  title: string;
  image: string;
  subtitle?: string;
  isActive: boolean; // Added isActive
}

export interface Platform {
  id: string;
  name: string;
  image: string;
  link: string;
  isActive: boolean; // Added isActive
}

export interface Category {
  id: string;
  name: string;
  image: string;
  isActive: boolean; // Added isActive
}

export interface Banner {
  id: string | number;
  image: string;
  link: string;
}

export interface User {
  id?: string; // Added ID
  username: string;
  email: string;
  mobile?: string;
  bio?: string;
  profilePhoto?: string;
  coverImage?: string;
  location?: string;
  fullAddress?: string;
  businessEmail?: string;
  links?: string[];
  friendsCount?: number;
  isLoggedIn: boolean;
  isAdmin?: boolean;
  // For other users viewing this profile
  friendStatus?: 'friend' | 'request_received' | 'request_sent' | 'none'; 
}

export interface Friend {
  id: string;
  username: string;
  avatar: string;
  mutualFriends: number;
  isOnline?: boolean;
}

export type AuthTab = 'signup' | 'login';

// --- DISCOVER & YOUTUBE TYPES ---

export type VideoCategory = 'Music' | 'Tech' | 'Gaming' | 'News' | 'Education' | 'Movies' | 'Comedy' | 'Vlog';

export interface Channel {
  id: string;
  name: string;
  avatar: string;
  banner: string;
  subscribers: string;
  description: string;
  isVerified?: boolean;
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channelId: string;
  channelName: string; // denormalized for easy access
  channelAvatar: string;
  views: string;
  uploadedAt: string;
  description: string;
  category: VideoCategory;
  isShort?: boolean;
  duration: number; // in seconds
  // Local interaction stats
  localLikes: number;
  localComments: number;
  localShares: number;
}

export interface UserPost {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  type: 'image' | 'video';
  mediaUrl: string; // Main display image/video
  mediaGallery?: string[]; // Multiple images support
  title: string;
  description?: string;
  uploadedAt: string; // Display string (e.g. "Just now")
  timestamp: string; // ISO String for Analytics
  views: number;
  likes: number;
  comments: number;
  shares: number;
  links?: string[];
  privacy?: 'public' | 'friends_of_friends' | 'friends' | 'private';
}

export interface Story {
  id: string;
  username: string;
  avatar: string;
  image: string;
  isUser?: boolean; // For "Create Story" or "My Story"
}

export interface SearchFilters {
  date: 'any' | 'today' | 'week' | 'month' | 'year';
  duration: 'any' | 'short' | 'medium' | 'long'; // <4, 4-20, >20
  type: 'any' | 'youtube' | 'trykaro';
}

export interface Report {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  subject: string;
  description: string;
  images: string[];
  status: 'pending' | 'reviewed' | 'resolved';
  timestamp: string;
}

export interface Notification {
  id: string;
  type: 'broadcast' | 'personal';
  targetUserId?: string; // If personal
  targetUserName?: string;
  message: string;
  image?: string;
  video?: string;
  timestamp: string;
  isRead: boolean;
}

export interface NotificationUser {
  id: string;
  username: string;
  avatar: string;
  email: string;
}
