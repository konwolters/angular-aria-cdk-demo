import { Component, inject, Injectable, signal } from '@angular/core';
import { ButtonComponent } from '../button/button';
import { IconComponent } from '../icon/icon';

export interface ToastMessage {
  id: number;
  text: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  private readonly items = signal<readonly ToastMessage[]>([]);
  readonly messages = this.items.asReadonly();

  /** Explicit dismissal keeps confirmations available to keyboard and screen reader users. */
  show(text: string): number {
    const id = this.nextId++;
    this.items.update((items) => [...items, { id, text }]);
    return id;
  }
  dismiss(id: number): void {
    this.items.update((items) => items.filter((item) => item.id !== id));
  }
}

@Component({
  selector: 'app-toast-outlet',
  imports: [ButtonComponent, IconComponent],
  template: `
    <div
      aria-live="polite"
      aria-relevant="additions"
      class="pointer-events-none fixed inset-x-4 bottom-5 z-[1100] flex flex-col items-end gap-3 sm:left-auto sm:right-6 sm:w-96"
    >
      @for (message of toasts.messages(); track message.id) {
        <div
          class="pointer-events-auto flex w-full items-start gap-3 rounded-card border border-border bg-surface p-4 shadow-lg"
        >
          <span
            aria-hidden="true"
            class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-subtle text-brand-strong"
            ><app-icon name="check" [size]="18"
          /></span>
          <div class="min-w-0 flex-1 pt-0.5">
            <p class="text-sm font-semibold text-content">Benachrichtigung</p>
            <p class="mt-1 break-words text-sm leading-relaxed text-content-secondary">
              {{ message.text }}
            </p>
          </div>
          <button
            appButton
            type="button"
            variant="ghost"
            size="small"
            icon="close"
            (click)="toasts.dismiss(message.id)"
            [attr.aria-label]="'Meldung schließen: ' + message.text"
          ></button>
        </div>
      }
    </div>
  `,
})
export class ToastOutletComponent {
  protected readonly toasts = inject(ToastService);
}
