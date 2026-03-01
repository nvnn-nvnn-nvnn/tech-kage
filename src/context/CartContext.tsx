import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export type CartItemType = "custom_build" | "prebuild";

export interface CartItem {
  id:       string;
  type:     CartItemType;
  name:     string;
  price:    number;
  addedAt:  string;
  build?:   Record<string, any>;
  config?:  Record<string, any>;
  imageUrl?: string;
  specs?:   string;
  sku?:     string;
  quantity: number;
}

interface CartContextType {
  items:          CartItem[];
  history:        CartItem[];
  addBuild:       (build: any, price: number, config: any, name: string) => void;
  addPrebuild:    (prebuild: Omit<CartItem, "id" | "type" | "addedAt" | "quantity">) => void;
  removeItem:     (id: string) => void;
  clearCart:      () => void;
  clearHistory:   () => void;
  updateQuantity: (id: string, quantity: number) => void;
  cartCount:      number;
  cartTotal:      number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const MAX_HISTORY = 3;

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  // ── All useState at the top ───────────────────────────────────
  const [authReady, setAuthReady]   = useState(false);
  const [items, setItems]           = useState<CartItem[]>([]);
  const [history, setHistory]       = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("cart_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ── All useEffects after ──────────────────────────────────────
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!authReady) return;
    if (!user) {
      try {
        const saved = localStorage.getItem("tk_cart_v2");
        if (saved) setItems(JSON.parse(saved));
      } catch {
        localStorage.removeItem("tk_cart_v2");
      }
      return;
    }

    const loadCart = async () => {
      const { data } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (data && data.length > 0) {
        setItems(data.map(row => row.item_data as CartItem));
      } else {
        try {
          const saved = localStorage.getItem("tk_cart_v2");
          if (saved) setItems(JSON.parse(saved));
        } catch {}
      }
    };

    loadCart();
  }, [authReady, user]);

  useEffect(() => {
    localStorage.setItem("tk_cart_v2", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("cart_history", JSON.stringify(history));
  }, [history]);

  // ── All functions after ───────────────────────────────────────
  const addBuild = async (build: any, price: number, config: any, name: string) => {
    const item: CartItem = {
      id:       generateId(),
      type:     "custom_build",
      name:     name || "Custom Build",
      price,
      build,
      config,
      quantity: 1,
      addedAt:  new Date().toISOString(),
    };

    setItems(prev => [
      ...prev.filter(i => i.type !== "custom_build"),
      item,
    ]);

    // ← setHistory correctly inside addBuild
    setHistory(prev => {
      const alreadyExists = prev.some(b => b.id === item.id);
      if (alreadyExists) return prev;
      const updated = [...prev, item];
      return updated.length > MAX_HISTORY ? updated.slice(-MAX_HISTORY) : updated;
    });

    if (user) {
      await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .eq("item_data->>type", "custom_build");

      await supabase.from("cart_items").insert({
        user_id:   user.id,
        item_id:   item.id,
        item_data: item,
      });
    }
  };

  const addPrebuild = async (prebuild: Omit<CartItem, "id" | "type" | "addedAt" | "quantity">) => {
    const exists = items.find(i => i.sku && i.sku === prebuild.sku);
    if (exists) return;

    const item: CartItem = {
      ...prebuild,
      id:       generateId(),
      type:     "prebuild",
      quantity: 1,
      addedAt:  new Date().toISOString(),
    };

    setItems(prev => [...prev, item]);

    if (user) {
      await supabase.from("cart_items").insert({
        user_id:   user.id,
        item_id:   item.id,
        item_data: item,
      });
    }
  };

  const removeItem = async (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    if (user) {
      await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .eq("item_id", id);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) { removeItem(id); return; }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const clearCart = async () => {
    setItems([]);
    localStorage.removeItem("tk_cart_v2");

    if (user) {
      await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);
    }
  };


  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("cart_history");
  }

  const cartCount = items.length;
  const cartTotal = items.reduce((sum, i) => sum + (i.price || 0), 0);

  return (
    <CartContext.Provider value={{
      items, history, addBuild, addPrebuild, removeItem, updateQuantity, clearCart, clearHistory, cartCount, cartTotal,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error("useCart must be used within CartProvider");
  return context;
};