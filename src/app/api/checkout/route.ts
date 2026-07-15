import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getDeviceById } from "@/data/devices";

// Real checkout requires STRIPE_SECRET_KEY in the environment.
// Without it we return 503 and the UI falls back to the request form.

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Online checkout is not available yet. Please contact us to order." },
      { status: 503 },
    );
  }

  let body: { deviceId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const device = body.deviceId ? getDeviceById(body.deviceId) : undefined;
  if (!device) {
    return NextResponse.json({ error: "Unknown device." }, { status: 400 });
  }

  const origin =
    request.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://plus-rclick.vercel.app";

  const stripe = new Stripe(secretKey);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: device.price * 100,
          product_data: {
            name: device.name,
            description: `${device.shortDescription} Includes 1 year of Right Click Plus (${device.plusItemCode}) at no additional cost.`,
          },
        },
      },
    ],
    metadata: {
      deviceId: device.id,
      plusItemCode: device.plusItemCode,
    },
    success_url: `${origin}/register?device=${device.id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/${device.category === "network" ? "network" : "computers"}`,
  });

  return NextResponse.json({ url: session.url });
}
