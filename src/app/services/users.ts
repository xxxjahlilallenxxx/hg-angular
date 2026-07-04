import { Injectable, signal } from '@angular/core';
import { User } from '../classes/interfaces/user';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly userList = signal<User[]>([]);
  readonly users = this.userList.asReadonly();

  // Demo-only in-memory credential store; the backend will own real password
  // storage/hashing once the Spring API is wired up.
  private readonly credentials = new Map<string, string>();

  usernameExists(username: string): boolean {
    const normalized = username.trim().toLowerCase();
    return this.userList().some((user) => user.username.toLowerCase() === normalized);
  }

  registerUser(username: string, email: string, password: string): User {
    // The backend will be responsible for generating this id once it exists;
    // crypto.randomUUID() stands in for that until the Spring API is wired up.
    const user: User = { id: crypto.randomUUID(), username, email };
    this.userList.update((users) => [...users, user]);
    this.credentials.set(username, password);
    return user;
  }

  validateCredentials(username: string, password: string): boolean {
    return this.credentials.get(username) === password;
  }
}
