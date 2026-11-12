import { Component, inject } from '@angular/core';
import { ImportSeiteComponent } from '../import/import-seite';
import { ImportZustand } from '../import/import-zustand';
import { injectGuiRouteContext } from './gui-route-context';

@Component({
  selector: 'app-import-route',
  imports: [ImportSeiteComponent],
  templateUrl: './import-route.html',
})
export class ImportRouteComponent {
  protected readonly ctx = injectGuiRouteContext();
  protected readonly state = inject(ImportZustand);
}
