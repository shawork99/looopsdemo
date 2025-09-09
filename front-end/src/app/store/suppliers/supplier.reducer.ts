import { createReducer, on } from '@ngrx/store';
import * as SupplierActions from './supplier.actions';
import { SupplierPaginate } from './supplier.model';

export interface SupplierState {
  suppliers: SupplierPaginate | null;
  hideSupplierForm: boolean;
  isGridLoading: boolean;
  showFormLoading: boolean;
  loading: boolean;
  error: any;
}

export const initialSupplierState: SupplierState = {
  suppliers: null,
  loading: false,
  error: null,
  hideSupplierForm: false,
  isGridLoading: false,
  showFormLoading: false
};

export const supplierReducer = createReducer(
  initialSupplierState,

  on(SupplierActions.loadSuppliers, (state) => ({
      ...state,
      isGridLoading: true,
      hideSupplierForm: false
  })),

  on(SupplierActions.loadSuppliersSuccess, (state, response) => ({
      ...state,
      suppliers: response.data,
      isGridLoading: false
    })),

    on(SupplierActions.manageSupplierGridLoading, (state, data) => ({
      ...state,
      isGridLoading: data.data
    })),

    on(SupplierActions.showHideSupplierForm, (state, { show }) => ({
      ...state,
      hideSupplierForm: show
    })),
      
    on(SupplierActions.showSupplierFormLoading, (state, data) => ({
      ...state,
      showFormLoading: data.show
    }))

);
