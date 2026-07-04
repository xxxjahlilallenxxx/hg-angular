import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Dashboard } from './dashboard';
import { Auth } from '../services/auth';

@Component({ selector: 'app-dummy', template: '' })
class Dummy {}

describe('Dashboard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([
          { path: '', component: Dummy },
          { path: 'dashboard', component: Dummy },
        ]),
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Dashboard);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should hide the home icon while on the home route', () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[aria-label="Go home"]')).toBeNull();
  });

  it('should show the home icon after navigating away from home', async () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/dashboard');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[aria-label="Go home"]')).toBeTruthy();
  });

  it('should hide the profile icon when logged out', () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[aria-label="Go to profile"]')).toBeNull();
  });

  it('should show the profile icon when logged in', () => {
    const fixture = TestBed.createComponent(Dashboard);
    const auth = TestBed.inject(Auth);
    auth.login('tester');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[aria-label="Go to profile"]')).toBeTruthy();
  });
});
