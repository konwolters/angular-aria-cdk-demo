import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button';
import { DialogModule } from '@angular/cdk/dialog';
import { DialogBase } from '../dialog/dialog-base';

@Component({
  selector: 'app-modal',
  imports: [ButtonComponent, DialogModule],
  templateUrl: './modal.html',
})
export class ModalComponent extends DialogBase {
  protected readonly drawer = false;
}
