
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type PageKey = 'help' | 'about' | 'contact' | 'follow' | 'privacy';

export interface PageContent {
  id: PageKey;
  title: string;
  content: string; // HTML string
  lastUpdated: string;
}

interface ContentContextType {
  pages: Record<PageKey, PageContent>;
  updatePage: (key: PageKey, content: string) => void;
  getPage: (key: PageKey) => PageContent;
}

const INITIAL_PAGES: Record<PageKey, PageContent> = {
  help: { id: 'help', title: 'Help & Support', content: '<h1>Help Center</h1><p>How can we assist you today?</p>', lastUpdated: new Date().toISOString() },
  about: { id: 'about', title: 'About Us', content: '<h1>About Kajoogram</h1><p>We are the leading premium social commerce platform.</p>', lastUpdated: new Date().toISOString() },
  contact: { id: 'contact', title: 'Contact Us', content: '<h1>Get in Touch</h1><p>Email us at support@kajoogram.com</p>', lastUpdated: new Date().toISOString() },
  follow: { id: 'follow', title: 'Follow Us', content: '<h1>Join the Community</h1><p>Follow us on Instagram and Twitter.</p>', lastUpdated: new Date().toISOString() },
  privacy: { id: 'privacy', title: 'Privacy Policy', content: '<h1>Privacy Policy</h1><p>Your data is safe with us.</p>', lastUpdated: new Date().toISOString() },
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from localStorage or default
  const [pages, setPages] = useState<Record<PageKey, PageContent>>(() => {
    const saved = localStorage.getItem('kajoogram_content_pages');
    return saved ? JSON.parse(saved) : INITIAL_PAGES;
  });

  useEffect(() => {
    localStorage.setItem('kajoogram_content_pages', JSON.stringify(pages));
  }, [pages]);

  const updatePage = (key: PageKey, content: string) => {
    setPages(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        content,
        lastUpdated: new Date().toISOString()
      }
    }));
  };

  const getPage = (key: PageKey) => pages[key];

  return (
    <ContentContext.Provider value={{ pages, updatePage, getPage }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContentContext = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContentContext must be used within a ContentContextProvider');
  }
  return context;
};
