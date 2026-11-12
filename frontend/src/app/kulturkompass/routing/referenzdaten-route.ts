import { Component, inject } from '@angular/core';
import { ReferenzdatenSeiteComponent } from '../referenzdaten/referenzdaten-seite';
import { ReferenzdatenZustand } from '../referenzdaten/referenzdaten-zustand';
import { injectGuiRouteContext } from './gui-route-context';

@Component({
  selector: 'app-referenzdaten-route',
  imports: [ReferenzdatenSeiteComponent],
  templateUrl: './referenzdaten-route.html',
})
export class ReferenzdatenRouteComponent {
  protected readonly ctx = injectGuiRouteContext();
  protected readonly state = inject(ReferenzdatenZustand);
}
