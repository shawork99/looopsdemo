import {inject, Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as DepartmentActions from "./department.actions";
import {catchError, EMPTY, mergeMap, of, tap} from "rxjs";
import {AlertService} from "@/app/services/alert.service";
import {DepartmentService} from "@/app/services/department.service";
import {
    CreateDepartmentResponse, DeleteDepartmentResponse,
    GetAllDepartmentResponse,
    UpdateDepartmentResponse
} from "@store/department/department.model";


@Injectable()
export class DepartmentEffects {
    private actions$ = inject(Actions);

    constructor(private alertService: AlertService,
                private departmentService: DepartmentService) {
    }

    getAllDepartment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DepartmentActions.getAllDepartments),
            mergeMap((action) =>
                this.departmentService.getAllDepartment(action?.data).pipe(
                    mergeMap((resp: GetAllDepartmentResponse) => [
                        DepartmentActions.onAllDepartmentSuccess({data: resp?.data}),
                        DepartmentActions.manageDepartmentGridLoading({data: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(DepartmentActions.manageDepartmentGridLoading({data: false}));
                    })
                )
            )
        )
    );

    createDepartment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DepartmentActions.createDepartment),
            mergeMap((action) =>
                this.departmentService.createDepartment(action?.data).pipe(
                    tap((resp: CreateDepartmentResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: CreateDepartmentResponse) => [
                        DepartmentActions.showHideDepartmentForm({show: false}),
                        DepartmentActions.showDepartmentFormLoading({show: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(DepartmentActions.showDepartmentFormLoading({show: false}));
                    })
                )
            )
        )
    );

    editDepartment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DepartmentActions.updateDepartment),
            mergeMap((action) =>
                this.departmentService.updateDepartment(action?.departmentId, action?.data).pipe(
                    tap((resp: UpdateDepartmentResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: UpdateDepartmentResponse) => [
                        DepartmentActions.showHideDepartmentForm({show: false}),
                        DepartmentActions.showDepartmentFormLoading({show: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(DepartmentActions.showDepartmentFormLoading({show: false}));
                    })
                )
            )
        )
    );

    deleteDepartment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DepartmentActions.deleteDepartment),
            mergeMap((action) =>
                this.departmentService.deleteDepartment(action?.data).pipe(
                    tap((resp: DeleteDepartmentResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: DeleteDepartmentResponse) => [
                        DepartmentActions.getAllDepartments({data:this.departmentService.lastFilter})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(DepartmentActions.manageDepartmentGridLoading({data: false}));
                    })
                )
            )
        )
    );
}