import { createContext, useContext } from "react";
import { clProduct } from "../../types/interface";

export interface CartItem extends clProduct {
  quantity: number;
}

export interface CartContextTypes {
  cart: CartItem[];
  addToCart: (product: clProduct) => void;
  decrementFromCart: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextTypes>({
  cart: [],
  addToCart: () => undefined,
  decrementFromCart: () => undefined,
  removeFromCart: () => undefined,
  clearCart: () => undefined,
});

export const useCart = () => useContext(CartContext);
