import { Component, computed, input } from '@angular/core';
import { DataTableCellDirective } from '../../shared/data-table/data-table-cell.directive';
import { DataTableColumn, DataTableComponent } from '../../shared/data-table/data-table';
import { SelectComponent, SelectOption } from '../../shared/select/select';
import { TextFieldComponent } from '../../shared/text-field/text-field';
import { TextareaComponent } from '../../shared/textarea/textarea';

type AngebotRow = Record<string, string>;
type Participant = {
  name: string;
  konto: string;
  bic: string;
  pc: string;
  bezeichnung: string;
  hasName: boolean;
};

@Component({
  selector: 'app-angebot-detail',
  imports: [
    DataTableComponent,
    DataTableCellDirective,
    SelectComponent,
    TextFieldComponent,
    TextareaComponent,
  ],
  templateUrl: './angebot-detail.html',
})
export class AngebotDetailComponent {
  readonly value = input<AngebotRow | null>(null);
  readonly readonly = input(true);
  readonly bereichOptions = input<readonly SelectOption[] | null>(null);
  protected readonly bereichs = [
    { value: '10010001', label: '10010001' },
    { value: '10010002', label: '10010002' },
    { value: '10010003', label: '10010003' },
    { value: '10020001', label: '10020001' },
  ];
  protected readonly businessTypes = [
    { value: 'Workshop', label: 'Workshop' },
    { value: 'Ausstellung', label: 'Ausstellung' },
  ];
  protected readonly securities = [
    { value: 'Präsenz', label: 'Präsenz' },
    { value: 'Online', label: 'Online' },
  ];
  protected readonly countries = [
    { value: 'DE', label: 'Deutschland' },
    { value: 'LU', label: 'Luxemburg' },
    { value: 'US', label: 'USA' },
  ];
  protected readonly columns: DataTableColumn<Participant>[] = [
    { key: 'name', header: '', value: (row) => row.name },
    { key: 'konto', header: 'Kontakt-ID', value: (row) => row.konto },
    { key: 'bic', header: 'Kontaktcode', value: (row) => row.bic },
    { key: 'pc', header: 'PC', value: (row) => row.pc },
    { key: 'bezeichnung', header: 'Name', value: (row) => row.bezeichnung },
  ];
  protected readonly participants = computed<Participant[]>(() => [
    {
      name: 'Ansprechperson',
      konto: this.value()?.['konto'] || '',
      bic: this.value()?.['agentBic'] || '',
      pc: '',
      bezeichnung: '',
      hasName: false,
    },
    {
      name: 'Organisationsteam',
      konto: '',
      bic: '',
      pc: '',
      bezeichnung: '',
      hasName: true,
    },
    {
      name: 'Veranstaltungsteam',
      konto: '',
      bic: this.value()?.['bic'] || '',
      pc: '',
      bezeichnung: '',
      hasName: true,
    },
    {
      name: 'Technikpartner',
      konto: '',
      bic: '',
      pc: '',
      bezeichnung: '',
      hasName: true,
    },
    {
      name: 'Servicepartner',
      konto: '',
      bic: '',
      pc: '',
      bezeichnung: '',
      hasName: true,
    },
  ]);
}
