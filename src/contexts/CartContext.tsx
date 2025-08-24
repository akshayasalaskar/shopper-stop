import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product } from '../types/api';
import { useToastContext } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  totalQuantity: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToastContext();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        const newTotal = product.price * newQuantity;
        const discountedTotal = newTotal * (1 - product.discountPercentage / 100);
        
        toast({
          title: "Cart updated",
          description: `${product.title} quantity updated to ${newQuantity}`,
        });
        
        return prev.map(item =>
          item.id === product.id
            ? { 
                ...item, 
                quantity: newQuantity, 
                total: newTotal,
                discountedTotal 
              }
            : item
        );
      } else {
        const total = product.price * quantity;
        const discountedTotal = total * (1 - product.discountPercentage / 100);
        
        const newItem: CartItem = {
          id: product.id,
          title: product.title,
          price: product.price,
          quantity,
          total,
          discountPercentage: product.discountPercentage,
          discountedTotal,
          thumbnail: product.thumbnail,
        };
        
        toast({
          title: "Added to cart",
          description: `${product.title} has been added to your cart`,
        });
        
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(prev => {
      const item = prev.find(item => item.id === productId);
      if (item) {
        toast({
          title: "Removed from cart",
          description: `${item.title} has been removed from your cart`,
        });
      }
      return prev.filter(item => item.id !== productId);
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(prev =>
      prev.map(item => {
        if (item.id === productId) {
          const newTotal = item.price * quantity;
          const discountedTotal = newTotal * (1 - item.discountPercentage / 100);
          return { 
            ...item, 
            quantity, 
            total: newTotal,
            discountedTotal 
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  const total = items.reduce((sum, item) => sum + item.discountedTotal, 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      totalQuantity,
    }}>
      {children}
    </CartContext.Provider>
  );
};
