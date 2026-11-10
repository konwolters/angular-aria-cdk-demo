import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ControlIdService {
  private nextId = 0;

  next(): string {
    return `app-control-${this.nextId++}`;
  }
}
