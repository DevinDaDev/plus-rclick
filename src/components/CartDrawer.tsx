"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart, formatPrice } from "@/lib/cart";
import { getDeviceById } from "@/data/devices";

export default function CartDrawer() {
  const cart = useCart();
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);

  return (
    <div
      aria-hidden={!cart.isOpen}
      className={`fixed inset-0 z-50 ${cart.isOpen ? "" : "pointer-events-none"}`}
    >
      {/* Overlay */}
      <div
        onClick={cart.closeCart}
        className={`absolute inset-0 bg-foreground/40 transition-opacity duration-200 ${
          cart.isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-xl transition-transform duration-200 ${
          cart.isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-extrabold">
            Your cart{cart.count > 0 ? ` (${cart.count})` : ""}
          </h2>
          <button
            type="button"
            onClick={cart.closeCart}
            aria-label="Close cart"
            className="cursor-pointer rounded-md p-2 text-muted-foreground hover:text-foreground"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {cart.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Link
              href="/network"
              onClick={cart.closeCart}
              className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent-hover"
            >
              Shop devices
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
              {cart.items.map((item) => {
                const device = getDeviceById(item.deviceId);
                if (!device) return null;
                return (
                  <li key={item.deviceId} className="flex gap-4 py-4">
                    <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-white">
                      <Image
                        src={device.imageUrl}
                        alt={device.name}
                        fill
                        sizes="80px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-bold leading-tight">
                          {device.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => cart.removeItem(item.deviceId)}
                          aria-label={`Remove ${device.name}`}
                          className="cursor-pointer text-muted-foreground hover:text-foreground"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                            <path d="M3 6h18M8 6V4h8v2m1 0-1 14H8L7 6" />
                          </svg>
                        </button>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Includes 1 year of Plus
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="inline-flex items-center rounded-md border border-border">
                          <button
                            type="button"
                            onClick={() => cart.setQty(item.deviceId, item.qty - 1)}
                            aria-label="Decrease quantity"
                            className="cursor-pointer px-2.5 py-1 text-muted-foreground hover:text-foreground"
                          >
                            −
                          </button>
                          <span className="min-w-7 text-center text-sm font-semibold">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => cart.setQty(item.deviceId, item.qty + 1)}
                            aria-label="Increase quantity"
                            className="cursor-pointer px-2.5 py-1 text-muted-foreground hover:text-foreground"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-sm font-bold">
                          {formatPrice(device.price * item.qty)}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-border px-5 py-4">
              {/* Discount code */}
              {cart.discountCode ? (
                <div className="mb-3 flex items-center justify-between rounded-md bg-accent-soft px-3 py-2 text-sm">
                  <span>
                    Code <strong>{cart.discountCode}</strong> applied
                  </span>
                  <button
                    type="button"
                    onClick={cart.clearDiscount}
                    className="cursor-pointer font-semibold text-accent hover:text-accent-hover"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form
                  className="mb-3 flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const ok = cart.applyDiscount(code);
                    setCodeError(!ok);
                    if (ok) setCode("");
                  }}
                >
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      setCodeError(false);
                    }}
                    placeholder="Discount code"
                    aria-label="Discount code"
                    className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="cursor-pointer rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
                  >
                    Apply
                  </button>
                </form>
              )}
              {codeError && (
                <p className="mb-3 text-xs text-red-600">
                  That code is not valid.
                </p>
              )}

              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-semibold">{formatPrice(cart.subtotal)}</dd>
                </div>
                {cart.discountAmount > 0 && (
                  <div className="flex justify-between text-accent">
                    <dt>Discount</dt>
                    <dd>−{formatPrice(cart.discountAmount)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Estimated tax</dt>
                  <dd className="font-semibold">{formatPrice(cart.tax)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base">
                  <dt className="font-extrabold">Total</dt>
                  <dd className="font-extrabold">{formatPrice(cart.total)}</dd>
                </div>
              </dl>

              <Link
                href="/checkout"
                onClick={cart.closeCart}
                className="mt-4 block w-full rounded-md bg-accent px-6 py-3 text-center text-base font-bold text-accent-foreground transition-colors hover:bg-accent-hover"
              >
                Checkout
              </Link>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Every device includes 1 year of Plus at no additional cost.
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
