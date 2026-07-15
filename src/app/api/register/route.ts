import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getDeviceById } from "@/data/devices";

interface Registration {
  companyName: string;
  contactName: string;
  email: string;
  deviceModel: string;
  serialNumber: string;
}

function validate(body: Partial<Registration>): string | null {
  const required: (keyof Registration)[] = [
    "companyName",
    "contactName",
    "email",
    "deviceModel",
    "serialNumber",
  ];
  for (const field of required) {
    if (!body[field] || String(body[field]).trim() === "") {
      return `Missing required field: ${field}`;
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.email))) {
    return "Please enter a valid email address.";
  }
  if (!getDeviceById(String(body.deviceModel))) {
    return "Please choose a valid device model.";
  }
  return null;
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Device registration is not available yet. Our team will register your device for you." },
      { status: 503 },
    );
  }

  let body: Partial<Registration>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validationError = validate(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const device = getDeviceById(String(body.deviceModel))!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { error } = await supabase.from("registered_devices").insert({
    company_name: String(body.companyName).trim(),
    contact_name: String(body.contactName).trim(),
    email: String(body.email).trim().toLowerCase(),
    device_id: device.id,
    device_name: device.name,
    device_category: device.category,
    plus_item_code: device.plusItemCode,
    serial_number: String(body.serialNumber).trim(),
  });

  if (error) {
    // 23505 = unique_violation (serial already registered)
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "This serial number is already registered." },
        { status: 409 },
      );
    }
    console.error("[plus-register] insert error:", error);
    return NextResponse.json(
      { error: "We could not register your device. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
