import { createContext } from "react";
import { clProduct } from "../../types/interface";

interface ClothesContextProps {
  clothes: clProduct[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const ClothesContext = createContext<ClothesContextProps>({
  clothes: [],
  loading: true,
  error: null,
  refetch: () => undefined,
});
