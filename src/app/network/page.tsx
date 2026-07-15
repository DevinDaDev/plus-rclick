import type { Metadata } from "next";
import Link from "next/link";
import { networkDevices } from "@/data/devices";
import DeviceCard from "@/components/DeviceCard";

export const metadata: Metadata = {
  title: "Plus for Network Equipment",
  description:
    "Rapid recovery for the routers, switches, and access points that run your office. Target recovery is 8 business hours, same day, with a pre-configured spare.",
};

const included = [
  "Coverage for Ubiquiti and SonicWall routers, network switches, and Wi-Fi access points bought from Right Click.",
  "A spare unit kept ready at the Right Click office. Large customers can keep their own spare on-site.",
  "A saved backup of your device configuration, so the spare arrives pre-configured with your settings.",
  "No reprogramming on arrival. The spare is ready to run your network.",
];

export default function NetworkPage() {
  return (
    <div>
      <section className="border-b border-border bg-accent-soft">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            Plus for Network Equipment
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Rapid recovery for critical network infrastructure
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            When the equipment that runs your office fails, every minute counts.
            Plus keeps a pre-configured spare ready so we can get your network
            back with minimum downtime.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold tracking-tight">
              What&apos;s included
            </h2>
            <ul className="mt-6 space-y-4">
              {included.map((item) => (
                <li key={item} className="flex gap-3">
                  <svg className="mt-0.5 shrink-0 text-accent" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="rounded-xl border border-border bg-muted p-6">
            <p className="text-sm font-medium text-muted-foreground">
              Target recovery
            </p>
            <p className="mt-2 text-4xl font-bold text-accent">8 hours</p>
            <p className="mt-1 text-sm text-muted-foreground">
              business hours, same day
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              That is our target to get a pre-configured spare to you once your
              request comes in.
            </p>
          </aside>
        </div>

        {/* Disclaimer: not a warranty */}
        <div className="mt-10 rounded-xl border border-border bg-background p-6">
          <h3 className="text-base font-semibold">Good to know</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Plus is not a warranty. Your manufacturer warranty still applies
            separately and stays unaffected. Plus adds rapid replacement on top
            of it.
          </p>
        </div>
      </section>

      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight">Covered devices</h2>
          <p className="mt-2 text-muted-foreground">
            Each device below includes one year of Plus with your purchase.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {networkDevices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/request"
              className="inline-flex rounded-md bg-accent px-6 py-3 text-base font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
            >
              Request my spare unit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
