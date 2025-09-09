import {inject, Injectable} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {catchError, exhaustMap, map, of, throwError} from 'rxjs'
import {
    getMySystemDetails,
    login, loginFailure,
    loginSuccess,
    logout,
    logoutSuccess, onMySystemDetailSuccess,recoverPasswordSuccess,recoverPassword,recoverPasswordFailure,resetPassword,resetPasswordFailure,resetPasswordReset,resetPasswordSuccess,
} from './authentication.actions';
import {AuthenticationService} from '@/app/services/auth.service'
import {localStorageKeys} from "@/app/shared/config/common.config";
import {EncryptionService} from "@/app/services/encryption.service";
import {tap} from "rxjs/operators";
import {AlertService} from "@/app/services/alert.service";

@Injectable()
export class AuthenticationEffects {
    private actions$ = inject(Actions)

    constructor(
        private authService: AuthenticationService,
        private router: Router,
        private alertService: AlertService,
        private route: ActivatedRoute
    ) {
    }

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(login),
            exhaustMap(({email, password}) => {
                return this.authService.login(email, password).pipe(
                    map((resp) => {
                        localStorage.setItem(localStorageKeys.token, EncryptionService.encrypt(resp?.data?.token));
                        this.alertService.showSuccess(resp?.message);
                        return loginSuccess({data: resp?.data});
                    }),
                    tap((resp) => this.router.navigate(['/'])),
                    catchError((error) => {
                        this.alertService.showError(error);
                        return of(loginFailure());
                    })
                )
            })
        )
    )

    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(logout),
            exhaustMap(() => {
                return this.authService.logout().pipe(
                    map((resp) => {
                        localStorage.clear();
                        return logoutSuccess();
                    }),
                    tap((resp) => {
                        this.router.navigate(['/auth/login']);
                        return resp;
                    }),
                    catchError((error) => {
                        this.alertService.showError(error?.error?.message);
                        return throwError(error);
                    })
                )
            })
        )
    )

    getMySystemDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(getMySystemDetails),
            exhaustMap(() => {
                return this.authService.getMySystemDetails().pipe(
                    map((resp) => {
                        localStorage.setItem(localStorageKeys.user, EncryptionService.encrypt(resp?.data?.user));
                        localStorage.setItem(localStorageKeys.navigation, EncryptionService.encrypt(resp?.data?.navigation));
                        localStorage.setItem(localStorageKeys.permission, EncryptionService.encrypt(resp?.data?.permissions));
                        return onMySystemDetailSuccess({data: resp?.data});
                    }),
                    catchError((error) => {
                        this.alertService.showError(error?.error?.message);
                        return throwError(error);
                    })
                )
            })
        )
    )

    $recoverPassword = createEffect(() =>
        this.actions$.pipe(
            ofType(recoverPassword),
            exhaustMap(({ email }) =>
            this.authService.recoverPassword(email).pipe(
                map((res) =>{
                    return recoverPasswordSuccess({ message: res.message });
                }),
                catchError((error) => {
                    
                    return of(recoverPasswordFailure({ error: error }));
                })
            )
            )
        )
    )

    resetPassword$ = createEffect(() =>
        this.actions$.pipe(
            ofType(resetPassword),
            exhaustMap(({ payload, password,password_confirmation }) =>
            this.authService.resetPassword(payload, password, password_confirmation).pipe(
                map(res => resetPasswordSuccess({ message: res.message })),
                catchError(err => of(resetPasswordFailure({ error: err.error?.message || 'Error' })))
            )
            )
        )
    );
}
