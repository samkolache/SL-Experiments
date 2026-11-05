import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

/**
 * Full-page viewer for a self-contained HTML build report.
 * The report path comes from route data (`reportSrc`) and is resolved against
 * the app's base href, e.g. `reports/mcp/products-pricing-card-report.html`.
 * The files are copied into the build output by the `reports` asset entry in
 * angular.json.
 */
@Component({
  selector: 'app-report-viewer',
  standalone: true,
  template: `<iframe class="report-frame" [src]="src" [title]="title"></iframe>`,
  styles: `
    :host { display: block; position: fixed; inset: 0; }
    .report-frame { width: 100%; height: 100%; border: 0; display: block; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportViewerComponent {
  private readonly data = inject(ActivatedRoute).snapshot.data;

  readonly src = inject(DomSanitizer).bypassSecurityTrustResourceUrl(this.data['reportSrc']);
  readonly title: string = this.data['reportTitle'] ?? 'Build report';
}
