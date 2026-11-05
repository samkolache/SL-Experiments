// ── Products & Pricing card (Figma "Sams-Vibe" 683:8694 et al.) ────────────
// Static display data for the redesigned county × product pricing grid.

export interface PricingProduct {
  key: string;
  name: string;
  description: string;
}

export const PRICING_PRODUCTS: PricingProduct[] = [
  { key: 'interior-pcr', name: 'Interior PCR / Disaster Condition', description: 'Description of Interior Property Condition Report / Disaster Condition Report' },
  { key: 'exterior-pcr', name: 'Exterior PCR / Disaster Condition', description: 'Description of Exterior Property Condition Report / Disaster Condition Report' },
  { key: 'interior-bpo', name: 'Interior BPO', description: 'Description of Interior Broker Price Opinion' },
  { key: 'exterior-bpo', name: 'Exterior BPO', description: 'Description of Exterior Broker Price Opinion' },
  { key: 'pdr', name: 'Property Data Reports (FNMA / Freddie)', description: 'Description of Property Data Reports (FNMA / Freddie)' },
];

export const PRICING_COUNTIES: string[] = ['Harris', 'Dallas', 'Tarrant', 'Travis', 'Bexar'];

// Pre-populated competitive market rate shown in every fee input.
export const DEFAULT_PRICING_FEE = 150;
