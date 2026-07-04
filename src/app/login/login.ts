import { Component, ViewChild, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { Auth } from '../services/auth';
import { UsersService } from '../services/users';
import { LoginForm } from '../classes/login-form';

const MAX_FAILED_ATTEMPTS = 3;

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly usersService = inject(UsersService);

  @ViewChild(MatTooltip) private passwordTooltip?: MatTooltip;

  form = new LoginForm();

  private failedAttempts = 0;

  readonly loginError = signal<string | null>(null);
  readonly passwordTooltipMessage = computed(() => this.loginError() ?? 'Enter your password');
  readonly passwordTooltipClass = computed(() => (this.loginError() ? 'tooltip-error' : ''));

  onSubmit(): void {
    if (!this.form.username.trim() || !this.form.password) {
      return;
    }

    if (!this.usersService.validateCredentials(this.form.username, this.form.password)) {
      this.failedAttempts++;
      this.loginError.set('Incorrect username or password');
      this.passwordTooltip?.show();

      if (this.failedAttempts >= MAX_FAILED_ATTEMPTS) {
        this.failedAttempts = 0;
        const wantsReset = window.confirm(
          'You have had 3 failed login attempts. Would you like to submit a forgot password form?',
        );
        if (wantsReset) {
          this.router.navigateByUrl('/forgot-password');
        }
      }
      return;
    }

    this.failedAttempts = 0;
    this.loginError.set(null);
    this.passwordTooltip?.hide();
    this.auth.login(this.form.username);
    this.router.navigateByUrl('/');
  }
}
