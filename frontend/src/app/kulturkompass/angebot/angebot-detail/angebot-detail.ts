import {
  applyEach,
  form,
  FormField,
  maxLength,
  readonly as readonlyField,
  required,
} from '@angular/forms/signals';
import { Component, computed, input, linkedSignal, model, output } from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button';
import { DataTableCellDirective } from '../../../shared/data-table/data-table-cell.directive';
import { DataTableColumn, DataTableComponent } from '../../../shared/data-table/data-table';
import { SelectComponent, SelectOption } from '../../../shared/select/select';
import { TextFieldComponent } from '../../../shared/text-field/text-field';
import { TextareaComponent } from '../../../shared/textarea/textarea';
import { SideDrawerComponent } from '../../../shared/side-drawer/side-drawer';

type AngebotRow = Record<string, string>;
type Participant = {
  name: string;
  konto: string;
  bic: string;
  pc: string;
  bezeichnung: string;
  hasName: boolean;
  index: number;
};

@Component({
  selector: 'app-angebot-detail',
  imports: [
    ButtonComponent,
    FormField,
    DataTableComponent,
    DataTableCellDirective,
    SelectComponent,
    TextFieldComponent,
    TextareaComponent,
    SideDrawerComponent,
  ],
  templateUrl: './angebot-detail.html',
})
export class AngebotDetail {
  readonly open = model(false);
  readonly title = input.required<string>();
  readonly value = input<AngebotRow | null>(null);
  readonly editing = input(false);
  readonly accept = output<void>();
  protected readonly readonly = computed(() => !this.editing());
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
    { key: 'name', header: '', width: '28%', value: (row) => row.name },
    { key: 'konto', header: 'Kontakt-ID', width: '18%', value: (row) => row.konto },
    { key: 'bic', header: 'Kontaktcode', width: '18%', value: (row) => row.bic },
    { key: 'pc', header: 'PC', width: '18%', value: (row) => row.pc },
    { key: 'bezeichnung', header: 'Name', width: '18%', value: (row) => row.bezeichnung },
  ];
  protected readonly angebotModel = linkedSignal(() => {
    const value = this.value();
    this.open();
    return {
      bereichnummer: value?.['bereichnummer'] || '',
      geschaeft: value?.['geschaeft'] || '',
      wertpapier: value?.['wertpapier'] || '',
      isin: value?.['isin'] || '',
      land: value?.['land'] || '',
      psetBic: value?.['psetBic'] || '',
      zusatzinfo: value?.['zusatzinfo'] || '',
      participants: [
        {
          index: 0,
          name: 'Ansprechperson',
          konto: value?.['konto'] || '',
          bic: value?.['agentBic'] || '',
          pc: '',
          bezeichnung: '',
          hasName: false,
        },
        {
          index: 1,
          name: 'Organisationsteam',
          konto: '',
          bic: '',
          pc: '',
          bezeichnung: '',
          hasName: true,
        },
        {
          index: 2,
          name: 'Veranstaltungsteam',
          konto: '',
          bic: value?.['bic'] || '',
          pc: '',
          bezeichnung: '',
          hasName: true,
        },
        {
          index: 3,
          name: 'Technikpartner',
          konto: '',
          bic: '',
          pc: '',
          bezeichnung: '',
          hasName: true,
        },
        {
          index: 4,
          name: 'Servicepartner',
          konto: '',
          bic: '',
          pc: '',
          bezeichnung: '',
          hasName: true,
        },
      ],
    };
  });
  protected readonly angebotForm = form(this.angebotModel, (path) => {
    readonlyField(path, { when: () => this.readonly() });
    required(path.bereichnummer);
    required(path.geschaeft);
    required(path.wertpapier);
    required(path.land);
    maxLength(path.isin, 12);
    maxLength(path.psetBic, 11);
    maxLength(path.zusatzinfo, 255);
    applyEach(path.participants, (participant) => {
      maxLength(participant.konto, 35);
      maxLength(participant.bic, 11);
      maxLength(participant.pc, 34);
      maxLength(participant.bezeichnung, 35);
    });
  });
  protected readonly participants = computed(() => this.angebotModel().participants);
}
