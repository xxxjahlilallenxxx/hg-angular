import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Profile } from './profile';
import { Auth } from '../services/auth';

describe('Profile', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Profile);
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('changePassword', () => {
    it('should do nothing when the passwords do not match', () => {
      const fixture = TestBed.createComponent(Profile);
      const profile = fixture.componentInstance;
      const auth = TestBed.inject(Auth);
      const changePasswordSpy = spyOn(auth, 'changePassword');

      profile.passwordForm.newPassword = 'abc123';
      profile.passwordForm.confirmPassword = 'different';
      profile.changePassword();

      expect(changePasswordSpy).not.toHaveBeenCalled();
    });

    it('should update the password and reset the form when they match', () => {
      const fixture = TestBed.createComponent(Profile);
      const profile = fixture.componentInstance;
      const auth = TestBed.inject(Auth);
      const changePasswordSpy = spyOn(auth, 'changePassword');

      profile.passwordForm.newPassword = 'abc123';
      profile.passwordForm.confirmPassword = 'abc123';
      profile.changePassword();

      expect(changePasswordSpy).toHaveBeenCalledWith('abc123');
      expect(profile.passwordForm.newPassword).toBe('');
      expect(profile.passwordForm.confirmPassword).toBe('');
    });
  });

  describe('deleteAccount', () => {
    it('should do nothing when the user cancels the confirmation', () => {
      const fixture = TestBed.createComponent(Profile);
      const profile = fixture.componentInstance;
      const auth = TestBed.inject(Auth);
      const deleteAccountSpy = spyOn(auth, 'deleteAccount');
      spyOn(window, 'confirm').and.returnValue(false);

      profile.deleteAccount();

      expect(deleteAccountSpy).not.toHaveBeenCalled();
    });

    it('should delete the account and navigate home when confirmed', () => {
      const fixture = TestBed.createComponent(Profile);
      const profile = fixture.componentInstance;
      const auth = TestBed.inject(Auth);
      const router = TestBed.inject(Router);
      const deleteAccountSpy = spyOn(auth, 'deleteAccount');
      const navigateSpy = spyOn(router, 'navigateByUrl');
      spyOn(window, 'confirm').and.returnValue(true);

      profile.deleteAccount();

      expect(deleteAccountSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith('/');
    });
  });
});
