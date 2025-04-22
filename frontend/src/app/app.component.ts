import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
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
