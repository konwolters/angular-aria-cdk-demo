import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ToastOutletComponent } from './toast';
import { ToastService } from './toast.service';

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

  it('uses independent durations and keeps a toast with auto-close disabled', () => {
    vi.useFakeTimers();
    try {
      const service = TestBed.inject(ToastService);
      const standard = service.show('Standard');
      const short = service.show('Kurz', { durationMs: 1_000 });
      const persistent = service.show('Bleibt sichtbar', { autoClose: false, durationMs: 1_000 });
      const ids = () => service.messages().map((message) => message.id);

      vi.advanceTimersByTime(999);
      expect(ids()).toEqual([standard, short, persistent]);
      vi.advanceTimersByTime(1);
      expect(ids()).toEqual([standard, persistent]);
      vi.advanceTimersByTime(1_999);
      expect(ids()).toEqual([standard, persistent]);
      vi.advanceTimersByTime(1);
      expect(ids()).toEqual([persistent]);

      service.dismiss(persistent);
      expect(ids()).toEqual([]);
    } finally {
      vi.useRealTimers();
    }
  });

  it('cancels the timer when a toast is dismissed early', () => {
    vi.useFakeTimers();
    try {
      const service = TestBed.inject(ToastService);
      const id = service.show('Schließen');
      expect(vi.getTimerCount()).toBe(1);

      service.dismiss(id);
      expect(vi.getTimerCount()).toBe(0);
      expect(service.messages()).toEqual([]);
    } finally {
      vi.useRealTimers();
    }
  });
});
