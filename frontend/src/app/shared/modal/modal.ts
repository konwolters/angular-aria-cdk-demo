import { CdkTrapFocus } from '@angular/cdk/a11y';
import { Component, input, model } from '@angular/core';
import { ButtonComponent } from '../button/button';

@Component({
  selector: 'app-modal',
  imports: [ButtonComponent, CdkTrapFocus],
  templateUrl: './modal.html',
  host: {
    '(document:keydown.escape)': 'closeOnEscape()',
  },
})
export class ModalComponent {
  readonly open = model(false);
  readonly title = input.required<string>();

  close(): void {
    this.open.set(false);
  }

  closeOnEscape(): void {
    if (this.open()) this.close();
  }
}
