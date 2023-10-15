import React, { useState, useEffect, createContext, ReactNode } from 'react';
import { clProduct } from '../../types/interface';

interface ItemsProviderProps {
    children: ReactNode;
}

const ItemsContext = createContext<{ items: clProduct[], setItems: React.Dispatch<React.SetStateAction<clProduct[]>> }>({
  items: [],
  setItems: () => {}
});

const ItemsProvider: React.FC<ItemsProviderProps> = ({ children }) => {
  const [items, setItems] = useState<clProduct[]>([]);

  useEffect(() => {
    const url = import.meta.env.VITE_API_BASE_URL_ITEMS;
    const getItems = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    getItems();
  }, []);

  return (
    <ItemsContext.Provider value={{ items, setItems }}>
      {children}
    </ItemsContext.Provider>
  );
};

export { ItemsProvider, ItemsContext };
