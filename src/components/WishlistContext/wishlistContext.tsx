import { ReactNode, useEffect, useState } from "react";
import { clProduct } from "../../types/interface";
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

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product: clProduct) => {
    setWishlist(current => current.some(item => item.id === product.id) ? current : [...current, product]);
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist(current => current.filter(product => product.id !== productId));
  };

  const clearWishlist = () => setWishlist([]);

  return <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, clearWishlist }}>{children}</WishlistContext.Provider>;
};
