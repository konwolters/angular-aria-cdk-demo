import { GUI_STATUSES } from '../../daten/gui-status';
import { GuiRow } from '../../daten/gui-modelle';
import { Component, inject, signal } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { ReferenzdatenService } from '../referenzdaten.service';
import { ButtonComponent } from '../../../shared/button/button';
import { DataTableCellDirective } from '../../../shared/data-table/data-table-cell.directive';
import { DataTableComponent } from '../../../shared/data-table/data-table';
import { ModalComponent } from '../../../shared/modal/modal';
import { SelectComponent } from '../../../shared/select/select';
import { SideDrawerComponent } from '../../../shared/side-drawer/side-drawer';
import { TabPanelTemplateDirective } from '../../../shared/tabs/tab-panel-template.directive';
import { TabsComponent } from '../../../shared/tabs/tabs';
import { TextFieldComponent } from '../../../shared/text-field/text-field';

@Component({
  selector: 'app-referenzdaten-seite',
  imports: [
    ButtonComponent,
    DataTableCellDirective,
    DataTableComponent,
    FormField,
    ModalComponent,
    SelectComponent,
    SideDrawerComponent,
    TabPanelTemplateDirective,
    TabsComponent,
    TextFieldComponent,
  ],
  templateUrl: './referenzdaten-seite.html',
})
export class ReferenzdatenSeite {
  protected readonly referenzdatenService = inject(ReferenzdatenService);

  protected readonly editorOpen = signal(false);
  protected readonly editorTitle = signal('');
  protected readonly submitDialogOpen = signal(false);
  protected readonly statuses = GUI_STATUSES;
  protected readonly tabs = () => this.referenzdatenService.tabs;
  protected readonly selectedTab = this.referenzdatenService.selectedTab;
  protected readonly editing = this.referenzdatenService.editing;
  protected readonly rows = () => this.referenzdatenService.rows;
  protected readonly columns = () => this.referenzdatenService.columns;
  protected readonly editableColumns = this.referenzdatenService.editableColumns;

  protected openEditor(row: GuiRow | null): void {
    this.referenzdatenService.prepareEditor(row);
    const subject =
      this.referenzdatenService.tabs.find(
        (tab) => tab.value === this.referenzdatenService.selectedTab(),
      )?.label || 'Referenzwert';
    this.editorTitle.set(`${subject} ${row ? 'bearbeiten' : 'hinzufügen'}`);
    this.editorOpen.set(true);
  }
}
