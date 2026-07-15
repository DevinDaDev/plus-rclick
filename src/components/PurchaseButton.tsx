"use client";

import { useState } from "react";
import Link from "next/link";

export default function PurchaseButton({ deviceId }: { deviceId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "unavailable">("idle");

  async function startCheckout() {
    setStatus("loading");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.url) {
        window.location.assign(body.url);
        return;
      }
      setStatus("unavailable");
    } catch {
      setStatus("unavailable");
    }
  }

  if (status === "unavailable") {
    return (
      <Link
        href={`/request?device=${deviceId}`}
        className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
      >
        Contact us to order
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={startCheckout}
      disabled={status === "loading"}
      className="cursor-pointer rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
    >
      {status === "loading" ? "Opening checkout…" : "Purchase device"}
    </button>
  );
}
