import { ChangeDetectionStrategy, Component, DOCUMENT, ElementRef, ViewChild, inject, signal } from '@angular/core';

// Bootstrap's JS bundle isn't loaded in the prototypes app, so this replicates
// what `new bootstrap.Modal(el, { backdrop: false }).show()/hide()` does to the
// DOM: display:block, then `.show` on the next frame so the fade transition runs.
const FADE_MS = 150;

@Component({
  selector: 'app-help-modal',
  standalone: true,
  templateUrl: './help-modal.html',
  styleUrl: './help-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpModalComponent {
  @ViewChild('helpModal') modalRef!: ElementRef<HTMLElement>;

  protected readonly displayed = signal(false);
  protected readonly shown = signal(false);
  private hideTimer?: ReturnType<typeof setTimeout>;
  private readonly doc = inject(DOCUMENT);

  open(): void {
    clearTimeout(this.hideTimer);
    this.displayed.set(true);
    this.lockBodyScroll(true);
    requestAnimationFrame(() => {
      this.shown.set(true);
      this.modalRef?.nativeElement.focus();
    });
  }

  close(): void {
    if (!this.displayed()) {
      return;
    }
    this.shown.set(false);
    this.hideTimer = setTimeout(() => {
      this.displayed.set(false);
      this.lockBodyScroll(false);
    }, FADE_MS);
  }

  // Mirrors Bootstrap's ScrollBarHelper: hide body overflow and pad for the scrollbar.
  private lockBodyScroll(lock: boolean): void {
    const body = this.doc.body;
    if (lock) {
      const scrollbarWidth = Math.abs(window.innerWidth - this.doc.documentElement.clientWidth);
      body.classList.add('modal-open');
      body.style.overflow = 'hidden';
      body.style.paddingRight = scrollbarWidth ? `${scrollbarWidth}px` : '';
    } else {
      body.classList.remove('modal-open');
      body.style.overflow = '';
      body.style.paddingRight = '';
    }
  }
}
