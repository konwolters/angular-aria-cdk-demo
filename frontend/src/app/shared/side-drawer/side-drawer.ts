import { Component, input } from '@angular/core';
import { ButtonComponent } from '../button/button';
import { DialogModule } from '@angular/cdk/dialog';
import { DialogBase } from '../dialog/dialog-base';

@Component({
  selector: 'app-side-drawer',
  imports: [ButtonComponent, DialogModule],
  templateUrl: './side-drawer.html',
})
export class SideDrawerComponent extends DialogBase {
  readonly width = input('48rem');
  protected readonly drawer = true;

  protected override dialogWidth(): string {
    return `min(100vw, ${this.width()})`;
  }
}
