import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlIdService } from '../field-messages/field-messages';
import { ButtonComponent } from '../button/button';
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'app-file-picker',
  host: { class: 'block' },
  imports: [ButtonComponent, IconComponent],
  template: `
    <section
      class="block"
      (dragenter)="dragEnter($event)"
      (dragleave)="dragLeave($event)"
      (dragover)="dragOver($event)"
      (drop)="drop($event)"
    >
      <label [for]="errorId + '-input'" class="mb-2 block text-sm font-medium text-content">{{
        label()
      }}</label>
      <div
        class="flex flex-col items-center rounded-card border-2 border-dashed px-6 py-8 text-center transition-colors"
        [class.border-border-strong]="!dragging()"
        [class.bg-surface-subtle]="!dragging()"
        [class.border-brand]="dragging()"
        [class.bg-brand-subtle]="dragging()"
        [class.opacity-50]="disabled()"
      >
        <input
          #fileInput
          [id]="errorId + '-input'"
          type="file"
          class="sr-only"
          tabindex="-1"
          [accept]="accept()"
          [disabled]="disabled()"
          [attr.aria-describedby]="errorId"
          [attr.aria-invalid]="!!error()"
          (change)="choose($event)"
        />
        <span
          aria-hidden="true"
          class="mb-4 grid h-12 w-12 place-items-center rounded-card border border-border bg-surface text-brand-strong"
        >
          <app-icon name="arrow-up" [size]="24" />
        </span>
        <p class="text-sm font-semibold text-content">
          {{ dragging() ? 'Datei hier ablegen' : 'Datei hierher ziehen' }}
        </p>
        <p class="mb-4 mt-1 text-sm text-content-muted">oder vom Computer auswählen</p>
        <button
          appButton
          type="button"
          variant="secondary"
          [disabled]="disabled()"
          (click)="fileInput.click()"
        >
          Datei auswählen
        </button>
        <p class="mt-4 text-xs text-content-muted">
          {{ acceptedTypes() }} · Maximal {{ formatSize(maxBytes()) }}
        </p>
      </div>
      @if (value(); as file) {
        <div
          class="mt-3 flex items-center gap-3 rounded-control border border-border bg-surface p-3"
        >
          <span
            class="grid h-9 w-9 shrink-0 place-items-center rounded-control bg-brand-subtle text-brand-strong"
            aria-hidden="true"
            ><app-icon name="receipt" [size]="18"
          /></span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-content">{{ file.name }}</p>
            <p class="mt-0.5 text-xs text-content-muted">{{ formatSize(file.size) }}</p>
          </div>
          <button
            appButton
            type="button"
            variant="ghost"
            size="small"
            icon="close"
            [disabled]="disabled()"
            (click)="remove()"
            [attr.aria-label]="file.name + ' entfernen'"
          ></button>
        </div>
      }
      <p [id]="errorId" role="alert" class="mt-2 text-sm text-danger">{{ error() }}</p>
    </section>
  `,
})
export class FilePickerComponent {
  protected readonly errorId = inject(ControlIdService).next();
  readonly label = input('Datei');
  readonly accept = input('.csv,text/csv');
  protected readonly acceptedTypes = computed(() => {
    const types = this.accept()
      .split(',')
      .map((type) => type.trim())
      .filter(Boolean);
    const extensions = types
      .filter((type) => type.startsWith('.'))
      .map((type) => type.slice(1).toUpperCase());
    return [...new Set(extensions.length ? extensions : types)].join(', ') || 'Alle Dateitypen';
  });
  readonly maxBytes = input(10 * 1024 * 1024);
  readonly disabled = input(false);
  readonly value = model<File | null>(null);
  readonly rejected = output<string>();
  protected readonly error = signal('');
  protected readonly dragging = signal(false);
  private dragDepth = 0;
  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  protected dragEnter(event: DragEvent): void {
    event.preventDefault();
    if (this.disabled()) return;
    this.dragDepth++;
    this.dragging.set(true);
  }
  protected dragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragDepth = Math.max(0, this.dragDepth - 1);
    if (this.dragDepth === 0) this.dragging.set(false);
  }
  protected dragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = this.disabled() ? 'none' : 'copy';
  }
  protected drop(event: DragEvent): void {
    event.preventDefault();
    this.dragDepth = 0;
    this.dragging.set(false);
    if (!this.disabled()) this.selectFiles(Array.from(event.dataTransfer?.files ?? []));
  }
  protected choose(event: Event): void {
    this.selectFiles(Array.from((event.target as HTMLInputElement).files ?? []));
    (event.target as HTMLInputElement).value = '';
  }
  private selectFiles(files: File[]): void {
    if (this.disabled() || !files.length) return;
    const file = files[0];
    const accepted = this.accept()
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean);
    const matches =
      accepted.length === 0 ||
      accepted.some((type) =>
        type.startsWith('.')
          ? file.name.toLowerCase().endsWith(type)
          : type.endsWith('/*')
            ? file.type.toLowerCase().startsWith(type.slice(0, -1))
            : file.type.toLowerCase() === type,
      );
    const error =
      files.length !== 1
        ? 'Bitte genau eine Datei auswählen.'
        : !matches
          ? 'Dieser Dateityp ist nicht erlaubt.'
          : file.size > this.maxBytes()
            ? `Die Datei darf höchstens ${this.maxBytes()} Bytes groß sein.`
            : '';
    this.error.set(error);
    if (error) {
      this.rejected.emit(error);
      return;
    }
    this.value.set(file);
  }
  remove(): void {
    if (this.disabled()) return;
    this.value.set(null);
    this.error.set('');
    const input = this.fileInput()?.nativeElement;
    if (input) input.value = '';
  }

  protected formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    const unit = bytes < 1024 * 1024 ? 'KB' : 'MB';
    const amount = bytes / (unit === 'KB' ? 1024 : 1024 * 1024);
    return `${new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 }).format(amount)} ${unit}`;
  }
}
