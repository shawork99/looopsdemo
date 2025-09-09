import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as SupplierActions from './supplier.actions';
import { catchError, mergeMap, of, tap } from 'rxjs';
import { SupplierService } from '@/app/services/supplier.service';
import { AlertService } from '@/app/services/alert.service';
import {
  CreateSupplierResponse,
  DeleteSupplierResponse,
  GetAllSupplierResponse,
  UpdateSupplierResponse
} from './supplier.model';

@Injectable()
export class SupplierEffects {
  private actions$ = inject(Actions);

  constructor(
    private supplierService: SupplierService,
    private alertService: AlertService
) {}

  getAllSuppliers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SupplierActions.loadSuppliers),
      mergeMap(action =>
        this.supplierService.getAllSuppliers(action.data).pipe(
          mergeMap((resp: GetAllSupplierResponse) => [
            SupplierActions.loadSuppliersSuccess({ data: resp.data }),
            SupplierActions.manageSupplierGridLoading({ data: false })
          ]),
          catchError(err => {
            this.alertService.showError(err);
            return of(SupplierActions.manageSupplierGridLoading({ data: false }));
          })
        )
      )
    )
  );

  deleteCustomer$ = createEffect(() =>
      this.actions$.pipe(
        ofType(SupplierActions.deleteSupplier),
        mergeMap(action =>
          this.supplierService.deleteSupplier(action.data).pipe(
            tap((resp: DeleteSupplierResponse) => this.alertService.showSuccess(resp.message)),
            mergeMap(() => [
              SupplierActions.loadSuppliers({ data: this.supplierService.lastFilter })
            ]),
            catchError(err => {
              this.alertService.showError(err);
              return of(SupplierActions.manageSupplierGridLoading({ data: false }));
            })
          )
        )
      )
    );

    createCustomer$ = createEffect(() =>
        this.actions$.pipe(
          ofType(SupplierActions.createSupplier),
          mergeMap(action =>
            this.supplierService.createSupplier(action.data).pipe(
              tap((resp: CreateSupplierResponse) => this.alertService.showSuccess(resp.message)),
              mergeMap(() => [
                SupplierActions.showHideSupplierForm({ show: false }),
                SupplierActions.showSupplierFormLoading({ show: false })
              ]),
              catchError(err => {
                this.alertService.showError(err);
                return of(SupplierActions.showSupplierFormLoading({ show: false }));
              })
            )
          )
        )
      );

  updateCustomer$ = createEffect(() =>
      this.actions$.pipe(
        ofType(SupplierActions.updateSupplier),
        mergeMap(action =>
          this.supplierService.updateSupplier(action.supplierId, action.data).pipe(
            tap((resp: UpdateSupplierResponse) => this.alertService.showSuccess(resp.message)),
            mergeMap(() => [
              SupplierActions.showHideSupplierForm({ show: false }),
              SupplierActions.showSupplierFormLoading({ show: false })
            ]),
            catchError(err => {
              this.alertService.showError(err);
              return of(SupplierActions.showSupplierFormLoading({ show: false }));
            })
          )
        )
      )
    );

  
}
