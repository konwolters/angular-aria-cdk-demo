import { CdkTrapFocus } from '@angular/cdk/a11y';
import { Component, input, model } from '@angular/core';
import { ButtonComponent } from '../button/button';

@Component({
  selector: 'app-side-drawer',
  imports: [ButtonComponent, CdkTrapFocus],
  templateUrl: './side-drawer.html',
  host: {
    '(document:keydown.escape)': 'closeOnEscape()',
  },
})
export class SideDrawerComponent {
  readonly open = model(false);
  readonly title = input.required<string>();

  close(): void {
    this.open.set(false);
  }

  closeOnEscape(): void {
    if (this.open()) this.close();
  }
}
