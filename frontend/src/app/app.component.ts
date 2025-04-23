import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ContactListComponent } from './components/contact-list/contact-list.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Contactos App';
  ping: string = '';      // declara la propiedad para interpolación :contentReference[oaicite:2]{index=2}

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Si quieres llamar a tu API /api/ping:
    this.http.get<{ ping: string }>('/api/ping')
      .subscribe(res => this.ping = res.ping);
  }
}
