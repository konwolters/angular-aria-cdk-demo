import { TestBed } from '@angular/core/testing';
import { FilePickerComponent } from './file-picker';

describe('FilePickerComponent', () => {
  it('accepts CSV files, resets the native input and can remove the selection', () => {
    const fixture = TestBed.createComponent(FilePickerComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const file = new File(['a;b'], 'example.csv', { type: 'text/csv' });
    Object.defineProperty(input, 'files', { configurable: true, value: [file] });
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(file);
    expect(input.value).toBe('');
    fixture.componentInstance.remove();
    expect(fixture.componentInstance.value()).toBeNull();
  });

  it('rejects invalid types, oversized files and multiple dropped files without replacing the selection', () => {
    const fixture = TestBed.createComponent(FilePickerComponent);
    fixture.componentRef.setInput('maxBytes', 3);
    fixture.detectChanges();
    const selected = new File(['ok'], 'ok.csv');
    fixture.componentInstance.value.set(selected);
    const rejected: string[] = [];
    fixture.componentInstance.rejected.subscribe((message) => rejected.push(message));
    const drop = (files: File[]) => {
      const event = new Event('drop', { cancelable: true });
      Object.defineProperty(event, 'dataTransfer', { value: { files } });
      fixture.nativeElement.querySelector('section').dispatchEvent(event);
    };
    drop([new File(['x'], 'wrong.txt')]);
    drop([new File(['large'], 'large.csv')]);
    drop([selected, selected]);
    expect(rejected.length).toBe(3);
    expect(fixture.componentInstance.value()).toBe(selected);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    drop([new File(['x'], 'new.csv')]);
    fixture.componentInstance.remove();
    expect(fixture.componentInstance.value()).toBe(selected);
  });
});
