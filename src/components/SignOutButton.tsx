"use client";

import { useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase-browser";

export default function SignOutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        const supabase = getBrowserClient();
        if (supabase) await supabase.auth.signOut();
        router.push("/");
        router.refresh();
      }}
      className="cursor-pointer rounded-md border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted"
    >
      Sign out
    </button>
  );
}
