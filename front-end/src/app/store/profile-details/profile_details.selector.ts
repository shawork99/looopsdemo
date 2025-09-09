import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProfileDetailsState } from './profile_details.reducer';

export const selectProfileDetailsState = createFeatureSelector<ProfileDetailsState>('profile');

export const selectProfileDetails = createSelector(
  selectProfileDetailsState,
  (state) => state.profile
);

export const selectProfileLoading = createSelector(selectProfileDetailsState, (state) => state?.loading);
export const selectProfileError = createSelector(selectProfileDetailsState, (state) => state?.error);