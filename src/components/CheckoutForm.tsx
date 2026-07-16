"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart, formatPrice } from "@/lib/cart";
import { getDeviceById } from "@/data/devices";

export default function CheckoutForm() {
  const cart = useCart();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const data = new FormData(event.currentTarget);
    const payload = {
      companyName: String(data.get("companyName") || "").trim(),
      contactName: String(data.get("contactName") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      shippingAddress: String(data.get("shippingAddress") || "").trim(),
      items: cart.items,
      discountCode: cart.discountCode || undefined,
    };

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }
      cart.clear();
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-border bg-background p-8 text-center shadow-sm">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <h2 className="mt-5 text-2xl font-extrabold tracking-tight">
          Order received
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Thank you! Our team will confirm your order and arrange payment and
          delivery. You will get an email confirmation shortly. After delivery,
          register your device&apos;s serial number to activate your year of{" "}
          <span className="italic font-semibold text-plus">Plus</span>.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/register"
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent-hover"
          >
            Register a device
          </Link>
          <Link
            href="/"
            className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold hover:bg-muted"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-border bg-background p-8 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Link
          href="/network"
          className="mt-4 inline-flex rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent-hover"
        >
          Shop devices
        </Link>
      </div>
    );
  }

  const labelClass = "block text-sm font-medium";
  const inputClass =
    "mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

  return (
    <div className="grid gap-10 lg:grid-cols-5">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-background p-6 sm:p-8 lg:col-span-3"
        noValidate
      >
        <h2 className="text-lg font-extrabold">Contact & shipping</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="companyName" className={labelClass}>
              Company name
            </label>
            <input id="companyName" name="companyName" type="text" required autoComplete="organization" className={inputClass} />
          </div>
          <div>
            <label htmlFor="contactName" className={labelClass}>
              Contact name
            </label>
            <input id="contactName" name="contactName" type="text" required autoComplete="name" className={inputClass} />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone
            </label>
            <input id="phone" name="phone" type="tel" required autoComplete="tel" className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="shippingAddress" className={labelClass}>
              Shipping address
            </label>
            <textarea id="shippingAddress" name="shippingAddress" rows={3} required autoComplete="street-address" className={inputClass} />
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          Payment: our team will confirm your order and arrange payment.
          Online card payment is coming soon.
        </div>

        {status === "error" && (
          <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="mt-6 w-full cursor-pointer rounded-md bg-accent px-6 py-3 text-base font-bold text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {status === "submitting" ? "Placing order…" : "Place order"}
        </button>
      </form>

      {/* Summary */}
      <aside className="h-fit rounded-xl border border-border bg-muted p-6 lg:col-span-2">
        <h2 className="text-lg font-extrabold">Order summary</h2>
        <ul className="mt-4 space-y-4">
          {cart.items.map((item) => {
            const device = getDeviceById(item.deviceId);
            if (!device) return null;
            return (
              <li key={item.deviceId} className="flex items-center gap-3">
                <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md border border-border bg-white">
                  <Image src={device.imageUrl} alt={device.name} fill sizes="64px" className="object-contain p-1" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-semibold leading-tight">{device.name}</p>
                  <p className="text-muted-foreground">Qty {item.qty}</p>
                </div>
                <p className="text-sm font-bold">
                  {formatPrice(device.price * item.qty)}
                </p>
              </li>
            );
          })}
        </ul>
        <dl className="mt-5 space-y-1.5 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="font-semibold">{formatPrice(cart.subtotal)}</dd>
          </div>
          {cart.discountAmount > 0 && (
            <div className="flex justify-between text-accent">
              <dt>Discount ({cart.discountCode})</dt>
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
        <p className="mt-4 text-xs text-muted-foreground">
          Every device includes 1 year of{" "}
          <span className="italic font-semibold text-plus">Plus</span> at no
          additional cost.
        </p>
      </aside>
    </div>
  );
}
