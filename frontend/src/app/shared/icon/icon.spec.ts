import { TestBed } from '@angular/core/testing';
import { IconComponent } from './icon';

describe('IconComponent', () => {
  it('renders a consistently sized decorative SVG icon', async () => {
    await TestBed.configureTestingModule({ imports: [IconComponent] }).compileComponents();

    const fixture = TestBed.createComponent(IconComponent);
    fixture.componentRef.setInput('name', 'chevron-down');
    fixture.componentRef.setInput('size', 16);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const svg = host.querySelector('svg');
    expect(host.getAttribute('aria-hidden')).toBe('true');
    expect(host.style.width).toBe('1rem');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(svg?.querySelector('path')).not.toBeNull();
  });
});
