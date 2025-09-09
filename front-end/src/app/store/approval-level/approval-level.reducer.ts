import {createReducer, on} from "@ngrx/store";
import * as ApprovalLevelAction from "./approval-level.actions";
import {ApprovalLevel, ApprovalLevelFormData, ApprovalLevelPaginate} from "@store/approval-level/approval-level.model";


export interface ApprovalLevelState {
    approvalLevel: ApprovalLevelPaginate | null;
    hideApprovalLevelForm: boolean,
    isGridLoading: boolean;
    showFormLoading: boolean;
    formData: ApprovalLevelFormData;
    editApprovalLevelDetails: ApprovalLevel;
    approverRoleID: number;
}

export const initialApprovalLevelState: ApprovalLevelState = {
    approvalLevel: null,
    hideApprovalLevelForm: false,
    isGridLoading: false,
    showFormLoading: false,
    formData: null,
    editApprovalLevelDetails: null,
    approverRoleID: null
}

export const approvalLevelReducer = createReducer(
    initialApprovalLevelState,
    on(ApprovalLevelAction.getAllApprovalLevels, (state) => ({
        ...state,
        isGridLoading: true,
        hideApprovalLevelForm: false
    })),
    on(ApprovalLevelAction.onAllApprovalLevelsSuccess, (state, response) => ({
        ...state,
        approvalLevel: response?.data,
        isGridLoading: false
    })),
    on(ApprovalLevelAction.showHideApprovalLevelForm, (state, status) => ({
        ...state,
        hideApprovalLevelForm: status?.show
    })),
    on(ApprovalLevelAction.manageApprovalLevelLoading, (state, data) => ({
        ...state,
        isGridLoading: data?.data
    })),
    on(ApprovalLevelAction.showApprovalLevelFormLoading, (state, data) => ({
        ...state,
        showFormLoading: data?.show
    })),
    on(ApprovalLevelAction.onGetFormDataSuccess, (state, data) => ({
        ...state,
        formData: data?.data
    })),
    on(ApprovalLevelAction.onEditApprovalLevelDetailSuccess, (state, data) => ({
        ...state,
        editApprovalLevelDetails: data?.data,
        showFormLoading: false
    })),
    on(ApprovalLevelAction.getEditApprovalLevelDetails, (state, data) => ({
        ...state,
        showFormLoading: true
    })),
    on(ApprovalLevelAction.getApproverRoleID, (state) => ({
        ...state,
        showFormLoading: true
    })),
    on(ApprovalLevelAction.onGetApproverRoleIDSuccess, (state, response) => ({
        ...state,
        approverRoleID: response?.data,
        showFormLoading: false
    }))

)