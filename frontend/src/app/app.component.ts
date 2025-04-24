import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  username: string | null = null;
  isLoggedIn = false;
  theme: 'light' | 'dark' = 'light';

  constructor(private authService: AuthService) {
    // Recuperar el tema guardado o usar el predeterminado
    const savedTheme = localStorage.getItem('theme');
    this.theme = (savedTheme === 'dark' ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.username = user?.username || null;
    });
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('theme', this.theme);
  }

  logout() {
    this.authService.logout();
  }
}
