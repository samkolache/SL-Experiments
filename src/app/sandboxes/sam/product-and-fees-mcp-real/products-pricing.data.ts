// ── Products & Pricing card (Figma "Confirm Products & Pricing") ───────────
// One fee per product per county. Display-only: the only interaction is the
// per-product checkbox.

export interface PricingProduct {
  key: string;
  name: string;
  description: string;
}

export const PRICING_PRODUCTS: PricingProduct[] = [
  { key: 'interior-pcr', name: 'Interior PCR / Disaster Condition', description: 'Description of Interior PCR / Disaster Condition' },
  { key: 'exterior-pcr', name: 'Exterior PCR / Disaster Condition', description: 'Description of Exterior PCR / Disaster Condition' },
  { key: 'interior-bpo', name: 'Interior BPO', description: 'Description of Interior BPO' },
  { key: 'exterior-bpo', name: 'Exterior BPO', description: 'Description of Exterior BPO' },
  { key: 'pdr', name: 'Property Data Reports (FNMA / Freddie)', description: 'Description of Property Data Reports (FNMA / Freddie)' },
];

export const PRICING_COUNTIES: string[] = ['Harris', 'Dallas', 'Tarrant', 'Travis', 'Bexar'];

// Pre-populated market-rate fee shown in every input.
export const PRICING_DEFAULT_FEE = 150;
