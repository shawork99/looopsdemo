import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable, switchMap, take} from 'rxjs'
import {environment} from "@/environments/environment";
import {Store} from "@ngrx/store";
import {getAuthToken} from "@store/authentication/authentication.selector";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private store: Store) {
    }

    intercept(
        request: HttpRequest<Request>,
        next: HttpHandler
    ): Observable<HttpEvent<Event>> {
        request = request.clone({
            headers: request.headers.set('Content-Type', 'application/json'),
        });
        if (request.url.includes('assets/')) {
            return next.handle(request);
        }
        request = request.clone({
            url: `${environment.apiUrl + request.url}`,
        });
        return this.store.select(getAuthToken).pipe(
            take(1),
            switchMap((token: any) => {
                if (token) {
                    request = request.clone({
                        headers: request.headers.set('Authorization', 'Bearer ' + token),
                    });
                    return next.handle(request);
                }
                return next.handle(request);
            })
        );
    }
}
