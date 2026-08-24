import { createContext, ReactNode, useEffect, useState } from "react";
import { fetchProducts, productEndpoints, readCachedProducts } from "../../services/products";
import { clProduct } from "../../types/interface";

interface ItemsContextProps {
  items: clProduct[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const ItemsContext = createContext<ItemsContextProps>({
  items: [],
  loading: true,
  error: null,
  refetch: () => undefined,
});

const ItemsProvider = ({ children }: { children: ReactNode }) => {
  const [initialItems] = useState<clProduct[] | null>(() => readCachedProducts(productEndpoints.items));
  const [items, setItems] = useState<clProduct[]>(initialItems ?? []);
  const [loading, setLoading] = useState(initialItems === null);
  const [error, setError] = useState<string | null>(null);
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    if (requestKey === 0 && initialItems !== null) return;

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchProducts(productEndpoints.items, controller.signal, requestKey > 0)
      .then(setItems)
      .catch(requestError => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError(requestError instanceof Error ? requestError.message : "Could not load items.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [initialItems, requestKey]);

  return <ItemsContext.Provider value={{ items, loading, error, refetch: () => setRequestKey(value => value + 1) }}>{children}</ItemsContext.Provider>;
};

export { ItemsProvider, ItemsContext };
