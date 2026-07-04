import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Dashboard } from '../dashboard/dashboard';
import { ServersService } from '../services/servers';

@Component({
  selector: 'app-home',
  imports: [Dashboard, RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly serversService = inject(ServersService);

  protected readonly servers = this.serversService.servers;

  protected readonly discordCommunities = [
    { name: 'Hirogi Games Official', link: 'https://discord.gg/hirogi-games' },
    { name: 'Hirogi Modding Hub', link: 'https://discord.gg/hirogi-modding' },
  ];

  protected readonly githubLinks = [
    { name: 'hirogi-games/web-app', link: 'https://github.com/hirogi-games/web-app' },
    { name: 'hirogi-games/server', link: 'https://github.com/hirogi-games/server' },
  ];

  protected readonly downloads = [
    { name: 'hg-core', link: 'https://github.com/hirogi-games/hg-core/releases/latest' },
    { name: 'hg-bank', link: 'https://github.com/hirogi-games/hg-bank/releases/latest' },
    { name: 'hg-clothing', link: 'https://github.com/hirogi-games/hg-clothing/releases/latest' },
    { name: 'hg-jobs', link: 'https://github.com/hirogi-games/hg-jobs/releases/latest' },
  ];
}
