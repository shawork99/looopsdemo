import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CustomerState } from "./customer.reducer";

export const selectCustomerState = createFeatureSelector<CustomerState>('customers');

export const selectCustomers = createSelector(
  selectCustomerState,
  (state) => state?.customers
);

export const isCustomersGridLoading = createSelector(
  selectCustomerState,
  (state) => state?.isGridLoading
);

export const selectShowHideCustomerForm = createSelector(
  selectCustomerState,
  (state) => state?.hideCustomerForm
);

export const selectShowCustomerFormLoading = createSelector(
  selectCustomerState,
  (state) => state?.showFormLoading
);
