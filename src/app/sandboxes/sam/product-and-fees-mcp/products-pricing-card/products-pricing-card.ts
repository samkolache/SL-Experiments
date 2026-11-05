import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DEFAULT_PRICING_FEE, PRICING_COUNTIES, PRICING_PRODUCTS } from '../products-pricing.data';

/**
 * Redesigned Products & Pricing card (Figma Sams-Vibe 683:8694 / 683:9265 / 683:9756).
 * UI only: the sole behaviour is toggling a product's checkbox. Fee inputs are
 * display-only and pre-filled with the default market rate.
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
  protected readonly defaultFee = DEFAULT_PRICING_FEE;

  // Shared by the table and the mobile list so both views stay in sync.
  protected readonly selected = signal<Record<string, boolean>>(
    Object.fromEntries(PRICING_PRODUCTS.map((p) => [p.key, true])),
  );

  protected toggleProduct(key: string): void {
    this.selected.update((s) => ({ ...s, [key]: !s[key] }));
  }
}
