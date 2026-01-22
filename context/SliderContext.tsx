
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Banner } from '../types';
import { BANNERS as INITIAL_DATA } from '../data';

interface SliderContextType {
  banners: Banner[];
  addBanner: (banner: Banner) => void;
  deleteBanner: (id: string | number) => void;
  reorderBanner: (index: number, direction: 'up' | 'down') => void;
}

const SliderContext = createContext<SliderContextType | undefined>(undefined);

export const SliderContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [banners, setBanners] = useState<Banner[]>(INITIAL_DATA);

  const addBanner = (banner: Banner) => {
    setBanners((prev) => [...prev, banner]);
  };

  const deleteBanner = (id: string | number) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  const reorderBanner = (index: number, direction: 'up' | 'down') => {
    setBanners((prev) => {
      const newList = [...prev];
      if (direction === 'up' && index > 0) {
        [newList[index], newList[index - 1]] = [newList[index - 1], newList[index]];
      } else if (direction === 'down' && index < newList.length - 1) {
        [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
      }
      return newList;
    });
  };

  return (
    <SliderContext.Provider value={{ banners, addBanner, deleteBanner, reorderBanner }}>
      {children}
    </SliderContext.Provider>
  );
};

export const useSliderContext = () => {
  const context = useContext(SliderContext);
  if (context === undefined) {
    throw new Error('useSliderContext must be used within a SliderContextProvider');
  }
  return context;
};
