import { form, FormField, readonly as readonlyField, required } from '@angular/forms/signals';
import { Component, input, linkedSignal, model, untracked } from '@angular/core';
import { SelectComponent } from '../../../shared/select/select';
import { TextFieldComponent } from '../../../shared/text-field/text-field';

type Row = Record<string, string>;

@Component({
  selector: 'app-veranstaltungsort-stammdaten',
  imports: [TextFieldComponent, SelectComponent, FormField],
  templateUrl: './veranstaltungsort-stammdaten.html',
})
export class VeranstaltungsortStammdaten {
  readonly selected = input<Row | null>(null);
  readonly historical = input<Row | null>(null);
  readonly previousLabel = input('');
  readonly editing = input(false);
  readonly editScope = input<'veranstaltungsort' | 'angebot'>('veranstaltungsort');
  readonly statuses = input.required<readonly { value: string; label: string }[]>();
  readonly name = model('');
  readonly customerNumber = model('');
  readonly status = model('aktiv');

  protected readonly stammdatenModel = linkedSignal(() => ({
    name: this.editing() ? untracked(this.name) : this.historyValue('name'),
    kundennummer: this.editing()
      ? untracked(this.customerNumber)
      : this.historyValue('kundennummer'),
    alertId: this.historyValue('alertId'),
    akronym: this.historyValue('akronym'),
    lei: this.historyValue('lei'),
    status: untracked(this.status),
  }));
  protected readonly stammdatenForm = form(this.stammdatenModel, (path) => {
    readonlyField(path, { when: () => !this.editing() || this.editScope() === 'angebot' });
    required(path.name);
    required(path.kundennummer);
    required(path.status);
  });

  protected historyValue(field: string): string {
    const value = this.selected()?.[field] || '';
    const version = this.historical()?.['version'];

    if (
      (field === 'alertId' && (version === '1' || version === '2')) ||
      (field === 'akronym' && version === '1')
    )
      return value ? `${value}-ALT` : '';

    return value;
  }

  protected historyChanged(field: string): boolean {
    return this.historical()?.['changedField'] === field;
  }

  protected historyPreviousValue(field: string): string | undefined {
    if (!this.historical()) return undefined;

    const value = this.historyValue(field);
    return this.historyChanged(field) && value ? `${value}-ALT` : value;
  }

  protected historyPreviousLabel(): string {
    return `Version ${Number(this.historical()?.['version'] ?? 1) - 1}`;
  }
}
