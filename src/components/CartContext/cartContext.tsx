import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface Product {
  id: string;
  quantity: number;
}

interface CartContextTypes {
  cart: Product[];
  addToCart: (product: Product) => void;
  decrementFromCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
}

const CartContext = createContext<CartContextTypes>({
  cart: [],
  addToCart: () => {},
  decrementFromCart: () => {},
  removeFromCart: () => {}
});

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Product[]>(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    const existingProduct = cart.find(item => item.id === product.id);
  
    if (existingProduct) {
      setCart(prevCart => prevCart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const decrementFromCart = (product: Product) => {
    const existingProduct = cart.find(item => item.id === product.id);
  
    if (existingProduct) {
      setCart(prevCart => prevCart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity -1 }
          : item
      ));
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.map(item =>
      item.id === productId
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ).filter(item => item.quantity > 0));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, decrementFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
