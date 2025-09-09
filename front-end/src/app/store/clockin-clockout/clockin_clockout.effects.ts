import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ClockinoutActions from './clockin_clockout.action';
import { catchError, mergeMap, of, tap } from 'rxjs';
import { ClockinClockoutservice } from '@/app/services/clockin-clockout.service';
import { AlertService } from '@/app/services/alert.service';
import { clockinclockout, load_profile, load_clockinoutprfile, clockinrespons, clockoutrespons } from './clockin_clockout.model';

@Injectable()
export class ClockinoutEffects {
  private actions$ = inject(Actions);

  constructor(
    private clockinoutservice: ClockinClockoutservice,
    private alertService: AlertService
  ) {}

  getuserdata$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClockinoutActions.loadprfiledata),
      mergeMap(action =>
        this.clockinoutservice.getprofileuserdata().pipe(
          mergeMap((resp: load_clockinoutprfile) => [
            ClockinoutActions.loadprfiledataSuccess({ data: resp.data })
          ]),
          catchError(err => {
            this.alertService.showError(err);
            return of(ClockinoutActions.loadprfiledataFailure({ error: err }));
          })
        )
      )
    )
  );

  loadClockinoutDetails$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ClockinoutActions.loadClockinoutDetails),
    mergeMap(() =>
      this.clockinoutservice.getClockinoutDetails().pipe(
        mergeMap((resp: any) => [
          ClockinoutActions.loadClockinoutDetailsSuccess({ data: resp.data })
        ]),
        catchError(err => {
          this.alertService.showError(err);
          return of(ClockinoutActions.loadClockinoutDetailsFailure({ error: err }));
        })
      )
    )
  )
);

  loadattandacestsatus$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ClockinoutActions.loadattandacestsatus),
    mergeMap(() =>
      this.clockinoutservice.getattandancestatus().pipe(
        mergeMap((resp: any) => [
          ClockinoutActions.loadattandacestsatusSuccess({ data: resp.data })
        ]),
        catchError(err => {
          this.alertService.showError(err);
          return of(ClockinoutActions.loadattandacestsatusFailure({ error: err }));
        })
      )
    )
  )
);


  loadallinandoutdata$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ClockinoutActions.loadallinandout),
    mergeMap(() =>
      this.clockinoutservice.getallclockinoutsfortheday().pipe(
        mergeMap((resp: any) => [
          ClockinoutActions.loadallinandoutSuccess({ data: resp.data })
        ]),
        catchError(err => {
          this.alertService.showError(err);
          return of(ClockinoutActions.loadallinandoutFailure({ error: err }));
        })
      )
    )
  )
);





  clockIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClockinoutActions.clockIn),
      mergeMap(action =>
        this.clockinoutservice.clockIn(action.userId, action.comment).pipe(
          tap((resp: clockinrespons)=>{
              this.alertService.showSuccess(resp.message);
          }),
          mergeMap((resp) => [
            ClockinoutActions.clockInSuccess({ data: resp })
          ]),

          catchError(err => {
            this.alertService.showError(err);
            return of(ClockinoutActions.clockInFailure({ error: err }));
          })
        )
      )
    )
  );

  clockOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClockinoutActions.clockOut),
      mergeMap(action =>
        this.clockinoutservice.clockOut(action.userId, action.comment).pipe(
            tap((resp: clockoutrespons)=>{
              this.alertService.showSuccess(resp.message);
          }),
          mergeMap((resp) => [
            ClockinoutActions.clockOutSuccess({ data: resp })
          ]),
          catchError(err => {
            this.alertService.showError(err);
            return of(ClockinoutActions.clockOutFailure({ error: err }));
          })
        )
      )
    )
  );

  loadWishes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClockinoutActions.loadWishes),
      mergeMap(() =>
        this.clockinoutservice.getWishes().pipe(
          mergeMap((resp: any) => [
            ClockinoutActions.loadWishesSuccess({
              userMessage: resp.data?.user_message ?? null,
              otherCelebrantsMessage: resp.data?.other_message ?? null,
            })
          ]),
          catchError((err) => {
            this.alertService.showError(err);
            return of(ClockinoutActions.loadWishesFailure({ error: err }));
          })
        )
      )
    )
  );

}
