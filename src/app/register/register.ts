import { Component, ViewChild, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { RegisterForm } from '../classes/register-form';
import { Auth } from '../services/auth';
import { UsersApi } from '../services/users-api';

const USERNAME_CHECK_DEBOUNCE_MS = 400;

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly router = inject(Router);
  private readonly usersApi = inject(UsersApi);
  private readonly auth = inject(Auth);

  @ViewChild(MatTooltip) private usernameTooltip?: MatTooltip;

  form = new RegisterForm();

  private usernameCheckTimer?: ReturnType<typeof setTimeout>;

  readonly usernameError = signal<string | null>(null);
  readonly usernameTooltipMessage = computed(
    () => this.usernameError() ?? 'Choose a unique username',
  );
  readonly usernameTooltipClass = computed(() => (this.usernameError() ? 'tooltip-error' : ''));

  readonly formError = signal<string | null>(null);
  readonly submitting = signal(false);

  checkUsername(): void {
    clearTimeout(this.usernameCheckTimer);
    const username = this.form.username.trim();
    if (!username) {
      this.usernameError.set(null);
      this.usernameTooltip?.hide();
      return;
    }

    this.usernameCheckTimer = setTimeout(() => {
      this.usersApi.usernameExists(username).subscribe({
        next: (exists) => {
          if (exists) {
            this.usernameError.set('Username already exists');
            this.usernameTooltip?.show();
          } else {
            this.usernameError.set(null);
            this.usernameTooltip?.hide();
          }
        },
        error: () => {
          // Availability check failing shouldn't block typing; the real
          // conflict check happens again on submit.
        },
      });
    }, USERNAME_CHECK_DEBOUNCE_MS);
  }

  onSubmit(): void {
    this.formError.set(null);

    if (
      !this.form.username.trim() ||
      !this.form.email.trim() ||
      !this.form.password ||
      this.form.password !== this.form.confirmPassword ||
      this.usernameError()
    ) {
      return;
    }

    this.submitting.set(true);
    this.usersApi.register(this.form.username, this.form.email, this.form.password).subscribe({
      next: (user) => {
        this.submitting.set(false);
        this.auth.login(user.username);
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.submitting.set(false);
        const message: string = err?.error?.message ?? 'Registration failed. Please try again.';
        if (message.toLowerCase().includes('username')) {
          this.usernameError.set(message);
          this.usernameTooltip?.show();
        } else {
          this.formError.set(message);
        }
      },
    });
  }
}
