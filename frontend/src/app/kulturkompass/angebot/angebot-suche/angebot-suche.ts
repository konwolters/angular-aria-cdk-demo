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
import { ANGEBOT_SEARCH_COLUMNS } from '../../daten/gui-spalten';
import { GuiDialogService } from '../../daten/gui-dialog.service';
import { StagingService } from '../../antrag/staging.service';

@Component({
  selector: 'app-angebot-suche',
  imports: [
    ButtonComponent,
    FormField,
    DataTableToolbarComponent,
    DataTableComponent,
    DataTableCellDirective,
    TextFieldComponent,
    MultiSelectComponent,
  ],
  templateUrl: './angebot-suche.html',
})
export class AngebotSuche {
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

  protected readonly extraModel = signal({
    registerkennung: '',
    bereichnummer: '',
    format: [] as string[],
    code: '',
    ansprechcode: '',
    ansprechid: '',
    teamcode: '',
    zusatzinfo: '',
  });
  protected readonly extraForm = form(this.extraModel);
  protected readonly columns = ANGEBOT_SEARCH_COLUMNS;
  protected readonly countriesForm = form(this.state.countries);
  protected readonly businessTypesForm = form(this.state.businessTypes);
  private readonly dialog = inject(GuiDialogService);
  private readonly staging = inject(StagingService);

  protected openDetails(row: GuiRow): void {
    this.dialog.openDrawer('angebot', 'Angebotsdetail', row, false);
  }

  protected openRequest(row: GuiRow): void {
    const request = this.staging.findForRow(row, 'Angebote');

    if (request) {
      this.state.query.set('');
      this.state.appliedQuery.set('');
      void this.router.navigate(['/gui/staging', request['id']]);
    }
  }

  constructor() {
    this.state.page.set('angebot');
  }
}
