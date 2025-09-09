 import {inject, Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Router} from "@angular/router";
import {catchError, EMPTY, mergeMap, of, tap} from "rxjs";
import {AlertService} from "@/app/services/alert.service";
import {ApprovalsService} from "@/app/services/approvals.service";
import * as ApprovalsAction from "./approvals.actions";
import {
    GetAllApprovalsResponse,
    ApproveDocumentResponse
} from "@store/approvals/approvals.model";

@Injectable()
export class ApprovalsEffects {
private actions$ = inject(Actions);

    constructor(
        private alertService: AlertService,
        private router: Router,
        private approvalsService: ApprovalsService
    ) {}

    getAllApprovals$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ApprovalsAction.getAllApprovals),
            mergeMap((action) =>
                this.approvalsService.getAllApprovals(action?.data).pipe(
                    mergeMap((resp: GetAllApprovalsResponse) => [
                        ApprovalsAction.onAllApprovalsSuccess({data: resp?.data}),
                        ApprovalsAction.manageApprovalsLoading({data: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(ApprovalsAction.manageApprovalsLoading({data: false}));
                    })
                )
            )
        )
    );
    approveDocument$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ApprovalsAction.approveDocument),
            mergeMap((action) =>
                this.approvalsService.approveDocument(action?.data).pipe(
                    tap((resp: ApproveDocumentResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: ApproveDocumentResponse) => [
                        ApprovalsAction.approveDocumentSuccess({data: resp}),
                        ApprovalsAction.getAllApprovals({data: {search: null, perPage: 10, page: 1}})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(ApprovalsAction.manageApprovalsLoading({ data: false }));
                    })
                )
            )
        )
    );
}