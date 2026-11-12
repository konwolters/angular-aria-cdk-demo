import { Component, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/button/button';
import { DataTableToolbarComponent } from '../../../shared/data-table-toolbar/data-table-toolbar';
import { DataTableComponent } from '../../../shared/data-table/data-table';
import { DataTableCellDirective } from '../../../shared/data-table/data-table-cell.directive';
import { TextFieldComponent } from '../../../shared/text-field/text-field';
import { MultiSelectComponent } from '../../../shared/multi-select/multi-select';
import { GuiPaginationService } from '../../gui-pagination.service';
import { GuiSessionService } from '../../daten/gui-session.service';
import { GuiRow } from '../../daten/gui-modelle';
import { SucheService } from '../../suche/suche.service';
import { REQUEST_COLUMNS } from '../../daten/gui-spalten';

@Component({
  selector: 'app-antrag-suche',
  imports: [
    ButtonComponent,
    FormField,
    DataTableToolbarComponent,
    DataTableComponent,
    DataTableCellDirective,
    TextFieldComponent,
    MultiSelectComponent,
  ],
  templateUrl: './antrag-suche.html',
})
export class AntragSuche {
  protected readonly state = inject(SucheService);
  protected readonly session = inject(GuiSessionService);
  protected readonly pagination = inject(GuiPaginationService);
  protected readonly router = inject(Router);
  protected readonly queryForm = form(this.state.query);
  protected readonly customerNumberForm = form(this.session.customerNumber);
  protected readonly rows = this.state.rows;
  protected apply(): void {
    this.state.appliedQuery.set(this.state.query());
  }
  protected reset(): void {
    this.state.query.set('');
    this.state.appliedQuery.set('');
    this.session.status.set('aktiv');
  }
  protected readonly extraModel = signal({ bereichnummer: '', umfang: [] as string[] });
  protected readonly extraForm = form(this.extraModel);
  protected readonly columns = REQUEST_COLUMNS;
  protected readonly referenceTypesForm = form(this.state.referenceTypes);
  protected openAntrag(row: GuiRow): void {
    this.state.query.set('');
    this.state.appliedQuery.set('');
    void this.router.navigate(['/gui/staging', row['id']]);
  }
  constructor() {
    this.state.page.set('staging');
  }
}
