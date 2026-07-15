// TODO: Right Click to confirm final models and pricing.
// Prices below are placeholders (USD) and images are neutral SVG placeholders.
// Edit this file to update the models, descriptions, and pricing shown on the site.

export type DeviceCategory = "network" | "computer";

export interface Device {
  id: string;
  name: string;
  category: DeviceCategory;
  shortDescription: string;
  /** Placeholder price in USD. */
  price: number;
  /** Neutral placeholder image path or SVG. Do not hotlink manufacturer images. */
  imageUrl: string;
  /** Line-item code used when Plus is added to an order. */
  plusItemCode: string;
}

const NETWORK_PLUS_CODE = "RC-PLUS-NETWORK-1YR";
const PC_PLUS_CODE = "RC-PLUS-PC-1YR";

export const networkDevices: Device[] = [
  {
    id: "udm-pro",
    name: "Ubiquiti Dream Machine Pro",
    category: "network",
    shortDescription:
      "All-in-one router, security gateway, and network controller for growing offices.",
    price: 499,
    imageUrl: "/devices/router.svg",
    plusItemCode: NETWORK_PLUS_CODE,
  },
  {
    id: "usw-24-poe",
    name: "Ubiquiti 24-Port PoE Switch",
    category: "network",
    shortDescription:
      "Managed 24-port switch with PoE to power phones, cameras, and access points.",
    price: 379,
    imageUrl: "/devices/switch.svg",
    plusItemCode: NETWORK_PLUS_CODE,
  },
  {
    id: "u7-pro-ap",
    name: "Ubiquiti U7 Pro Access Point",
    category: "network",
    shortDescription:
      "High-capacity Wi-Fi 7 access point for fast, reliable coverage across the office.",
    price: 189,
    imageUrl: "/devices/access-point.svg",
    plusItemCode: NETWORK_PLUS_CODE,
  },
  {
    id: "sonicwall-tz",
    name: "SonicWall TZ-Series Firewall",
    category: "network",
    shortDescription:
      "Business firewall with threat protection for securing your network perimeter.",
    price: 649,
    imageUrl: "/devices/firewall.svg",
    plusItemCode: NETWORK_PLUS_CODE,
  },
];

export const computerDevices: Device[] = [
  {
    id: "dell-latitude-5450",
    name: "Dell Latitude 5450 Laptop",
    category: "computer",
    shortDescription:
      "Standard business laptop for everyday office work and travel.",
    price: 1249,
    imageUrl: "/devices/laptop.svg",
    plusItemCode: PC_PLUS_CODE,
  },
  {
    id: "dell-precision-3591",
    name: "Dell Precision 3591 Laptop",
    category: "computer",
    shortDescription:
      "Mobile workstation for design, engineering, and other heavy workloads.",
    price: 1899,
    imageUrl: "/devices/laptop.svg",
    plusItemCode: PC_PLUS_CODE,
  },
  {
    id: "dell-optiplex-7020",
    name: "Dell OptiPlex 7020 Desktop",
    category: "computer",
    shortDescription:
      "Reliable desktop for fixed workstations and front-desk setups.",
    price: 999,
    imageUrl: "/devices/desktop.svg",
    plusItemCode: PC_PLUS_CODE,
  },
  {
    id: "lenovo-thinkpad-t14",
    name: "Lenovo ThinkPad T14 Laptop",
    category: "computer",
    shortDescription:
      "Durable business laptop with a full-day battery for hybrid teams.",
    price: 1349,
    imageUrl: "/devices/laptop.svg",
    plusItemCode: PC_PLUS_CODE,
  },
];

export const allDevices: Device[] = [...networkDevices, ...computerDevices];

/** Look up a single device by id. */
export function getDeviceById(id: string): Device | undefined {
  return allDevices.find((device) => device.id === id);
}
