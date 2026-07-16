import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSignedInUser } from "@/lib/supabase-server";
import { getServiceClient } from "@/lib/supabase";
import SignOutButton from "@/components/SignOutButton";

export const metadata: Metadata = {
  title: "My account",
  description: "Your covered devices, orders, and spare requests.",
};

export const dynamic = "force-dynamic";

const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100,
  );

const dateFmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const REQUEST_STATUS_LABELS: Record<string, string> = {
  requested: "Requested",
  in_prep: "In prep",
  shipped: "Shipped",
  returned: "Returned",
  bought_out: "Bought out",
  closed: "Closed",
};

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending_payment: "Payment pending",
  paid: "Paid",
  fulfilled: "Fulfilled",
  cancelled: "Cancelled",
};

export default async function AccountPage() {
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_URL,
  );

  if (!supabaseConfigured) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Accounts are coming soon
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Customer accounts are almost ready. In the meantime, our team handles
          everything by email — request a spare any time and we&apos;ll take
          care of you.
        </p>
        <Link
          href="/request"
          className="mt-6 inline-flex rounded-md bg-accent px-6 py-3 text-base font-semibold text-accent-foreground hover:bg-accent-hover"
        >
          Request my spare unit
        </Link>
      </div>
    );
  }

  const user = await getSignedInUser();
  if (!user?.email) redirect("/login");
  const email = user.email.toLowerCase();

  const service = getServiceClient()!;
  const [devicesRes, ordersRes, requestsRes] = await Promise.all([
    service
      .from("registered_devices")
      .select("id, device_id, device_name, device_category, serial_number, plus_expires_at, created_at")
      .eq("email", email)
      .order("created_at", { ascending: false }),
    service
      .from("orders")
      .select("id, created_at, status, total_cents, order_items(device_name, qty)")
      .eq("customer_id", (
        await service.from("customers").select("id").eq("email", email).maybeSingle()
      ).data?.id ?? "00000000-0000-0000-0000-000000000000")
      .order("created_at", { ascending: false }),
    service
      .from("spare_requests")
      .select("id, created_at, device_name, status, serial_number")
      .eq("email", email)
      .order("created_at", { ascending: false }),
  ]);

  const devices = devicesRes.data ?? [];
  const orders = ordersRes.data ?? [];
  const requests = requestsRes.data ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">My account</h1>
          <p className="mt-1 text-muted-foreground">{user.email}</p>
        </div>
        <SignOutButton />
      </div>

      {/* My devices */}
      <section className="mt-10">
        <h2 className="text-xl font-extrabold">My devices</h2>
        {devices.length === 0 ? (
          <p className="mt-3 text-muted-foreground">
            No devices registered yet.{" "}
            <Link href="/register" className="font-semibold text-accent hover:text-accent-hover">
              Register a device
            </Link>{" "}
            to activate its <span className="italic font-semibold text-plus">Plus</span> coverage.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {devices.map((d) => (
              <div key={d.id} className="rounded-xl border border-border bg-background p-5">
                <p className="font-bold leading-tight">{d.device_name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Serial: {d.serial_number}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  <span className="italic font-semibold text-plus">Plus</span>{" "}
                  coverage until {dateFmt(d.plus_expires_at)}
                </p>
                <Link
                  href={`/request?device=${encodeURIComponent(d.device_id)}`}
                  className="mt-4 inline-flex rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent-hover"
                >
                  Request spare
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* My orders */}
      <section className="mt-10">
        <h2 className="text-xl font-extrabold">My orders</h2>
        {orders.length === 0 ? (
          <p className="mt-3 text-muted-foreground">No orders yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="px-4 py-3 whitespace-nowrap">{dateFmt(o.created_at)}</td>
                    <td className="px-4 py-3">
                      {(o.order_items ?? [])
                        .map((i: { device_name: string; qty: number }) => `${i.qty}× ${i.device_name}`)
                        .join(", ")}
                    </td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap">
                      {money(o.total_cents)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {ORDER_STATUS_LABELS[o.status] ?? o.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* My requests */}
      <section className="mt-10">
        <h2 className="text-xl font-extrabold">My spare requests</h2>
        {requests.length === 0 ? (
          <p className="mt-3 text-muted-foreground">No spare requests yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Device</th>
                  <th className="px-4 py-3">Serial</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {requests.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 whitespace-nowrap">{dateFmt(r.created_at)}</td>
                    <td className="px-4 py-3">{r.device_name}</td>
                    <td className="px-4 py-3">{r.serial_number || "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-bold text-accent">
                        {REQUEST_STATUS_LABELS[r.status] ?? r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
