"use client";

import { useCart } from "@/lib/cart";

export default function CartButton() {
  const cart = useCart();

  return (
    <button
      type="button"
      onClick={cart.openCart}
      aria-label={`Open cart, ${cart.count} items`}
      className="relative cursor-pointer rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {cart.count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-plus px-1 text-xs font-bold text-white">
          {cart.count}
        </span>
      )}
    </button>
  );
}
