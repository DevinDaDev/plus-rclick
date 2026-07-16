"use client";

import { useCart } from "@/lib/cart";

export default function AddToCartButton({
  deviceId,
  size = "sm",
}: {
  deviceId: string;
  size?: "sm" | "lg";
}) {
  const cart = useCart();
  const sizing =
    size === "lg"
      ? "px-6 py-3 text-base"
      : "px-4 py-2 text-sm";

  return (
    <button
      type="button"
      onClick={() => cart.addItem(deviceId)}
      className={`cursor-pointer rounded-md bg-accent font-semibold text-accent-foreground transition-colors hover:bg-accent-hover ${sizing}`}
    >
      Add to cart
    </button>
  );
}
