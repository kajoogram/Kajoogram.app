import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category } from '../types';
import { db } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCategory: (index: number, direction: 'up' | 'down') => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener for Categories
  useEffect(() => {
    const q = query(collection(db, "categories"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      setCategories(fetched);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching categories:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      await addDoc(collection(db, "categories"), {
        ...category,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error adding category:", error);
      throw error;
    }
  };

  const updateCategory = async (category: Category) => {
    try {
      const categoryRef = doc(db, "categories", category.id);
      const { id, ...data } = category;
      await updateDoc(categoryRef, {
        ...data,
        // updatedAt: serverTimestamp() // Optional: track updates
      });
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, "categories", id));
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  };

  // Reordering is visual-only in this version as it relies on 'createdAt' in Firestore.
  // To implement persistent ordering, a custom 'orderIndex' field would be required in Firestore.
  const reorderCategory = (index: number, direction: 'up' | 'down') => {
    // Optimistic UI update can be done here if needed, but Firestore listener will overwrite it.
    console.warn("Manual reordering is disabled in Firestore mode (Ordered by Creation Time).");
  };

  return (
    <CategoryContext.Provider value={{ categories, loading, addCategory, updateCategory, deleteCategory, reorderCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategoryContext must be used within a CategoryContextProvider');
  }
  return context;
};