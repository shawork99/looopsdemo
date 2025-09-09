import {createFeatureSelector, createSelector} from "@ngrx/store";
import {LeaveTypeState} from "@store/leave_type/leave_type.reducer";

export const selectLeaveTypeState = createFeatureSelector<LeaveTypeState>('leave_types');
export const selectLeaveTypes = createSelector(selectLeaveTypeState, (state) => state?.leaveTypes);
export const isLeaveTypesGridLoading = createSelector(selectLeaveTypeState, (state) => state?.isGridLoading);
export const selectShowHideLeaveTypeForm = createSelector(selectLeaveTypeState, (state) => state?.hideLeaveTypeForm);
export const selectShowLeaveTypeFormLoading = createSelector(selectLeaveTypeState, (state) => state?.showFormLoading);