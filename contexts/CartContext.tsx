'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, VariantOption } from '@/types/product';

export interface CartItem {
  product: Product;
  selectedVariant?: VariantOption;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variant?: VariantOption, quantity?: number) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar carrinho do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Salvar carrinho no localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (product: Product, variant?: VariantOption, quantity: number = 1) => {
    setItems((currentItems) => {
      const existingIndex = currentItems.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedVariant?.id === variant?.id
      );

      if (existingIndex > -1) {
        const newItems = [...currentItems];
        newItems[existingIndex].quantity += quantity;
        return newItems;
      }

      return [...currentItems, { product, selectedVariant: variant, quantity }];
    });
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(item.product.id === productId && item.selectedVariant?.id === variantId)
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId && item.selectedVariant?.id === variantId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => {
      const price = item.selectedVariant?.price || item.product.priceWithDiscount || item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
}
