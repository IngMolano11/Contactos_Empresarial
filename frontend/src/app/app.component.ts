import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  ping = '...';

  async ngOnInit() {
    try {
      const res = await fetch('http://localhost:8000/api/contactos');
      this.ping = res.ok ? '✅ OK' : '❌ ' + res.status;
    } catch {
      this.ping = '❌ Sin conexión';
    }
  }
}
