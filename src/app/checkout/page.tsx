import type { Metadata } from "next";
import CheckoutForm from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Right Click Plus order.",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Checkout</h1>
      <div className="mt-8">
        <CheckoutForm />
      </div>
    </div>
  );
}
