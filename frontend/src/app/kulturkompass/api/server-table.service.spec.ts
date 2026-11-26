import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TestBed } from '@angular/core/testing';
import { ServerTableService } from './server-table.service';
import { INITIAL_TABLE_QUERY, TablePage, TableQuery } from './table.model';

describe('Kulturkompass table search', () => {
  it('reloads on query changes and does not return stale results while loading or on error', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const serverTableService = TestBed.inject(ServerTableService);
    const httpTestingController = TestBed.inject(HttpTestingController);
    const applicationRef = TestBed.inject(ApplicationRef);
    const endpoint = '/api/kulturkompass/angebote';
    const query = signal<TableQuery>(INITIAL_TABLE_QUERY);
    const results = TestBed.runInInjectionContext(() =>
      rxResource({
        params: () => query(),
        stream: ({ params }) => serverTableService.search<{ id: string }>(endpoint, params),
      }),
    );

    const initialPage: TablePage<{ id: string }> = {
      content: [{ id: 'angebot-1' }],
      page: { totalElements: 1, totalPages: 1, number: 0, size: 8 },
    };
    TestBed.tick();
    const initialRequest = httpTestingController.expectOne((req) => req.url === endpoint);
    expect(initialRequest.request.method).toBe('GET');
    expect(initialRequest.request.params.get('page')).toBe('0');
    initialRequest.flush(initialPage);
    await applicationRef.whenStable();
    expect(results.value()).toEqual(initialPage);

    query.update((current) => ({ ...current, filters: { land: ['DE', 'LU'] } }));
    TestBed.tick();
    const filterRequest = httpTestingController.expectOne((req) => req.url === endpoint);
    expect(filterRequest.request.params.getAll('land')).toEqual(['DE', 'LU']);
    expect(results.isLoading()).toBe(true);
    expect(results.hasValue()).toBe(false);

    query.update((current) => ({ ...current, page: 1 }));
    TestBed.tick();
    expect(filterRequest.cancelled).toBe(true);
    const pageRequest = httpTestingController.expectOne((req) => req.url === endpoint);
    expect(pageRequest.request.params.get('page')).toBe('1');
    pageRequest.flush(null, { status: 500, statusText: 'Internal Server Error' });
    await applicationRef.whenStable();

    expect(results.isLoading()).toBe(false);
    expect(results.error()).toBeDefined();
    expect(results.hasValue()).toBe(false);
    httpTestingController.verify();
  });
});
