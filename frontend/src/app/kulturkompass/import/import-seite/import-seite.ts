import { Component, inject } from '@angular/core';
import type { Signal } from '@angular/core';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import type { GuiPageContext } from '../../kulturkompass';
import { ImportZustand } from '../import-zustand';
import { ButtonComponent } from '../../../shared/button/button';
import { DataTableCellDirective } from '../../../shared/data-table/data-table-cell.directive';
import { DataTableComponent } from '../../../shared/data-table/data-table';
import { FilePickerComponent } from '../../../shared/file-picker/file-picker';
import { SelectComponent } from '../../../shared/select/select';
import { StepperComponent } from '../../../shared/stepper/stepper';

@Component({
  selector: 'app-import-seite',
  imports: [
    ButtonComponent,
    DataTableCellDirective,
    DataTableComponent,
    FilePickerComponent,
    SelectComponent,
    StepperComponent,
  ],
  templateUrl: './import-seite.html',
})
export class ImportSeiteComponent {
  protected readonly ctx = inject(ROUTER_OUTLET_DATA) as Signal<GuiPageContext>;
  protected readonly state = inject(ImportZustand);
  protected readonly importStage = this.state.stage;
  protected readonly dataType = this.state.dataType;
  protected readonly file = this.state.file;
  protected readonly steps = () => this.state.steps;
  protected readonly completedSteps = this.state.completedSteps;
  protected readonly importTypes = () => this.state.importTypes;
  protected readonly previewRows = this.state.previewRows;
  protected readonly previewColumns = this.state.previewColumns;
  protected readonly groupRows = () => this.state.groupRows;
  protected readonly groupColumns = () => this.state.groupColumns;
  protected readonly importResultRows = () => this.state.resultRows;
  protected readonly importResultColumns = () => this.state.resultColumns;
  protected readonly pagination = () => this.ctx().pagination;

  protected changeStep(direction: number): void {
    const steps = this.steps();
    const index = steps.findIndex((step) => step.value === this.importStage());
    this.importStage.set(steps[Math.max(0, Math.min(steps.length - 1, index + direction))].value);
  }
}
