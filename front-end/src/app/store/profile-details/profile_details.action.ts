import { createAction, props } from '@ngrx/store';
import { profile } from './profile_details.model';

export const loadProfileDetails = createAction('[Profile] Load Profile Details');
export const loadProfileDetailsSuccess = createAction('[Profile] Load Profile Details Success',props<{ profile: profile }>());
export const loadProfileDetailsFailure = createAction('[Profile] Load Profile Details Failure', props<{ error: any }>());

export const updateProfileDetails = createAction('[Profile] Update Profile Details', props<{ id: number, data: profile }>());
export const updateProfileDetailsSuccess = createAction('[Profile] Update Profile Details Success', props<{ message: string }>());
export const updateProfileDetailsFailure = createAction('[Profile] Update Profile Details Failure', props<{ error: any }>());

export const updatePassword = createAction('[Profile] Update Password',props<{ id: number; data: { old_password: string; password: string; password_confirmation: string } }>());
export const updatePasswordSuccess = createAction('[Profile] Update Password Success',props<{ message: string }>());
export const updatePasswordFailure = createAction('[Profile] Update Password Failure',props<{ error: any }>());
