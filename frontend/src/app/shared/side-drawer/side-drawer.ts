import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button';
import { DialogModule } from '@angular/cdk/dialog';
import { DialogBase } from '../dialog/dialog-base';

@Component({
  selector: 'app-side-drawer',
  imports: [ButtonComponent, DialogModule],
  templateUrl: './side-drawer.html',
})
export class SideDrawerComponent extends DialogBase {
  protected readonly drawer = true;
}
