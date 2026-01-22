import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';

interface AppContextType {
  appLogo: string | null;
  setAppLogo: (logoUrl: string) => Promise<void>; // Updated signature to return Promise
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appLogo, setLocalAppLogo] = useState<string | null>(null);

  // Real-time listener for Logo
  useEffect(() => {
    const logoRef = doc(db, "settings", "headerLogo");
    const unsubscribe = onSnapshot(logoRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setLocalAppLogo(data.logoUrl || null);
      } else {
        setLocalAppLogo(null);
      }
    }, (error) => {
      console.error("Error fetching logo:", error);
    });

    return () => unsubscribe();
  }, []);

  const setAppLogo = async (logoUrl: string) => {
    try {
      await setDoc(doc(db, "settings", "headerLogo"), {
        logoUrl: logoUrl,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error saving logo:", error);
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{ appLogo, setAppLogo }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};