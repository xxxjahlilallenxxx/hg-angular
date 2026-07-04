import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatSliderModule } from '@angular/material/slider';
import { CreateServerForm } from '../classes/create-server-form';
import { ServersService } from '../services/servers';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-create-server',
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatSliderModule,
  ],
  templateUrl: './create-server.html',
  styleUrl: './create-server.scss',
})
export class CreateServer {
  private readonly router = inject(Router);
  private readonly serversService = inject(ServersService);
  private readonly auth = inject(Auth);

  readonly minCapacity = 4;
  readonly maxCapacity = 1000;

  form = new CreateServerForm();

  addMod(event: MatChipInputEvent): void {
    const mod = event.value.trim();
    if (mod) {
      this.form.mods.push(mod);
    }
    event.chipInput.clear();
  }

  removeMod(mod: string): void {
    this.form.mods = this.form.mods.filter((existing) => existing !== mod);
  }

  onSubmit(): void {
    if (!this.form.serverName.trim()) {
      return;
    }
    this.serversService.addServer({
      name: this.form.serverName,
      ipAddress: this.form.ipAddress,
      memberCount: 0,
      capacity: this.form.capacity,
      active: true,
      owner: this.auth.username(),
      cfxRegistrationKey: this.form.cfxRegistrationKey,
    });
    this.router.navigateByUrl('/');
  }
}
