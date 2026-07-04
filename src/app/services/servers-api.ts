import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateServerPayload, Server } from '../classes/interfaces/server';

@Injectable({ providedIn: 'root' })
export class ServersApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://hg-server.jollyplant-dd787027.centralus.azurecontainerapps.io/api/servers';

  getServers(requester?: string): Observable<Server[]> {
    const params = requester ? new HttpParams().set('requester', requester) : undefined;
    return this.http.get<Server[]>(this.baseUrl, { params });
  }

  getServer(name: string, requester?: string): Observable<Server> {
    const params = requester ? new HttpParams().set('requester', requester) : undefined;
    return this.http.get<Server>(`${this.baseUrl}/${encodeURIComponent(name)}`, { params });
  }

  createServer(server: CreateServerPayload): Observable<Server> {
    return this.http.post<Server>(this.baseUrl, server);
  }

  updateServer(name: string, changes: Partial<Server>, requester: string): Observable<Server> {
    const params = new HttpParams().set('requester', requester);
    return this.http.put<Server>(`${this.baseUrl}/${encodeURIComponent(name)}`, changes, { params });
  }

  deleteServer(name: string, requester: string): Observable<void> {
    const params = new HttpParams().set('requester', requester);
    return this.http.delete<void>(`${this.baseUrl}/${encodeURIComponent(name)}`, { params });
  }
}
