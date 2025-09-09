import {createFeatureSelector, createSelector} from "@ngrx/store";
import { ApprovalLevelState } from "@store/approval-level/approval-level.reducer";

export const selectApprovalLevelState = createFeatureSelector<ApprovalLevelState>('approvalLevel');
export const selectApprovalLevels = createSelector(selectApprovalLevelState, (state) => state?.approvalLevel);
export const isApprovalLevelGridLoading = createSelector(selectApprovalLevelState, (state) => state?.isGridLoading);
export const selectShowHideApprovalLevelForm = createSelector(selectApprovalLevelState, (state) => state?.hideApprovalLevelForm);
export const selectShowApprovalLevelFormLoading = createSelector(selectApprovalLevelState, (state) => state?.showFormLoading);
export const selectApprovalLevelFormData = createSelector(selectApprovalLevelState, (state) => state?.formData);
export const selectEditApprovalLevelDetails = createSelector(selectApprovalLevelState, (state) => state?.editApprovalLevelDetails);
export const selectApproverRoleID = createSelector(selectApprovalLevelState, (state) => state?.approverRoleID);