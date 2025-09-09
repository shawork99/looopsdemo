import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as CustomerActions from "./customer.actions";
import { catchError, mergeMap, of, tap } from "rxjs";
import { AlertService } from "@/app/services/alert.service";
import { CustomerService } from "@/app/services/customer.service";
import {
  CreateCustomerResponse,
  DeleteCustomerResponse,
  GetAllCustomerResponse,
  UpdateCustomerResponse
} from "./customer.model";

@Injectable()
export class CustomerEffects {
  private actions$ = inject(Actions);

  constructor(private alertService: AlertService, private customerService: CustomerService) {}

  getAllCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.getAllCustomers),
      mergeMap(action =>
        this.customerService.getAllCustomers(action.data).pipe(
          mergeMap((resp: GetAllCustomerResponse) => [
            CustomerActions.onAllCustomerSuccess({ data: resp.data }),
            CustomerActions.manageCustomerGridLoading({ data: false })
          ]),
          catchError(err => {
            this.alertService.showError(err);
            return of(CustomerActions.manageCustomerGridLoading({ data: false }));
          })
        )
      )
    )
  );

  createCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.createCustomer),
      mergeMap(action =>
        this.customerService.createCustomer(action.data).pipe(
          tap((resp: CreateCustomerResponse) => this.alertService.showSuccess(resp.message)),
          mergeMap(() => [
            CustomerActions.showHideCustomerForm({ show: false }),
            CustomerActions.showCustomerFormLoading({ show: false })
          ]),
          catchError(err => {
            this.alertService.showError(err);
            return of(CustomerActions.showCustomerFormLoading({ show: false }));
          })
        )
      )
    )
  );

  updateCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.updateCustomer),
      mergeMap(action =>
        this.customerService.updateCustomer(action.customerId, action.data).pipe(
          tap((resp: UpdateCustomerResponse) => this.alertService.showSuccess(resp.message)),
          mergeMap(() => [
            CustomerActions.showHideCustomerForm({ show: false }),
            CustomerActions.showCustomerFormLoading({ show: false })
          ]),
          catchError(err => {
            this.alertService.showError(err);
            return of(CustomerActions.showCustomerFormLoading({ show: false }));
          })
        )
      )
    )
  );

  deleteCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.deleteCustomer),
      mergeMap(action =>
        this.customerService.deleteCustomer(action.data).pipe(
          tap((resp: DeleteCustomerResponse) => this.alertService.showSuccess(resp.message)),
          mergeMap(() => [
            CustomerActions.getAllCustomers({ data: this.customerService.lastFilter })
          ]),
          catchError(err => {
            this.alertService.showError(err);
            return of(CustomerActions.manageCustomerGridLoading({ data: false }));
          })
        )
      )
    )
  );
}
