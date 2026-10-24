import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WritableSignal } from '@angular/core';
import { CustomerTableComponent } from './customer-table';

describe('CustomerTableComponent', () => {
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerTableComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('waits for the search button before applying text and filters', async () => {
    const fixture = TestBed.createComponent(CustomerTableComponent);
    fixture.detectChanges();

    httpTesting
      .expectOne((request) => request.url === '/api/customers')
      .flush({
        content: [],
        totalElements: 0,
        totalPages: 0,
        number: 0,
        size: 8,
      });

    const searchInput = fixture.nativeElement.querySelector(
      'input[placeholder="Name, E-Mail, Firma…"]',
    ) as HTMLInputElement;
    searchInput.value = 'Alex';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
    fixture.detectChanges();

    const draftState = fixture.componentInstance as unknown as {
      searchTerm: WritableSignal<string>;
      selectedStatuses: WritableSignal<string[]>;
    };
    expect(draftState.searchTerm()).toBe('Alex');
    draftState.selectedStatuses.set(['Active']);

    httpTesting.expectNone((request) => request.url === '/api/customers');

    const searchButton = [...fixture.nativeElement.querySelectorAll('button')].find(
      (button) => button.textContent?.trim() === 'Suchen',
    ) as HTMLButtonElement;
    searchButton.click();
    TestBed.tick();

    const searchRequest = httpTesting.expectOne((request) => request.url === '/api/customers');
    expect(searchRequest.request.params.get('search')).toBe('Alex');
    expect(searchRequest.request.params.getAll('status')).toEqual(['Active']);
    searchRequest.flush({
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 8,
    });
  });
});
