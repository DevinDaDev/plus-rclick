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
  /** Short spec bullets shown on the product detail page. TODO: Right Click to confirm. */
  specs: string[];
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
    imageUrl: "/devices/udm-pro.png",
    plusItemCode: NETWORK_PLUS_CODE,
    specs: [
      "All-in-one router, security gateway, and UniFi controller",
      "10G SFP+ WAN and LAN ports plus 8-port gigabit switch",
      "Built-in threat management and network monitoring",
      "Rack-mountable, 1U",
    ],
  },
  {
    id: "usw-24-poe",
    name: "Ubiquiti 24-Port PoE Switch",
    category: "network",
    shortDescription:
      "Managed 24-port switch with PoE to power phones, cameras, and access points.",
    price: 379,
    imageUrl: "/devices/usw-24-poe.png",
    plusItemCode: NETWORK_PLUS_CODE,
    specs: [
      "24 gigabit RJ45 ports, 16 with PoE+",
      "2 SFP uplink ports",
      "Managed through the UniFi controller",
      "Quiet, rack-mountable design",
    ],
  },
  {
    id: "u7-pro-ap",
    name: "Ubiquiti U7 Pro Access Point",
    category: "network",
    shortDescription:
      "High-capacity Wi-Fi 7 access point for fast, reliable coverage across the office.",
    price: 189,
    imageUrl: "/devices/u7-pro-ap.jpg",
    plusItemCode: NETWORK_PLUS_CODE,
    specs: [
      "Wi-Fi 7 tri-band access point",
      "Coverage for high-density offices",
      "PoE+ powered, ceiling or wall mount",
      "Managed through the UniFi controller",
    ],
  },
  {
    id: "sonicwall-tz",
    name: "SonicWall TZ-Series Firewall",
    category: "network",
    shortDescription:
      "Business firewall with threat protection for securing your network perimeter.",
    price: 649,
    imageUrl: "/devices/sonicwall-tz.jpg",
    plusItemCode: NETWORK_PLUS_CODE,
    specs: [
      "Business firewall with deep packet inspection",
      "Threat protection and content filtering",
      "VPN support for remote workers",
      "Desktop form factor",
    ],
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
    imageUrl: "/devices/dell-latitude-5450.jpg",
    plusItemCode: PC_PLUS_CODE,
    specs: [
      "14-inch business laptop",
      "Intel Core Ultra processor",
      "16 GB RAM, 512 GB SSD",
      "Windows 11 Pro",
    ],
  },
  {
    id: "dell-precision-3591",
    name: "Dell Precision 3591 Laptop",
    category: "computer",
    shortDescription:
      "Mobile workstation for design, engineering, and other heavy workloads.",
    price: 1899,
    imageUrl: "/devices/dell-precision-3591.jpg",
    plusItemCode: PC_PLUS_CODE,
    specs: [
      "15.6-inch mobile workstation",
      "Intel Core Ultra, discrete NVIDIA graphics",
      "32 GB RAM, 1 TB SSD",
      "Windows 11 Pro",
    ],
  },
  {
    id: "dell-optiplex-7020",
    name: "Dell OptiPlex 7020 Desktop",
    category: "computer",
    shortDescription:
      "Reliable desktop for fixed workstations and front-desk setups.",
    price: 999,
    imageUrl: "/devices/dell-optiplex-7020.jpg",
    plusItemCode: PC_PLUS_CODE,
    specs: [
      "Compact business desktop",
      "Intel Core processor",
      "16 GB RAM, 512 GB SSD",
      "Windows 11 Pro",
    ],
  },
  {
    id: "lenovo-thinkpad-t14",
    name: "Lenovo ThinkPad T14 Laptop",
    category: "computer",
    shortDescription:
      "Durable business laptop with a full-day battery for hybrid teams.",
    price: 1349,
    imageUrl: "/devices/lenovo-thinkpad-t14.jpg",
    plusItemCode: PC_PLUS_CODE,
    specs: [
      "14-inch business laptop",
      "Intel Core Ultra processor",
      "16 GB RAM, 512 GB SSD",
      "Windows 11 Pro, full-day battery",
    ],
  },
];

export const allDevices: Device[] = [...networkDevices, ...computerDevices];

/** Look up a single device by id. */
export function getDeviceById(id: string): Device | undefined {
  return allDevices.find((device) => device.id === id);
}
