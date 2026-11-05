/**
 * The optional first column, ahead of every configured column.
 *  - 'checkbox' — row selection, plus a select-all box in the header
 *  - 'drag'     — a drag handle (visual only, nothing is wired to it)
 *  - 'chevron'  — expands a row to show the `dtDetailRow` template
 */
export type LeadColumnKind = 'checkbox' | 'drag' | 'chevron';

/** Lead column width in px: a 16px control plus 12px cell padding either side. */
export const LEAD_COLUMN_PX = 40;

/** Width of the trailing apply-filters column, in px. */
export const APPLY_COLUMN_PX = 56;

/** Named column widths, so tables share one scale instead of ad-hoc px. */
export type WidthToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export const WIDTH_TOKEN_PX: Record<WidthToken, number> = {
  xs: 64,
  sm: 96,
  md: 144,
  lg: 192,
  xl: 256,
  xxl: 320
};

/** Narrowest a fill column gets before the table scrolls horizontally. */
export const FILL_MIN_PX = 120;

/**
 *  - a token or a number — fixed width (a number is px)
 *  - 'fill'              — shares the leftover width with other fill columns
 *  - `{ fill: n }`       — shares the leftover width, weighted by n
 *
 * Defaults to 'fill'.
 */
export type ColumnWidth = WidthToken | number | 'fill' | { fill: number };

export interface SelectOption {
  label: string;
  value: string;
}

/** 'text' for a search box, or a list of options for a select. */
export type ColumnFilter = 'text' | { options: SelectOption[]; allLabel?: string };

export interface TableColumn {
  id: string;
  header: string;

  /** Property path to display, e.g. 'customer.name'. Defaults to `id`. */
  field?: string;

  width?: ColumnWidth;
  align?: 'left' | 'center' | 'right';

  /** One line with an ellipsis. Cells wrap by default. */
  truncate?: boolean;

  /** Shows the sort caret in the header. */
  sortable?: boolean;

  /** What the server sorts on, when it differs from `field`. */
  sortKey?: string;

  /** Shows a filter control under the header. A `dtFilter` template also adds one. */
  filter?: ColumnFilter;

  /** Property name on the filters object. Defaults to `field`, then `id`. */
  filterKey?: string;

  /**
   * Pins the column to the left while scrolling horizontally. Needs a fixed
   * width, and sticky columns should come first.
   */
  sticky?: boolean;
}

export type SortDirection = 'asc' | 'desc';

/** Everything the server needs to fetch a page. Emitted by the table as one event. */
export interface TableQuery {
  sort: { key: string; direction: SortDirection } | null;
  filters: Record<string, unknown>;
  page: number;
  pageSize: number;
}

export const DEFAULT_TABLE_QUERY: TableQuery = { sort: null, filters: {}, page: 1, pageSize: 50 };

export function fixedWidthPx(width: ColumnWidth | undefined): number | null {
  if (typeof width === 'number') {
    return width;
  }
  if (typeof width === 'string' && width !== 'fill') {
    return WIDTH_TOKEN_PX[width];
  }
  return null;
}

export function fillWeight(width: ColumnWidth | undefined): number {
  return width && typeof width === 'object' ? width.fill : 1;
}

export function resolveField(row: any, path: string): any {
  if (!row || !path) {
    return null;
  }
  return path
    .split('.')
    .reduce((value, key) => (value == null ? value : value[key]), row);
}
