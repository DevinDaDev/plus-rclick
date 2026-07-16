"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { allDevices, getDeviceById } from "@/data/devices";

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const presetDeviceId = searchParams.get("device");
  const fromCheckout = Boolean(searchParams.get("session_id"));

  const [deviceModel, setDeviceModel] = useState<string>(
    presetDeviceId && getDeviceById(presetDeviceId) ? presetDeviceId : "",
  );
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const data = new FormData(event.currentTarget);
    const payload = {
      companyName: String(data.get("companyName") || "").trim(),
      contactName: String(data.get("contactName") || "").trim(),
      email: String(data.get("email") || "").trim(),
      deviceModel: String(data.get("deviceModel") || ""),
      serialNumber: String(data.get("serialNumber") || "").trim(),
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-border bg-background p-8 text-center shadow-sm">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <h2 className="mt-5 text-2xl font-bold tracking-tight">
          Device registered
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Your device is covered by Right Click <span className="italic font-semibold text-plus">Plus</span> for one year. If it ever
          fails, request your pre-configured spare and we will get you back up
          and running.
        </p>
        <Link
          href="/request"
          className="mt-6 inline-flex rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          Request a spare unit
        </Link>
      </div>
    );
  }

  const labelClass = "block text-sm font-medium";
  const inputClass =
    "mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

  return (
    <div>
      {fromCheckout && (
        <div className="mb-6 rounded-xl border border-border bg-accent-soft p-5">
          <p className="font-semibold">Thank you for your order!</p>
          <p className="mt-1 text-sm text-muted-foreground">
            One last step: register your device&apos;s serial number below to
            activate your included year of <span className="italic font-semibold text-plus">Plus</span>. If you don&apos;t have the
            serial number yet, you can come back to this page after delivery.
          </p>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-background p-6 shadow-sm sm:p-8"
        noValidate
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="companyName" className={labelClass}>
              Company name
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              required
              autoComplete="organization"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="contactName" className={labelClass}>
              Contact name
            </label>
            <input
              id="contactName"
              name="contactName"
              type="text"
              required
              autoComplete="name"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="deviceModel" className={labelClass}>
              Device model
            </label>
            <select
              id="deviceModel"
              name="deviceModel"
              required
              value={deviceModel}
              onChange={(e) => setDeviceModel(e.target.value)}
              className={inputClass}
            >
              <option value="">Select your device</option>
              {allDevices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="serialNumber" className={labelClass}>
              Serial number
            </label>
            <input
              id="serialNumber"
              name="serialNumber"
              type="text"
              required
              placeholder="Found on the device label or the box"
              className={inputClass}
            />
          </div>
        </div>

        {status === "error" && (
          <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="mt-6 w-full cursor-pointer rounded-md bg-accent px-6 py-3 text-base font-semibold text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {status === "submitting" ? "Registering…" : "Register device"}
        </button>
      </form>
    </div>
  );
}
