import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

export interface StepIconItem {
    // Icon-font glyph / glyph-stylesheet class. Ignored when img is set.
    icon?: string;
    // Base name of an SVG pair in assets/images/step-icons — rendered as
    // <img src=".../<img>.svg">, or <img>-selected.svg when the step is active.
    img?: string;
    label: string;
    isFilled?: boolean;
}

export type StepIconOrientation = 'horizontal' | 'vertical';

@Component({
    selector: 'app-step-icon-header',
    imports: [],
    templateUrl: './step-icon-header.html',
    styleUrl: './step-icon-header.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.step-icon-header--vertical]': "orientation() === 'vertical'",
    },
})
export class StepIconHeaderComponent {
    readonly steps = input.required<StepIconItem[]>();
    readonly activeIndex = input(0);
    readonly orientation = input<StepIconOrientation>('horizontal');

    readonly stepClick = output<number>();
}
