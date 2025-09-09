import {createReducer, on} from "@ngrx/store";
import * as RequestStatusActions from "./request-status.actions";
import {RequestStatusPaginate} from "./request-status.model";

export interface RequestStatusState {
    requestStatus: RequestStatusPaginate | null;
    hideRequestStatusForm: boolean,
    isGridLoading: boolean;
    showFormLoading: boolean;
}

export const initialRequestStatusState: RequestStatusState = {
    requestStatus: null,
    hideRequestStatusForm: false,
    isGridLoading: false,
    showFormLoading: false
}

export const requestStatusReducer = createReducer(
    initialRequestStatusState,
    on(RequestStatusActions.getAllRequestStatus, (state) => ({
        ...state,
        isGridLoading: true,
        hideRequestStatusForm: false
    })),
    on(RequestStatusActions.onAllRequestStatusSuccess, (state, response) => ({
        ...state,
        requestStatus: response?.data,
        isGridLoading: false
    })),
    on(RequestStatusActions.showHideRequestStatusForm, (state, status) => ({
        ...state,
        hideRequestStatusForm: status?.show
    })),
    on(RequestStatusActions.manageRequestStatusGridLoading, (state, data) => ({
        ...state,
        isGridLoading: data?.data
    })),
    on(RequestStatusActions.showRequestStatusFormLoading, (state, data) => ({
        ...state,
        showFormLoading: data?.show
    }))
)