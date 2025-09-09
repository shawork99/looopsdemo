import {createFeatureSelector, createSelector} from "@ngrx/store";
import { LeaveAdjustmentState } from "@store/leave_adjustment/leave_adjustment.reducer";

export const selectLeaveAdjustmentState = createFeatureSelector<LeaveAdjustmentState>('leaveAdjustment');
export const selectLeaveAdjustment = createSelector(selectLeaveAdjustmentState, (state) => state?.leaveAdjustment);
export const isLeaveAdjustmentGridLoading = createSelector(selectLeaveAdjustmentState, (state) => state?.isGridLoading);
export const selectShowHideLeaveAdjustmentForm = createSelector(selectLeaveAdjustmentState, (state) => state?.hideLeaveAdjustmentForm);
export const selectShowLeaveAdjustmentFormLoading = createSelector(selectLeaveAdjustmentState, (state) => state?.showFormLoading);
export const selectEditLeaveAdjustmentDetails = createSelector(selectLeaveAdjustmentState, (state) => state?.editLeaveAdjustmentDetails);
export const selectLeaveAdjustmentFormData = createSelector(selectLeaveAdjustmentState, (state) => state?.formData);
// Leave Adjustment Details
export const selectLeaveAdjustmentDetailFormData = createSelector(selectLeaveAdjustmentState, (state) => state?.detailFormData);
export const selectShowHideLeaveAdjustmentDetailForm = createSelector(selectLeaveAdjustmentState, (state) => state?.hideLeaveAdjustmentDetailForm);
export const selectShowLeaveAdjustmentDetailFormLoading = createSelector(selectLeaveAdjustmentState, (state) => state?.showDetailFormLoading);
export const selectLeaveAdjustmentDetailGrid = createSelector(
    selectLeaveAdjustmentState,
    (s) => s?.detailGrid
);
export const selectDetailsLeaveTypes = createSelector(
  selectLeaveAdjustmentDetailGrid,
  (g) => g?.leaveTypes ?? []
);
export const selectDetailsItems = createSelector(
  selectLeaveAdjustmentDetailGrid,
  (g) => g?.items ?? []
);

export const selectDetailsLoading = createSelector(
  selectLeaveAdjustmentState,
  (s) => s?.detailsLoading
);

export const selectDetailsSaving = createSelector(
  selectLeaveAdjustmentState,
  (s) => s?.detailsSaving
);
