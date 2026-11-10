import { Dialog } from '@angular/cdk/dialog';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ModalComponent } from '../modal/modal';
import { SideDrawerComponent } from '../side-drawer/side-drawer';

@Component({
  imports: [ModalComponent, SideDrawerComponent],
  templateUrl: './dialog.spec.html',
})
class Host {
  readonly drawer = signal(true);
  readonly modal = signal(false);
  readonly requests: string[] = [];
}

describe('CDK dialog wrappers', () => {
  it('delegates close requests and keeps the editor open until the caller decides', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    const dialog = TestBed.inject(Dialog);
    expect(dialog.openDialogs.length).toBe(1);
    const ref = dialog.openDialogs[0];
    ref.overlayRef.overlayElement.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    expect(fixture.componentInstance.requests).toEqual(['escape']);
    expect(fixture.componentInstance.drawer()).toBe(true);
    expect(document.querySelector('button[dialog-footer]')?.textContent).toContain('Übernehmen');
    fixture.componentInstance.drawer.set(false);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(dialog.openDialogs.length).toBe(0);
  });

  it('closes only the top dialog on Escape and uses unique accessible titles', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.componentInstance.modal.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    const dialog = TestBed.inject(Dialog);
    expect(dialog.openDialogs.length).toBe(2);
    const titleIds = [...document.querySelectorAll('[role="dialog"]')].map((node) =>
      node.getAttribute('aria-labelledby'),
    );
    expect(new Set(titleIds).size).toBe(2);
    expect(titleIds.every((id) => id && document.getElementById(id))).toBe(true);
    dialog.openDialogs
      .at(-1)!
      .overlayRef.overlayElement.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      );
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance.modal()).toBe(false);
    expect(fixture.componentInstance.drawer()).toBe(true);
    expect(fixture.componentInstance.requests).toEqual([]);
  });
});
