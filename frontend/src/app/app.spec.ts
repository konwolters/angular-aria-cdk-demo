import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render navigation for all table areas', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const navigation = compiled.querySelector('nav[aria-label="Hauptnavigation"]');
    expect(navigation?.textContent).toContain('Customers');
    expect(navigation?.textContent).toContain('Orders');
    expect(navigation?.textContent).toContain('Projects');
    expect(navigation?.textContent).toContain('Tabs');
  });
});
