import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeadearComponent } from '../headear/headear.component';
@Component({
  selector: 'app-politica',
  standalone: true,
  imports: [CommonModule, RouterModule, HeadearComponent ],
  templateUrl: './politica.component.html',
  styleUrls: ['./politica.component.css']
})
export class PoliticaComponent {}
