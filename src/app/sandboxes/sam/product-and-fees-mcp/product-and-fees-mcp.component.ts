import { Component, ChangeDetectionStrategy, OnDestroy, inject } from '@angular/core';
import { ThemeService, ThemeName } from '../../../services/theme.service';
import { MilestoneHeaderComponent } from '../product-and-fees/milestone-header/milestone-header';
import { MilestoneSidebarComponent } from '../product-and-fees/milestone-sidebar/milestone-sidebar';
import { ProductsPricingCardComponent } from './products-pricing-card/products-pricing-card';
import { StepIconItem } from '../product-and-fees/step-icon-header/step-icon-header';
import { HEADER_STEPS, SIDEBAR_STEPS, ACTIVE_STEP_INDEX } from '../product-and-fees/product-and-fees.data';

/**
 * UI-only replica of the VendorOnBoardingSpa Products & Fees screen.
 * VendorOnBoardingSpa ships the exos *external* theme, so the page switches to
 * it while mounted and restores whatever theme was active before on leave.
 */
@Component({
  selector: 'app-product-and-fees-mcp',
  standalone: true,
  imports: [MilestoneHeaderComponent, MilestoneSidebarComponent, ProductsPricingCardComponent],
  templateUrl: './product-and-fees-mcp.component.html',
  styleUrl: './product-and-fees-mcp.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAndFeesMcpComponent implements OnDestroy {
  private readonly themeService = inject(ThemeService);
  private readonly previousTheme: ThemeName = this.themeService.active();

  protected readonly steps: StepIconItem[] = HEADER_STEPS;
  protected readonly sidebarSteps: StepIconItem[] = SIDEBAR_STEPS;
  protected readonly activeIndex = ACTIVE_STEP_INDEX;

  constructor() {
    this.themeService.setTheme('external');
  }

  ngOnDestroy(): void {
    this.themeService.setTheme(this.previousTheme);
  }
}
