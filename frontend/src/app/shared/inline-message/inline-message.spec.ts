import { TestBed } from '@angular/core/testing';
import { InlineMessageComponent } from './inline-message';

describe('InlineMessageComponent', () => {
  it('announces errors assertively and ordinary notifications politely', () => {
    const fixture = TestBed.createComponent(InlineMessageComponent);
    fixture.componentRef.setInput('title', 'Validierungsfehler');
    fixture.componentRef.setInput('severity', 'error');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'Validierungsfehler',
    );
    fixture.componentRef.setInput('severity', 'info');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="status"]')).not.toBeNull();
  });
});
