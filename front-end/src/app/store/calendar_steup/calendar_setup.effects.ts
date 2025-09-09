import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, EMPTY, map, mergeMap, of, tap } from 'rxjs';
import { AlertService } from '@/app/services/alert.service';
import { CalendarSetupService } from '@/app/services/calendar-setup.service';
import * as CalendarSetupAction from './calendar_setup.actions';
import {
    CreateCalendarSetupResponse,
    DeleteCalendarSetupResponse,
    GetAllCalendarSetupResponse,
    GetEditCalendarSetupResponse,
    UpdateCalendarSetupResponse
} from '@store/calendar_steup/calendar_setup.model';
import { CreateApprovalLevelResponse } from '@store/approval-level/approval-level.model';

@Injectable()
export class CalendarSetupEffects {
    private actions$ = inject(Actions);

    constructor(
        private alertService: AlertService,
        private router: Router,
        private calendarSetupService: CalendarSetupService
    ) {}

    loadCalendarSetupEvents$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CalendarSetupAction.loadCalendarSetupEvents),
            mergeMap(() =>
            this.calendarSetupService.getAllCalendarSetup().pipe(
                map(response => 
                CalendarSetupAction.loadCalendarSetupEventsSuccess({ events: response.data })
                ),
                catchError(error =>
                of(CalendarSetupAction.loadCalendarSetupEventsFailure({ error: error.message }))
                )
            ))
        )
    );


    createApprovalLevel$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CalendarSetupAction.createCalendarSetup),
            mergeMap((action) =>
                this.calendarSetupService.createApprovalLevel(action?.data).pipe(
                    tap((resp: CreateCalendarSetupResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: CreateCalendarSetupResponse) => [
                        CalendarSetupAction.showHideCalendarSetupForm({show: false}),
                        CalendarSetupAction.showCalendarSetupFormLoading({show: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(CalendarSetupAction.showCalendarSetupFormLoading({show: false}));
                    })
                )
            )
        )
    );
    editApprovalLevel$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CalendarSetupAction.updateCalendarSetup),
            mergeMap((action) =>
                this.calendarSetupService.updateCalendarSetup(action?.calendarSetupId, action?.data).pipe(
                    tap((resp: UpdateCalendarSetupResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: UpdateCalendarSetupResponse) => [
                        CalendarSetupAction.showHideCalendarSetupForm({show: false}),
                        CalendarSetupAction.showCalendarSetupFormLoading({show: false})
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(CalendarSetupAction.showCalendarSetupFormLoading({show: false}));
                    })
                )
            )
        )
    );
    
    deleteApprovalLevel$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CalendarSetupAction.deleteCalendarSetup),
            mergeMap((action) =>
                this.calendarSetupService.deleteCalendarSetup(action?.data).pipe(
                    tap((resp: DeleteCalendarSetupResponse) => {
                        this.alertService.showSuccess(resp?.message);
                        return resp;
                    }),
                    mergeMap((resp: DeleteCalendarSetupResponse) => [
                        CalendarSetupAction.loadCalendarSetupEvents()
                    ]),
                    catchError((err) => {
                        this.alertService.showError(err);
                        return of(CalendarSetupAction.manageCalendarSetupLoading({data: false}));
                    })
                )
            )
        )
    );
        
        
    getEditApprovalLevelDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CalendarSetupAction.getEditCalendarSetupDetails),
            mergeMap((action) =>
                this.calendarSetupService.getCalendarSetupForEdit(action?.calendarSetupId).pipe(
                    mergeMap((resp: GetEditCalendarSetupResponse) => [
                        CalendarSetupAction.onEditCalendarSetupDetailSuccess({data: resp?.data})
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
