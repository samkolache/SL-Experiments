// Static display data for the UI-only Products & Fees replica.
// In VendorOnBoardingSpa these come from the onboarding API; here they are
// hard-coded so the page renders in a realistic, fully-populated state.

import { StepIconItem } from './step-icon-header/step-icon-header';

// ── Models (trimmed copy of VOB product-fees-models.ts) ────────────────────

export type SectionType = 'multiColumn' | 'single';
export type AdjustmentType = 'Add' | 'Subtract';

export interface FeeValue {
  isEnabled: boolean;
  fee: number | null;
}

export interface InspectionType {
  key: string;
  displayName: string;
}

export interface MultiColumnFeeRow {
  id: string;
  name: string;
  displayOrder: number;
  fees: Record<string, FeeValue>;
}

export interface SingleFeeRow {
  id: string;
  name: string;
  displayOrder: number;
  isEnabled: boolean;
  fee: number | null;
}

export interface ProductFeeSection {
  sectionId: string;
  sectionName: string;
  sectionType: SectionType;
  displayOrder: number;
  inspectionTypes: InspectionType[] | null;
  sections: MultiColumnFeeRow[] | null;
  fees: SingleFeeRow[] | null;
}

export interface CountyFeeAdjustment {
  adjustmentType: AdjustmentType;
  fee?: number;
}

export interface CountyFee {
  state: string;
  county: string;
  countyName: string | null;
  interior: CountyFeeAdjustment;
  exterior: CountyFeeAdjustment;
}

export interface CoverageArea {
  countyName: string;
  state: string;
}

// ── Milestone steps ────────────────────────────────────────────────────────
// Products & Fees is active; the three steps before it are complete.

export const ACTIVE_STEP_INDEX = 3;

export const HEADER_STEPS: StepIconItem[] = [
  { img: 'license', label: 'License', isFilled: true },
  { img: 'my-info', label: 'Info & Docs', isFilled: true },
  { img: 'coverage', label: 'Coverage', isFilled: true },
  { img: 'product-and-fees', label: 'Products & Fees', isFilled: false },
  { img: 'availability', label: 'Your Availability', isFilled: false },
];

export const SIDEBAR_STEPS: StepIconItem[] = [
  { img: 'license', label: 'Appraiser License Verification', isFilled: true },
  { img: 'my-info', label: 'Info & Documents', isFilled: true },
  { img: 'coverage', label: 'Coverage Area', isFilled: true },
  { img: 'product-and-fees', label: 'Products & Fees', isFilled: false },
  { img: 'availability', label: 'Your Availability', isFilled: false },
];

// ── Product fee sections ───────────────────────────────────────────────────

const INSPECTION_TYPES: InspectionType[] = [
  { key: 'interior', displayName: 'Interior' },
  { key: 'exterior', displayName: 'Exterior' },
];

function multiRow(id: string, name: string, displayOrder: number): MultiColumnFeeRow {
  return {
    id,
    name,
    displayOrder,
    fees: {
      interior: { isEnabled: true, fee: null },
      exterior: { isEnabled: true, fee: null },
    },
  };
}

function singleRow(id: string, name: string, displayOrder: number): SingleFeeRow {
  return { id, name, displayOrder, isEnabled: true, fee: null };
}

export function createProductFeeSections(): ProductFeeSection[] {
  return [
    {
      sectionId: 'core-products',
      sectionName: 'Core Products',
      sectionType: 'multiColumn',
      displayOrder: 1,
      inspectionTypes: INSPECTION_TYPES,
      sections: [
        multiRow('sf-detached', 'Single Family - Detached', 1),
        multiRow('sf-condo', 'Single Family - Condo', 2),
        multiRow('sf-coop', 'Single Family - Co-Op', 3),
        multiRow('multi-family', 'Multi Family', 4),
        multiRow('land', 'Land', 5),
        multiRow('field-review', 'Field Review', 6),
        multiRow('recert-updates', 'Recertification & Updates', 7),
      ],
      fees: null,
    },
    {
      sectionId: 'additional-products',
      sectionName: 'Additional Products',
      sectionType: 'single',
      displayOrder: 2,
      inspectionTypes: null,
      sections: null,
      fees: [
        singleRow('desktop-gse', 'Desktop / Hybrid - GSE Compliant', 1),
        singleRow('desktop-limited', 'Desktop / Hybrid - Limited Scope', 2),
      ],
    },
    {
      sectionId: 'add-ons',
      sectionName: 'Add-On Pricing Considerations (Optional)',
      sectionType: 'single',
      displayOrder: 3,
      inspectionTypes: null,
      sections: null,
      fees: [
        singleRow('as-is', 'As Is & As Subject To Values', 1),
        singleRow('rent-schedule', 'Rent Schedule / Operating Income Statement', 2),
        singleRow('fha-usda', 'FHA / USDA', 3),
        singleRow('renovation', 'Renovation', 4),
        singleRow('manufactured-home', 'Manufactured Home', 5),
        singleRow('reo-addendum', 'REO Addendum', 6),
        singleRow('retroactive-value', 'Retroactive Value', 7),
      ],
    },
  ];
}

// ── Coverage areas (county dropdown options) ───────────────────────────────

export const COVERAGE_AREAS: CoverageArea[] = [
  { countyName: 'Allegheny', state: 'PA' },
  { countyName: 'Butler', state: 'PA' },
  { countyName: 'Beaver', state: 'PA' },
  { countyName: 'Washington', state: 'PA' },
  { countyName: 'Westmoreland', state: 'PA' },
];

export function createEmptyCountyFee(): CountyFee {
  return {
    county: '',
    countyName: '',
    state: '',
    interior: { adjustmentType: 'Add' },
    exterior: { adjustmentType: 'Add' },
  };
}

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
