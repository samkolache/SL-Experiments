import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SingleFeeRow } from '../product-and-fees.data';
import { MAX_FEE_AMOUNT, parseFeeInput } from '../fee-input';

@Component({
  selector: 'app-section-single',
  standalone: true,
  imports: [],
  templateUrl: './section-single.html',
  styleUrl: './section-single.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionSingle {
  readonly displayText = input<string>('');
  readonly feeRows = input<SingleFeeRow[]>([]);
  readonly maxFeeAmount = MAX_FEE_AMOUNT;

  onFeeInput(feeRow: SingleFeeRow, event: Event): void {
    if (!feeRow.isEnabled) {
      return;
    }
    const result = parseFeeInput(event.target as HTMLInputElement);
    if (result.type === 'skip') {
      return;
    }
    feeRow.fee = result.type === 'value' ? result.fee : null;
  }

  onEnabledChange(feeRow: SingleFeeRow, event: Event): void {
    feeRow.isEnabled = (event.target as HTMLInputElement).checked;
    if (!feeRow.isEnabled) {
      feeRow.fee = null;
    }
  }
}
