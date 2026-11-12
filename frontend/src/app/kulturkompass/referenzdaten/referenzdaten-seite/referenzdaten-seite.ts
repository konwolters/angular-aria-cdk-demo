import { GuiDialogService } from '../../daten/gui-dialog.service';
import { GuiRow } from '../../daten/gui-modelle';
import { Component, inject } from '@angular/core';
import { ReferenzdatenService } from '../referenzdaten.service';
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
export class ReferenzdatenSeite {
  protected readonly dialog = inject(GuiDialogService);
  protected readonly state = inject(ReferenzdatenService);
  protected readonly tabs = () => this.state.tabs;
  protected readonly selectedTab = this.state.selectedTab;
  protected readonly editing = this.state.editing;
  protected readonly rows = () => this.state.rows;
  protected readonly columns = () => this.state.columns;
  protected readonly editableColumns = this.state.editableColumns;
  protected openEditor(row: GuiRow | null): void {
    this.state.prepareEditor(row);
    const subject =
      this.state.tabs.find((tab) => tab.value === this.state.selectedTab())?.label ||
      'Referenzwert';
    this.dialog.openDrawer(
      'reference',
      `${subject} ${row ? 'bearbeiten' : 'hinzufügen'}`,
      row,
      true,
    );
  }
}
