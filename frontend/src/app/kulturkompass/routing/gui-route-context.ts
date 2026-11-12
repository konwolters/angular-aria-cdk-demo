import { inject, Signal } from '@angular/core';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import type { GuiPageContext } from '../kulturkompass';

export function injectGuiRouteContext(): Signal<GuiPageContext> {
  return inject(ROUTER_OUTLET_DATA) as Signal<GuiPageContext>;
}
