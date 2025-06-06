import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-map',
  standalone: true, // Removido imports desnecessários
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  @Input() latitude: number = 0;
  @Input() longitude: number = 0;

  // Gera URL para mapa estático usando OpenStreetMap
  getStaticMapUrl(): string {
    return `https://staticmap.openstreetmap.de/staticmap.php?center=${this.latitude},${this.longitude}&zoom=15&size=400x200&markers=${this.latitude},${this.longitude},red-pin&maptype=mapnik`;
  }
}
