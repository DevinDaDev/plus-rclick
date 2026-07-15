import type { Metadata } from "next";
import { Suspense } from "react";
import RequestForm from "@/components/RequestForm";

export const metadata: Metadata = {
  title: "Request my spare unit",
  description:
    "Tell us what failed and we will start your rapid recovery. Target recovery for network equipment is 8 business hours.",
};

export default function RequestPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Request my spare unit
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Tell us what failed and we will start your rapid recovery. Target
        recovery for network equipment is 8 business hours, same day.
      </p>

      <div className="mt-10">
        <Suspense
          fallback={
            <div className="rounded-xl border border-border bg-background p-8 text-muted-foreground shadow-sm">
              Loading form…
            </div>
          }
        >
          <RequestForm />
        </Suspense>
      </div>
    </div>
  );
}
