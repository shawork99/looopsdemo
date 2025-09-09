import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of,tap } from "rxjs";
import { AlertService } from "@/app/services/alert.service";
import * as CompanyActions from "./company_configuration.action";
import { CompanyConfigurationService } from "@/app/services/company-configuration.service";
import { UpdateCompanyResponse } from "./company_configuration.model";

@Injectable()
export class CompanyConfigurationEffects {
  private actions$ = inject(Actions);
  private companyService = inject(CompanyConfigurationService);

  constructor(private alertService: AlertService, private companyservice: CompanyConfigurationService) {}


  loadCompany$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CompanyActions.loadCompanyInfo),
    mergeMap(() =>
      this.companyService.getCompanyInfo().pipe(
        map(response => CompanyActions.loadCompanyInfoSuccess({ company: response.data })),
        catchError(error => of(CompanyActions.loadCompanyInfoFailure({ error })))
      )
    )
  )
);

 updateCompanyInfo$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CompanyActions.updateCompanyInfo),
    mergeMap(action =>
      this.companyService.updateCompanyInfo(action.id, action.data).pipe(
        tap((resp: UpdateCompanyResponse) => {
          this.alertService.showSuccess(resp.message);
        }),
        mergeMap((resp) => [
          CompanyActions.updateCompanyInfoSuccess({ message: resp.message })
        ]),
        catchError(err => {
          this.alertService.showError(err);
          return of(CompanyActions.updateCompanyInfoFailure({ error: err }));
        })
      )
    )
  )
);

}
