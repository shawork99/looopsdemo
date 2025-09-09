import {createReducer, on} from "@ngrx/store";
import * as LeaveTypeActions from "./leave_type.actions";
import {LeaveTypePaginate} from "@store/leave_type/leave_type.model";

export interface LeaveTypeState {
    leaveTypes : LeaveTypePaginate | null;
    hideLeaveTypeForm:boolean,
    isGridLoading:boolean;
    showFormLoading:boolean;
}

export const initialLeaveTypeState: LeaveTypeState = {
    leaveTypes: null,
    hideLeaveTypeForm: false,
    isGridLoading : false,
    showFormLoading: false
}

export const leaveTypeReducer = createReducer(
    initialLeaveTypeState,
    on(LeaveTypeActions.getAllLeaveTypes,(state) =>({
        ...state,
        isGridLoading: true,
        hideLeaveTypeForm: false
    })),
    on(LeaveTypeActions.onAllLeaveTypeSuccess,(state,response) =>({
        ...state,
        leaveTypes:response?.data,
        isGridLoading: false
    })),
    on(LeaveTypeActions.showHideLeaveTypeForm,(state,status) =>({
        ...state,
        hideLeaveTypeForm: status?.show
    })),
    on(LeaveTypeActions.manageLeaveTypeGridLoading,(state,data) =>({
        ...state,
        isGridLoading: data?.data
    })),
    on(LeaveTypeActions.showLeaveTypeFormLoading,(state,data) =>({
        ...state,
        showFormLoading: data?.show
    }))
)