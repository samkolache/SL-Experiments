import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SectionMultiColumn } from '../section-multi-column/section-multi-column';
import { SectionSingle } from '../section-single/section-single';
import { MAX_FEE_AMOUNT, parseFeeInput } from '../fee-input';
import {
  AdjustmentType,
  COVERAGE_AREAS,
  CountyFee,
  CoverageArea,
  ProductFeeSection,
  createEmptyCountyFee,
  createProductFeeSections,
} from '../product-and-fees.data';

/**
 * UI-only copy of VOB's ProductAndFeesComponent card. Data is static; only
 * on-screen behaviour is kept (county rows, +/- toggles, county de-duplication
 * in the dropdowns, input trimming). BACK / CONTINUE do nothing.
 */
@Component({
  selector: 'app-product-and-fees',
  standalone: true,
  imports: [SectionMultiColumn, SectionSingle],
  templateUrl: './product-and-fees-card.html',
  styleUrl: './product-and-fees-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAndFeesCardComponent {
  private static readonly countyOptionDelimiter = '|';

  readonly maxFeeAmount = MAX_FEE_AMOUNT;
  readonly productFeeSections = signal<ProductFeeSection[]>(createProductFeeSections());
  readonly coverageAreas = signal<CoverageArea[]>(COVERAGE_AREAS);
  readonly countyFees = signal<CountyFee[]>([createEmptyCountyFee()]);
  readonly hasCoverageAreas = computed(() => this.coverageAreas().length > 0);

  // Tablet band (768-868px): the county panel's placeholder shortens to "County".
  private readonly isTabletWidth = toSignal(
    fromEvent(window, 'resize').pipe(
      map(() => window.innerWidth >= 768 && window.innerWidth <= 868),
      startWith(window.innerWidth >= 768 && window.innerWidth <= 868)
    ),
    { initialValue: window.innerWidth >= 768 && window.innerWidth <= 868 }
  );
  protected readonly countyPlaceholder = () => this.isTabletWidth() ? 'County' : 'Select County';

  addCountyExceptionRow(): void {
    this.countyFees.update((rows) => [...rows, createEmptyCountyFee()]);
  }

  removeCountyException(countyFee: CountyFee): void {
    this.countyFees.update((rows) => rows.filter((row) => row !== countyFee));
  }

  setCountyExceptionRow(row: CountyFee, event: Event): void {
    const selected = this.parseCountyOptionValue((event.target as HTMLSelectElement).value);

    if (!selected) {
      row.county = '';
      row.countyName = '';
      row.state = '';
    } else if (!this.isCountySelectedInOtherRow(selected.countyName, selected.state, row)) {
      row.county = selected.countyName;
      row.countyName = selected.countyName;
      row.state = selected.state;
    }
    this.refreshRows();
  }

  isCountySelectedInOtherRow(countyName: string, state: string, currentRow: CountyFee): boolean {
    return this.countyFees().some(
      (row) => row !== currentRow && row.county === countyName && row.state === state,
    );
  }

  toCountyOptionValue(countyName: string, state: string): string {
    return `${countyName}${ProductAndFeesCardComponent.countyOptionDelimiter}${state}`;
  }

  setCountyFeeException(row: CountyFee, isInterior: boolean, event: Event): void {
    const result = parseFeeInput(event.target as HTMLInputElement);
    if (result.type === 'skip') {
      return;
    }
    const fee = result.type === 'value' ? result.fee : undefined;
    (isInterior ? row.interior : row.exterior).fee = fee;
    this.refreshRows();
  }

  setFeeAdjustmentType(row: CountyFee, isInterior: boolean, adjustmentType: AdjustmentType): void {
    (isInterior ? row.interior : row.exterior).adjustmentType = adjustmentType;
    this.refreshRows();
  }

  // Rows are mutated in place (keeps @for identity); clone the array to notify.
  private refreshRows(): void {
    this.countyFees.update((rows) => [...rows]);
  }

  private parseCountyOptionValue(value: string): { countyName: string; state: string } | null {
    const delimiterIndex = value.lastIndexOf(ProductAndFeesCardComponent.countyOptionDelimiter);
    if (delimiterIndex <= 0 || delimiterIndex === value.length - 1) {
      return null;
    }
    const countyName = value.slice(0, delimiterIndex).trim();
    const state = value.slice(delimiterIndex + 1).trim();
    return countyName && state ? { countyName, state } : null;
  }
}
