import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HelpModalComponent } from '../help-modal/help-modal';
import { StepIconHeaderComponent, StepIconItem } from '../step-icon-header/step-icon-header';

// UI-only copy of VOB's MilestoneHeaderComponent, fixed to the Products & Fees
// route (stepper visible, no nav tabs, not the progress screen). Navigation,
// progress fetching and logout are intentionally left out.
@Component({
    selector: 'app-milestone-header',
    standalone: true,
    imports: [NgOptimizedImage, HelpModalComponent, StepIconHeaderComponent],
    templateUrl: './milestone-header.html',
    styleUrl: './milestone-header.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MilestoneHeaderComponent {
    readonly steps = input.required<StepIconItem[]>();
    readonly activeIndex = input(0);

    protected readonly mobileStepsOpen = signal(false);
    protected readonly mobileMenuOpen = signal(false);

    toggleMobileSteps(): void {
        this.mobileStepsOpen.update(open => !open);
        // Only one dropdown panel at a time — they share the same anchor area.
        if (this.mobileStepsOpen()) {
            this.mobileMenuOpen.set(false);
        }
    }

    onMobileStepClick(): void {
        this.mobileStepsOpen.set(false);
    }

    onProgressStepClick(_index: number): void {
        // Navigation only in the real app.
    }

    toggleMobileMenu(): void {
        this.mobileMenuOpen.update(open => !open);
        if (this.mobileMenuOpen()) {
            this.mobileStepsOpen.set(false);
        }
    }

    onMobileMenuHelp(helpModal: HelpModalComponent): void {
        this.mobileMenuOpen.set(false);
        helpModal.open();
    }

    closeMobileMenu(): void {
        this.mobileMenuOpen.set(false);
    }
}
