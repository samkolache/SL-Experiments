import { Component, ChangeDetectionStrategy, OnDestroy, inject } from '@angular/core';
import { ThemeService, ThemeName } from '../../../services/theme.service';
import { MilestoneHeaderComponent } from './milestone-header/milestone-header';
import { MilestoneSidebarComponent } from './milestone-sidebar/milestone-sidebar';
// import { ProductAndFeesCardComponent } from './product-and-fees-card/product-and-fees-card';
import { ProductPricingCardComponent } from './product-pricing-card/product-pricing-card';
import { StepIconItem } from './step-icon-header/step-icon-header';
import { HEADER_STEPS, SIDEBAR_STEPS, ACTIVE_STEP_INDEX } from './product-and-fees.data';

/**
 * UI-only replica of the VendorOnBoardingSpa Products & Fees screen.
 * VendorOnBoardingSpa ships the exos *external* theme, so the page switches to
 * it while mounted and restores whatever theme was active before on leave.
 */
@Component({
  selector: 'app-onboarding-layout',
  standalone: true,
  imports: [MilestoneHeaderComponent, MilestoneSidebarComponent, ProductPricingCardComponent /* , ProductAndFeesCardComponent */],
  templateUrl: './product-and-fees.component.html',
  styleUrl: './product-and-fees.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAndFeesComponent implements OnDestroy {
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
