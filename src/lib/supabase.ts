import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client (service role). Returns null until the env vars
 * are configured, so every API route degrades gracefully without a database.
 */
export function getServiceClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Find or create a customer row by email; returns its id (or null on failure). */
export async function upsertCustomer(
  supabase: SupabaseClient,
  data: { companyName: string; contactName: string; email: string; phone?: string },
): Promise<string | null> {
  const email = data.email.toLowerCase();
  const { data: existing } = await supabase
    .from("customers")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("customers")
    .insert({
      company_name: data.companyName,
      contact_name: data.contactName,
      email,
      phone: data.phone || null,
    })
    .select("id")
    .single();
  if (error) {
    console.error("[supabase] customer upsert failed:", error);
    return null;
  }
  return created.id;
}
