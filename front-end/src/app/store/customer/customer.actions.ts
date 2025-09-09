import { createAction, props } from "@ngrx/store";
import { Customer, CustomerFilter, CustomerPaginate } from "./customer.model";

export const getAllCustomers = createAction('[Customer] Get All Customers', props<{ data: CustomerFilter }>());
export const onAllCustomerSuccess = createAction('[Customer] Get All Customers Success', props<{ data: CustomerPaginate }>());
export const manageCustomerGridLoading = createAction('[Customer] Enable Customers Loading', props<{ data: boolean }>());

export const createCustomer = createAction('[Customer] Create Customer', props<{ data: Customer }>());
export const updateCustomer = createAction('[Customer] Update Customer', props<{ customerId: number, data: Customer }>());
export const deleteCustomer = createAction('[Customer] Delete Customer', props<{ data: number }>());

export const showHideCustomerForm = createAction('[Customer] Show Customer Form', props<{ show: boolean }>());
export const showCustomerFormLoading = createAction('[Customer] Show Customer Form Loading', props<{ show: boolean }>());
