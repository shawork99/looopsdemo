// src/app/interceptors/auth.interceptor.ts
import {HttpInterceptorFn} from '@angular/common/http';
import {environment} from "@/environments/environment";
import {inject} from "@angular/core";
import {AuthenticationService} from "@/app/services/auth.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authenticationService = inject(AuthenticationService);
    req = req.clone({
        headers: req.headers.set('Content-Type', 'application/json'),
    });
    if (req.url.includes('assets/')) {
        return next(req);
    }
    const clonedReq = req.clone({
        url: `${environment.apiUrl}/${req.url}`,
    });
    return next(clonedReq);
};