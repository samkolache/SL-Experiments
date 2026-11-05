import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  booleanAttribute,
  inject
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  APPLY_COLUMN_PX,
  DEFAULT_TABLE_QUERY,
  FILL_MIN_PX,
  LEAD_COLUMN_PX,
  LeadColumnKind,
  SortDirection,
  TableColumn,
  TableQuery,
  fillWeight,
  fixedWidthPx,
  resolveField
} from './tables.model';
import {
  DtActionsDirective,
  DtApplyButtonDirective,
  DtCellContext,
  DtCellDirective,
  DtDetailRowDirective,
  DtFilterContext,
  DtFilterDirective
} from './tables.directives';

/**
 * Renders rows and emits `queryChange` — it never sorts, filters or pages
 * the data itself. The consumer fetches with the query and passes new rows.
 *
 * Nothing is emitted on init, so fetch once with your own initial query.
 */
@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent implements OnChanges, AfterContentInit {

  @Input() heading?: string;
  @Input() description?: string;

  @Input() columns: TableColumn[] = [];
  @Input() rows: any[] = [];

  /** Property that uniquely identifies a row. */
  @Input() rowId = 'id';

  /** Leave unset for no first column. */
  @Input() leadColumn?: LeadColumnKind;

  /** Prefix for the ids on every control, for test automation. */
  @Input() idPrefix = 'dt';

  /** Current sort, filters and page. Owned by the parent. */
  @Input() query: TableQuery = DEFAULT_TABLE_QUERY;

  /** Total rows on the server, for the pagination footer. */
  @Input() total = 0;
  @Input() pageSizes = [50, 100, 150];
  @Input({ transform: booleanAttribute }) paginated = true;

  @Input({ transform: booleanAttribute }) loading = false;

  /** Bounds the scroll area, e.g. '480px', so the header sticks. */
  @Input() maxHeight?: string;

  @Input() emptyMessage = 'No records to show.';

  @Output() queryChange = new EventEmitter<TableQuery>();

  /** The selected rows. Cleared whenever `rows` is replaced. */
  @Output() selectionChange = new EventEmitter<any[]>();

  @ContentChildren(DtCellDirective) private cellDirectives!: QueryList<DtCellDirective>;
  @ContentChildren(DtFilterDirective) private filterDirectives!: QueryList<DtFilterDirective>;
  @ContentChild(DtDetailRowDirective) detailRow?: DtDetailRowDirective;
  @ContentChild(DtApplyButtonDirective) applyButton?: DtApplyButtonDirective;
  @ContentChild(DtActionsDirective) actions?: DtActionsDirective;

  readonly leadColumnPx = LEAD_COLUMN_PX;
  readonly applyColumnPx = APPLY_COLUMN_PX;

  cellTemplates = new Map<string, TemplateRef<DtCellContext>>();
  filterTemplates = new Map<string, TemplateRef<DtFilterContext>>();

  /** Derived when columns or templates change, not on every render pass. */
  columnWidths: string[] = [];
  stickyLeft: (number | null)[] = [];
  hasStickyColumns = false;
  hasFilterRow = false;
  minTableWidth = 0;

  /** Filters being edited. Only sent when the apply button is clicked. */
  draft: Record<string, unknown> = {};

  private selected = new Set<unknown>();
  private expanded = new Set<unknown>();
  private cdr = inject(ChangeDetectorRef);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns'] || changes['leadColumn']) {
      this.computeLayout();
    }

    // Only reset the draft when the applied filters change — a sort or page
    // change passes the same filters back and shouldn't wipe unapplied edits.
    const query = changes['query'];
    if (query && query.previousValue?.filters !== this.query.filters) {
      this.draft = { ...this.query.filters };
    }

    if (changes['rows'] && !changes['rows'].firstChange) {
      this.expanded.clear();
      if (this.selected.size) {
        this.selected.clear();
        // Emitting mid-change-detection would update the parent after it was checked.
        Promise.resolve().then(() => this.selectionChange.emit([]));
      }
    }
  }

  ngAfterContentInit(): void {
    this.collectTemplates();
    this.cellDirectives.changes.subscribe(() => this.collectTemplates());
    this.filterDirectives.changes.subscribe(() => this.collectTemplates());
  }

  get columnCount(): number {
    return this.columns.length + (this.leadColumn ? 1 : 0) + (this.hasFilterRow ? 1 : 0);
  }

  get showToolbar(): boolean {
    return !!(this.heading || this.description || this.actions);
  }

  id(...parts: (string | number)[]): string {
    return [this.idPrefix, ...parts].join('-');
  }

  rowKey(row: any): unknown {
    return row?.[this.rowId];
  }

  cellValue(row: any, col: TableColumn): any {
    return resolveField(row, col.field ?? col.id);
  }

  alignClass(col: TableColumn): string {
    return col.align === 'right' ? 'text-end' : col.align === 'center' ? 'text-center' : '';
  }

  // ── Sort ──────────────────────────────────────────────────────────────────

  sortDirection(col: TableColumn): SortDirection | null {
    const sort = this.query.sort;
    return sort && sort.key === this.sortKey(col) ? sort.direction : null;
  }

  ariaSort(col: TableColumn): string | null {
    const direction = this.sortDirection(col);
    return direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : null;
  }

  /** Fetches immediately: unsorted → ascending → descending → ascending. */
  toggleSort(col: TableColumn): void {
    const direction: SortDirection = this.sortDirection(col) === 'asc' ? 'desc' : 'asc';
    this.emitQuery({ sort: { key: this.sortKey(col), direction }, page: 1 });
  }

  private sortKey(col: TableColumn): string {
    return col.sortKey ?? col.field ?? col.id;
  }

  // ── Filters ───────────────────────────────────────────────────────────────

  filterKey(col: TableColumn): string {
    return col.filterKey ?? col.field ?? col.id;
  }

  selectFilter(col: TableColumn) {
    return col.filter && col.filter !== 'text' ? col.filter : null;
  }

  readonly setFilter = (key: string, value: unknown): void => {
    this.draft = { ...this.draft, [key]: value };
    this.cdr.markForCheck();
  };

  /** Trims strings, drops empty values, and fetches from page 1. */
  readonly applyFilters = (): void => {
    const filters: Record<string, unknown> = {};
    for (const [key, raw] of Object.entries(this.draft)) {
      const value = typeof raw === 'string' ? raw.trim() : raw;
      if (value !== '' && value != null) {
        filters[key] = value;
      }
    }
    this.emitQuery({ filters, page: 1 });
  };

  filterContext(col: TableColumn): DtFilterContext {
    return {
      $implicit: this.draft,
      set: this.setFilter,
      apply: this.applyFilters,
      id: this.id('filter', col.id),
      label: `Filter by ${col.header}`
    };
  }

  // ── Selection & expansion ─────────────────────────────────────────────────

  isSelected(row: any): boolean {
    return this.selected.has(this.rowKey(row));
  }

  get allSelected(): boolean {
    return this.rows.length > 0 && this.rows.every(row => this.isSelected(row));
  }

  get someSelected(): boolean {
    return this.selected.size > 0 && !this.allSelected;
  }

  toggleRow(row: any): void {
    const key = this.rowKey(row);
    if (this.selected.has(key)) {
      this.selected.delete(key);
    } else {
      this.selected.add(key);
    }
    this.emitSelection();
  }

  toggleAll(): void {
    this.selected = this.allSelected ? new Set() : new Set(this.rows.map(row => this.rowKey(row)));
    this.emitSelection();
  }

  /** Call after a bulk action completes. */
  clearSelection(): void {
    this.selected.clear();
    this.emitSelection();
    this.cdr.markForCheck();
  }

  isExpanded(row: any): boolean {
    return this.expanded.has(this.rowKey(row));
  }

  toggleExpanded(row: any): void {
    const key = this.rowKey(row);
    if (this.expanded.has(key)) {
      this.expanded.delete(key);
    } else {
      this.expanded.add(key);
    }
  }

  private emitSelection(): void {
    this.selectionChange.emit(this.rows.filter(row => this.isSelected(row)));
  }

  // ── Pagination ────────────────────────────────────────────────────────────

  get pageCount(): number {
    return Math.max(1, Math.ceil(this.total / this.query.pageSize));
  }

  get rangeStart(): number {
    return this.total ? (this.query.page - 1) * this.query.pageSize + 1 : 0;
  }

  get rangeEnd(): number {
    return Math.min(this.query.page * this.query.pageSize, this.total);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.pageCount && page !== this.query.page) {
      this.emitQuery({ page });
    }
  }

  setPageSize(size: string): void {
    this.emitQuery({ pageSize: Number(size), page: 1 });
  }

  private emitQuery(patch: Partial<TableQuery>): void {
    this.queryChange.emit({ ...this.query, ...patch });
  }

  // ── Layout ────────────────────────────────────────────────────────────────

  private collectTemplates(): void {
    this.cellTemplates = new Map(this.cellDirectives.map(dir => [dir.dtCell, dir.template]));
    this.filterTemplates = new Map(this.filterDirectives.map(dir => [dir.dtFilter, dir.template]));
    this.computeLayout();
    this.cdr.markForCheck();
  }

  private computeLayout(): void {
    this.hasFilterRow = this.columns.some(col => !!col.filter) || this.filterTemplates.size > 0;

    const leadPx = this.leadColumn ? LEAD_COLUMN_PX : 0;
    const fixed = this.columns.map(col => fixedWidthPx(col.width));

    let totalFixed = leadPx + (this.hasFilterRow ? APPLY_COLUMN_PX : 0);
    let totalWeight = 0;
    let fillCount = 0;
    this.columns.forEach((col, i) => {
      const px = fixed[i];
      if (px != null) {
        totalFixed += px;
      } else {
        totalWeight += fillWeight(col.width);
        fillCount++;
      }
    });

    // `table-layout: fixed` makes these authoritative, so widths survive scrolling.
    this.columnWidths = this.columns.map((col, i) => {
      const px = fixed[i];
      if (px != null) {
        return `${px}px`;
      }
      const share = fillWeight(col.width) / totalWeight;
      return `calc((100% - ${totalFixed}px) * ${share.toFixed(4)})`;
    });

    // Past this the container scrolls rather than squeezing fill columns.
    this.minTableWidth = totalFixed + fillCount * FILL_MIN_PX;

    // Each sticky column pins at the summed width of the pinned columns before it.
    let left = leadPx;
    this.stickyLeft = this.columns.map((col, i) => {
      const px = fixed[i];
      if (!col.sticky || px == null) {
        return null;
      }
      const offset = left;
      left += px;
      return offset;
    });
    this.hasStickyColumns = this.stickyLeft.some(offset => offset != null);
  }
}
