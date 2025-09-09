import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
// import { ErrorService } from 'src/app/shared/services/error.service';
import { Router } from '@angular/router';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
    constructor(
        private spinner: NgxSpinnerService,
        // private errorService: ErrorService,
        // private toastr: ToastrService,
        private router: Router
    ) {}

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            finalize(() => {
                this.spinner.hide();
            }),
            catchError((error: HttpErrorResponse): Observable<any> => {
                if (error?.error?.message) {
                    // this.errorService.setErrorMessage(error?.error?.message);
                    // this.toastr.error(error?.error?.message);
                } else {
                    // this.errorService.setHttpError(error);
                }
                // if (error?.status === 401) {
                //     localStorage.clear();
                //     this.router.navigateByUrl('/');
                // }
                return throwError(error);
            })
        );
    }
}