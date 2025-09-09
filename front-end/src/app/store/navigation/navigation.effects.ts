import {inject, Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, mergeMap, of, tap} from "rxjs";
import {AlertService} from "@/app/services/alert.service";
import {NavigationService} from "@/app/services/navigation.service";
import {
    createNavigationByRole,
    getNavigationByRoleId,
    getNavigationFormData,
    manageNavigationGridLoading, onNavigationByRoleIdSuccess,
    onNavigationFormDataSuccess, showSaveButtonLoading
} from "@store/navigation/navigation.actions";
import {CreateNavigationResponse, GetNavigationsByRoleR, NavigationFormDataR} from "@store/navigation/navigation.model";

@Injectable()
export class NavigationEffects {
    private actions$ = inject(Actions);

    constructor(private alertService: AlertService,
                private navigationService: NavigationService) {
    }

    getNavigationFormData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(getNavigationFormData),
            mergeMap(() =>
                this.navigationService.getNavigationFormData().pipe(
                    mergeMap((resp: NavigationFormDataR) => [
                        onNavigationFormDataSuccess({data: resp?.data}),
                        manageNavigationGridLoading({show: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(manageNavigationGridLoading({show: false}));
                    })
                )
            )
        )
    );

    getNavigationsByRole$ = createEffect(() =>
        this.actions$.pipe(
            ofType(getNavigationByRoleId),
            mergeMap((action) =>
                this.navigationService.getNavigationsByRole(action.roleId).pipe(
                    mergeMap((resp: GetNavigationsByRoleR) => [
                        onNavigationByRoleIdSuccess({data: resp?.data}),
                        showSaveButtonLoading({show: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of( showSaveButtonLoading({show: false}));
                    })
                )
            )
        )
    );

    createNavigationsByRole$ = createEffect(() =>
        this.actions$.pipe(
            ofType(createNavigationByRole),
            mergeMap((action) =>
                this.navigationService.createNavigationsByRole(action.data).pipe(
                    tap((resp: CreateNavigationResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: CreateNavigationResponse) => [
                        showSaveButtonLoading({show: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(showSaveButtonLoading({show: false}));
                    })
                )
            )
        )
    );
}