import { signal } from '@angular/core';

interface PageState {
  page: number;
  size: number;
}

/** Local presentation state only; the data remains owned by the page. */
export class GuiPagination {
  private readonly states = signal<Record<string, PageState>>({});

  size(key: string): number {
    return this.states()[key]?.size ?? 8;
  }
  totalPages(key: string, rows: readonly unknown[]): number {
    return Math.ceil(rows.length / this.size(key));
  }
  page(key: string, rows: readonly unknown[]): number {
    return Math.min(this.states()[key]?.page ?? 0, Math.max(0, this.totalPages(key, rows) - 1));
  }
  rows<T>(key: string, rows: readonly T[]): readonly T[] {
    const start = this.page(key, rows) * this.size(key);
    return rows.slice(start, start + this.size(key));
  }
  setPage(key: string, page: number): void {
    this.states.update((states) => ({ ...states, [key]: { page, size: this.size(key) } }));
  }
  setSize(key: string, size: number): void {
    this.states.update((states) => ({ ...states, [key]: { page: 0, size } }));
  }
}
