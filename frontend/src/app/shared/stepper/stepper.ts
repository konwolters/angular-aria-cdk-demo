import { Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon';

export interface StepItem {
  value: string;
  label: string;
}

/** A progress indicator, not a workflow engine: callers own validation and navigation. */
@Component({
  selector: 'app-stepper',
  host: { class: 'block' },
  imports: [IconComponent],
  templateUrl: './stepper.html',
})
export class StepperComponent {
  readonly steps = input.required<readonly StepItem[]>();
  readonly current = input.required<string>();
  readonly completed = input<readonly string[]>([]);
  readonly label = input('Fortschritt');
}
