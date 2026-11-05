import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { MAX_FEE_AMOUNT, parseFeeInput } from '../../product-and-fees/fee-input';
import {
  PRICING_COUNTIES,
  PRICING_DEFAULT_FEE,
  PRICING_PRODUCTS,
  PricingProduct,
} from '../product-pricing.data';

/**
 * "Confirm Products & Pricing" card (Figma 683:8694 and its responsive
 * siblings). Content is coded once; the three layouts (desktop grid,
 * 768-933 transposed grid, <768 stacked blocks) are switched purely in CSS
 * and all reuse the same fee-input / product-label templates.
 *
 * The only state is which products are checked.
 */
@Component({
  selector: 'app-product-pricing-card',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './product-pricing-card.html',
  styleUrl: './product-pricing-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPricingCardComponent {
  protected readonly products = PRICING_PRODUCTS;
  protected readonly counties = PRICING_COUNTIES;
  protected readonly defaultFee = PRICING_DEFAULT_FEE;
  protected readonly maxFeeAmount = MAX_FEE_AMOUNT;

  protected readonly checked = signal<Record<string, boolean>>(
    Object.fromEntries(PRICING_PRODUCTS.map((p) => [p.key, true])),
  );

  protected toggle(product: PricingProduct, event: Event): void {
    const value = (event.target as HTMLInputElement).checked;
    this.checked.update((state) => ({ ...state, [product.key]: value }));
  }

  // Same display-only trimming the original card's inputs use.
  protected onFeeInput(event: Event): void {
    parseFeeInput(event.target as HTMLInputElement);
  }
}
