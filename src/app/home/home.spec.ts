import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Home } from './home';

const SERVERS_URL =
  'https://hg-server.jollyplant-dd787027.centralus.azurecontainerapps.io/api/servers';

describe('Home', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
    httpMock.expectOne(SERVERS_URL).flush([]);
  });

  it('should render the dashboard nav', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-dashboard')).toBeTruthy();
    httpMock.expectOne(SERVERS_URL).flush([]);
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
    httpMock.expectOne(SERVERS_URL).flush([]);
  });

  it('should list every server, community, repo, and download', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();

    httpMock.expectOne(SERVERS_URL).flush([
      {
        name: 'Los Santos Roleplay',
        ipAddress: '192.168.1.10:30120',
        memberCount: 124,
        capacity: 200,
        active: true,
        owner: 'system',
        cfxRegistrationKey: null,
      },
      {
        name: 'Vinewood Chronicles RP',
        ipAddress: '192.168.1.11:30120',
        memberCount: 87,
        capacity: 150,
        active: true,
        owner: 'system',
        cfxRegistrationKey: null,
      },
      {
        name: 'Sandy Shores Underground',
        ipAddress: '192.168.1.12:30120',
        memberCount: 0,
        capacity: 100,
        active: false,
        owner: 'system',
        cfxRegistrationKey: null,
      },
    ]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('mat-card');

    expect(cards[0].querySelectorAll('li').length).toBe(3);
    expect(cards[1].querySelectorAll('li').length).toBe(2);
    expect(cards[2].querySelectorAll('li').length).toBe(2);
    expect(cards[3].querySelectorAll('li').length).toBe(4);
  });
});
