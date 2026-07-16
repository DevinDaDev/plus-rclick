import { NextResponse } from "next/server";
import { getDeviceById } from "@/data/devices";
import { getServiceClient, upsertCustomer } from "@/lib/supabase";

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

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function buildHtml(req: SpareRequest): string {
  const device = getDeviceById(req.deviceModel);
  const modelLabel = device ? device.name : req.deviceModel;
  const rows: [string, string][] = [
    ["Company", req.companyName],
    ["Contact", req.contactName],
    ["Email", req.email],
    ["Phone", req.phone],
    ["Preferred contact", req.preferredContact],
    ["Device type", req.deviceType === "network" ? "Network equipment" : "Computer"],
    ["Device model", modelLabel],
    ["Serial number", req.serialNumber || "Not provided"],
    ["Reason", req.reason || "Not provided"],
  ];
  const rowsHtml = rows
    .map(
      ([label, value], i) => `
        <tr style="background:${i % 2 ? "#f8fafc" : "#ffffff"};">
          <td style="padding:10px 16px;font-size:13px;color:#4e5c69;white-space:nowrap;vertical-align:top;">${label}</td>
          <td style="padding:10px 16px;font-size:14px;color:#17222e;font-weight:500;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#eff2f4;font-family:'Segoe UI',system-ui,-apple-system,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:24px auto;padding:0 12px;">
      <div style="background:#0c6e94;border-radius:10px 10px 0 0;padding:20px 24px;">
        <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">Right Click <span style="color:#bfe3f0;">Plus</span></p>
        <p style="margin:4px 0 0;color:#bfe3f0;font-size:13px;">New spare unit request</p>
      </div>
      <div style="background:#ffffff;border:1px solid #e3e8ec;border-top:none;border-radius:0 0 10px 10px;overflow:hidden;">
        <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">${rowsHtml}
        </table>
        <div style="padding:16px 24px;border-top:1px solid #e3e8ec;">
          <p style="margin:0;font-size:12px;color:#4e5c69;">
            Reply to this email to reach the requester directly.
            Target recovery for network equipment is 4 business hours.
          </p>
        </div>
      </div>
      <p style="text-align:center;margin:12px 0 0;font-size:11px;color:#8a97a3;">
        Sent by the Right Click Plus request form &middot; plus.rclick.com
      </p>
    </div>
  </body>
</html>`;
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
      html: buildHtml(req),
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

  // Persist the request as a ticket when Supabase is configured (Stage 2).
  const req = body as SpareRequest;
  const supabase = getServiceClient();
  if (supabase) {
    try {
      const device = getDeviceById(req.deviceModel);
      const customerId = await upsertCustomer(supabase, {
        companyName: req.companyName,
        contactName: req.contactName,
        email: req.email,
        phone: req.phone,
      });
      const { error } = await supabase.from("spare_requests").insert({
        customer_id: customerId,
        company_name: req.companyName,
        contact_name: req.contactName,
        email: req.email.toLowerCase(),
        phone: req.phone,
        device_id: req.deviceModel,
        device_name: device ? device.name : req.deviceModel,
        serial_number: req.serialNumber || null,
        reason: req.reason || null,
        preferred_contact: req.preferredContact,
      });
      if (error) throw error;
    } catch (err) {
      console.error("[plus-request] supabase persist failed:", err);
    }
  }

  try {
    await deliverRequest(req);
  } catch (err) {
    console.error("[plus-request] delivery error:", err);
    return NextResponse.json(
      { error: "We could not submit your request. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
