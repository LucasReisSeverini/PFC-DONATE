import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';  // Importando o GoogleMapsModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GoogleMapsModule],  // Adicionando o GoogleMapsModule no imports
  template: `
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {}
