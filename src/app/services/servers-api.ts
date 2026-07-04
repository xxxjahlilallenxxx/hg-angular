import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Server } from '../classes/interfaces/server';

@Injectable({ providedIn: 'root' })
export class ServersApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/servers';

  getServers(): Observable<Server[]> {
    return this.http.get<Server[]>(this.baseUrl);
  }

  getServer(name: string): Observable<Server> {
    return this.http.get<Server>(`${this.baseUrl}/${name}`);
  }

  createServer(server: Server): Observable<Server> {
    return this.http.post<Server>(this.baseUrl, server);
  }

  updateServer(name: string, changes: Partial<Server>): Observable<Server> {
    return this.http.put<Server>(`${this.baseUrl}/${name}`, changes);
  }

  deleteServer(name: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${name}`);
  }
}
