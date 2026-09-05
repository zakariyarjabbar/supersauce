"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { menuItems } from "@/lib/menu";

type CartLine = { slug: string; quantity: number };
type CartContextValue = {
  cart: CartLine[];
  count: number;
  total: number;
  ready: boolean;
  add: (slug: string, quantity?: number) => void;
  update: (slug: string, quantity: number) => void;
  clear: () => void;
  toast: string;
  favorites: string[];
  toggleFavorite: (slug: string) => void;
};
const CartContext = createContext<CartContextValue | null>(null);
const key = "supersauce-cart-v1";
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState("");
  useEffect(() => {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(key) || "[]");
      if (Array.isArray(parsed)) {
        const valid = parsed.filter(
          (x): x is CartLine =>
            !!x &&
            typeof x === "object" &&
            "slug" in x &&
            typeof x.slug === "string" &&
            menuItems.some((p) => p.slug === x.slug) &&
            "quantity" in x &&
            Number.isInteger(x.quantity) &&
            Number(x.quantity) > 0 &&
            Number(x.quantity) <= 20,
        );
        // Device-local preferences are restored only after the server render hydrates.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCart([...new Map(valid.map((x) => [x.slug, x])).values()]);
      }
      const saved: unknown = JSON.parse(localStorage.getItem("supersauce-favorites") || "[]");
      if (Array.isArray(saved))
        setFavorites(
          saved.filter((x) => typeof x === "string" && menuItems.some((p) => p.slug === x)),
        );
    } catch {
      /* Browsing still works when browser storage is unavailable. */
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(key, JSON.stringify(cart));
        localStorage.setItem("supersauce-favorites", JSON.stringify(favorites));
      } catch {
        /* Session state remains available. */
      }
    }
  }, [cart, favorites, ready]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(timer);
  }, [toast]);
  const add = useCallback((slug: string, quantity = 1) => {
    const product = menuItems.find((p) => p.slug === slug);
    if (!product) return;
    const amount = Number.isFinite(quantity) ? Math.max(1, Math.min(20, Math.floor(quantity))) : 1;
    setCart((current) =>
      current.some((x) => x.slug === slug)
        ? current.map((x) =>
            x.slug === slug ? { ...x, quantity: Math.min(20, x.quantity + amount) } : x,
          )
        : [...current, { slug, quantity: amount }],
    );
    setToast(`أضفنا ${product.name} لطلبك`);
  }, []);
  const update = useCallback(
    (slug: string, quantity: number) =>
      setCart((current) =>
        quantity <= 0
          ? current.filter((x) => x.slug !== slug)
          : current.map((x) =>
              x.slug === slug
                ? { ...x, quantity: Math.max(1, Math.min(20, Math.floor(quantity))) }
                : x,
            ),
      ),
    [],
  );
  const toggleFavorite = useCallback(
    (slug: string) =>
      setFavorites((current) =>
        current.includes(slug) ? current.filter((x) => x !== slug) : [...current, slug],
      ),
    [],
  );
  const count = cart.reduce((sum, x) => sum + x.quantity, 0);
  const total = cart.reduce(
    (sum, x) => sum + (menuItems.find((p) => p.slug === x.slug)?.price || 0) * x.quantity,
    0,
  );
  return (
    <CartContext.Provider
      value={{
        cart,
        count,
        total,
        ready,
        add,
        update,
        clear: () => setCart([]),
        toast,
        favorites,
        toggleFavorite,
      }}
    >
      {children}
      <div role="status" aria-live="polite" className={`toast ${toast ? "visible" : ""}`}>
        {toast}
      </div>
    </CartContext.Provider>
  );
}
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("CartProvider is missing");
  return context;
}
