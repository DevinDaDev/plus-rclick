import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSignedInUser } from "@/lib/supabase-server";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Right Click Plus account.",
};

export default async function LoginPage() {
  const user = await getSignedInUser();
  if (user) redirect("/account");

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Sign in</h1>
      <p className="mt-3 text-muted-foreground">
        Manage your covered devices, orders, and spare requests.
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
