import { Component, inject } from '@angular/core';
import type { Signal } from '@angular/core';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import type { GuiPageContext } from '../../kulturkompass';
import { ReferenzdatenZustand } from '../referenzdaten-zustand';
import { ButtonComponent } from '../../../shared/button/button';
import { DataTableCellDirective } from '../../../shared/data-table/data-table-cell.directive';
import { DataTableComponent } from '../../../shared/data-table/data-table';
import { TabPanelTemplateDirective } from '../../../shared/tabs/tab-panel-template.directive';
import { TabsComponent } from '../../../shared/tabs/tabs';

@Component({
  selector: 'app-referenzdaten-seite',
  imports: [
    ButtonComponent,
    DataTableCellDirective,
    DataTableComponent,
    TabPanelTemplateDirective,
    TabsComponent,
  ],
  templateUrl: './referenzdaten-seite.html',
})
export class ReferenzdatenSeiteComponent {
  protected readonly ctx = inject(ROUTER_OUTLET_DATA) as Signal<GuiPageContext>;
  protected readonly state = inject(ReferenzdatenZustand);
  protected readonly tabs = () => this.state.tabs;
  protected readonly selectedTab = this.state.selectedTab;
  protected readonly editing = this.state.editing;
  protected readonly rows = () => this.state.rows;
  protected readonly columns = () => this.state.columns;
  protected readonly editableColumns = this.state.editableColumns;
}
