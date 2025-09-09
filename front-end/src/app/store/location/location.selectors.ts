import { createFeatureSelector, createSelector } from "@ngrx/store";
import { LocationState } from "./location.reducer";

export const selectLocationState = createFeatureSelector<LocationState>('locations');

export const selectLocations = createSelector(
  selectLocationState,
  (state) => state?.locations
);

export const isLocationsGridLoading = createSelector(
  selectLocationState,
  (state) => state?.isGridLoading
);

export const selectShowHideLocationForm = createSelector(
  selectLocationState,
  (state) => state?.hideLocationForm
);

export const selectShowLocationFormLoading = createSelector(
  selectLocationState,
  (state) => state?.showFormLoading
);
