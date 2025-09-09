import {inject, Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as LeaveGroupActions from "./leave_group.actions";
import {catchError, EMPTY, mergeMap, of, tap} from "rxjs";
import {AlertService} from "@/app/services/alert.service";
import {LeaveGroupService} from "@/app/services/leave-group.service";
import {
    CreateLeaveGroupDResponse,
    CreateLeaveGroupResponse, DeleteLeaveGroupResponse,
    GetAllLeaveGroupResponse, LeaveGroupDFormDataR,
    UpdateLeaveGroupResponse
} from "@store/leave_group/leave_group.model";

@Injectable()
export class LeaveGroupEffects {
    private actions$ = inject(Actions);

    constructor(private alertService: AlertService,
                private leaveGroupService: LeaveGroupService) {
    }

    getAllLeaveGroup$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LeaveGroupActions.getAllLeaveGroups),
            mergeMap((action) =>
                this.leaveGroupService.getAllLeaveGroup(action?.data).pipe(
                    mergeMap((resp: GetAllLeaveGroupResponse) => [
                        LeaveGroupActions.onAllLeaveGroupSuccess({data: resp?.data}),
                        LeaveGroupActions.manageLeaveGroupGridLoading({data: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(LeaveGroupActions.manageLeaveGroupGridLoading({data: false}));
                    })
                )
            )
        )
    );

    createLeaveGroup$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LeaveGroupActions.createLeaveGroup),
            mergeMap((action) =>
                this.leaveGroupService.createLeaveGroup(action?.data).pipe(
                    tap((resp: CreateLeaveGroupResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: CreateLeaveGroupResponse) => [
                        LeaveGroupActions.showHideLeaveGroupForm({show: false}),
                        LeaveGroupActions.showLeaveGroupFormLoading({show: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(LeaveGroupActions.showLeaveGroupFormLoading({show: false}));
                    })
                )
            )
        )
    );

    editLeaveGroup$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LeaveGroupActions.updateLeaveGroup),
            mergeMap((action) =>
                this.leaveGroupService.updateLeaveGroup(action?.LeaveGroupId, action?.data).pipe(
                    tap((resp: UpdateLeaveGroupResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: UpdateLeaveGroupResponse) => [
                        LeaveGroupActions.showHideLeaveGroupForm({show: false}),
                        LeaveGroupActions.showLeaveGroupFormLoading({show: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(LeaveGroupActions.showLeaveGroupFormLoading({show: false}));
                    })
                )
            )
        )
    );

    deleteLeaveGroup$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LeaveGroupActions.deleteLeaveGroup),
            mergeMap((action) =>
                this.leaveGroupService.deleteLeaveGroup(action?.data).pipe(
                    tap((resp: DeleteLeaveGroupResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: DeleteLeaveGroupResponse) => [
                        LeaveGroupActions.getAllLeaveGroups({data: this.leaveGroupService.lastFilter})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(LeaveGroupActions.manageLeaveGroupGridLoading({data: false}));
                    })
                )
            )
        )
    );
//Leave Group Details
    getLeaveGroupDFormData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LeaveGroupActions.getLeaveGroupDFormData),
            mergeMap((action) =>
                this.leaveGroupService.getAllLeaveGroupDFormData(action?.leaveGroupId).pipe(
                    mergeMap((resp: LeaveGroupDFormDataR) => [
                        LeaveGroupActions.onLeaveGroupDFormDataSuccess({data: resp?.data})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return EMPTY;
                        //return of(LeaveTypeActions.manageLeaveTypeGridLoading({data: false}));
                    })
                )
            )
        )
    );


    createLeaveGroupDetail$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LeaveGroupActions.createLeaveGroupDetail),
            mergeMap((action) =>
                this.leaveGroupService.createLeaveGroupDetail(action?.data).pipe(
                    tap((resp: CreateLeaveGroupDResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: CreateLeaveGroupDResponse) => [
                        LeaveGroupActions.showHideLeaveGroupDForm({show: false}),
                        LeaveGroupActions.showLeaveGroupFormLoading({show: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(LeaveGroupActions.showLeaveGroupFormLoading({show: false}));
                    })
                )
            )
        )
    );
}