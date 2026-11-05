import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FeeValue, InspectionType } from '../product-and-fees.data';
import { MAX_FEE_AMOUNT, parseFeeInput } from '../fee-input';

@Component({
  selector: 'app-section-multi-column',
  standalone: true,
  imports: [],
  templateUrl: './section-multi-column.html',
  styleUrl: './section-multi-column.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionMultiColumn {
  readonly displayText = input<string>('');
  readonly code = input<string>('');
  readonly columns = input<Record<string, FeeValue>>({});
  readonly headers = input<InspectionType[]>([]);
  readonly showHeader = input<boolean>(false);
  readonly maxFeeAmount = MAX_FEE_AMOUNT;

  onFeeInput(column: FeeValue, event: Event): void {
    if (!column.isEnabled) {
      return;
    }
    const result = parseFeeInput(event.target as HTMLInputElement);
    if (result.type === 'skip') {
      return;
    }
    column.fee = result.type === 'value' ? result.fee : null;
  }

  onEnabledChange(column: FeeValue, event: Event): void {
    column.isEnabled = (event.target as HTMLInputElement).checked;
    if (!column.isEnabled) {
      column.fee = null;
    }
  }

  isLandInteriorGroup(section: string, columnGroup: string): boolean {
    const isInterior = columnGroup?.toLowerCase() === 'interior';
    const isLandSection = section?.toLowerCase() === 'land';
    return isLandSection && isInterior;
  }
}
