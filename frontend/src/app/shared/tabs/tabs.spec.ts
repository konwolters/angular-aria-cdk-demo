import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TabPanelTemplateDirective } from './tab-panel-template.directive';
import { TabItem, TabsComponent } from './tabs';

@Component({
  imports: [TabPanelTemplateDirective, TabsComponent],
  templateUrl: './tabs.spec.html',
})
class TabsHostComponent {
  readonly items: readonly TabItem[] = [
    { value: 'first', label: 'First' },
    { value: 'second', label: 'Second' },
  ];
  readonly selected = signal('first');
}

describe('TabsComponent', () => {
  it('renders the selected panel and changes panels when another tab is selected', async () => {
    await TestBed.configureTestingModule({ imports: [TabsHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(TabsHostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="tabpanel"]')?.textContent).toContain(
      'First panel content',
    );

    (fixture.nativeElement.querySelectorAll('[role="tab"]')[1] as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(fixture.componentInstance.selected()).toBe('second');
    const visiblePanel = [...fixture.nativeElement.querySelectorAll('[role="tabpanel"]')].find(
      (panel) => !panel.classList.contains('hidden'),
    );
    expect(visiblePanel?.textContent).toContain('Second panel content');
  });
});
