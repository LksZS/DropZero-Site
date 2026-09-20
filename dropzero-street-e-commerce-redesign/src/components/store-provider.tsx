"use client";

import type { CatalogProduct } from "@/lib/catalog";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type CartItem = {
  product: CatalogProduct;
  size: string;
  color: string;
  quantity: number;
};

type StoreContextValue = {
  cart: CartItem[];
  cartCount: number;
  cartOpen: boolean;
  menuOpen: boolean;
  searchOpen: boolean;
  favorites: string[];
  addItem: (product: CatalogProduct, size?: string, color?: string) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  toggleFavorite: (productId: string) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  setMenuOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);
const CART_KEY = "dropzero_cart_v2";
const FAVORITES_KEY = "dropzero_favorites_v2";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(CART_KEY);
      const savedFavorites = window.localStorage.getItem(FAVORITES_KEY);
      if (savedCart) setCart(JSON.parse(savedCart) as CartItem[]);
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites) as string[]);
    } catch {
      window.localStorage.removeItem(CART_KEY);
      window.localStorage.removeItem(FAVORITES_KEY);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites, hydrated]);

  useEffect(() => {
    const locked = cartOpen || menuOpen || searchOpen;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen, menuOpen, searchOpen]);

  const addItem = useCallback((product: CatalogProduct, size?: string, color?: string) => {
    const selectedSize = size ?? product.sizes[0];
    const selectedColor = color ?? product.colors[0];
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id && item.size === selectedSize && item.color === selectedColor);
      if (existing) {
        return current.map((item) => item === existing ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { product, size: selectedSize, color: selectedColor, quantity: 1 }];
    });
    setCartOpen(true);
  }, []);

  const removeItem = useCallback((productId: string, size: string) => {
    setCart((current) => current.filter((item) => !(item.product.id === productId && item.size === size)));
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, quantity: number) => {
    if (quantity < 1) return removeItem(productId, size);
    setCart((current) => current.map((item) => item.product.id === productId && item.size === size ? { ...item, quantity } : item));
  }, [removeItem]);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]);
  }, []);

  const value = useMemo<StoreContextValue>(() => ({
    cart,
    cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    cartOpen,
    menuOpen,
    searchOpen,
    favorites,
    addItem,
    removeItem,
    updateQuantity,
    toggleFavorite,
    clearCart: () => setCart([]),
    setCartOpen,
    setMenuOpen,
    setSearchOpen,
  }), [cart, cartOpen, menuOpen, searchOpen, favorites, addItem, removeItem, updateQuantity, toggleFavorite]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
}
