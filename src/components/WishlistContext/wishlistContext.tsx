import { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { clProduct } from "../../types/interface";
import { reconcileSavedProducts } from "../../services/products";
import { ClothesContext } from "../Fetch/clothes-context";
import { ItemsContext } from "../Fetch/items-context";
import { WishlistContext } from "./useWishlist";

const readWishlist = (): clProduct[] => {
  try {
    const storedWishlist = localStorage.getItem("wishlist");
    const parsedWishlist: unknown = storedWishlist ? JSON.parse(storedWishlist) : [];
    return Array.isArray(parsedWishlist) ? parsedWishlist : [];
  } catch {
    return [];
  }
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<clProduct[]>(readWishlist);
  const { clothes } = useContext(ClothesContext);
  const { items } = useContext(ItemsContext);

  useEffect(() => {
    setWishlist(current => reconcileSavedProducts(current, [...clothes, ...items]));
  }, [clothes, items]);

  useEffect(() => {
    try {
      const serialized = JSON.stringify(wishlist);
      if (localStorage.getItem("wishlist") !== serialized) localStorage.setItem("wishlist", serialized);
    } catch {
      // Keep saved products usable when browser storage is unavailable.
    }
  }, [wishlist]);

  const addToWishlist = useCallback((product: clProduct) => {
    setWishlist(current => current.some(item => item.id === product.id) ? current : [...current, product]);
  }, []);

  const removeFromWishlist = useCallback((productId: number) => {
    setWishlist(current => current.filter(product => product.id !== productId));
  }, []);

  const clearWishlist = useCallback(() => setWishlist([]), []);
  const value = useMemo(() => ({ wishlist, addToWishlist, removeFromWishlist, clearWishlist }), [wishlist, addToWishlist, removeFromWishlist, clearWishlist]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
