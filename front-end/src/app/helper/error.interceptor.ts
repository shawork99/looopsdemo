import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { AuthenticationService } from '../services/auth.service'
import {Store} from "@ngrx/store";
import {logout} from "@store/authentication/authentication.actions";
import {Router} from "@angular/router";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private  store: Store,
              private router: Router) {}

  intercept(
    request: HttpRequest<Request>,
    next: HttpHandler
  ): Observable<HttpEvent<Event>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
        this.store.dispatch(logout());
         this.router.navigate(['/auth/login']);
        }
        const error = err?.error?.message || err?.statusText
        return throwError(error)
      })
    )
  }
}
