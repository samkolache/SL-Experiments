import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MAX_FEE_AMOUNT, parseFeeInput } from '../../product-and-fees/fee-input';

export interface PricingProduct {
  key: string;
  name: string;
  /** Shown under the name in the <767px stacked layout only. */
  description: string;
}

/** Static content from the Figma mocks (Sams-Vibe, nodes 683:8694 … 683:9691). */
export const PRICING_COUNTIES: string[] = ['Harris', 'Dallas', 'Tarrant', 'Travis', 'Bexar'];
export const PRICING_PRODUCTS: PricingProduct[] = [
  { key: 'interior-pcr', name: 'Interior PCR / Disaster Condition', description: 'Description of Interior Property Condition Report / Disaster Condition Report' },
  { key: 'exterior-pcr', name: 'Exterior PCR / Disaster Condition', description: 'Description of Exterior Property Condition Report / Disaster Condition Report' },
  { key: 'interior-bpo', name: 'Interior BPO', description: 'Description of Interior BPO' },
  { key: 'exterior-bpo', name: 'Exterior BPO', description: 'Description of Exterior BPO' },
  { key: 'pdr', name: 'Property Data Reports (FNMA / Freddie)', description: 'Description of Property Data Reports (FNMA / Freddie)' },
];
export const DEFAULT_PRICING_FEE = 150;

/**
 * New "Confirm Products & Pricing" card (replaces ProductAndFeesCardComponent).
 *
 * One DOM, three layouts, switched purely in CSS:
 *  - >=933px   counties are rows, products are columns   (grid-auto-flow: column)
 *  - 768-932px products are rows, counties are columns   (grid-auto-flow: row)
 *  - <768px    one stacked block per product, county label + input per row
 * The only interaction is the product checkbox (native checked state).
 */
@Component({
  selector: 'app-product-pricing-card',
  standalone: true,
  templateUrl: './product-pricing-card.html',
  styleUrl: './product-pricing-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPricingCardComponent {
  protected readonly counties = PRICING_COUNTIES;
  protected readonly products = PRICING_PRODUCTS;
  protected readonly defaultFee = DEFAULT_PRICING_FEE;
  protected readonly maxFeeAmount = MAX_FEE_AMOUNT;

  // Existing input behaviour (2-decimal trimming) reused from fee-input.ts.
  protected onFeeInput(event: Event): void {
    parseFeeInput(event.target as HTMLInputElement);
  }
}
