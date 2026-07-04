import { Injectable, signal } from '@angular/core';
import { Server } from '../classes/interfaces/server';

@Injectable({ providedIn: 'root' })
export class ServersService {
  private readonly serverList = signal<Server[]>([
    {
      name: 'Los Santos Roleplay',
      ipAddress: '192.168.1.10:30120',
      memberCount: 124,
      capacity: 200,
      active: true,
      owner: 'system',
    },
    {
      name: 'Vinewood Chronicles RP',
      ipAddress: '192.168.1.11:30120',
      memberCount: 87,
      capacity: 150,
      active: true,
      owner: 'system',
    },
    {
      name: 'Sandy Shores Underground',
      ipAddress: '192.168.1.12:30120',
      memberCount: 0,
      capacity: 100,
      active: false,
      owner: 'system',
    },
  ]);
  readonly servers = this.serverList.asReadonly();

  addServer(server: Server): void {
    this.serverList.update((servers) => [...servers, server]);
  }

  updateServer(name: string, changes: Partial<Server>): void {
    this.serverList.update((servers) =>
      servers.map((server) => (server.name === name ? { ...server, ...changes } : server)),
    );
  }

  removeServer(name: string): void {
    this.serverList.update((servers) => servers.filter((server) => server.name !== name));
  }
}
