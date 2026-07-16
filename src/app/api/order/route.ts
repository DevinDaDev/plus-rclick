import { NextResponse } from "next/server";
import { getDeviceById } from "@/data/devices";

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

  try {
    await deliverOrder(body as OrderPayload);
  } catch (err) {
    console.error("[plus-order] delivery error:", err);
    return NextResponse.json(
      { error: "We could not submit your order. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
