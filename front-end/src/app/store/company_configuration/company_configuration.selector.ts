import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CompanyConfigurationState } from './company_configuration.reducer';

export const selectCompanyConfigurationState =
  createFeatureSelector<CompanyConfigurationState>('company_configuration');

export const selectCompany = createSelector(
  selectCompanyConfigurationState,
  (state) => state?.company
);

export const selectCompanyLoading = createSelector(
  selectCompanyConfigurationState,
  (state) => state?.loading
);

export const selectCompanyError = createSelector(
  selectCompanyConfigurationState,
  (state) => state?.error
);
