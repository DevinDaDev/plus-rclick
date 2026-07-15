"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { networkDevices, computerDevices, getDeviceById } from "@/data/devices";

type DeviceType = "network" | "computer" | "";
type ContactMethod = "email" | "phone";

function initialDeviceType(deviceId: string | null): DeviceType {
  const device = deviceId ? getDeviceById(deviceId) : undefined;
  return device ? device.category : "";
}

export default function RequestForm() {
  const searchParams = useSearchParams();
  const presetDeviceId = searchParams.get("device");

  const [deviceType, setDeviceType] = useState<DeviceType>(
    initialDeviceType(presetDeviceId),
  );
  const [deviceModel, setDeviceModel] = useState<string>(
    presetDeviceId && getDeviceById(presetDeviceId) ? presetDeviceId : "",
  );
  const [contactMethod, setContactMethod] = useState<ContactMethod>("email");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  const modelOptions =
    deviceType === "network"
      ? networkDevices
      : deviceType === "computer"
        ? computerDevices
        : [];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      companyName: String(data.get("companyName") || "").trim(),
      contactName: String(data.get("contactName") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      deviceType: String(data.get("deviceType") || ""),
      deviceModel: String(data.get("deviceModel") || ""),
      serialNumber: String(data.get("serialNumber") || "").trim(),
      reason: String(data.get("reason") || "").trim(),
      preferredContact: String(data.get("preferredContact") || ""),
    };

    try {
      const res = await fetch("/api/request", {
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
      <div className="rounded-2xl border border-border bg-background p-8 text-center shadow-sm">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <h2 className="mt-5 text-2xl font-bold tracking-tight">
          Request received
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Our team will contact you shortly to start your rapid recovery. Target
          recovery for network equipment is 8 business hours.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setDeviceType("");
            setDeviceModel("");
          }}
          className="mt-6 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
        >
          Submit another request
        </button>
      </div>
    );
  }

  const labelClass = "block text-sm font-medium";
  const inputClass =
    "mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8"
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
          <label htmlFor="phone" className={labelClass}>
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="deviceType" className={labelClass}>
            Device type
          </label>
          <select
            id="deviceType"
            name="deviceType"
            required
            value={deviceType}
            onChange={(e) => {
              setDeviceType(e.target.value as DeviceType);
              setDeviceModel("");
            }}
            className={inputClass}
          >
            <option value="">Select a device type</option>
            <option value="network">Network equipment</option>
            <option value="computer">Computer</option>
          </select>
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
            disabled={!deviceType}
            className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <option value="">
              {deviceType ? "Select a model" : "Choose a device type first"}
            </option>
            {modelOptions.map((device) => (
              <option key={device.id} value={device.id}>
                {device.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="serialNumber" className={labelClass}>
            Serial number{" "}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </label>
          <input
            id="serialNumber"
            name="serialNumber"
            type="text"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="preferredContact" className={labelClass}>
            Preferred contact method
          </label>
          <select
            id="preferredContact"
            name="preferredContact"
            value={contactMethod}
            onChange={(e) => setContactMethod(e.target.value as ContactMethod)}
            className={inputClass}
          >
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="reason" className={labelClass}>
          What happened?{" "}
          <span className="font-normal text-muted-foreground">
            (optional — any reason qualifies)
          </span>
        </label>
        <textarea
          id="reason"
          name="reason"
          rows={4}
          placeholder="Broken, damaged, lost, stolen, or just not working — a short note helps, but it is not required."
          className={inputClass}
        />
      </div>

      {status === "error" && (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 w-full rounded-md bg-accent px-6 py-3 text-base font-semibold text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {status === "submitting" ? "Sending…" : "Submit request"}
      </button>
    </form>
  );
}
