import { createContext, ReactNode, useEffect, useState } from "react";
import { fetchProducts, productEndpoints, readCachedProducts } from "../../services/products";
import { clProduct } from "../../types/interface";

interface ClothesContextProps {
  clothes: clProduct[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const ClothesContext = createContext<ClothesContextProps>({
  clothes: [],
  loading: true,
  error: null,
  refetch: () => undefined,
});

const ClothesProvider = ({ children }: { children: ReactNode }) => {
  const [initialClothes] = useState<clProduct[] | null>(() => readCachedProducts(productEndpoints.clothes));
  const [clothes, setClothes] = useState<clProduct[]>(initialClothes ?? []);
  const [loading, setLoading] = useState(initialClothes === null);
  const [error, setError] = useState<string | null>(null);
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    if (requestKey === 0 && initialClothes !== null) return;

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchProducts(productEndpoints.clothes, controller.signal, requestKey > 0)
      .then(setClothes)
      .catch(requestError => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError(requestError instanceof Error ? requestError.message : "Could not load clothes.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [initialClothes, requestKey]);

  return <ClothesContext.Provider value={{ clothes, loading, error, refetch: () => setRequestKey(value => value + 1) }}>{children}</ClothesContext.Provider>;
};

export { ClothesProvider, ClothesContext };
