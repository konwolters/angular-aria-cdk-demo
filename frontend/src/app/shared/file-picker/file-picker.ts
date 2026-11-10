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
import { ControlIdService } from '../field-messages/control-id.service';
import { ButtonComponent, ButtonSize } from '../button/button';
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'app-file-picker',
  host: { class: 'block' },
  imports: [ButtonComponent, IconComponent],
  templateUrl: './file-picker.html',
})
export class FilePickerComponent {
  protected readonly errorId = inject(ControlIdService).next();
  readonly label = input('Datei');
  readonly buttonSize = input<ButtonSize>('small');
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
