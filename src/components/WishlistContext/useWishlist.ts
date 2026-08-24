import { createContext, useContext } from "react";
import { clProduct } from "../../types/interface";

interface WishlistContextTypes {
  wishlist: clProduct[];
  addToWishlist: (product: clProduct) => void;
  removeFromWishlist: (productId: number) => void;
  clearWishlist: () => void;
}

export const WishlistContext = createContext<WishlistContextTypes>({
  wishlist: [],
  addToWishlist: () => undefined,
  removeFromWishlist: () => undefined,
  clearWishlist: () => undefined,
});

export const useWishlist = () => useContext(WishlistContext);
