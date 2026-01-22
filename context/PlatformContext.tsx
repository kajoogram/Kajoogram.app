
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Platform } from '../types';
import { PLATFORMS as INITIAL_DATA } from '../data';

interface PlatformContextType {
  platforms: Platform[];
  addPlatform: (platform: Platform) => void;
  updatePlatform: (platform: Platform) => void;
  deletePlatform: (id: string) => void;
  reorderPlatform: (index: number, direction: 'up' | 'down') => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [platforms, setPlatforms] = useState<Platform[]>(
    INITIAL_DATA.map((p, index) => ({
      id: `plat-${index}-${Date.now()}`,
      name: p.name,
      image: p.image,
      link: '',
      isActive: true
    }))
  );

  const addPlatform = (platform: Platform) => {
    setPlatforms((prev) => [...prev, platform]);
  };

  const updatePlatform = (updatedPlatform: Platform) => {
    setPlatforms((prev) => prev.map((p) => (p.id === updatedPlatform.id ? updatedPlatform : p)));
  };

  const deletePlatform = (id: string) => {
    setPlatforms((prev) => prev.filter((p) => p.id !== id));
  };

  const reorderPlatform = (index: number, direction: 'up' | 'down') => {
    setPlatforms((prev) => {
      const newList = [...prev];
      if (newList.length < 2) return newList;
      if (direction === 'up' && index > 0) {
        [newList[index], newList[index - 1]] = [newList[index - 1], newList[index]];
      } else if (direction === 'down' && index < newList.length - 1) {
        [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
      }
      return newList;
    });
  };

  return (
    <PlatformContext.Provider value={{ platforms, addPlatform, updatePlatform, deletePlatform, reorderPlatform }}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatformContext = () => {
  const context = useContext(PlatformContext);
  if (context === undefined) {
    throw new Error('usePlatformContext must be used within a PlatformContextProvider');
  }
  return context;
};