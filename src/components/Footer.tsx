import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="text-base font-semibold">
            Right Click <span className="text-accent">Plus</span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Plus is included for one year with qualifying purchases.
          </p>
        </div>

        <div className="text-sm text-muted-foreground">
          {/* TODO: Right Click to confirm final contact details. */}
          <p className="font-medium text-foreground">Contact</p>
          <p className="mt-2">Right Click</p>
          <p>Phone: (555) 555-0100</p>
          <p>Email: support@rclick.com</p>
        </div>

        <nav className="flex flex-col gap-2 text-sm">
          <p className="font-medium text-foreground">Explore</p>
          <Link href="/network" className="text-muted-foreground hover:text-foreground">
            Network Equipment
          </Link>
          <Link href="/computers" className="text-muted-foreground hover:text-foreground">
            Business Computers
          </Link>
          <Link href="/request" className="text-muted-foreground hover:text-foreground">
            Request Spare
          </Link>
        </nav>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} Right Click. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
