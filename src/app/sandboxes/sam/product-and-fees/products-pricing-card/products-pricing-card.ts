import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MAX_FEE_AMOUNT } from '../fee-input';
import { PRICING_COUNTIES, PRICING_DEFAULT_FEE, PRICING_PRODUCTS } from '../product-and-fees.data';

/**
 * "Confirm Products & Pricing" card (Figma 683:8835 … 683:9691).
 *
 * One markup, three layouts. Every header and cell carries its product (--p)
 * and county (--c) index; each breakpoint only changes the grid-placement
 * formula in the SCSS:
 *   ≥934px     products are columns, counties are rows
 *   767–933px  axes swap: products are rows, counties are columns
 *   ≤766px     stacked: one block per product, one row per county
 *
 * UI only: the product checkboxes toggle natively; there is no other logic.
 */
@Component({
  selector: 'app-products-pricing-card',
  standalone: true,
  templateUrl: './products-pricing-card.html',
  styleUrl: './products-pricing-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPricingCardComponent {
  protected readonly products = PRICING_PRODUCTS;
  protected readonly counties = PRICING_COUNTIES;
  protected readonly defaultFee = PRICING_DEFAULT_FEE;
  protected readonly maxFeeAmount = MAX_FEE_AMOUNT;
}
