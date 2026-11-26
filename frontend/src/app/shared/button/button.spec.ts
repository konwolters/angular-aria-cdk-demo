import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ButtonComponent, ButtonSize, ButtonVariant } from './button';

@Component({
  imports: [ButtonComponent],
  templateUrl: './button.spec.html',
})
class ButtonHostComponent {
  readonly variant = signal<ButtonVariant>('secondary');
  readonly size = signal<ButtonSize>('small');
  readonly active = signal(false);
}

describe('ButtonComponent', () => {
  it('keeps the native button element and applies its configured variant and icon', async () => {
    await TestBed.configureTestingModule({ imports: [ButtonHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(ButtonHostComponent);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.tagName).toBe('BUTTON');
    expect(button.classList.contains('border-border-strong')).toBe(true);
    expect(button.classList.contains('min-h-8')).toBe(true);
    expect(button.querySelector('app-icon')).not.toBeNull();
  });

  it('renders text links without button sizing and allows wrapping', async () => {
    await TestBed.configureTestingModule({ imports: [ButtonHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ButtonHostComponent);
    fixture.componentInstance.variant.set('text-link');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.classList.contains('whitespace-normal')).toBe(true);
    expect(button.classList.contains('text-left')).toBe(true);
    expect(button.classList.contains('min-h-8')).toBe(false);
    expect(button.classList.contains('px-2.5')).toBe(false);
  });

  it('uses only active colors while a button is active, regardless of variant', async () => {
    await TestBed.configureTestingModule({ imports: [ButtonHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ButtonHostComponent);
    const { variant, active } = fixture.componentInstance;
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const variants: ButtonVariant[] = [
      'primary',
      'secondary',
      'ghost',
      'link',
      'text-link',
      'danger',
    ];

    for (const value of variants) {
      variant.set(value);
      active.set(true);
      fixture.detectChanges();

      expect([...button.classList].filter((name) => name.startsWith('bg-'))).toEqual([
        'bg-brand-subtle',
      ]);
      expect(button.classList.contains('text-brand-strong')).toBe(true);
      expect(button.classList.contains('border-brand')).toBe(true);
      expect([...button.classList].some((name) => /^hover:(bg|border|text)-/.test(name))).toBe(
        false,
      );

      active.set(false);
      fixture.detectChanges();
      expect(button.classList.contains('bg-brand-subtle')).toBe(false);
      expect(button.classList.contains('border-brand')).toBe(false);
    }
  });
});
