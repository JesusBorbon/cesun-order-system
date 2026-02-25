import React, { createContext, useContext, useState } from 'react';

// Lo que representa un producto en tu base de datos (Go backend)
interface Product {
  id: string;
  name: string;
  price: number; // Mejor como number para cálculos
}

// Lo que vive dentro del estado del carrito
interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void; // Añadido para completar la lógica
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((currentCart) => {
      // ASEGURAMOS TIPOS: Forzamos que el precio sea número al entrar al carrito
      const safeProduct = {
        ...product,
        price: Number(product.price) || 0
      };

      const existingItem = currentCart.find((item) => item.id === safeProduct.id);

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === safeProduct.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { ...safeProduct, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((currentCart) => currentCart.filter(item => item.id !== id));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Ahora que price es number, esto no dará error de tipos
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de un CartProvider');
  return context;
};
