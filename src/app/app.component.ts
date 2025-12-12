import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { ToastComponent } from './core/toast.component';
import { ThemeService } from './core/theme.service';
import { AuthService } from './features/auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ToastComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'project-manager';
  themeLabel = 'Mode sombre';
  showNavbar = true;
  userRole: 'admin' | 'user' | null = null;

  constructor(
    private theme: ThemeService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.themeLabel = this.theme.isDark() ? 'Mode clair' : 'Mode sombre';
    
    // Subscribe to current user
    this.authService.currentUser$.subscribe(user => {
      this.userRole = user?.role || null;
    });
    
    // Listen to route changes to hide/show navbar
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showNavbar = !event.url.includes('/login');
    });
    
    // Check initial route
    this.showNavbar = !this.router.url.includes('/login');
  }

  toggleTheme() {
    this.theme.toggle();
    // recompute label after toggling
    this.themeLabel = this.theme.isDark() ? 'Mode clair' : 'Mode sombre';
  }
}
