import type { Metadata } from "next";
import { Suspense } from "react";
import RegisterForm from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "Register your device",
  description:
    "Register your device's serial number to activate your included year of Right Click Plus.",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Register your device
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Enter your device&apos;s serial number to activate your included year of
        Plus coverage.
      </p>

      <div className="mt-10">
        <Suspense
          fallback={
            <div className="rounded-xl border border-border bg-background p-8 text-muted-foreground shadow-sm">
              Loading form…
            </div>
          }
        >
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
