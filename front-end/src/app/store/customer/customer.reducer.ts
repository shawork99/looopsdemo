import { createReducer, on } from "@ngrx/store";
import * as CustomerActions from "./customer.actions";
import { CustomerPaginate } from "./customer.model";

export interface CustomerState {
  customers: CustomerPaginate | null;
  hideCustomerForm: boolean;
  isGridLoading: boolean;
  showFormLoading: boolean;
}

export const initialCustomerState: CustomerState = {
  customers: null,
  hideCustomerForm: false,
  isGridLoading: false,
  showFormLoading: false,
};

export const customerReducer = createReducer(
  initialCustomerState,

  on(CustomerActions.getAllCustomers, (state) => ({
    ...state,
    isGridLoading: true,
    hideCustomerForm: false
  })),

  on(CustomerActions.onAllCustomerSuccess, (state, response) => ({
    ...state,
    customers: response.data,
    isGridLoading: false
  })),

  on(CustomerActions.manageCustomerGridLoading, (state, data) => ({
    ...state,
    isGridLoading: data.data
  })),

  on(CustomerActions.showHideCustomerForm, (state, status) => ({
    ...state,
    hideCustomerForm: status.show
  })),

  on(CustomerActions.showCustomerFormLoading, (state, data) => ({
    ...state,
    showFormLoading: data.show
  }))
);
