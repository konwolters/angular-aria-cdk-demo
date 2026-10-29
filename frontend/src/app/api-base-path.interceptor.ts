import { DOCUMENT } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

/** Keep API calls inside the same deployment prefix as Angular's base URL. */
export const apiBasePathInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith('/api/')) {
    return next(request);
  }

  const url = new URL(request.url.slice(1), inject(DOCUMENT).baseURI);
  return next(request.clone({ url: url.pathname + url.search }));
};
