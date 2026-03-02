"use client";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { BookProvider } from "./context/BookContext";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <CartProvider>
        <BookProvider>
          {children}
        </BookProvider>
      </CartProvider>
    </AuthProvider>
  );
}