import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ButtonComponent, ButtonSize, ButtonVariant } from './button';

@Component({
  imports: [ButtonComponent],
  template: `
    <button appButton [variant]="variant()" [size]="size()" icon="plus">Add item</button>
  `,
})
class ButtonHostComponent {
  readonly variant = signal<ButtonVariant>('secondary');
  readonly size = signal<ButtonSize>('small');
}

describe('ButtonComponent', () => {
  it('keeps the native button element and applies its configured variant and icon', async () => {
    await TestBed.configureTestingModule({ imports: [ButtonHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(ButtonHostComponent);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.tagName).toBe('BUTTON');
    expect(button.classList.contains('border-border-strong')).toBe(true);
    expect(button.classList.contains('h-8')).toBe(true);
    expect(button.querySelector('app-icon')).not.toBeNull();
  });
});
