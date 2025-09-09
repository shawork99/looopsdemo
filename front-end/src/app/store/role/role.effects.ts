import {inject, Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Router} from "@angular/router";
import * as RoleActions from "./role.actions";
import {catchError, EMPTY, mergeMap, tap} from "rxjs";
import {AlertService} from "@/app/services/alert.service";
import {RoleService} from "@/app/services/role.service";
import {CreateRoleResponse, DeleteRoleResponse, GetAllRolesResponse, UpdateRoleResponse} from "@store/role/role.model";


@Injectable()
export class RoleEffects {
    private actions$ = inject(Actions);

    constructor(private alertService: AlertService,
                private router: Router,
                private roleService: RoleService) {
    }


    getAllRoles$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RoleActions.getAllRoles),
            mergeMap((action) =>
                this.roleService.getAllRoles(action?.data).pipe(
                    mergeMap((resp: GetAllRolesResponse) => [
                        RoleActions.onAllRolesSuccess({data: resp?.data}),
                        RoleActions.manageRoleLoading({data: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        RoleActions.manageRoleLoading({data: false});
                        return EMPTY;
                    })
                )
            )
        )
    );

    createRole$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RoleActions.createRole),
            mergeMap((action) =>
                this.roleService.createRole(action?.data).pipe(
                    tap((resp: CreateRoleResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: CreateRoleResponse) => [
                        RoleActions.showHideRoleForm({show: false}),
                        RoleActions.showRoleFormLoading({show: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        RoleActions.showRoleFormLoading({show: false})
                        return EMPTY;
                    })
                )
            )
        )
    );

    editRole$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RoleActions.updateRole),
            mergeMap((action) =>
                this.roleService.updateRole(action?.roleId, action?.data).pipe(
                    tap((resp: UpdateRoleResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: UpdateRoleResponse) => [
                        RoleActions.showHideRoleForm({show: false}),
                        RoleActions.showRoleFormLoading({show: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        RoleActions.showRoleFormLoading({show: false})
                        return EMPTY;
                    })
                )
            )
        )
    );

    deleteRole$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RoleActions.deleteRole),
            mergeMap((action) =>
                this.roleService.deleteRole(action?.data).pipe(
                    tap((resp: DeleteRoleResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: DeleteRoleResponse) => [
                        RoleActions.getAllRoles({data:this.roleService.lastFilter})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        RoleActions.manageRoleLoading({data: false});
                        return EMPTY;
                    })
                )
            )
        )
    );
}