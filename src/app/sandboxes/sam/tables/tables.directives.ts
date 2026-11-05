import { Directive, Input, TemplateRef, inject } from '@angular/core';
import { TableColumn } from './tables.model';

export interface DtCellContext {
  $implicit: any;
  index: number;
  column: TableColumn;
}

export interface DtFilterContext {
  /** The filters being edited, not yet applied. */
  $implicit: Record<string, unknown>;
  set: (key: string, value: unknown) => void;
  apply: () => void;
  /** Put these on your control — `label` as its aria-label. */
  id: string;
  label: string;
}

export interface DtDetailRowContext {
  $implicit: any;
  index: number;
}

export interface DtApplyButtonContext {
  $implicit: () => void;
  id: string;
}

/** Replaces the body cells of one column: `<ng-template dtCell="columnId" let-row>`. */
@Directive({ selector: 'ng-template[dtCell]', standalone: true })
export class DtCellDirective {
  @Input({ required: true }) dtCell!: string;
  readonly template = inject<TemplateRef<DtCellContext>>(TemplateRef);

  static ngTemplateContextGuard(_dir: DtCellDirective, ctx: unknown): ctx is DtCellContext {
    return true;
  }
}

/** A custom filter control: `<ng-template dtFilter="columnId" let-filters let-set="set">`. */
@Directive({ selector: 'ng-template[dtFilter]', standalone: true })
export class DtFilterDirective {
  @Input({ required: true }) dtFilter!: string;
  readonly template = inject<TemplateRef<DtFilterContext>>(TemplateRef);

  static ngTemplateContextGuard(_dir: DtFilterDirective, ctx: unknown): ctx is DtFilterContext {
    return true;
  }
}

/** Content shown under an expanded row, for `leadColumn="chevron"`. */
@Directive({ selector: 'ng-template[dtDetailRow]', standalone: true })
export class DtDetailRowDirective {
  readonly template = inject<TemplateRef<DtDetailRowContext>>(TemplateRef);

  static ngTemplateContextGuard(_dir: DtDetailRowDirective, ctx: unknown): ctx is DtDetailRowContext {
    return true;
  }
}

/** Replaces the default apply-filters button: `<ng-template dtApplyButton let-apply>`. */
@Directive({ selector: 'ng-template[dtApplyButton]', standalone: true })
export class DtApplyButtonDirective {
  readonly template = inject<TemplateRef<DtApplyButtonContext>>(TemplateRef);

  static ngTemplateContextGuard(_dir: DtApplyButtonDirective, ctx: unknown): ctx is DtApplyButtonContext {
    return true;
  }
}

/** Marks content for the toolbar's right side: `<button dtActions>`. */
@Directive({ selector: '[dtActions]', standalone: true })
export class DtActionsDirective {}

export const DT_DIRECTIVES = [
  DtCellDirective,
  DtFilterDirective,
  DtDetailRowDirective,
  DtApplyButtonDirective,
  DtActionsDirective
] as const;
