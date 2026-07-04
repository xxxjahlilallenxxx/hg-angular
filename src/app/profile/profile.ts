import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { Auth } from '../services/auth';
import { Dashboard } from '../dashboard/dashboard';
import { CreateServer } from '../create-server/create-server';
import { ChangePasswordForm } from '../classes/change-password-form';
import { SettingsForm } from '../classes/settings-form';
import { CreateServerForm } from '../classes/create-server-form';
import { ServersService } from '../services/servers';

type ProfileSection =
  | 'password'
  | 'settings'
  | 'delete'
  | 'add-server'
  | 'update-server'
  | 'delete-server';

@Component({
  selector: 'app-profile',
  imports: [
    FormsModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    Dashboard,
    CreateServer,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly serversService = inject(ServersService);

  readonly selectedSection = signal<ProfileSection>('password');

  readonly minCapacity = 4;
  readonly maxCapacity = 1000;

  // Only the owner can update or delete their own server (and, in turn, ever
  // see its cfx registration key), so both sections share this same list.
  protected readonly ownedServerNames = computed(() =>
    this.serversService
      .servers()
      .filter((server) => server.owner === this.auth.username())
      .map((server) => server.name),
  );

  passwordForm = new ChangePasswordForm();
  settingsForm = new SettingsForm();

  selectedServerToUpdate = '';
  updateServerForm = new CreateServerForm();

  selectedServerToDelete = '';

  changePassword(): void {
    if (
      !this.passwordForm.newPassword ||
      this.passwordForm.newPassword !== this.passwordForm.confirmPassword
    ) {
      return;
    }
    this.auth.changePassword(this.passwordForm.newPassword);
    this.passwordForm = new ChangePasswordForm();
  }

  deleteAccount(): void {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This cannot be undone.',
    );
    if (!confirmed) {
      return;
    }
    this.auth.deleteAccount();
    this.router.navigateByUrl('/');
  }

  addUpdateMod(event: MatChipInputEvent): void {
    const mod = event.value.trim();
    if (mod) {
      this.updateServerForm.mods.push(mod);
    }
    event.chipInput.clear();
  }

  removeUpdateMod(mod: string): void {
    this.updateServerForm.mods = this.updateServerForm.mods.filter((existing) => existing !== mod);
  }

  onServerToUpdateChange(name: string): void {
    const server = this.serversService.servers().find((existing) => existing.name === name);
    this.updateServerForm = new CreateServerForm();
    this.updateServerForm.serverName = name;
    if (server) {
      this.updateServerForm.capacity = server.capacity;
      this.updateServerForm.ipAddress = server.ipAddress;
      this.updateServerForm.cfxRegistrationKey = server.cfxRegistrationKey;
    }
  }

  updateServer(): void {
    if (!this.selectedServerToUpdate || !this.ownedServerNames().includes(this.selectedServerToUpdate)) {
      return;
    }
    this.serversService.updateServer(this.selectedServerToUpdate, {
      ipAddress: this.updateServerForm.ipAddress,
      capacity: this.updateServerForm.capacity,
      cfxRegistrationKey: this.updateServerForm.cfxRegistrationKey,
    });
  }

  deleteServer(): void {
    if (!this.selectedServerToDelete || !this.ownedServerNames().includes(this.selectedServerToDelete)) {
      return;
    }
    const confirmed = window.confirm(
      `Are you sure you want to delete ${this.selectedServerToDelete}? This cannot be undone.`,
    );
    if (!confirmed) {
      return;
    }
    this.serversService.removeServer(this.selectedServerToDelete);
    this.selectedServerToDelete = '';
  }
}
