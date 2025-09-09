import { createReducer, on } from '@ngrx/store';
import * as CompanyActions from './company_configuration.action';
import { Company } from './company_configuration.model';

export interface CompanyConfigurationState {
  company: Company | null;
  loading: boolean;
  error: any;
}

export const initialCompanyConfigurationState: CompanyConfigurationState = {
  company: null,
  loading: false,
  error: null
};

export const companyConfigurationReducer = createReducer(
  initialCompanyConfigurationState,
  on(CompanyActions.loadCompanyInfo, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CompanyActions.loadCompanyInfoSuccess, (state, { company }) => ({
    ...state,
    company,
    loading: false
  })),
  on(CompanyActions.loadCompanyInfoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
