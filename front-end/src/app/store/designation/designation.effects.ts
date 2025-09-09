import {inject, Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as DesignationActions from "./designation.actions";
import {catchError, mergeMap, of, tap} from "rxjs";
import {AlertService} from "@/app/services/alert.service";
import {DesignationService} from "@/app/services/designation.service";
import {
    CreateDesignationResponse, DeleteDesignationResponse,
    GetAllDesignationResponse,
    UpdateDesignationResponse
} from "@store/designation/designation.model";



@Injectable()
export class DesignationEffects {
    private actions$ = inject(Actions);

    constructor(private alertService: AlertService,
                private designationService: DesignationService) {
    }

    getAllDesignation$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DesignationActions.getAllDesignation),
            mergeMap((action) =>
                this.designationService.getAllDesignation(action?.data).pipe(
                    mergeMap((resp: GetAllDesignationResponse) => [
                        DesignationActions.onAllDesignationSuccess({data: resp?.data}),
                        DesignationActions.manageDesignationGridLoading({data: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(DesignationActions.manageDesignationGridLoading({data: false}));
                    })
                )
            )
        )
    );

    createDesignation$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DesignationActions.createDesignation),
            mergeMap((action) =>
                this.designationService.createDesignation(action?.data).pipe(
                    tap((resp: CreateDesignationResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: CreateDesignationResponse) => [
                        DesignationActions.showHideDesignationForm({show: false}),
                        DesignationActions.showDesignationFormLoading({show: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(DesignationActions.showDesignationFormLoading({show: false}));
                    })
                )
            )
        )
    );

    editDesignation$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DesignationActions.updateDesignation),
            mergeMap((action) =>
                this.designationService.updateDesignation(action?.designationId, action?.data).pipe(
                    tap((resp: UpdateDesignationResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: UpdateDesignationResponse) => [
                        DesignationActions.showHideDesignationForm({show: false}),
                        DesignationActions.showDesignationFormLoading({show: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(DesignationActions.showDesignationFormLoading({show: false}));
                    })
                )
            )
        )
    );

    deleteDesignation$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DesignationActions.deleteDesignation),
            mergeMap((action) =>
                this.designationService.deleteDesignation(action?.data).pipe(
                    tap((resp: DeleteDesignationResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: DeleteDesignationResponse) => [
                        DesignationActions.getAllDesignation({data:this.designationService.lastFilter})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(DesignationActions.manageDesignationGridLoading({data: false}));
                    })
                )
            )
        )
    );
}