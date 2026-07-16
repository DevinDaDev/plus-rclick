import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allDevices, getDeviceById } from "@/data/devices";
import PlusBadge from "@/components/PlusBadge";
import AddToCartButton from "@/components/AddToCartButton";

export function generateStaticParams() {
  return allDevices.map((device) => ({ id: device.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const device = getDeviceById(id);
  if (!device) return {};
  return {
    title: device.name,
    description: `${device.shortDescription} Includes 1 year of Right Click Plus.`,
  };
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

const plusBenefits: Record<"network" | "computer", string[]> = {
  network: [
    "We store a spare, pre-configured with your settings",
    "Target recovery: 4 business hours, same day",
    "No reprogramming — plug it in and you are back",
  ],
  computer: [
    "We keep a spare with your base-level company configuration",
    "Replacement for any reason the computer is unusable",
    "Temporary loaner up to 1 month, with a buy-out option",
  ],
};

export default async function DevicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const device = getDeviceById(id);
  if (!device) notFound();

  const backHref = device.category === "network" ? "/network" : "/computers";
  const backLabel =
    device.category === "network" ? "Network Equipment" : "Business Computers";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav className="text-sm text-muted-foreground">
        <Link href={backHref} className="hover:text-accent">
          {backLabel}
        </Link>{" "}
        / <span className="text-foreground">{device.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-white">
          <Image
            src={device.imageUrl}
            alt={device.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-8"
          />
        </div>

        <div>
          <PlusBadge />
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight">
            {device.name}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            {device.shortDescription}
          </p>
          <p className="mt-5 text-3xl font-extrabold">
            {formatPrice(device.price)}
          </p>
          <div className="mt-6">
            <AddToCartButton deviceId={device.id} size="lg" />
          </div>

          <div className="mt-8 rounded-xl border border-border bg-accent-soft p-5">
            <h2 className="text-sm font-extrabold uppercase tracking-wide">
              Included: 1 year of{" "}
              <span className="italic text-plus">Plus</span>
            </h2>
            <ul className="mt-3 space-y-2">
              {plusBenefits[device.category].map((benefit) => (
                <li key={benefit} className="flex gap-2.5 text-sm">
                  <svg className="mt-0.5 shrink-0 text-accent" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
              Specifications
            </h2>
            <ul className="mt-3 space-y-2">
              {device.specs.map((spec) => (
                <li key={spec} className="flex gap-2.5 text-sm text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {spec}
                </li>
              ))}
            </ul>
            {/* TODO: Right Click to confirm final specs and pricing. */}
          </div>
        </div>
      </div>
    </div>
  );
}
