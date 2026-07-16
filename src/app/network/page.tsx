import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { networkDevices } from "@/data/devices";
import DeviceCard from "@/components/DeviceCard";

export const metadata: Metadata = {
  title: "Plus for Network Equipment",
  description:
    "Rapid recovery for the routers, switches, and access points that run your office. Target recovery is 4 business hours, same day, with a pre-configured spare.",
};

const included = [
  "We store a spare unit at the Right Click office, ready to go. Large customers can keep their own spare on-site.",
  "We keep a backup of your device configuration, so the spare ships pre-configured with your settings.",
  "No reprogramming on arrival. Plug it in and your network is back.",
  "Coverage for Ubiquiti and SonicWall routers, network switches, and Wi-Fi access points bought from Right Click.",
];

export default function NetworkPage() {
  return (
    <div>
      {/* Compact hero + devices above the fold */}
      <section className="border-b border-border bg-accent-soft">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex items-center gap-4">
            <Image
              src="/brand/plus-switch.png"
              alt="Plus Switch logo"
              width={1024}
              height={1024}
              priority
              className="h-16 w-16"
            />
            <div>
              <p className="text-2xl font-extrabold">
                Plus <span className="italic text-plus">Switch</span>
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-accent">
                A Right Click Service
              </p>
            </div>
          </div>
          <h1 className="mt-6 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            Some things are too important to wait on. That&apos;s{" "}
            <span className="italic text-plus">Plus</span>.
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Buy your network equipment from Right Click and we store a spare
            loaded with your configuration. When yours fails, the replacement
            ships ready to plug in — no reprogramming, targeted at 4 business
            hours, same day. One year of Plus is included.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {["Network switches", "Routers & gateways", "Firewalls", "Wi-Fi access points"].map(
              (chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-border bg-background px-4 py-2 text-sm font-bold"
                >
                  {chip}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {networkDevices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Already bought your device?{" "}
          <Link href="/register" className="font-semibold text-accent hover:text-accent-hover">
            Register its serial number
          </Link>{" "}
          to activate your Plus coverage.
        </p>
      </section>

      {/* Details below the fold */}
      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
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

            <aside className="rounded-xl border border-border bg-background p-6">
              <p className="text-sm font-medium text-muted-foreground">
                Target recovery
              </p>
              <p className="mt-2 text-4xl font-bold text-accent">4 hours</p>
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
