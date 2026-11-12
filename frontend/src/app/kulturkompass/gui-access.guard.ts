import { isDevMode } from '@angular/core';
import { CanActivateFn } from '@angular/router';

export const guiAccessGuard: CanActivateFn = async () => {
  if (isDevMode()) return true;

  const accessUrl = new URL('api/gui-access', document.baseURI);
  try {
    const response = await fetch(accessUrl, { credentials: 'same-origin', cache: 'no-store' });

    if (response.ok) return true;

    if (response.status === 401) {
      accessUrl.searchParams.set('login', '1');
      window.location.assign(accessUrl.href);
    }
  } catch {
    // Bei fehlgeschlagener Zugangsprüfung darf sich die GUI nicht öffnen.
  }
  return false;
};
