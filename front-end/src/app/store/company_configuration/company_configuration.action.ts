import { createAction, props } from '@ngrx/store';
import { Company } from './company_configuration.model';

export const loadCompanyInfo = createAction('[Company] Load Company Info');
export const loadCompanyInfoSuccess = createAction('[Company] Load Company Info Success', props<{ company: Company }>());
export const loadCompanyInfoFailure = createAction('[Company] Load Company Info Failure', props<{ error: any }>());
export const updateCompanyInfo = createAction('[Company] Update Company Information', props<{id: number, data: Company}>());
export const updateCompanyInfoSuccess = createAction('[Company] Update Company Information Success', props<{ message: string }>());
export const updateCompanyInfoFailure = createAction('[Company] Update Company Information Failure', props<{ error: any }>());