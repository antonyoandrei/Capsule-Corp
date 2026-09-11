import { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { clProduct } from "../../types/interface";
import { reconcileSavedProducts } from "../../services/products";
import { ClothesContext } from "../Fetch/clothes-context";
import { ItemsContext } from "../Fetch/items-context";
import { CartActionsContext, CartContext, CartItem } from "./useCart";

const readCart = (): CartItem[] => {
  try {
    const storedCart = localStorage.getItem("cart");
    const parsedCart: unknown = storedCart ? JSON.parse(storedCart) : [];
    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(readCart);
  const { clothes } = useContext(ClothesContext);
  const { items } = useContext(ItemsContext);

  useEffect(() => {
    setCart(current => reconcileSavedProducts(current, [...clothes, ...items]));
  }, [clothes, items]);

  useEffect(() => {
    try {
      const serialized = JSON.stringify(cart);
      if (localStorage.getItem("cart") !== serialized) localStorage.setItem("cart", serialized);
    } catch {
      // Keep the current bag usable when browser storage is unavailable.
    }
  }, [cart]);

  const addToCart = useCallback((product: clProduct) => {
    setCart(current => {
      const existingProduct = current.find(item => item.id === product.id);
      if (existingProduct) {
        return current.map(item => item.id === product.id ? { ...item, ...product, quantity: item.quantity + 1 } : item);
      }
      return [...current, { ...product, quantity: 1 }];
    });
  }, []);

  const decrementFromCart = useCallback((productId: number) => {
    setCart(current => current
      .map(item => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item)
      .filter(item => item.quantity > 0));
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart(current => current.filter(item => item.id !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);
  const actions = useMemo(() => ({ addToCart, decrementFromCart, removeFromCart, clearCart }), [addToCart, decrementFromCart, removeFromCart, clearCart]);
  const value = useMemo(() => ({ cart, ...actions }), [cart, actions]);

  return <CartActionsContext.Provider value={actions}><CartContext.Provider value={value}>{children}</CartContext.Provider></CartActionsContext.Provider>;
};
