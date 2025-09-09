import {createReducer, on} from "@ngrx/store";
import * as LeaveGroupActions from "./leave_group.actions";
import {LeaveGroupDFormData, LeaveGroupPaginate} from "@store/leave_group/leave_group.model";

export interface LeaveGroupState {
    leaveGroups: LeaveGroupPaginate | null;
    hideLeaveGroupForm: boolean,
    isGridLoading: boolean;
    showFormLoading: boolean;
    leaveGroupDFormData: LeaveGroupDFormData;
    hideLeaveGroupDForm: boolean,
}

export const initialLeaveGroupState: LeaveGroupState = {
    leaveGroups: null,
    hideLeaveGroupForm: true,
    isGridLoading: false,
    showFormLoading: false,
    leaveGroupDFormData: null,
    hideLeaveGroupDForm: true
}

export const leaveGroupReducer = createReducer(
    initialLeaveGroupState,
    on(LeaveGroupActions.getAllLeaveGroups, (state) => ({
        ...state,
        isGridLoading: true,
        hideLeaveGroupForm: false
    })),
    on(LeaveGroupActions.onAllLeaveGroupSuccess, (state, response) => ({
        ...state,
        leaveGroups: response?.data,
        isGridLoading: false
    })),
    on(LeaveGroupActions.showHideLeaveGroupForm, (state, status) => ({
        ...state,
        hideLeaveGroupForm: status?.show
    })),
    on(LeaveGroupActions.manageLeaveGroupGridLoading, (state, data) => ({
        ...state,
        isGridLoading: data?.data
    })),
    on(LeaveGroupActions.showLeaveGroupFormLoading, (state, data) => ({
        ...state,
        showFormLoading: data?.show
    })),
    on(LeaveGroupActions.onLeaveGroupDFormDataSuccess, (state, data) => ({
        ...state,
        leaveGroupDFormData: data?.data
    })),
    on(LeaveGroupActions.showHideLeaveGroupDForm, (state, data) => ({
        ...state,
        hideLeaveGroupDForm: data?.show
    }))
)