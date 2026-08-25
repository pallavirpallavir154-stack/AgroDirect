import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, PlatformFeeConfig } from '../../shared/types';
import { DEFAULT_PLATFORM_FEE } from '../../shared/constants';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  productSubtotal: number;
  platformFee: number;
  deliveryFee: number;
  totalAmount: number;
  totalItemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('agrodirect_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [platformFeeConfig, setPlatformFeeConfig] = useState<PlatformFeeConfig>(DEFAULT_PLATFORM_FEE);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('agrodirect_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    // Fetch live platform fee configuration from backend
    fetch('/api/fee-config')
      .then((res) => (res.ok ? res.json() : fetch('/api/admin/fee-config').then((r) => (r.ok ? r.json() : null))))
      .then((data) => {
        if (data && data.feeAmount !== undefined) {
          setPlatformFeeConfig(data);
        }
      })
      .catch(() => {});
  }, []);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      const qtyToAdd = Math.max(product.minimumOrderQuantity || 1, quantity);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + qtyToAdd, subtotal: (i.quantity + qtyToAdd) * i.pricePerUnit }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          productImage: product.images[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
          farmerId: product.farmerId,
          farmerName: product.farmerName,
          pricePerUnit: product.pricePerUnit,
          quantity: qtyToAdd,
          unit: product.unit,
          subtotal: qtyToAdd * product.pricePerUnit,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? { ...i, quantity, subtotal: quantity * i.pricePerUnit }
          : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const productSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const platformFee = items.length > 0 && platformFeeConfig.active ? platformFeeConfig.feeAmount : 0;
  const deliveryFee = items.length > 0 ? 50 : 0;
  const totalAmount = productSubtotal + platformFee + deliveryFee;
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        productSubtotal,
        platformFee,
        deliveryFee,
        totalAmount,
        totalItemCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
