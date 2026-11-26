import { httpResource } from '@angular/common/http';
import { Router } from '@angular/router';
import { GuiRow } from '../../daten/gui-modelle';
import { Component, computed, inject, linkedSignal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { ImportService } from '../import.service';
import { ButtonComponent } from '../../../shared/button/button';
import { DataTableCellDirective } from '../../../shared/data-table/data-table-cell.directive';
import { DataTableComponent } from '../../../shared/data-table/data-table';
import { FilePickerComponent } from '../../../shared/file-picker/file-picker';
import { SelectComponent } from '../../../shared/select/select';
import { StepperComponent } from '../../../shared/stepper/stepper';
import { INITIAL_TABLE_QUERY, TablePage } from '../../api/table.model';

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
  protected readonly router = inject(Router);
  private readonly importService = inject(ImportService);

  protected readonly importStage = this.importService.stage;
  protected readonly dataType = this.importService.dataType;
  protected readonly file = this.importService.file;
  protected readonly dataTypeForm = form(this.dataType);
  protected readonly fileForm = form(this.file);
  protected readonly steps = () => this.importService.steps;
  protected readonly completedSteps = this.importService.completedSteps;
  protected readonly importTypes = () => this.importService.importTypes;
  protected readonly previewColumns = this.importService.previewColumns;
  protected readonly groupRows = () => this.importService.groupRows;
  protected readonly groupColumns = () => this.importService.groupColumns;
  protected readonly importResultRows = () => this.importService.resultRows;
  protected readonly importResultColumns = () => this.importService.resultColumns;
  private readonly previewPaging = linkedSignal({
    source: this.dataType,
    computation: () => ({ page: 0, size: INITIAL_TABLE_QUERY.size }),
  });
  protected readonly preview = httpResource<TablePage<GuiRow>>(() =>
    this.importStage() === 'vorschau'
      ? {
          url: '/api/kulturkompass/import/vorschau',
          params: { datenart: this.dataType(), ...this.previewPaging() },
        }
      : undefined,
  );
  protected readonly previewPage = computed(() =>
    this.preview.hasValue() ? this.preview.value() : undefined,
  );

  protected setPreviewPage(page: number): void {
    this.previewPaging.update((paging) => ({ ...paging, page }));
  }

  protected setPreviewSize(size: number): void {
    this.previewPaging.set({ page: 0, size });
  }

  protected openResult(row: GuiRow): void {
    void this.router.navigate(['/gui/staging', row['id']]);
  }

  protected changeStep(direction: number): void {
    const steps = this.steps();
    const index = steps.findIndex((step) => step.value === this.importStage());
    this.importStage.set(steps[Math.max(0, Math.min(steps.length - 1, index + direction))].value);
  }
}
