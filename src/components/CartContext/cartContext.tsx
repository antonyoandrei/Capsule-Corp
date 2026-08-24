import { ReactNode, useEffect, useState } from "react";
import { clProduct } from "../../types/interface";
import { CartContext, CartItem } from "./useCart";

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

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: clProduct) => {
    setCart(current => {
      const existingProduct = current.find(item => item.id === product.id);
      if (existingProduct) {
        return current.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const decrementFromCart = (productId: number) => {
    setCart(current => current
      .map(item => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item)
      .filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId: number) => {
    setCart(current => current.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  return <CartContext.Provider value={{ cart, addToCart, decrementFromCart, removeFromCart, clearCart }}>{children}</CartContext.Provider>;
};
