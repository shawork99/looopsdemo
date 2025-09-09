import {inject, Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as ShiftActions from "./shift.actions";
import {catchError, mergeMap, of, tap} from "rxjs";
import {AlertService} from "@/app/services/alert.service";
import {ShiftService} from "@/app/services/shift.service";
import {
    CreateShiftResponse,
    DeleteShiftResponse,
    GetAllShiftResponse,
    GetEditShiftResponse,
    UpdateShiftResponse
} from "@store/shift/shift.model";


@Injectable()
export class ShiftEffects {
    private actions$ = inject(Actions);

    constructor(private alertService: AlertService,
                private shiftService: ShiftService) {
    }

    getAllShifts$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ShiftActions.getAllShifts),
            mergeMap((action) =>
                this.shiftService.getAllShifts(action?.data).pipe(
                    mergeMap((resp: GetAllShiftResponse) => [
                        ShiftActions.onGetAllShiftSuccess({data: resp?.data}),
                        ShiftActions.manageShiftGridLoading({data: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(ShiftActions.manageShiftGridLoading({data: false}));
                    })
                )
            )
        )
    );

    createShift$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ShiftActions.createShift),
            mergeMap((action) =>
                this.shiftService.createShift(action?.data).pipe(
                    tap((resp: CreateShiftResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: CreateShiftResponse) => [
                        ShiftActions.showHideShiftForm({show: false}),
                        ShiftActions.showShiftFormLoading({show: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(ShiftActions.showShiftFormLoading({show: false}));
                    })
                )
            )
        )
    );

    editShift$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ShiftActions.updateShift),
            mergeMap((action) =>
                this.shiftService.updateShift(action?.shiftId, action?.data).pipe(
                    tap((resp: UpdateShiftResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: UpdateShiftResponse) => [
                        ShiftActions.showHideShiftForm({show: false}),
                        ShiftActions.showShiftFormLoading({show: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(ShiftActions.showShiftFormLoading({show: false}));
                    })
                )
            )
        )
    );

    getShift$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ShiftActions.onGetEditShift),
            mergeMap((action) =>
                this.shiftService.getEditShift(action?.shiftId).pipe(
                    mergeMap((resp: GetEditShiftResponse) => [
                        ShiftActions.onGetEditShiftSuccess({data: resp?.data})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(ShiftActions.showShiftFormLoading({show: false}));
                    })
                )
            )
        )
    );

    deleteShift$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ShiftActions.deleteShift),
            mergeMap((action) =>
                this.shiftService.deleteShift(action?.data).pipe(
                    tap((resp: DeleteShiftResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: DeleteShiftResponse) => [
                        ShiftActions.getAllShifts({data: this.shiftService.lastFilter})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(ShiftActions.manageShiftGridLoading({data: false}));
                    })
                )
            )
        )
    );
}