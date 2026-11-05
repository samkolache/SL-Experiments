import { Component, ChangeDetectionStrategy, input, viewChild } from '@angular/core';
import { HelpModalComponent } from '../help-modal/help-modal';
import { StepIconHeaderComponent, StepIconItem } from '../step-icon-header/step-icon-header';

// UI-only copy of VOB's MilestoneSidebarComponent on the Products & Fees route.
// Step navigation, Progress Dashboard and Logout do nothing here.
@Component({
    selector: 'app-milestone-sidebar',
    standalone: true,
    imports: [HelpModalComponent, StepIconHeaderComponent],
    templateUrl: './milestone-sidebar.html',
    styleUrl: './milestone-sidebar.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MilestoneSidebarComponent {
    readonly steps = input.required<StepIconItem[]>();
    readonly activeIndex = input(0);

    protected readonly helpModal = viewChild.required(HelpModalComponent);

    onHelpClick(): void {
        this.helpModal().open();
    }
}
