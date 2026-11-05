import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  template: `
    <button class="btn btn-secondary mt-2" (click)="theme.toggle()">
      Theme: {{ theme.active() }} — click to switch
    </button>
  `,
})
export class ThemeSwitcherComponent {
  theme = inject(ThemeService);
}
