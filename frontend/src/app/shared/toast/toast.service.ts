import { Injectable, signal } from '@angular/core';

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
