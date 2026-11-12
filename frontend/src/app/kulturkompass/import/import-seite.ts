import { Component, input, model, output } from '@angular/core';
import { ButtonComponent } from '../../shared/button/button';
import { DataTableCellDirective } from '../../shared/data-table/data-table-cell.directive';
import { DataTableColumn, DataTableComponent } from '../../shared/data-table/data-table';
import { FilePickerComponent } from '../../shared/file-picker/file-picker';
import { SelectComponent, SelectOption } from '../../shared/select/select';
import { StepItem, StepperComponent } from '../../shared/stepper/stepper';
import { GuiPagination } from '../gui-pagination';

type Row = Record<string, string>;

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
  readonly importStage = model.required<string>();
  readonly dataType = model.required<string>();
  readonly file = model.required<File | null>();
  readonly steps = input.required<readonly StepItem[]>();
  readonly completedSteps = input.required<readonly string[]>();
  readonly importTypes = input.required<readonly SelectOption[]>();
  readonly previewRows = input.required<readonly Row[]>();
  readonly previewColumns = input.required<readonly DataTableColumn<Row>[]>();
  readonly groupRows = input.required<readonly Row[]>();
  readonly groupColumns = input.required<readonly DataTableColumn<Row>[]>();
  readonly importResultRows = input.required<readonly Row[]>();
  readonly importResultColumns = input.required<readonly DataTableColumn<Row>[]>();
  readonly pagination = input.required<GuiPagination>();
  readonly openResult = output<Row>();
  readonly openStaging = output<void>();

  protected changeStep(direction: number): void {
    const steps = this.steps();
    const index = steps.findIndex((step) => step.value === this.importStage());
    this.importStage.set(steps[Math.max(0, Math.min(steps.length - 1, index + direction))].value);
  }
}
