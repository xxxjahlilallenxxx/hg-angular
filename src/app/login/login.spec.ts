import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Login } from './login';
import { Auth } from '../services/auth';
import { UsersService } from '../services/users';

describe('Login', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Login);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should log in with matching credentials and navigate home on submit', () => {
    const fixture = TestBed.createComponent(Login);
    const login = fixture.componentInstance;
    const auth = TestBed.inject(Auth);
    const usersService = TestBed.inject(UsersService);
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigateByUrl');

    usersService.registerUser('player1', 'player@hirogi.games', 'secret');

    login.form.username = 'player1';
    login.form.password = 'secret';
    login.onSubmit();

    expect(auth.isLoggedIn()).toBeTrue();
    expect(auth.username()).toBe('player1');
    expect(navigateSpy).toHaveBeenCalledWith('/');
  });

  it('should not log in and should show an error on incorrect password', () => {
    const fixture = TestBed.createComponent(Login);
    const login = fixture.componentInstance;
    const auth = TestBed.inject(Auth);
    const usersService = TestBed.inject(UsersService);
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigateByUrl');

    usersService.registerUser('player1', 'player@hirogi.games', 'secret');

    login.form.username = 'player1';
    login.form.password = 'wrong-password';
    login.onSubmit();

    expect(auth.isLoggedIn()).toBeFalse();
    expect(login.loginError()).toBe('Incorrect username or password');
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should prompt for a forgot password form after 3 failed attempts', () => {
    const fixture = TestBed.createComponent(Login);
    const login = fixture.componentInstance;
    const usersService = TestBed.inject(UsersService);
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigateByUrl');
    const confirmSpy = spyOn(window, 'confirm').and.returnValue(true);

    usersService.registerUser('player1', 'player@hirogi.games', 'secret');

    login.form.username = 'player1';
    login.form.password = 'wrong-password';
    login.onSubmit();
    login.onSubmit();
    login.onSubmit();

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
