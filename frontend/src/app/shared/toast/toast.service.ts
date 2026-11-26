import { DestroyRef, Injectable, inject, signal } from '@angular/core';

const DEFAULT_DURATION_MS = 3_000;
const MAX_TIMEOUT_MS = 2_147_483_647;

export interface ToastMessage {
  id: number;
  text: string;
}

export interface ToastOptions {
  autoClose?: boolean;
  durationMs?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly destroyRef = inject(DestroyRef);

  private nextId = 0;
  private readonly items = signal<readonly ToastMessage[]>([]);
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();
  readonly messages = this.items.asReadonly();

  constructor() {
    this.destroyRef.onDestroy(() => {
      for (const timer of this.timers.values()) clearTimeout(timer);
      this.timers.clear();
    });
  }

  show(
    text: string,
    { autoClose = true, durationMs = DEFAULT_DURATION_MS }: ToastOptions = {},
  ): number {
    const id = this.nextId++;
    this.items.update((items) => [...items, { id, text }]);
    if (autoClose) {
      const delay =
        Number.isFinite(durationMs) && durationMs >= 1 && durationMs <= MAX_TIMEOUT_MS
          ? durationMs
          : DEFAULT_DURATION_MS;
      this.timers.set(
        id,
        setTimeout(() => this.dismiss(id), delay),
      );
    }
    return id;
  }

  dismiss(id: number): void {
    const timer = this.timers.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this.items.update((items) => items.filter((item) => item.id !== id));
  }
}
