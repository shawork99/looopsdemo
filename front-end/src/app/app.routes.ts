import { Routes } from '@angular/router'
import { LayoutComponent } from './layout/layout.component'
import { AuthLayoutComponent } from './auth-layout/auth-layout.component'
import { ErrorLayoutComponent } from './error-layout/error-layout.component'
import {adminGuard} from "@core/guards/admin.guard";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    loadChildren: () =>
      import('./views/views.route').then((mod) => mod.VIEWS_ROUTES),
    canActivate: [adminGuard]
  },

  {
    path: '',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./views/auth/auth.route').then((mod) => mod.AUTH_ROUTES),
  },
  {
    path: '',
    component: ErrorLayoutComponent,
    loadChildren: () =>
      import('./views/errors/error.route').then(
        (mod) => mod.ERROR_PAGES_ROUTES
      ),
  }
]
