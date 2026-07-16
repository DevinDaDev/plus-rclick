import Image from "next/image";
import Link from "next/link";
import type { Device } from "@/data/devices";
import PlusBadge from "@/components/PlusBadge";
import AddToCartButton from "@/components/AddToCartButton";

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
      <Link
        href={`/devices/${device.id}`}
        className="relative block aspect-[16/10] w-full bg-white"
        aria-label={`View details for ${device.name}`}
      >
        <Image
          src={device.imageUrl}
          alt={device.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-contain p-6"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <PlusBadge className="self-start" />
        <h3 className="text-lg font-semibold leading-tight">
          <Link href={`/devices/${device.id}`} className="hover:text-accent">
            {device.name}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground">{device.shortDescription}</p>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="text-xs text-muted-foreground">Starting at</p>
            <p className="text-xl font-semibold">{formatPrice(device.price)}</p>
          </div>
          <AddToCartButton deviceId={device.id} />
        </div>
      </div>
    </article>
  );
}
