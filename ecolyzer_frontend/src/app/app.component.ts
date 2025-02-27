// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ArcElement, Chart, DoughnutController } from 'chart.js';
import { LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, DoughnutController, ArcElement);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Eco Energy Platform';
}