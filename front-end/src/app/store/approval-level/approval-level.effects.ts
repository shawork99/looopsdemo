import {inject, Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Router} from "@angular/router";
import {catchError, EMPTY, mergeMap, of, tap} from "rxjs";
import {AlertService} from "@/app/services/alert.service";
import {ApprovalLevelService} from "@/app/services/approval-level.service";
import * as ApprovalLevelAction from "./approval-level.actions";
import {
    CreateApprovalLevelResponse,
    DeleteApprovalLevelResponse,
    GetAllApprovalLevelResponse, GetEditApprovalLevelResponse,
    GetApprovalLevelFormDataResponse,
    UpdateApprovalLevelResponse,
    GetApproverRoleIDResponse,
} from "@store/approval-level/approval-level.model";

@Injectable()
export class ApprovalLevelEffects {
private actions$ = inject(Actions);

    constructor(private alertService: AlertService,
                private router: Router,
                private approvalLevelService: ApprovalLevelService) {
    }

    getApprovalLevelFormData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ApprovalLevelAction.getFormData),
            mergeMap((action) =>
                this.approvalLevelService.getFormData().pipe(
                    mergeMap((resp: GetApprovalLevelFormDataResponse) => [
                        ApprovalLevelAction.onGetFormDataSuccess({data: resp?.data})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return EMPTY;
                    })
                )
            )
        )
    );

    getAllApprovalLevels$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ApprovalLevelAction.getAllApprovalLevels),
            mergeMap((action) =>
                this.approvalLevelService.getAllApprovalLevels(action?.data).pipe(
                    mergeMap((resp: GetAllApprovalLevelResponse) => [
                        ApprovalLevelAction.onAllApprovalLevelsSuccess({data: resp?.data}),
                        ApprovalLevelAction.manageApprovalLevelLoading({data: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(ApprovalLevelAction.manageApprovalLevelLoading({data: false}));
                    })
                )
            )
        )
    );

    createApprovalLevel$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ApprovalLevelAction.createApprovalLevel),
            mergeMap((action) =>
                this.approvalLevelService.createApprovalLevel(action?.data).pipe(
                    tap((resp: CreateApprovalLevelResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: CreateApprovalLevelResponse) => [
                        ApprovalLevelAction.showHideApprovalLevelForm({show: false}),
                        ApprovalLevelAction.showApprovalLevelFormLoading({show: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(ApprovalLevelAction.showApprovalLevelFormLoading({show: false}));
                    })
                )
            )
        )
    );
    editApprovalLevel$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ApprovalLevelAction.updateApprovalLevel),
            mergeMap((action) =>
                this.approvalLevelService.updateApprovalLevel(action?.approvalLevelId, action?.data).pipe(
                    tap((resp: UpdateApprovalLevelResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: UpdateApprovalLevelResponse) => [
                        ApprovalLevelAction.showHideApprovalLevelForm({show: false}),
                        ApprovalLevelAction.showApprovalLevelFormLoading({show: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(ApprovalLevelAction.showApprovalLevelFormLoading({show: false}));
                    })
                )
            )
        )
    );

    deleteApprovalLevel$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ApprovalLevelAction.deleteApprovalLevel),
            mergeMap((action) =>
                this.approvalLevelService.deleteApprovalLevel(action?.data).pipe(
                    tap((resp: DeleteApprovalLevelResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: DeleteApprovalLevelResponse) => [
                        ApprovalLevelAction.getAllApprovalLevels({data: this.approvalLevelService.lastFilter})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(ApprovalLevelAction.manageApprovalLevelLoading({data: false}));
                    })
                )
            )
        )
    );
    
    
    getEditApprovalLevelDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ApprovalLevelAction.getEditApprovalLevelDetails),
            mergeMap((action) =>
                this.approvalLevelService.getApprovalLevelForEdit(action?.approvalLevelId).pipe(
                    mergeMap((resp: GetEditApprovalLevelResponse) => [
                        ApprovalLevelAction.onEditApprovalLevelDetailSuccess({data: resp?.data})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return EMPTY;
                    })
                )
            )
        )
    );

    getApproverRoleID$ = createEffect(() => 
        this.actions$.pipe(
            ofType(ApprovalLevelAction.getApproverRoleID),
            mergeMap((action) =>
                this.approvalLevelService.getApproverRoleID(action.roleId).pipe(
                    mergeMap((resp: GetApproverRoleIDResponse) => [
                        ApprovalLevelAction.onGetApproverRoleIDSuccess({data: resp?.data})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return EMPTY;
                    })
                )
            )
        )
    );
}