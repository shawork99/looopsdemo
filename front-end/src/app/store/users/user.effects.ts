import {inject, Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Router} from "@angular/router";
import {catchError, EMPTY, mergeMap, of, tap} from "rxjs";
import {AlertService} from "@/app/services/alert.service";
import {UserService} from "@/app/services/user.service";
import * as UserActions from "./user.actions";
import {
    CreateUserResponse,
    DeleteUserResponse,
    GetAllUsersResponse, GetEditUserResponse,
    GetUserFormDataResponse,
    UpdateUserResponse, UserPasswordResetResponse,SendPasswordMailResponse
} from "@store/users/user.model";
import {onShowPasswordResetForm} from "./user.actions";


@Injectable()
export class UserEffects {
    private actions$ = inject(Actions);

    constructor(private alertService: AlertService,
                private router: Router,
                private userService: UserService) {
    }


    getUserFormData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.getFormData),
            mergeMap((action) =>
                this.userService.getFormData().pipe(
                    mergeMap((resp: GetUserFormDataResponse) => [
                        UserActions.onGetFormDataSuccess({data: resp?.data})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return EMPTY;
                    })
                )
            )
        )
    );


    getAllUsers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.getAllUsers),
            mergeMap((action) =>
                this.userService.getAllUsers(action?.data).pipe(
                    mergeMap((resp: GetAllUsersResponse) => [
                        UserActions.onAllUsersSuccess({data: resp?.data}),
                        UserActions.manageUserLoading({data: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(UserActions.manageUserLoading({data: false}));
                    })
                )
            )
        )
    );

    createUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.createUser),
            mergeMap((action) =>
                this.userService.createUser(action?.data).pipe(
                    tap((resp: CreateUserResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: CreateUserResponse) => [
                        UserActions.showHideUserForm({show: false}),
                        UserActions.showUserFormLoading({show: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(UserActions.showUserFormLoading({show: false}));
                    })
                )
            )
        )
    );

    editUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.updateUser),
            mergeMap((action) =>
                this.userService.updateUser(action?.userId, action?.data).pipe(
                    tap((resp: UpdateUserResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: UpdateUserResponse) => [
                        UserActions.showHideUserForm({show: false}),
                        UserActions.showUserFormLoading({show: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(UserActions.showUserFormLoading({show: false}));
                    })
                )
            )
        )
    );

    resetUserPassword$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.onResetUserPassword),
            mergeMap((action) =>
                this.userService.resetUserPassword(action?.data).pipe(
                    tap((resp: UserPasswordResetResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: UpdateUserResponse) => [
                        UserActions.onShowPasswordResetForm({show: false}),
                        UserActions.showUserFormLoading({show: false}),
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(UserActions.showUserFormLoading({show: false}));
                    })
                )
            )
        )
    );

    deleteUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.deleteUser),
            mergeMap((action) =>
                this.userService.deleteUser(action?.data).pipe(
                    tap((resp: DeleteUserResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: DeleteUserResponse) => [
                        UserActions.getAllUsers({data: this.userService.lastFilter})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(UserActions.manageUserLoading({data: false}));
                    })
                )
            )
        )
    );


    getUserForEdit$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.getEditUserDetails),
            mergeMap((action) =>
                this.userService.getUserForEdit(action?.userId).pipe(
                    mergeMap((resp: GetEditUserResponse) => [
                        UserActions.onEditUserDetailSuccess({data: resp?.data})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return EMPTY;
                    })
                )
            )
        )
    );

    sendUserPasswordMail$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.onSendUserPasswordMail),
            mergeMap(({ userId }) =>
            this.userService.SendPasswordMail(userId).pipe(
                tap((res: SendPasswordMailResponse) => {
                this.alertService.showSuccess(res.message || "Password mail sent successfully");
                }),
                mergeMap(() => of(UserActions.onSendUserPasswordMailSuccess())),
                catchError((error) => {
                this.alertService.showError(error?.error?.message );
                return of(UserActions.onSendUserPasswordMailFailure({ error }));
                })
            )
            )
        )
    );

    downloadExcel$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.onDownloadExcel),
            mergeMap(({ filters }) =>
            this.userService.downloadExcel(filters).pipe(
                tap((blob: Blob) => {
                // Trigger file download
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const now = new Date();
                const formatted = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')} ` +
                                    `${now.getHours().toString().padStart(2,'0')}.${now.getMinutes().toString().padStart(2,'0')}.${now.getSeconds().toString().padStart(2,'0')}`;

                a.download = `User Details (${formatted}).xlsx`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                }),
                mergeMap(() => of(UserActions.onDownloadExcelSuccess())),
                catchError((error) => {
                this.alertService.showError(error?.error?.message || 'Excel download failed');
                return of(UserActions.onDownloadExcelFailure({ error }));
                })
            )
            )
        )
    );

}