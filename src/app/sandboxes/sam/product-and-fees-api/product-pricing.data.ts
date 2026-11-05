// ── Product pricing card (Figma "Confirm Products & Pricing", 683:8694) ────
// Each product carries the three label lengths the mocks use: `short` for the
// desktop column header, `medium` for the 768-933 transposed row header and
// `long` (+ description) for the stacked mobile block heading.

export interface PricingProduct {
  key: string;
  short: string;
  medium: string;
  long: string;
  description: string;
}

export const PRICING_PRODUCTS: PricingProduct[] = [
  {
    key: 'interior-pcr',
    short: 'Interior PCR / Disaster Condition',
    medium: 'Interior Condition / Disaster Condition Report',
    long: 'Interior Property Condition Report / Disaster Condition Report',
    description: 'Description of Interior Property Condition Report / Disaster Condition Report',
  },
  {
    key: 'exterior-pcr',
    short: 'Exterior PCR / Disaster Condition',
    medium: 'Exterior Condition / Disaster Condition Report',
    long: 'Exterior Property Condition Report / Disaster Condition Report',
    description: 'Description of Exterior Property Condition Report / Disaster Condition Report',
  },
  {
    key: 'interior-bpo',
    short: 'Interior BPO',
    medium: 'Interior BPO',
    long: 'Interior BPO',
    description: 'Description of Interior BPO',
  },
  {
    key: 'exterior-bpo',
    short: 'Exterior BPO',
    medium: 'Exterior BPO',
    long: 'Exterior BPO',
    description: 'Description of Exterior BPO',
  },
  {
    key: 'property-data-reports',
    short: 'Property Data Reports (FNMA / Freddie)',
    medium: 'Property Data Reports (FNMA / Freddie)',
    long: 'Property Data Reports (FNMA / Freddie)',
    description: 'Description of Property Data Reports (FNMA / Freddie)',
  },
];

export const PRICING_COUNTIES: string[] = ['Harris', 'Dallas', 'Tarrant', 'Travis', 'Bexar'];

export const PRICING_DEFAULT_FEE = 150;
