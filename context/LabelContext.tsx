
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Label } from '../types';
import { LABELS as INITIAL_DATA } from '../data';

interface LabelContextType {
  labels: Label[];
  addLabel: (label: Label) => void;
  updateLabel: (label: Label) => void;
  deleteLabel: (id: string) => void;
  reorderLabel: (index: number, direction: 'up' | 'down') => void;
}

const LabelContext = createContext<LabelContextType | undefined>(undefined);

export const LabelContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [labels, setLabels] = useState<Label[]>(
    INITIAL_DATA.map(l => ({ ...l, isActive: true }))
  );

  const addLabel = (label: Label) => {
    setLabels((prev) => [...prev, label]);
  };

  const updateLabel = (updatedLabel: Label) => {
    setLabels((prev) => prev.map((l) => (l.id === updatedLabel.id ? updatedLabel : l)));
  };

  const deleteLabel = (id: string) => {
    setLabels((prev) => prev.filter((l) => l.id !== id));
  };

  const reorderLabel = (index: number, direction: 'up' | 'down') => {
    setLabels((prev) => {
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
    <LabelContext.Provider value={{ labels, addLabel, updateLabel, deleteLabel, reorderLabel }}>
      {children}
    </LabelContext.Provider>
  );
};

export const useLabelContext = () => {
  const context = useContext(LabelContext);
  if (context === undefined) {
    throw new Error('useLabelContext must be used within a LabelContextProvider');
  }
  return context;
};