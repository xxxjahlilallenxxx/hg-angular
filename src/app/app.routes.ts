import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './login/login';
import { Register } from './register/register';
import { ForgotPassword } from './forgot-password/forgot-password';
import { Profile } from './profile/profile';
import { CreateServer } from './create-server/create-server';
import { Servers } from './servers/servers';
import { authGuard } from './services/auth-guard';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'profile', component: Profile },
  { path: 'create-server', component: CreateServer, canActivate: [authGuard] },
  { path: 'servers', component: Servers },
  { path: '**', redirectTo: '' },
];
