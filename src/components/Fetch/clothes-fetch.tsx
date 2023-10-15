import React, { useState, useEffect, createContext, ReactNode } from 'react';
import { clProduct } from '../../types/interface';

interface ClothesProviderProps {
    children: ReactNode;
}

interface ClothesContextProps {
    clothes: clProduct[];
    setClothes: React.Dispatch<React.SetStateAction<clProduct[]>>;
}

const ClothesContext = createContext<ClothesContextProps>({
    clothes: [],
    setClothes: () => {},
});

const ClothesProvider: React.FC<ClothesProviderProps> = ({ children }) => {
    const [clothes, setClothes] = useState<clProduct[]>([]);

    useEffect(() => {
        const url = import.meta.env.VITE_API_BASE_URL_CLOTHES;

        const getClothes = async () => {
            try {
                const response = await fetch(url);
                const data = await response.json();
                setClothes(data);
            } catch (error) {
                console.error('Error fetching clothes:', error);
            }
        };

        getClothes();
    }, []);

    return (
        <ClothesContext.Provider value={{ clothes, setClothes }}>
            {children}
        </ClothesContext.Provider>
    );
};

export { ClothesProvider, ClothesContext };
