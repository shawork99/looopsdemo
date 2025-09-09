import {createReducer, on} from "@ngrx/store";
import * as LeaveAdjustmentAction from "./leave_adjustment.actions";
import {
    LeaveAdjustment,
    LeaveAdjustmentPaginate, 
    LeaveAdjustmentFormData, 
    LeaveAdjustmentDetailFormData,
    LeaveAdjustmentDetailsVM
} from "@store/leave_adjustment/leave_adjustment.model";


export interface LeaveAdjustmentState {
    leaveAdjustment: LeaveAdjustmentPaginate | null;
    hideLeaveAdjustmentForm: boolean,
    isGridLoading: boolean;
    showFormLoading: boolean;
    editLeaveAdjustmentDetails: LeaveAdjustment;
    formData: LeaveAdjustmentFormData;
    detailFormData: LeaveAdjustmentDetailFormData;
    showDetailFormLoading: boolean;
    hideLeaveAdjustmentDetailForm: boolean;
    detailGrid: LeaveAdjustmentDetailsVM | null;
    detailsLoading: boolean;
    detailsSaving: boolean;
}

export const initialLeaveAdjustmentState: LeaveAdjustmentState = {
    leaveAdjustment: null,
    hideLeaveAdjustmentForm: false,
    isGridLoading: false,
    showFormLoading: false,
    editLeaveAdjustmentDetails: null,
    formData: null,
    detailFormData: null,
    showDetailFormLoading: false,
    hideLeaveAdjustmentDetailForm: false,
    detailGrid: null,
    detailsLoading: false,
    detailsSaving: false,
}

export const leaveAdjustmentReducer = createReducer(
    initialLeaveAdjustmentState,
    on(LeaveAdjustmentAction.getAllLeaveAdjustment, (state) => ({
        ...state,
        isGridLoading: true,
        hideLeaveAdjustmentForm: false
    })),
    on(LeaveAdjustmentAction.onAllLeaveAdjustmentSuccess, (state, response) => ({
        ...state,
        leaveAdjustment: response?.data,
        isGridLoading: false
    })),
    on(LeaveAdjustmentAction.showHideLeaveAdjustmentForm, (state, status) => ({
        ...state,
        hideLeaveAdjustmentForm: status?.show
    })),
    on(LeaveAdjustmentAction.manageLeaveAdjustmentLoading, (state, data) => ({
        ...state,
        isGridLoading: data?.data
    })),
    on(LeaveAdjustmentAction.showLeaveAdjustmentFormLoading, (state, data) => ({
        ...state,
        showFormLoading: data?.show
    })),
    on(LeaveAdjustmentAction.onEditLeaveAdjustmentDetailSuccess, (state, data) => ({
        ...state,
        editLeaveAdjustmentDetails: data?.data,
        showFormLoading: false
    })),
    on(LeaveAdjustmentAction.getEditLeaveAdjustmentDetails, (state, data) => ({
        ...state,
        showFormLoading: true
    })),
    on(LeaveAdjustmentAction.onGetFormDataSuccess, (state, data) => ({
        ...state,
        formData: data?.data
    })),
    on(LeaveAdjustmentAction.onGetDetailFormDataSuccess, (state, data) => ({
        ...state,
        detailFormData: data?.data
    })),

    // Leave Adjustment Detail

    on(LeaveAdjustmentAction.showHideLeaveAdjustmentDetailForm, (state, status) => ({
        ...state,
        hideLeaveAdjustmentDetailForm: status?.show
    })),
    on(LeaveAdjustmentAction.showLeaveAdjustmentDetailFormLoading, (state, data) => ({
        ...state,
        showDetailFormLoading: data?.show
    })),
    on(LeaveAdjustmentAction.loadLeaveAdjustmentDetails, (state) => ({
        ...state,
        detailsLoading: true
    })),
    on(LeaveAdjustmentAction.loadLeaveAdjustmentDetailsSuccess, (state, { data }) => ({
        ...state,
        detailGrid: data,
        detailsLoading: false
    })),
    on(LeaveAdjustmentAction.loadLeaveAdjustmentDetailsFailure, (state) => ({
        ...state,
        detailsLoading: false
    })),
    on(LeaveAdjustmentAction.saveLeaveAdjustmentDetails, (state) => ({
        ...state,
        detailsSaving: true
    })),
    on(LeaveAdjustmentAction.saveLeaveAdjustmentDetailsSuccess, (state) => ({
        ...state,
        detailsSaving: false
    })),
    on(LeaveAdjustmentAction.saveLeaveAdjustmentDetailsFailure, (state) => ({
        ...state,
        detailsSaving: false
    })),
    on(LeaveAdjustmentAction.clearEditLeaveAdjustmentDetails, (state) => ({
        ...state,
        editLeaveAdjustmentDetails: null 
    })),

    on(LeaveAdjustmentAction.clearLeaveAdjustmentDetails, (state) => ({
        ...state,
        detailsItems: [],
        detailsLeaveTypes: [],
        detailsLoading: false
    })),

)