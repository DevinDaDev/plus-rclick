import type { Metadata } from "next";
import Link from "next/link";
import { computerDevices } from "@/data/devices";
import DeviceCard from "@/components/DeviceCard";

export const metadata: Metadata = {
  title: "Plus for Business Computers",
  description:
    "Keep your staff up and running when a work computer fails. We keep a spare with your base-level company configuration ready to swap in.",
};

const recoverySteps = [
  {
    title: "Hard-drive swap first",
    body: "Our first step on-site is to move your hard drive into the spare. Usually the drive is not what failed, so you get a near-immediate full recovery with your files and setup intact.",
  },
  {
    title: "Rebuild if needed",
    body: "If the drive itself failed, we set up the spare from your base-level company configuration so you can sign back in and get to work.",
  },
];

export default function ComputersPage() {
  return (
    <div>
      {/* Compact hero + devices above the fold */}
      <section className="border-b border-border bg-accent-soft">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            Plus for Business Computers
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Business computers with 1 year of Plus included
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Buy a standardized model from Right Click and we keep a spare ready
            with your base-level company configuration — so your staff stay up
            and running.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {computerDevices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Already bought your computer?{" "}
          <Link href="/register" className="font-semibold text-accent hover:text-accent-hover">
            Register its serial number
          </Link>{" "}
          to activate your Plus coverage.
        </p>
      </section>

      {/* Details below the fold */}
      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight">
            How recovery works
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {recoverySteps.map((step, i) => (
              <div
                key={step.title}
                className="rounded-xl border border-border bg-background p-6"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-border bg-background p-6">
            <h3 className="text-base font-semibold">Request a replacement anytime</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Ask for a replacement for any reason the computer is unusable:
              broken, damaged even if the manufacturer denies the claim, lost, or
              stolen. We do not police the reason. The base-level configuration
              gets your team member signed in, and they pull their own email and
              files afterward.
            </p>
          </div>

          {/* Disclaimers: loaner + buy-out, no file backup, not a warranty */}
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-background p-6">
              <h3 className="text-base font-semibold">Temporary loaner</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                The replacement is a temporary loaner for up to one month while
                Right Click handles the manufacturer warranty or repair. You can
                also choose to purchase the loaner outright.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-6">
              <h3 className="text-base font-semibold">Files stay with you</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Right Click does not back up your files. Only a base-level company
                configuration is kept on the spare. For file backup, ask us about
                our separate backup service.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-6">
              <h3 className="text-base font-semibold">Warranty is separate</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Plus is not a warranty. Your manufacturer warranty still applies
                separately and stays unaffected. Plus adds rapid replacement on
                top of it.
              </p>
            </div>
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
