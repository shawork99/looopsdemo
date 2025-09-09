import {inject, Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as RequestStatusActions from "./request-status.actions"
import {catchError, EMPTY, mergeMap, of, tap} from "rxjs";
import {AlertService} from "../../services/alert.service";
import {RequestStatusService} from "../../services/request-status.service";
import {
    CreateRequestStatusResponse,
    DeleteRequestStatusResponse,
    GetAllRequestStatusResponse,
    UpdateRequestStatusResponse
} from "./request-status.model";

@Injectable()
export class RequestStatusEffects {
    private actions$ = inject(Actions);

    constructor(private alertService: AlertService,
                private requestStatusService: RequestStatusService) {
    }

    getAllRequestStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RequestStatusActions.getAllRequestStatus),
            mergeMap((action) =>
                this.requestStatusService.getAllRequestStatus(action?.data).pipe(
                    mergeMap((resp: GetAllRequestStatusResponse) => [
                        RequestStatusActions.onAllRequestStatusSuccess({data: resp?.data}),
                        RequestStatusActions.manageRequestStatusGridLoading({data: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(RequestStatusActions.manageRequestStatusGridLoading({data: false}));
                    })
                )
            )
        )
    );

    createRequestStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RequestStatusActions.createRequestStatus),
            mergeMap((action) =>
                this.requestStatusService.createRequestStatus(action?.data).pipe(
                    tap((resp: CreateRequestStatusResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: CreateRequestStatusResponse) => [
                        RequestStatusActions.showHideRequestStatusForm({show: false}),
                        RequestStatusActions.showRequestStatusFormLoading({show: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(RequestStatusActions.showRequestStatusFormLoading({show: false}));
                    })
                )
            )
        )
    );

    editRequestStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RequestStatusActions.updateRequestStatus),
            mergeMap((action) =>
                this.requestStatusService.updateRequestStatus(action?.requestStatusId, action?.data).pipe(
                    tap((resp: UpdateRequestStatusResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: UpdateRequestStatusResponse) => [
                        RequestStatusActions.showHideRequestStatusForm({show: false}),
                        RequestStatusActions.showRequestStatusFormLoading({show: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(RequestStatusActions.showRequestStatusFormLoading({show: false}));
                    })
                )
            )
        )
    );

    deleteRequestStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RequestStatusActions.deleteRequestStatus),
            mergeMap((action) =>
                this.requestStatusService.deleteRequestStatus(action?.data).pipe(
                    tap((resp: DeleteRequestStatusResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: DeleteRequestStatusResponse) => [
                        RequestStatusActions.getAllRequestStatus({data: this.requestStatusService.lastFilter})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(RequestStatusActions.manageRequestStatusGridLoading({data: false}));
                    })
                )
            )
        )
    );
}