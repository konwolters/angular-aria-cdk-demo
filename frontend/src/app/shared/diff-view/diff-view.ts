import { Component, input } from '@angular/core';

export interface DiffEntry {
  key: string;
  label: string;
  before: string | null;
  after: string | null;
  changed?: boolean;
}

@Component({
  selector: 'app-diff-view',
  templateUrl: './diff-view.html',
})
export class DiffViewComponent {
  readonly entries = input.required<readonly DiffEntry[]>();
  readonly caption = input('Wertvergleich');
  readonly beforeLabel = input('Aktueller Stand');
  readonly afterLabel = input('Beantragter Stand');
  protected status(entry: DiffEntry): string {
    if (!(entry.changed ?? entry.before !== entry.after)) return 'Unverändert';
    return entry.before === null ? 'Neu' : entry.after === null ? 'Entfernt' : 'Geändert';
  }
}
