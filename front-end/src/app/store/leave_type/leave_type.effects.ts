import {inject, Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as LeaveTypeActions from "./leave_type.actions";
import {catchError, mergeMap, of, tap} from "rxjs";
import {AlertService} from "@/app/services/alert.service";
import {LeaveTypeService} from "@/app/services/leave-type.service";
import {
    CreateLeaveTypeResponse, DeleteLeaveTypeResponse,
    GetAllLeaveTypeResponse,
    UpdateLeaveTypeResponse
} from "@store/leave_type/leave_type.model";


@Injectable()
export class LeaveTypeEffects {
    private actions$ = inject(Actions);

    constructor(private alertService: AlertService,
                private leaveTypeService: LeaveTypeService) {
    }

    getAllLeaveType$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LeaveTypeActions.getAllLeaveTypes),
            mergeMap((action) =>
                this.leaveTypeService.getAllLeaveType(action?.data).pipe(
                    mergeMap((resp: GetAllLeaveTypeResponse) => [
                        LeaveTypeActions.onAllLeaveTypeSuccess({data: resp?.data}),
                        LeaveTypeActions.manageLeaveTypeGridLoading({data: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(LeaveTypeActions.manageLeaveTypeGridLoading({data: false}));
                    })
                )
            )
        )
    );

    createLeaveType$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LeaveTypeActions.createLeaveType),
            mergeMap((action) =>
                this.leaveTypeService.createLeaveType(action?.data).pipe(
                    tap((resp: CreateLeaveTypeResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: CreateLeaveTypeResponse) => [
                        LeaveTypeActions.showHideLeaveTypeForm({show: false}),
                        LeaveTypeActions.showLeaveTypeFormLoading({show: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(LeaveTypeActions.showLeaveTypeFormLoading({show: false}));
                    })
                )
            )
        )
    );

    editLeaveType$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LeaveTypeActions.updateLeaveType),
            mergeMap((action) =>
                this.leaveTypeService.updateLeaveType(action?.LeaveTypeId, action?.data).pipe(
                    tap((resp: UpdateLeaveTypeResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: UpdateLeaveTypeResponse) => [
                        LeaveTypeActions.showHideLeaveTypeForm({show: false}),
                        LeaveTypeActions.showLeaveTypeFormLoading({show: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(LeaveTypeActions.showLeaveTypeFormLoading({show: false}));
                    })
                )
            )
        )
    );

    deleteLeaveType$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LeaveTypeActions.deleteLeaveType),
            mergeMap((action) =>
                this.leaveTypeService.deleteLeaveType(action?.data).pipe(
                    tap((resp: DeleteLeaveTypeResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: DeleteLeaveTypeResponse) => [
                        LeaveTypeActions.getAllLeaveTypes({data: this.leaveTypeService.lastFilter})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(LeaveTypeActions.manageLeaveTypeGridLoading({data: false}));
                    })
                )
            )
        )
    );
}