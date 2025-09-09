import { createAction, props } from '@ngrx/store';
import { Supplier, SupplierFilter,SupplierPaginate } from './supplier.model';


export const loadSuppliers = createAction('[Supplier] Get All Suppliers', props<{ data: SupplierFilter }>());
export const loadSuppliersSuccess = createAction('[Supplier] Get All Suppliers Success', props<{ data: SupplierPaginate }>());
export const manageSupplierGridLoading = createAction('[Supplier] Enable Suppliers Loading', props<{ data: boolean }>());

export const showSupplierFormLoading = createAction('[Supplier] Show Supplier Form Loading', props<{ show: boolean }>());

export const showHideSupplierForm = createAction('[Supplier] Show Supplier Form', props<{ show: boolean }>());

export const deleteSupplier = createAction('[Supplier] Delete Supplier', props<{ data: number }>());

export const createSupplier = createAction('[Supplier] Create Supplier', props<{ data: Supplier }>());

export const updateSupplier = createAction('[Supplier] Update Customer', props<{ supplierId: number, data: Supplier }>());

