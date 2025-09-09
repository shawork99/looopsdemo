import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SupplierState } from './supplier.reducer';

export const selectSupplierState = createFeatureSelector<SupplierState>('suppliers');

export const selectSuppliers = createSelector(
  selectSupplierState,
  (state) => state?.suppliers
);

export const isSuppliersGridLoading = createSelector(
  selectSupplierState,
  (state) => state?.isGridLoading
);

export const selectShowHideSupplierForm = createSelector(
  selectSupplierState,
  (state) => state?.hideSupplierForm
);

export const selectShowSupplierFormLoading = createSelector(
  selectSupplierState,
  (state) => state?.showFormLoading
);
