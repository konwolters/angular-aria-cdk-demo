import { Router } from '@angular/router';
import { GuiRow } from '../../daten/gui-modelle';
import { GuiPaginationService } from '../../gui-pagination.service';
import { Component, inject } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { ImportService } from '../import.service';
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
    FormField,
    DataTableCellDirective,
    DataTableComponent,
    FilePickerComponent,
    SelectComponent,
    StepperComponent,
  ],
  templateUrl: './import-seite.html',
})
export class ImportSeite {
  private readonly paginationState = inject(GuiPaginationService);
  protected readonly router = inject(Router);
  protected readonly state = inject(ImportService);
  protected readonly importStage = this.state.stage;
  protected readonly dataType = this.state.dataType;
  protected readonly file = this.state.file;
  protected readonly dataTypeForm = form(this.dataType);
  protected readonly fileForm = form(this.file);
  protected readonly steps = () => this.state.steps;
  protected readonly completedSteps = this.state.completedSteps;
  protected readonly importTypes = () => this.state.importTypes;
  protected readonly previewRows = this.state.previewRows;
  protected readonly previewColumns = this.state.previewColumns;
  protected readonly groupRows = () => this.state.groupRows;
  protected readonly groupColumns = () => this.state.groupColumns;
  protected readonly importResultRows = () => this.state.resultRows;
  protected readonly importResultColumns = () => this.state.resultColumns;
  protected readonly pagination = () => this.paginationState;

  protected openResult(row: GuiRow): void {
    void this.router.navigate(['/gui/staging', row['id']]);
  }
  protected changeStep(direction: number): void {
    const steps = this.steps();
    const index = steps.findIndex((step) => step.value === this.importStage());
    this.importStage.set(steps[Math.max(0, Math.min(steps.length - 1, index + direction))].value);
  }
}
