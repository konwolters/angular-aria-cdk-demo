import { DOCUMENT } from '@angular/common';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { apiBasePathInterceptor } from './api-base-path.interceptor';

describe('apiBasePathInterceptor', () => {
  function configure(baseURI: string) {
    TestBed.configureTestingModule({
      providers: [
        { provide: DOCUMENT, useValue: { baseURI } },
        provideHttpClient(withInterceptors([apiBasePathInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    return {
      http: TestBed.inject(HttpClient),
      testing: TestBed.inject(HttpTestingController),
    };
  }

  it('prefixes APIs while preserving query parameters', () => {
    const { http, testing } = configure('https://portal.example/aria-demo/');
    http.get('/api/customers?search=Alex', { params: { page: 1 } }).subscribe();
    testing.expectOne('/aria-demo/api/customers?search=Alex&page=1').flush({});
    testing.verify();
  });

  it('keeps local development at the root working', () => {
    const { http, testing } = configure('http://localhost:4200/');
    http.get('/api/customers').subscribe();
    testing.expectOne('/api/customers').flush({});
    testing.verify();
  });

  it('does not rewrite external requests or already-prefixed URLs', () => {
    const { http, testing } = configure('https://portal.example/aria-demo/');
    for (const url of ['https://example.com/api/test', '/aria-demo/api/customers', '/asset.json']) {
      http.get(url).subscribe();
      testing.expectOne(url).flush({});
    }
    testing.verify();
  });
});
