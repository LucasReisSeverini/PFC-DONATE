import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkTheme = false;

  constructor() {
    // ✅ ISSO é essencial - aplica o tema quando o serviço inicia
    this.applyTheme();
  }

  toggleTheme() {
    this.darkTheme = !this.darkTheme;
    this.applyTheme();
  }

  private applyTheme() {
    // ✅ LIMPA ambas as classes primeiro
    document.body.classList.remove('theme-light', 'theme-dark');

    // ✅ DEPOIS adiciona a correta
    if (this.darkTheme) {
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.add('theme-light');
    }

    console.log('Tema aplicado:', this.darkTheme ? 'dark' : 'light'); // Para debug
  }

  isDarkTheme(): boolean {
    return this.darkTheme;
  }
}
