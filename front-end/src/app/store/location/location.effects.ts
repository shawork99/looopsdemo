import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as LocationActions from "./location.actions";
import { catchError, mergeMap, of, tap } from "rxjs";
import { AlertService } from "@/app/services/alert.service";
import { LocationService } from "@/app/services/location.service";
import {
  CreateLocationResponse,
  DeleteLocationResponse,
  GetAllLocationResponse,
  UpdateLocationResponse
} from "./location.model";

@Injectable()
export class LocationEffects {
  private actions$ = inject(Actions);

  constructor(
    private alertService: AlertService,
    private locationService: LocationService
  ) {}

  getAllLocations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocationActions.getAllLocations),
      mergeMap(action =>
        this.locationService.getAllLocations(action.data).pipe(
          mergeMap((resp: GetAllLocationResponse) => [
            LocationActions.onAllLocationSuccess({ data: resp.data }),
            LocationActions.manageLocationGridLoading({ data: false })
          ]),
          catchError(err => {
            this.alertService.showError(err);
            return of(LocationActions.manageLocationGridLoading({ data: false }));
          })
        )
      )
    )
  );

  createLocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocationActions.createLocation),
      mergeMap(action =>
        this.locationService.createLocation(action.data).pipe(
          tap((resp: CreateLocationResponse) => {
            this.alertService.showSuccess(resp.message);
          }),
          mergeMap(() => [
            LocationActions.showHideLocationForm({ show: false }),
            LocationActions.showLocationFormLoading({ show: false })
          ]),
          catchError(err => {
            this.alertService.showError(err);
            return of(LocationActions.showLocationFormLoading({ show: false }));
          })
        )
      )
    )
  );

  updateLocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocationActions.updateLocation),
      mergeMap(action =>
        this.locationService.updateLocation(action.locationId, action.data).pipe(
          tap((resp: UpdateLocationResponse) => {
            this.alertService.showSuccess(resp.message);
          }),
          mergeMap(() => [
            LocationActions.showHideLocationForm({ show: false }),
            LocationActions.showLocationFormLoading({ show: false })
          ]),
          catchError(err => {
            this.alertService.showError(err);
            return of(LocationActions.showLocationFormLoading({ show: false }));
          })
        )
      )
    )
  );

  deleteLocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocationActions.deleteLocation),
      mergeMap(action =>
        this.locationService.deleteLocation(action.data).pipe(
          tap((resp: DeleteLocationResponse) => {
            this.alertService.showSuccess(resp.message);
          }),
          mergeMap(() => [
            LocationActions.getAllLocations({ data: this.locationService.lastFilter })
          ]),
          catchError(err => {
            this.alertService.showError(err);
            return of(LocationActions.manageLocationGridLoading({ data: false }));
          })
        )
      )
    )
  );
}
