import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Home } from './home';

describe('Home', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Home);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the dashboard nav', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-dashboard')).toBeTruthy();
  });

  it('should render a card for each section', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const titles = Array.from(compiled.querySelectorAll('mat-card-title')).map(
      (el) => el.textContent?.trim(),
    );
    expect(titles).toEqual([
      'FiveM RP Servers',
      'Discord Communities',
      'GitHub Links',
      'Downloads',
    ]);
  });

  it('should list every server, community, repo, and download', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('mat-card');

    expect(cards[0].querySelectorAll('li').length).toBe(3);
    expect(cards[1].querySelectorAll('li').length).toBe(2);
    expect(cards[2].querySelectorAll('li').length).toBe(2);
    expect(cards[3].querySelectorAll('li').length).toBe(4);
  });
});
