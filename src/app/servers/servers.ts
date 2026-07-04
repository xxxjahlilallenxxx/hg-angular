import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Dashboard } from '../dashboard/dashboard';
import { ServersService } from '../services/servers';
import { Auth } from '../services/auth';
import { Server } from '../classes/interfaces/server';

@Component({
  selector: 'app-servers',
  imports: [MatTableModule, MatButtonModule, MatIconModule, Dashboard],
  templateUrl: './servers.html',
  styleUrl: './servers.scss',
})
export class Servers {
  private readonly serversService = inject(ServersService);
  private readonly auth = inject(Auth);

  protected readonly displayedColumns = ['name', 'ipAddress', 'ratio', 'status', 'delete'];
  protected readonly servers = this.serversService.servers;

  canDelete(server: Server): boolean {
    return this.auth.isLoggedIn() && server.owner === this.auth.username();
  }

  deleteServer(name: string): void {
    const confirmed = window.confirm(`Are you sure you want to delete ${name}? This cannot be undone.`);
    if (!confirmed) {
      return;
    }
    this.serversService.removeServer(name).subscribe({
      error: (err) => console.error('Failed to delete server', err),
    });
  }
}
