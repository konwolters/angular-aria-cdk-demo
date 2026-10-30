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
  template: `
    <div class="overflow-x-auto rounded-control border border-border">
      <table class="w-full text-left text-sm">
        <caption class="sr-only">
          {{
            caption()
          }}
        </caption>
        <thead class="bg-canvas text-xs text-content-muted">
          <tr>
            <th scope="col" class="px-4 py-3 font-medium">Feld</th>
            <th scope="col" class="px-4 py-3 font-medium">{{ beforeLabel() }}</th>
            <th scope="col" class="px-4 py-3 font-medium">{{ afterLabel() }}</th>
            <th scope="col" class="px-4 py-3 font-medium">Änderung</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          @for (entry of entries(); track entry.key) {
            <tr>
              <th scope="row" class="px-4 py-4 font-medium">{{ entry.label }}</th>
              <td class="px-4 py-4 text-content-muted">{{ entry.before ?? '—' }}</td>
              <td class="px-4 py-4 text-content-secondary">{{ entry.after ?? '—' }}</td>
              <td class="px-4 py-4">
                <span
                  class="inline-flex whitespace-nowrap rounded-control bg-canvas px-2 py-1 text-xs font-medium"
                  >{{ status(entry) }}</span
                >
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="4" class="px-4 py-8 text-center text-content-muted">
                Keine Vergleichswerte vorhanden.
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
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
