"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { Book } from "./BookContext";
import toast from "react-hot-toast";
import { getAuth } from "firebase/auth";
/* =========================
   TYPES
========================= */

export interface CartItem extends Book {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (book: Book) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

/* =========================
   CONTEXT
========================= */

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

/* =========================
   PROVIDER
========================= */

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {

  const auth = getAuth();
  const user = auth.currentUser;

  const [cart, setCart] = useState<CartItem[]>([]);

  /* -------------------------
     LOAD CART
  ------------------------- */
  useEffect(() => {
  const storedCart = user
    ? localStorage.getItem(`cart_${user.uid}`)
    : null;

  if (storedCart) {
    setCart(JSON.parse(storedCart));
  }
}, []);
  /* -------------------------
     SAVE CART
  ------------------------- */
 useEffect(() => {
  if (user) {
    localStorage.setItem(`cart_${user.uid}`, JSON.stringify(cart));
  }
}, [cart]);

  /* -------------------------
     ADD TO CART
  ------------------------- */
  const addToCart = (book: Book) => {
    const existing = cart.find(
      (item) => item.id === book.id
    );

    if (existing) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );

      toast.success("Quantity Updated 🛒");
    } else {
      setCart((prev) => [
        ...prev,
        { ...book, quantity: 1 },
      ]);

      toast.success("Added to Cart ✅");
    }
  };

  /* -------------------------
     INCREASE
  ------------------------- */
  const increaseQuantity = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  /* -------------------------
     DECREASE
  ------------------------- */
  const decreaseQuantity = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity > 1
                  ? item.quantity - 1
                  : 1,
            }
          : item
      )
    );
  };

  /* -------------------------
     REMOVE
  ------------------------- */
  const removeFromCart = (id: string) => {
    setCart((prev) =>
      prev.filter((item) => item.id !== id)
    );

    toast("Removed from Cart ❌", {
      icon: "🗑️",
    });
  };

  /* -------------------------
     CLEAR
  ------------------------- */
  const clearCart = () => {
    setCart([]);
   if (user) {
  localStorage.removeItem(`cart_${user.uid}`);
}

    toast.success("Cart Cleared 🧹");
  };

  /* -------------------------
     HELPERS
  ------------------------- */
  const getTotalItems = () =>
    cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

  const getTotalPrice = () =>
    cart.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* =========================
   HOOK
========================= */

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used within CartProvider"
    );
  }

  return context;
}