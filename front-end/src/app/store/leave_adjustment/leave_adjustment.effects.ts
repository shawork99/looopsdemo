import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Router } from "@angular/router";
import { catchError, EMPTY, mergeMap, of, tap } from "rxjs";
import { AlertService } from "@/app/services/alert.service";
import { LeaveAdjustmentService } from "@/app/services/leave-adjustment.service";
import * as LeaveAdjustmentAction from "./leave_adjustment.actions";
import {
    CreateLeaveAdjustmentResponse,
    DeleteLeaveAdjustmentResponse,
    GetAllLeaveAdjustmentResponse,
    GetEditLeaveAdjustmentResponse,
    UpdateLeaveAdjustmentResponse,
    GetLeaveAdjustmentFormDataResponse,
    GetLeaveAdjustmentDetailFormDataResponse,
    CreateLeaveAdjustmentDetailResponse,
    GetLeaveAdjustmentDetailsResponse,
    SaveLeaveAdjustmentDetailsResponse,
    DeleteLeaveAdjustmentDetailResponse
} from "@store/leave_adjustment/leave_adjustment.model";

@Injectable()
export class LeaveAdjustmentEffects {
    private actions$ = inject(Actions);

    constructor(
        private alertService: AlertService,
        private router: Router,
        private leaveAdjustmentService: LeaveAdjustmentService) {
    }

    getAllLeaveAdjustment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LeaveAdjustmentAction.getAllLeaveAdjustment),
            mergeMap((action) =>
                this.leaveAdjustmentService.getAllLeaveAdjustment(action?.data).pipe(
                    mergeMap((resp: GetAllLeaveAdjustmentResponse) => [
                        LeaveAdjustmentAction.onAllLeaveAdjustmentSuccess({data: resp?.data}),
                        LeaveAdjustmentAction.manageLeaveAdjustmentLoading({data: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(LeaveAdjustmentAction.manageLeaveAdjustmentLoading({data: false}));
                    })
                )
            )
        )
    );

    createLeaveAdjustment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LeaveAdjustmentAction.createLeaveAdjustment),
            mergeMap((action) =>
                this.leaveAdjustmentService.createLeaveAdjustment(action?.data).pipe(
                    tap((resp: CreateLeaveAdjustmentResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: CreateLeaveAdjustmentResponse) => [
                        LeaveAdjustmentAction.showHideLeaveAdjustmentForm({show: false}),
                        LeaveAdjustmentAction.showLeaveAdjustmentFormLoading({show: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(LeaveAdjustmentAction.showLeaveAdjustmentFormLoading({show: false}));
                    })
                )
            )
        )
    );

    editLeaveAdjustment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LeaveAdjustmentAction.updateLeaveAdjustment),
            mergeMap((action) =>
                this.leaveAdjustmentService.updateLeaveAdjustment(action?.leaveAdjustmentID, action?.data).pipe(
                    tap((resp: UpdateLeaveAdjustmentResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        this.router.navigate(['/leave_adjustment']);
                        return resp;
                    }),
                    mergeMap((resp: UpdateLeaveAdjustmentResponse) => [
                        LeaveAdjustmentAction.showHideLeaveAdjustmentForm({show: false}),
                        LeaveAdjustmentAction.showLeaveAdjustmentFormLoading({show: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(LeaveAdjustmentAction.showLeaveAdjustmentFormLoading({show: false}));
                    })
                )
            )
        )
    );

    deleteLeaveAdjustment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LeaveAdjustmentAction.deleteLeaveAdjustment),
            mergeMap((action) =>
                this.leaveAdjustmentService.deleteLeaveAdjustment(action?.data).pipe(
                    tap((resp: DeleteLeaveAdjustmentResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: DeleteLeaveAdjustmentResponse) => [
                        LeaveAdjustmentAction.getAllLeaveAdjustment({data: this.leaveAdjustmentService.lastFilter})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(LeaveAdjustmentAction.manageLeaveAdjustmentLoading({data: false}));
                    })
                )
            )
        )
    );
    getEditLeaveAdjustmentDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LeaveAdjustmentAction.getEditLeaveAdjustmentDetails),
            mergeMap((action) =>
                this.leaveAdjustmentService.getLeaveAdjustmentForEdit(action?.leaveAdjustmentID).pipe(
                    mergeMap((resp: GetEditLeaveAdjustmentResponse) => [
                        LeaveAdjustmentAction.onEditLeaveAdjustmentDetailSuccess({data: resp?.data})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return EMPTY;
                    })
                )
            )
        )
    );
    getLeaveAdjustmentFormData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LeaveAdjustmentAction.getFormData),
            mergeMap((action) =>
                this.leaveAdjustmentService.getFormData().pipe(
                    mergeMap((resp: GetLeaveAdjustmentFormDataResponse) => [
                        LeaveAdjustmentAction.onGetFormDataSuccess({data: resp?.data})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return EMPTY;
                    })
                )
            )
        )
    );

    // Leave Adjustment Details

    getLeaveAdjustmentDetailFormData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LeaveAdjustmentAction.getDetailFormData),
            mergeMap((action) =>
            this.leaveAdjustmentService.getDetailFormData(action.leaveGroupID).pipe(
                mergeMap((resp: GetLeaveAdjustmentDetailFormDataResponse) => [
                LeaveAdjustmentAction.onGetDetailFormDataSuccess({ data: resp.data })
                ]),
                catchError((err) => {
                this.alertService.showError(err);
                return EMPTY;
                })
            )
            )
        )
    );

    createLeaveAdjustmentDetail$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LeaveAdjustmentAction.createLeaveAdjustmentDetail),
            mergeMap((action) =>
                this.leaveAdjustmentService.createLeaveAdjustmentDetail(action?.data).pipe(
                    tap((resp: CreateLeaveAdjustmentDetailResponse) => {
                        this.alertService.showSuccess(resp?.message);
                            return resp;
                        }),
                    mergeMap((resp: CreateLeaveAdjustmentDetailResponse) => [
                        LeaveAdjustmentAction.showHideLeaveAdjustmentDetailForm({show: false}),
                        LeaveAdjustmentAction.showLeaveAdjustmentDetailFormLoading({show: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(LeaveAdjustmentAction.showLeaveAdjustmentDetailFormLoading({show: false}));
                    })
                )
            )
        )
    );

    loadLeaveAdjustmentDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LeaveAdjustmentAction.loadLeaveAdjustmentDetails),
            mergeMap(action =>
                this.leaveAdjustmentService.getDetails(action.leaveAdjustmentID).pipe(
                    mergeMap((resp: GetLeaveAdjustmentDetailsResponse) => [
                        LeaveAdjustmentAction.loadLeaveAdjustmentDetailsSuccess({
                            data: {
                            leaveTypes: resp.data.leave_types,
                            items: resp.data.items
                            }
                        })
                    ]),
                    catchError(err => {
                        this.alertService.showError(err);
                        return of(LeaveAdjustmentAction.loadLeaveAdjustmentDetailsFailure({ error: err }));
                    })
                )
            )
        )
    );

    saveLeaveAdjustmentDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LeaveAdjustmentAction.saveLeaveAdjustmentDetails),
            mergeMap(action =>
                this.leaveAdjustmentService.saveDetails(action.payload).pipe(
                    tap((resp: SaveLeaveAdjustmentDetailsResponse) => this.alertService.showSuccess(resp.message)),
                    mergeMap((resp: SaveLeaveAdjustmentDetailsResponse) => [
                        LeaveAdjustmentAction.saveLeaveAdjustmentDetailsSuccess({ resp }),
                        LeaveAdjustmentAction.loadLeaveAdjustmentDetails({ leaveAdjustmentID: action.payload.leave_adjustment_id })
                    ]),
                    catchError(err => {
                        this.alertService.showError(err);
                        return of(LeaveAdjustmentAction.saveLeaveAdjustmentDetailsFailure({ error: err }));
                    })
                )
            )
        )
    );

    deleteLeaveAdjustmentRow$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LeaveAdjustmentAction.deleteLeaveAdjustmentDetail),
            mergeMap( action => 
                this.leaveAdjustmentService.deleteDetails(action.payload).pipe(
                    tap((resp: DeleteLeaveAdjustmentDetailResponse) => this.alertService.showSuccess(resp.message)),
                    mergeMap((resp: DeleteLeaveAdjustmentDetailResponse) => [
                        LeaveAdjustmentAction.deleteLeaveAdjustmentDetailSuccess({resp}),
                        LeaveAdjustmentAction.loadLeaveAdjustmentDetails({leaveAdjustmentID: action.payload.leave_adjustment_id})
                    ]),
                    catchError(err => {
                        this.alertService.showError(err);
                        return of(LeaveAdjustmentAction.deleteLeaveAdjustmentDetailFailure({error: err}));
                    })
                )
            )
        )
    );

}