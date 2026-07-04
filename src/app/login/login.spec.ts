import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Login } from './login';
import { Auth } from '../services/auth';

const LOGIN_URL =
  'https://hg-users.jollyplant-dd787027.centralus.azurecontainerapps.io/api/users/login';

describe('Login', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Login);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should log in with matching credentials and navigate home on submit', () => {
    const fixture = TestBed.createComponent(Login);
    const login = fixture.componentInstance;
    const auth = TestBed.inject(Auth);
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigateByUrl');

    login.form.username = 'player1';
    login.form.password = 'secret';
    login.onSubmit();

    httpMock
      .expectOne(LOGIN_URL)
      .flush({ id: 'abc-123', username: 'player1', email: 'player@hirogi.games' });

    expect(auth.isLoggedIn()).toBeTrue();
    expect(auth.username()).toBe('player1');
    expect(navigateSpy).toHaveBeenCalledWith('/');
  });

  it('should not log in and should show an error on incorrect password', () => {
    const fixture = TestBed.createComponent(Login);
    const login = fixture.componentInstance;
    const auth = TestBed.inject(Auth);
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigateByUrl');

    login.form.username = 'player1';
    login.form.password = 'wrong-password';
    login.onSubmit();

    httpMock
      .expectOne(LOGIN_URL)
      .flush(
        { message: 'Incorrect username or password' },
        { status: 401, statusText: 'Unauthorized' },
      );

    expect(auth.isLoggedIn()).toBeFalse();
    expect(login.loginError()).toBe('Incorrect username or password');
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should prompt for a forgot password form after 3 failed attempts', () => {
    const fixture = TestBed.createComponent(Login);
    const login = fixture.componentInstance;
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigateByUrl');
    const confirmSpy = spyOn(window, 'confirm').and.returnValue(true);

    login.form.username = 'player1';
    login.form.password = 'wrong-password';

    for (let i = 0; i < 3; i++) {
      login.onSubmit();
      httpMock
        .expectOne(LOGIN_URL)
        .flush(
          { message: 'Incorrect username or password' },
          { status: 401, statusText: 'Unauthorized' },
        );
    }

    expect(confirmSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith('/forgot-password');
  });

  it('should call onSubmit when the form is submitted', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();
    spyOn(fixture.componentInstance, 'onSubmit');

    const form = (fixture.nativeElement as HTMLElement).querySelector('form')!;
    form.dispatchEvent(new Event('submit'));

    expect(fixture.componentInstance.onSubmit).toHaveBeenCalled();
  });
});
