import {createFeatureSelector, createSelector} from "@ngrx/store";
import {DesignationState} from "@store/designation/designation.reducer";

export const selectDesignationState = createFeatureSelector<DesignationState>('designations');
export const selectDesignations = createSelector(selectDesignationState, (state) => state?.designations);
export const isDesignationsGridLoading = createSelector(selectDesignationState, (state) => state?.isGridLoading);
export const selectShowHideDesignationForm = createSelector(selectDesignationState, (state) => state?.hideDesignationForm);
export const selectShowDesignationFormLoading = createSelector(selectDesignationState, (state) => state?.showFormLoading);