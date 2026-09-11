import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchProducts, productEndpoints, readCachedProducts } from "../../services/products";
import { clProduct } from "../../types/interface";
import { ClothesContext } from "./clothes-context";

const ClothesProvider = ({ children }: { children: ReactNode }) => {
  const [initialClothes] = useState<clProduct[] | null>(() => readCachedProducts(productEndpoints.clothes));
  const [clothes, setClothes] = useState<clProduct[]>(initialClothes ?? []);
  const [loading, setLoading] = useState(initialClothes === null);
  const [error, setError] = useState<string | null>(null);
  const [requestKey, setRequestKey] = useState(0);
  const hasData = useRef(initialClothes !== null);
  const refetch = useCallback(() => setRequestKey(value => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(!hasData.current);
    setError(null);

    fetchProducts(productEndpoints.clothes, controller.signal, requestKey > 0)
      .then(products => {
        if (controller.signal.aborted) return;
        hasData.current = true;
        setClothes(products);
      })
      .catch(requestError => {
        if (controller.signal.aborted) return;
        setError(requestError instanceof Error ? requestError.message : "Could not load clothes.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [requestKey]);

  const value = useMemo(() => ({ clothes, loading, error, refetch }), [clothes, loading, error, refetch]);
  return <ClothesContext.Provider value={value}>{children}</ClothesContext.Provider>;
};

export { ClothesProvider };
