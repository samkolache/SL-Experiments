import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAppInitializer, inject } from '@angular/core';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { ThemeService } from './app/services/theme.service';

// Trimmed copy of ExosPrototypes' main.ts: auth, App Insights and the
// global error handler are removed; routing, HTTP, animations and the
// runtime theme switching are the same.
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideAppInitializer(() => inject(ThemeService).init()),
  ]
})
.catch((err) => console.error(err));
