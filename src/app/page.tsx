import Link from "next/link";

const steps = [
  {
    title: "We keep a spare",
    body: "When you buy qualifying hardware, Right Click keeps a matching spare and a backup of your device configuration.",
  },
  {
    title: "You tell us it failed",
    body: "Request a replacement for any reason the device is down. There is no long form and no reason to justify.",
  },
  {
    title: "We get you running",
    body: "The pre-configured spare goes out fast so your staff stay up and running with minimum downtime.",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-primary">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-sm font-medium text-accent-soft">
              Included free for 1 year with qualifying purchases
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
              Rapid recovery when your hardware fails
            </h1>
            <p className="mt-6 text-lg text-slate-300">
              Right Click Plus keeps your staff up and running. When covered
              hardware fails, we ship a pre-configured spare fast, so you get
              back to work with minimum downtime. It comes at no additional cost
              for one year with qualifying hardware you buy from Right Click.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/request"
                className="rounded-md bg-accent px-6 py-3 text-base font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
              >
                Request my spare unit
              </Link>
              <Link
                href="/network"
                className="rounded-md border border-slate-500 px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-white/10"
              >
                See what&apos;s covered
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Two offerings */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Two ways Plus keeps you covered
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Link
            href="/network"
            className="group flex flex-col rounded-2xl border border-border bg-background p-8 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="6" rx="1" />
                <rect x="3" y="14" width="18" height="6" rx="1" />
                <path d="M7 7h.01M7 17h.01" />
              </svg>
            </span>
            <h3 className="mt-5 text-xl font-semibold">
              Plus for Network Equipment
            </h3>
            <p className="mt-2 flex-1 text-muted-foreground">
              Routers, switches, and access points that run your office. Spares
              ship pre-configured with your settings. Target recovery is 8
              business hours, same day.
            </p>
            <span className="mt-5 font-semibold text-accent group-hover:text-accent-hover">
              Explore network coverage →
            </span>
          </Link>

          <Link
            href="/computers"
            className="group flex flex-col rounded-2xl border border-border bg-background p-8 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="12" rx="2" />
                <path d="M2 20h20" />
              </svg>
            </span>
            <h3 className="mt-5 text-xl font-semibold">
              Plus for Business Computers
            </h3>
            <p className="mt-2 flex-1 text-muted-foreground">
              Standard laptops and desktops from Right Click. We keep a spare
              with your base-level company configuration ready to swap in.
            </p>
            <span className="mt-5 font-semibold text-accent group-hover:text-accent-hover">
              Explore computer coverage →
            </span>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            How it works
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
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
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl bg-primary px-8 py-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl">
            Hardware down? Let&apos;s get you a spare.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            Tell us what failed and we will start your rapid recovery. Target
            recovery for network equipment is 8 business hours.
          </p>
          <Link
            href="/request"
            className="mt-6 inline-flex rounded-md bg-accent px-6 py-3 text-base font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            Request my spare unit
          </Link>
        </div>
      </section>
    </div>
  );
}
