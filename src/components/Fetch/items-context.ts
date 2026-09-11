import { createContext } from "react";
import { clProduct } from "../../types/interface";

interface ItemsContextProps {
  items: clProduct[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const ItemsContext = createContext<ItemsContextProps>({
  items: [],
  loading: true,
  error: null,
  refetch: () => undefined,
});
