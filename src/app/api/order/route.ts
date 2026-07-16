import { NextResponse } from "next/server";
import { getDeviceById } from "@/data/devices";
import { getServiceClient, upsertCustomer } from "@/lib/supabase";

// Stage 1: validates the order, emails a confirmation via Resend when configured,
// and logs otherwise. Stage 2 persists to Supabase; Stage 6 adds Stripe payment.

const TAX_RATE = 0.0775; // TODO: replace with Stripe Tax (Stage 6)
const DISCOUNT_CODES: Record<string, number> = { RCLAUNCH10: 0.1 };

const TO_EMAIL = process.env.REQUEST_TO_EMAIL || "support@rclick.com";
const FROM_EMAIL =
  process.env.REQUEST_FROM_EMAIL || "Right Click Plus <onboarding@resend.dev>";

interface OrderPayload {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  items: { deviceId: string; qty: number }[];
  discountCode?: string;
}

function validate(body: Partial<OrderPayload>): string | null {
  for (const field of ["companyName", "contactName", "email", "phone", "shippingAddress"] as const) {
    if (!body[field] || String(body[field]).trim() === "") {
      return `Missing required field: ${field}`;
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.email))) {
    return "Please enter a valid email address.";
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return "Your cart is empty.";
  }
  for (const item of body.items) {
    if (!getDeviceById(item.deviceId)) return "Unknown device in cart.";
    if (!Number.isInteger(item.qty) || item.qty < 1 || item.qty > 99) {
      return "Invalid quantity.";
    }
  }
  return null;
}

function priceOrder(order: OrderPayload) {
  const lines = order.items.map((item) => {
    const device = getDeviceById(item.deviceId)!;
    return { device, qty: item.qty, lineTotal: device.price * item.qty };
  });
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const code = order.discountCode?.trim().toUpperCase();
  const discountRate = code && DISCOUNT_CODES[code] ? DISCOUNT_CODES[code] : 0;
  const discount = subtotal * discountRate;
  const tax = (subtotal - discount) * TAX_RATE;
  return { lines, subtotal, discount, tax, total: subtotal - discount + tax, code: discountRate ? code : undefined };
}

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

function buildText(order: OrderPayload, priced: ReturnType<typeof priceOrder>): string {
  const items = priced.lines
    .map((l) => `  ${l.qty} x ${l.device.name} — ${money(l.lineTotal)}`)
    .join("\n");
  return [
    "New Right Click Plus order (payment pending — Stripe not yet wired)",
    "",
    `Company:  ${order.companyName}`,
    `Contact:  ${order.contactName}`,
    `Email:    ${order.email}`,
    `Phone:    ${order.phone}`,
    `Ship to:  ${order.shippingAddress}`,
    "",
    "Items:",
    items,
    "",
    `Subtotal: ${money(priced.subtotal)}`,
    priced.code ? `Discount (${priced.code}): -${money(priced.discount)}` : null,
    `Est. tax: ${money(priced.tax)}`,
    `Total:    ${money(priced.total)}`,
    "",
    "Every device includes 1 year of Plus at no additional cost.",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function buildHtml(order: OrderPayload, priced: ReturnType<typeof priceOrder>): string {
  const itemRows = priced.lines
    .map(
      (l, i) => `
        <tr style="background:${i % 2 ? "#f8fafc" : "#ffffff"};">
          <td style="padding:10px 16px;font-size:14px;color:#17222e;">${escapeHtml(l.device.name)}</td>
          <td style="padding:10px 16px;font-size:14px;color:#4e6274;text-align:center;">${l.qty}</td>
          <td style="padding:10px 16px;font-size:14px;color:#17222e;font-weight:600;text-align:right;">${money(l.lineTotal)}</td>
        </tr>`,
    )
    .join("");

  const totalRow = (label: string, value: string, opts: { bold?: boolean; color?: string } = {}) => `
    <tr>
      <td colspan="2" style="padding:4px 16px;font-size:13px;color:${opts.color || "#4e6274"};text-align:right;${opts.bold ? "font-weight:800;font-size:15px;color:#17222e;" : ""}">${label}</td>
      <td style="padding:4px 16px;font-size:13px;color:${opts.color || "#17222e"};text-align:right;${opts.bold ? "font-weight:800;font-size:15px;" : "font-weight:600;"}">${value}</td>
    </tr>`;

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#eef4f9;font-family:'Segoe UI',system-ui,-apple-system,Helvetica,Arial,sans-serif;">
    <div style="max-width:600px;margin:24px auto;padding:0 12px;">
      <div style="background:#045f86;border-radius:10px 10px 0 0;padding:20px 24px;">
        <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">Right Click <span style="color:#f46a21;font-style:italic;">Plus</span></p>
        <p style="margin:4px 0 0;color:#bfe3f0;font-size:13px;">New order — payment pending</p>
      </div>
      <div style="background:#ffffff;border:1px solid #dfe8ef;border-top:none;border-radius:0 0 10px 10px;overflow:hidden;">
        <div style="padding:16px 24px;border-bottom:1px solid #dfe8ef;">
          <table cellpadding="0" cellspacing="0" style="font-size:13px;color:#4e6274;">
            <tr><td style="padding:2px 12px 2px 0;">Company</td><td style="color:#17222e;font-weight:600;">${escapeHtml(order.companyName)}</td></tr>
            <tr><td style="padding:2px 12px 2px 0;">Contact</td><td style="color:#17222e;font-weight:600;">${escapeHtml(order.contactName)}</td></tr>
            <tr><td style="padding:2px 12px 2px 0;">Email</td><td style="color:#17222e;font-weight:600;">${escapeHtml(order.email)}</td></tr>
            <tr><td style="padding:2px 12px 2px 0;">Phone</td><td style="color:#17222e;font-weight:600;">${escapeHtml(order.phone)}</td></tr>
            <tr><td style="padding:2px 12px 2px 0;vertical-align:top;">Ship to</td><td style="color:#17222e;font-weight:600;">${escapeHtml(order.shippingAddress)}</td></tr>
          </table>
        </div>
        <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
          <tr style="background:#eef4f9;">
            <th style="padding:8px 16px;font-size:12px;color:#4e6274;text-align:left;text-transform:uppercase;letter-spacing:0.05em;">Item</th>
            <th style="padding:8px 16px;font-size:12px;color:#4e6274;text-align:center;text-transform:uppercase;letter-spacing:0.05em;">Qty</th>
            <th style="padding:8px 16px;font-size:12px;color:#4e6274;text-align:right;text-transform:uppercase;letter-spacing:0.05em;">Total</th>
          </tr>
          ${itemRows}
        </table>
        <table cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid #dfe8ef;padding-top:8px;margin-top:4px;">
          ${totalRow("Subtotal", money(priced.subtotal))}
          ${priced.code ? totalRow(`Discount (${priced.code})`, `−${money(priced.discount)}`, { color: "#0498d6" }) : ""}
          ${totalRow("Estimated tax", money(priced.tax))}
          ${totalRow("Total", money(priced.total), { bold: true })}
        </table>
        <div style="padding:14px 24px;border-top:1px solid #dfe8ef;margin-top:8px;">
          <p style="margin:0;font-size:12px;color:#4e6274;">
            Every device includes 1 year of <span style="color:#f46a21;font-style:italic;font-weight:600;">Plus</span> at no additional cost.
            Reply to this email to reach the customer directly.
          </p>
        </div>
      </div>
      <p style="text-align:center;margin:12px 0 0;font-size:11px;color:#8a97a3;">
        Sent by the Right Click Plus store &middot; plus.rclick.com
      </p>
    </div>
  </body>
</html>`;
}

async function deliverOrder(order: OrderPayload): Promise<void> {
  const priced = priceOrder(order);
  const text = buildText(order, priced);
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("[plus-order] RESEND_API_KEY not set — logging order:\n" + text);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      reply_to: order.email,
      subject: `Plus order — ${order.companyName} (${money(priced.total)})`,
      text,
      html: buildHtml(order, priced),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Order email failed (${res.status}): ${detail}`);
  }
}

export async function POST(request: Request) {
  let body: Partial<OrderPayload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validationError = validate(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  // Persist to Supabase when configured (Stage 2); email either way.
  const order = body as OrderPayload;
  const supabase = getServiceClient();
  if (supabase) {
    try {
      const priced = priceOrder(order);
      const customerId = await upsertCustomer(supabase, order);
      const { data: orderRow, error } = await supabase
        .from("orders")
        .insert({
          customer_id: customerId,
          shipping_address: order.shippingAddress,
          subtotal_cents: Math.round(priced.subtotal * 100),
          discount_cents: Math.round(priced.discount * 100),
          discount_code: priced.code || null,
          tax_cents: Math.round(priced.tax * 100),
          total_cents: Math.round(priced.total * 100),
        })
        .select("id")
        .single();
      if (error) throw error;
      const { error: itemsError } = await supabase.from("order_items").insert(
        priced.lines.map((l) => ({
          order_id: orderRow.id,
          device_id: l.device.id,
          device_name: l.device.name,
          plus_item_code: l.device.plusItemCode,
          qty: l.qty,
          unit_price_cents: Math.round(l.device.price * 100),
        })),
      );
      if (itemsError) throw itemsError;
    } catch (err) {
      // Don't lose the order if the DB write fails — the email still goes out.
      console.error("[plus-order] supabase persist failed:", err);
    }
  }

  try {
    await deliverOrder(order);
  } catch (err) {
    console.error("[plus-order] delivery error:", err);
    return NextResponse.json(
      { error: "We could not submit your order. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
