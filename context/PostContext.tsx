
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserPost } from '../types';
import { USER_POSTS as INITIAL_POSTS } from '../data';

interface PostContextType {
  posts: UserPost[];
  addPost: (post: UserPost) => void;
  deletePost: (id: string) => void;
  likePost: (id: string) => void;
  viewPost: (id: string) => void;
  sharePost: (id: string) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<UserPost[]>(INITIAL_POSTS);

  const addPost = (post: UserPost) => {
    setPosts((prev) => [post, ...prev]);
  };

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter(p => p.id !== id));
  };

  const likePost = (id: string) => {
    setPosts((prev) => prev.map(p => 
      p.id === id ? { ...p, likes: p.likes + 1 } : p
    ));
  };

  const viewPost = (id: string) => {
    setPosts((prev) => prev.map(p => 
      p.id === id ? { ...p, views: p.views + 1 } : p
    ));
  };

  const sharePost = (id: string) => {
    setPosts((prev) => prev.map(p => 
      p.id === id ? { ...p, shares: p.shares + 1 } : p
    ));
  };

  return (
    <PostContext.Provider value={{ posts, addPost, deletePost, likePost, viewPost, sharePost }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePostContext must be used within a PostContextProvider');
  }
  return context;
};
