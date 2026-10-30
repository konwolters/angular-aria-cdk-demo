import { TestBed } from '@angular/core/testing';
import { ToastOutletComponent, ToastService } from './toast';

describe('ToastService', () => {
  it('keeps separate messages and dismisses only the requested ID', () => {
    const fixture = TestBed.createComponent(ToastOutletComponent);
    const service = TestBed.inject(ToastService);
    const first = service.show('Gespeichert');
    const second = service.show('Gespeichert');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[aria-live="polite"]')).not.toBeNull();
    service.dismiss(first);
    expect(service.messages().map((message) => message.id)).toEqual([second]);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
    expect(service.messages()).toEqual([]);
  });
});
