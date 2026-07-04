import { Injectable, effect, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CreateServerPayload, Server } from '../classes/interfaces/server';
import { Auth } from './auth';
import { ServersApi } from './servers-api';

@Injectable({ providedIn: 'root' })
export class ServersService {
  private readonly serversApi = inject(ServersApi);
  private readonly auth = inject(Auth);

  private readonly serverList = signal<Server[]>([]);
  readonly servers = this.serverList.asReadonly();

  constructor() {
    // Refetch whenever the logged-in user changes, so the requester's own
    // cfx registration keys are (re)populated as soon as they log in.
    effect(() => {
      const requester = this.auth.username() || undefined;
      this.serversApi.getServers(requester).subscribe({
        next: (servers) => this.serverList.set(servers),
        error: (err) => console.error('Failed to load servers', err),
      });
    });
  }

  private refresh(): void {
    const requester = this.auth.username() || undefined;
    this.serversApi.getServers(requester).subscribe({
      next: (servers) => this.serverList.set(servers),
      error: (err) => console.error('Failed to load servers', err),
    });
  }

  addServer(server: CreateServerPayload): Observable<Server> {
    return this.serversApi.createServer(server).pipe(tap(() => this.refresh()));
  }

  updateServer(name: string, changes: Partial<Server>): Observable<Server> {
    return this.serversApi
      .updateServer(name, changes, this.auth.username())
      .pipe(tap(() => this.refresh()));
  }

  removeServer(name: string): Observable<void> {
    return this.serversApi
      .deleteServer(name, this.auth.username())
      .pipe(tap(() => this.refresh()));
  }
}
