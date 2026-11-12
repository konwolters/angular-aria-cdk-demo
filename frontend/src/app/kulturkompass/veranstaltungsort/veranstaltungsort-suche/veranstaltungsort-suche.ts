import { Component, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/button/button';
import { DataTableToolbarComponent } from '../../../shared/data-table-toolbar/data-table-toolbar';
import { DataTableComponent } from '../../../shared/data-table/data-table';
import { DataTableCellDirective } from '../../../shared/data-table/data-table-cell.directive';
import { TextFieldComponent } from '../../../shared/text-field/text-field';
import { SelectComponent } from '../../../shared/select/select';
import { GuiPaginationService } from '../../gui-pagination.service';
import { GuiSessionService } from '../../daten/gui-session.service';
import { GuiRow } from '../../daten/gui-modelle';
import { SucheService } from '../../suche/suche.service';
import { CUSTOMER_COLUMNS } from '../../daten/gui-spalten';
import { GUI_STATUSES } from '../../daten/gui-status';
import { StagingService } from '../../antrag/staging.service';
import { VeranstaltungsortService } from '../veranstaltungsort.service';

@Component({
  selector: 'app-veranstaltungsort-suche',
  imports: [
    ButtonComponent,
    FormField,
    DataTableToolbarComponent,
    DataTableComponent,
    DataTableCellDirective,
    TextFieldComponent,
    SelectComponent,
    RouterLink,
  ],
  templateUrl: './veranstaltungsort-suche.html',
})
export class VeranstaltungsortSuche {
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
    standortId: '',
    standortkuerzel: '',
  });
  protected readonly extraForm = form(this.extraModel);
  protected readonly statuses = () => GUI_STATUSES;
  protected readonly statusForm = form(this.session.status);
  protected readonly columns = CUSTOMER_COLUMNS;
  private readonly detail = inject(VeranstaltungsortService);
  private readonly staging = inject(StagingService);
  protected createVeranstaltungsort(): void {
    this.detail.selected.set(null);
    this.detail.name.set('');
    this.session.customerNumber.set('');
    this.detail.editScope.set('veranstaltungsort');
    this.detail.activeTab.set('stammdaten');
    this.navigateToDetail('neu', 'stammdaten');
  }
  protected openVeranstaltungsort(row: GuiRow, tab: 'stammdaten' | 'bereichs'): void {
    this.detail.selected.set(row);
    if (tab === 'bereichs') {
      this.detail.bereichFilter.set('alle');
      this.detail.bereichStatus.set('aktiv');
    }
    this.detail.activeTab.set(tab);
    this.navigateToDetail(row['kundennummer'], tab);
  }
  private navigateToDetail(id: string, tab: string): void {
    this.state.query.set('');
    this.state.appliedQuery.set('');
    this.detail.editing.set(false);
    this.detail.historical.set(null);
    void this.router.navigate(['/gui/veranstaltungsorte', id], { queryParams: { tab } });
  }
  protected openRequest(row: GuiRow): void {
    const request = this.staging.findForRow(row, 'Veranstaltungsort & Bereiche');
    if (request) {
      this.state.query.set('');
      this.state.appliedQuery.set('');
      void this.router.navigate(['/gui/staging', request['id']]);
    }
  }
  constructor() {
    this.state.page.set('veranstaltungsorte');
  }
}
