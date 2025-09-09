import {createReducer, on} from "@ngrx/store";
import * as ApprovalsAction from "./approvals.actions";
import {Approvals, ApprovalsPaginate} from "@store/approvals/approvals.model";

export interface ApprovalsState {
    approvals: ApprovalsPaginate | null;
    hideApprovalLevelForm: boolean,
    isGridLoading: boolean;
}

export const initialApprovalsState: ApprovalsState = {
    approvals: null,
    hideApprovalLevelForm: false,
    isGridLoading: false,
}
export const approvalsReducer = createReducer(
    initialApprovalsState,
    on(ApprovalsAction.getAllApprovals, (state) => ({
        ...state,
        isGridLoading: true,
        hideApprovalLevelForm: false
    })),
    on(ApprovalsAction.onAllApprovalsSuccess, (state, response) => ({
        ...state,
        approvals: response?.data,
        isGridLoading: false
    })),
    on(ApprovalsAction.manageApprovalsLoading, (state, data) => ({
        ...state,
        isGridLoading: data?.data
    })),
)