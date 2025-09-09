import {createFeatureSelector, createSelector} from "@ngrx/store";
import { ApprovalsState } from "@store/approvals/approvals.reducer";

export const selectApprovalsState = createFeatureSelector<ApprovalsState>('approvals');
export const selectApprovals = createSelector(selectApprovalsState, (state) => state?.approvals);
export const isApprovalsGridLoading = createSelector(selectApprovalsState, (state) => state?.isGridLoading);