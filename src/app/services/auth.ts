import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly loggedIn = signal(false);
  readonly isLoggedIn = this.loggedIn.asReadonly();

  private readonly loggedInUsername = signal('');
  readonly username = this.loggedInUsername.asReadonly();

  login(username: string): void {
    this.loggedIn.set(true);
    this.loggedInUsername.set(username);
  }

  logout(): void {
    this.loggedIn.set(false);
    this.loggedInUsername.set('');
  }

  changePassword(newPassword: string): void {
    console.log('Password changed', { newPassword });
  }

  deleteAccount(): void {
    console.log('Account deleted');
    this.logout();
  }
}
