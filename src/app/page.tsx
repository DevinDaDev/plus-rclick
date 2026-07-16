import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    title: "We store a pre-configured spare",
    body: "When you buy qualifying hardware, Right Click stores a matching spare loaded with your configuration, ready to ship.",
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

function HeroContent() {
  return (
    <>
      <p className="mb-4 inline-flex rounded-full bg-background px-3 py-1 text-sm font-bold text-accent shadow-sm">
        Included free for 1 year with qualifying purchases
      </p>
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-[2.6rem] lg:leading-tight">
        <span className="block whitespace-nowrap">Rapid recovery when your hardware fails.</span>
        <span className="block">That&apos;s <span className="italic text-plus">Plus</span>.</span>
      </h1>
      <p className="mt-6 text-lg text-foreground/80">
        Right Click <span className="italic font-semibold text-plus">Plus</span> keeps your staff up and running. When covered hardware
        fails, we ship a pre-configured spare fast, so you get back to work
        with minimum downtime. It comes at no additional cost for one year with
        qualifying hardware you buy from Right Click.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/network"
          className="rounded-md border border-accent/40 bg-accent-soft px-6 py-3 text-base font-bold text-foreground transition-colors hover:bg-[#d3edf9]"
        >
          Shop devices — <span className="italic font-semibold text-plus">Plus</span> included
        </Link>
        <Link
          href="/request"
          className="rounded-md border border-border bg-background px-6 py-3 text-base font-semibold transition-colors hover:bg-muted"
        >
          Request my spare unit
        </Link>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-accent-soft to-background">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          {/* Text stacks above the image on small screens */}
          <div className="mx-auto max-w-3xl text-center md:hidden">
            <HeroContent />
          </div>
          <div className="relative mt-6 overflow-hidden rounded-xl md:mt-0">
            <Image
              src="/brand/hero-office.jpg"
              alt="The Right Click team at work beside the spare-equipment server room"
              width={1264}
              height={525}
              priority
              className="h-auto w-full"
            />
            {/* Overlaid on the faded white center on md+ */}
            <div className="absolute inset-0 hidden items-center justify-center md:flex">
              <div className="max-w-4xl px-8 text-center">
                <HeroContent />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two offerings */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Two ways <span className="italic font-semibold text-plus">Plus</span> keeps you covered
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Link
            href="/network"
            className="group flex flex-col rounded-xl border border-border bg-background p-8 transition-colors hover:border-accent"
          >
            <Image
              src="/brand/plus-switch.png"
              alt=""
              width={1024}
              height={1024}
              className="h-14 w-14"
            />
            <h3 className="mt-5 text-xl font-extrabold">
              <span className="italic text-plus">Plus</span>{" "}
              <span className="font-semibold text-muted-foreground">
                — Network Equipment
              </span>
            </h3>
            <p className="mt-2 flex-1 text-muted-foreground">
              Routers, switches, and access points that run your office. We
              store a spare pre-configured with your settings, so it ships
              ready to plug in. Target recovery is 4 business hours, same day.
            </p>
            <span className="mt-5 font-semibold text-accent group-hover:text-accent-hover">
              Explore network coverage →
            </span>
          </Link>

          <Link
            href="/computers"
            className="group flex flex-col rounded-xl border border-border bg-background p-8 transition-colors hover:border-accent"
          >
            <Image
              src="/brand/plus-computer.png"
              alt=""
              width={1024}
              height={1024}
              className="h-14 w-14"
            />
            <h3 className="mt-5 text-xl font-extrabold">
              <span className="italic text-plus">Plus</span>{" "}
              <span className="font-semibold text-muted-foreground">
                — Business Computers
              </span>
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
        <div className="rounded-xl bg-accent-deep px-8 py-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-accent-foreground sm:text-3xl">
            Hardware down? Let&apos;s get you a spare.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-accent-soft">
            Tell us what failed and we will start your rapid recovery. Target
            recovery for network equipment is 4 business hours.
          </p>
          <Link
            href="/request"
            className="mt-6 inline-flex rounded-md bg-background px-6 py-3 text-base font-semibold text-accent transition-colors hover:bg-muted"
          >
            Request my spare unit
          </Link>
        </div>
      </section>
    </div>
  );
}
