import Image from "next/image";
import Link from "next/link";
import type { Device } from "@/data/devices";
import PlusBadge from "@/components/PlusBadge";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function DeviceCard({ device }: { device: Device }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-background transition-colors hover:border-accent">
      <div className="relative aspect-[16/10] w-full bg-muted">
        <Image
          src={device.imageUrl}
          alt={device.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <PlusBadge className="self-start" />
        <h3 className="text-lg font-semibold leading-tight">{device.name}</h3>
        <p className="text-sm text-muted-foreground">{device.shortDescription}</p>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="text-xs text-muted-foreground">Starting at</p>
            <p className="text-xl font-semibold">{formatPrice(device.price)}</p>
          </div>
          <Link
            href={`/request?device=${device.id}`}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            Request spare
          </Link>
        </div>
      </div>
    </article>
  );
}
