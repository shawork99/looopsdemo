import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of,tap } from "rxjs";
import { AlertService } from "@/app/services/alert.service";
import * as Profileaction from "./profile_details.action";
import { ProfileDetailsService } from "@/app/services/profile-details.service";
import { UpdateProfiledetails } from "./profile_details.model";

@Injectable()
export class ProfiledetailsEffect {
  private actions$ = inject(Actions);

  constructor(private alertService: AlertService, private profileDetailsService: ProfileDetailsService) {}


  loadprofile$ = createEffect(() =>
  this.actions$.pipe(
    ofType(Profileaction.loadProfileDetails),
    mergeMap(() =>
      this.profileDetailsService.getProfileDetails().pipe(
        map(response => Profileaction.loadProfileDetailsSuccess({ profile: response.data })),
        catchError(error => of(Profileaction.loadProfileDetailsFailure({ error })))
      )
    )
  )
);

updatePassword$ = createEffect(() =>
  this.actions$.pipe(
    ofType(Profileaction.updatePassword),
    mergeMap(({ id, data }) =>
      this.profileDetailsService.updatePassword(id, data).pipe(
        map(response => Profileaction.updatePasswordSuccess({ message: response.message })),
        catchError(err => of(Profileaction.updatePasswordFailure({ error: err })))
      )
    )
  )
);


showSuccess$ = createEffect(() =>
  this.actions$.pipe(
    ofType(Profileaction.updatePasswordSuccess),
    tap(({ message }) => {
      this.alertService.showSuccess(message);
    })
  ),
  { dispatch: false }
);

showError$ = createEffect(() =>
  this.actions$.pipe(
    ofType(Profileaction.updatePasswordFailure),
    tap(({ error }) => {
      const message = extractErrorMessage(error);
      this.alertService.showError(message);
    })
  ),
  { dispatch: false }
);
}

function extractErrorMessage(err: any): string {
  if (typeof err === 'string') return err;
  if (err?.error?.message) return err.error.message;
  if (err?.message) return err.message;
  return 'Password update failed';
}

