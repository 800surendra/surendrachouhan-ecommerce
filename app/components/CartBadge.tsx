"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function CartBadge() {
  const { cart } = useCart();

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <Link href="/cart" className="relative hover:text-yellow-400 transition">
      Cart
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-4 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full">
          {totalItems}
        </span>
      )}
    </Link>
  );
}