import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../button/button';
import { IconComponent } from '../icon/icon';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast-outlet',
  imports: [ButtonComponent, IconComponent],
  templateUrl: './toast.html',
})
export class ToastOutletComponent {
  protected readonly toasts = inject(ToastService);
}
