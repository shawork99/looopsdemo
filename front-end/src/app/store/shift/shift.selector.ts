import {createFeatureSelector, createSelector} from "@ngrx/store";
import {ShiftState} from "@store/shift/shift.reducer";

export const selectShiftState = createFeatureSelector<ShiftState>('shifts');
export const selectShifts = createSelector(selectShiftState, (state) => state?.shifts);
export const isShiftGridLoading = createSelector(selectShiftState, (state) => state?.isGridLoading);
export const selectShowHideShiftForm = createSelector(selectShiftState, (state) => state?.hideShiftForm);
export const selectShowShiftFormLoading = createSelector(selectShiftState, (state) => state?.showFormLoading);
export const selectEditShift = createSelector(selectShiftState, (state) => state?.editShift);