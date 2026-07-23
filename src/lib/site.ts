// Shared site constants — ported from the static build (build/build_pages.py).

export const WA_URL =
  "https://wa.me/642102454541?text=" +
  encodeURIComponent("Hi CoolMaster, I'd like to request a free quote.");

export const PHONE_DISPLAY = "0800 000 000";
export const PHONE_TEL = "+64800000000";
export const EMAIL = "info@coolmaster.co.nz";
export const OWNER = "Shiv Sivan";

export type ServiceMenuItem = { slug: string; label: string };

// slug (route param) -> menu label. Order = menu order, commercial first.
export const SERVICE_MENU: ServiceMenuItem[] = [
  { slug: "commercial-hvac", label: "Commercial HVAC Design & Install" },
  { slug: "commercial-refrigeration", label: "Commercial Refrigeration" },
  { slug: "bwof-form-12a", label: "BWoF & Form 12A Support" },
  { slug: "servicing-maintenance", label: "Servicing & Maintenance" },
  { slug: "mechanical-ventilation", label: "Mechanical Ventilation" },
  { slug: "emergency-repairs", label: "Emergency Refrigeration Repairs" },
  { slug: "heat-pumps", label: "Heat Pump Supply & Installation" },
  { slug: "air-conditioning", label: "Home Air Conditioning" },
  { slug: "ducted-systems", label: "Ducted Heating & Cooling" },
];
