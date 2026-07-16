"use client";

import { useState } from "react";
import { getBrowserClient } from "@/lib/supabase-browser";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "unavailable">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getBrowserClient();
    if (!supabase) {
      setStatus("unavailable");
      return;
    }
    setStatus("sending");
    setErrorMessage("");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
    } else {
      setStatus("sent");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-border bg-background p-8 text-center shadow-sm">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m2 7 10 7L22 7" />
          </svg>
        </span>
        <h2 className="mt-5 text-2xl font-extrabold tracking-tight">
          Check your email
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          We sent a sign-in link to <strong>{email}</strong>. Click it and
          you&apos;ll be signed in — no password needed.
        </p>
      </div>
    );
  }

  if (status === "unavailable") {
    return (
      <div className="rounded-xl border border-border bg-background p-8 text-center shadow-sm">
        <h2 className="text-xl font-extrabold tracking-tight">
          Accounts are coming soon
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Customer accounts are almost ready. For now, use the request form and
          our team will take care of you directly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-background p-6 shadow-sm sm:p-8"
    >
      <label htmlFor="email" className="block text-sm font-medium">
        Email address
      </label>
      <input
        id="email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      <p className="mt-2 text-xs text-muted-foreground">
        We&apos;ll email you a one-time sign-in link. No password to remember.
      </p>

      {status === "error" && (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-5 w-full cursor-pointer rounded-md bg-accent px-6 py-3 text-base font-bold text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {status === "sending" ? "Sending link…" : "Email me a sign-in link"}
      </button>
    </form>
  );
}
