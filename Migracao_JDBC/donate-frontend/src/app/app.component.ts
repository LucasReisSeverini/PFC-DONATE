import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GoogleMapsModule],
  template: `
    <div class="theme-toggle-container">
      <button (click)="toggleTheme()">
        {{ themeService.isDarkTheme() ? '☀️ Claro' : '🌙 Escuro' }}
      </button>
    </div>

    <router-outlet></router-outlet>
  `,
  styles: [`
    .theme-toggle-container {
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 1000;
    }

    button {
      padding: 8px 16px;
      cursor: pointer;
      border: none;
      border-radius: 4px;
      background-color: var(--button-bg-color);
      color: var(--button-text-color);
      transition: background-color 0.3s, color 0.3s;
    }
  `]
})
export class AppComponent {

  constructor(public themeService: ThemeService) {
    // ✅ REMOVA completamente esta linha:
    // document.body.classList.add('theme-light');
    // O ThemeService já cuida disso no constructor!
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
