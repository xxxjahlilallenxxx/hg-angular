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
import { UsersService } from '../services/users';

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
  private readonly usersService = inject(UsersService);
  private readonly auth = inject(Auth);

  @ViewChild(MatTooltip) private usernameTooltip?: MatTooltip;

  form = new RegisterForm();

  readonly usernameError = signal<string | null>(null);
  readonly usernameTooltipMessage = computed(
    () => this.usernameError() ?? 'Choose a unique username',
  );
  readonly usernameTooltipClass = computed(() => (this.usernameError() ? 'tooltip-error' : ''));

  checkUsername(): void {
    const username = this.form.username.trim();
    if (username && this.usersService.usernameExists(username)) {
      this.usernameError.set('Username already exists');
      this.usernameTooltip?.show();
    } else {
      this.usernameError.set(null);
      this.usernameTooltip?.hide();
    }
  }

  onSubmit(): void {
    this.checkUsername();
    if (
      !this.form.username.trim() ||
      !this.form.email.trim() ||
      !this.form.password ||
      this.form.password !== this.form.confirmPassword ||
      this.usernameError()
    ) {
      return;
    }
    this.usersService.registerUser(this.form.username, this.form.email, this.form.password);
    this.auth.login(this.form.username);
    this.router.navigateByUrl('/');
  }
}
