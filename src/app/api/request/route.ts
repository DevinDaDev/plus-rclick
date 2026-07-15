import { NextResponse } from "next/server";
import { getDeviceById } from "@/data/devices";

interface SpareRequest {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  deviceType: string;
  deviceModel: string;
  serialNumber?: string;
  reason?: string;
  preferredContact: string;
}

// Where request notifications are sent. TODO: Right Click to confirm.
const TO_EMAIL = process.env.REQUEST_TO_EMAIL || "support@rclick.com";
const FROM_EMAIL = process.env.REQUEST_FROM_EMAIL || "Right Click Plus <onboarding@resend.dev>";

function validate(body: Partial<SpareRequest>): string | null {
  const required: (keyof SpareRequest)[] = [
    "companyName",
    "contactName",
    "email",
    "phone",
    "deviceType",
    "deviceModel",
    "preferredContact",
  ];
  for (const field of required) {
    if (!body[field] || String(body[field]).trim() === "") {
      return `Missing required field: ${field}`;
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.email))) {
    return "Please enter a valid email address.";
  }
  if (body.deviceType !== "network" && body.deviceType !== "computer") {
    return "Please choose a valid device type.";
  }
  return null;
}

function buildSummary(req: SpareRequest): string {
  const device = getDeviceById(req.deviceModel);
  const modelLabel = device ? device.name : req.deviceModel;
  return [
    "New Right Click Plus spare request",
    "",
    `Company:           ${req.companyName}`,
    `Contact:           ${req.contactName}`,
    `Email:             ${req.email}`,
    `Phone:             ${req.phone}`,
    `Preferred contact: ${req.preferredContact}`,
    `Device type:       ${req.deviceType}`,
    `Device model:      ${modelLabel}`,
    `Serial number:     ${req.serialNumber || "(not provided)"}`,
    `Reason:            ${req.reason || "(not provided)"}`,
  ].join("\n");
}

/**
 * Single delivery function. Swap the body of this function to send requests to
 * a ticketing system later — the rest of the route does not need to change.
 */
async function deliverRequest(req: SpareRequest): Promise<void> {
  const summary = buildSummary(req);
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Graceful fallback: no email provider configured yet.
    console.log("[plus-request] RESEND_API_KEY not set — logging request:\n" + summary);
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
      reply_to: req.email,
      subject: `Plus spare request — ${req.companyName}`,
      text: summary,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Email delivery failed (${res.status}): ${detail}`);
  }
}

export async function POST(request: Request) {
  let body: Partial<SpareRequest>;
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
    await deliverRequest(body as SpareRequest);
  } catch (err) {
    console.error("[plus-request] delivery error:", err);
    return NextResponse.json(
      { error: "We could not submit your request. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
