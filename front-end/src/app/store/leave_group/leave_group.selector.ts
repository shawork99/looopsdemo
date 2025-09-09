import {LeaveGroupState} from "@store/leave_group/leave_group.reducer";
import {createFeatureSelector, createSelector} from "@ngrx/store";
export const selectLeaveGroupState = createFeatureSelector<LeaveGroupState>('leave_groups');
export const selectLeaveGroups = createSelector(selectLeaveGroupState, (state) => state?.leaveGroups);
export const isLeaveGroupsGridLoading = createSelector(selectLeaveGroupState, (state) => state?.isGridLoading);
export const selectShowHideLeaveGroupForm = createSelector(selectLeaveGroupState, (state) => state?.hideLeaveGroupForm);
export const selectShowLeaveGroupFormLoading = createSelector(selectLeaveGroupState, (state) => state?.showFormLoading);
export const selectLeaveGroupDFormData = createSelector(selectLeaveGroupState, (state) => state?.leaveGroupDFormData);
export const selectShowHideLeaveGroupDForm = createSelector(selectLeaveGroupState, (state) => state?.hideLeaveGroupDForm);