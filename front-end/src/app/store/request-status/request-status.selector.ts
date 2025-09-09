import {createFeatureSelector, createSelector} from "@ngrx/store";
import {RequestStatusState} from "@store/request-status/request-status.reducer";

export const selectRequestStatusState = createFeatureSelector<RequestStatusState>('requestStatus');
export const selectRequestStatus = createSelector(selectRequestStatusState, (state) => state?.requestStatus);
export const isRequestStatusGridLoading = createSelector(selectRequestStatusState, (state) => state?.isGridLoading);
export const selectShowHideRequestStatusForm = createSelector(selectRequestStatusState, (state) => state?.hideRequestStatusForm);
export const selectRequestStatusFormLoading = createSelector(selectRequestStatusState, (state) => state?.showFormLoading);