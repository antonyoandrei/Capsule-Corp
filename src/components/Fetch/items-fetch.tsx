import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchProducts, productEndpoints, readCachedProducts } from "../../services/products";
import { clProduct } from "../../types/interface";
import { ItemsContext } from "./items-context";

const ItemsProvider = ({ children }: { children: ReactNode }) => {
  const [initialItems] = useState<clProduct[] | null>(() => readCachedProducts(productEndpoints.items));
  const [items, setItems] = useState<clProduct[]>(initialItems ?? []);
  const [loading, setLoading] = useState(initialItems === null);
  const [error, setError] = useState<string | null>(null);
  const [requestKey, setRequestKey] = useState(0);
  const hasData = useRef(initialItems !== null);
  const refetch = useCallback(() => setRequestKey(value => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(!hasData.current);
    setError(null);

    fetchProducts(productEndpoints.items, controller.signal, requestKey > 0)
      .then(products => {
        if (controller.signal.aborted) return;
        hasData.current = true;
        setItems(products);
      })
      .catch(requestError => {
        if (controller.signal.aborted) return;
        setError(requestError instanceof Error ? requestError.message : "Could not load items.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [requestKey]);

  const value = useMemo(() => ({ items, loading, error, refetch }), [items, loading, error, refetch]);
  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>;
};

export { ItemsProvider };
