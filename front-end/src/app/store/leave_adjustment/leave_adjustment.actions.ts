import { createAction, props } from "@ngrx/store";
import {
    LeaveAdjustment,
    LeaveAdjustmentFilter, 
    LeaveAdjustmentPaginate, 
    LeaveAdjustmentFormData, 
    LeaveAdjustmentDetailFormData,
    LeaveAdjustmentDetailCreate,
    LeaveAdjustmentDetailsVM,
    SaveLeaveAdjustmentDetailsPayload,
    SaveLeaveAdjustmentDetailsResponse,
    DeleteLeaveAdjustmentDetail,
    DeleteLeaveAdjustmentDetailResponse
} from '@store/leave_adjustment/leave_adjustment.model';

export const getFormData = createAction('[LeaveAdjustment] Get Leave Adjustment Form Data');
export const onGetFormDataSuccess = createAction('[LeaveAdjustment] Get Leave Adjustment Form Data Success', props<{data: LeaveAdjustmentFormData}>());
export const getAllLeaveAdjustment = createAction('[LeaveAdjustment] Get All Leave Adjustment', props<{ data: LeaveAdjustmentFilter }>());
export const onAllLeaveAdjustmentSuccess = createAction('[LeaveAdjustment] Get Leave Adjustment Success', props<{ data: LeaveAdjustmentPaginate }>());
export const manageLeaveAdjustmentLoading = createAction('[LeaveAdjustment] Enable Leave Adjustment Loading', props<{ data: boolean }>());
export const createLeaveAdjustment = createAction('[LeaveAdjustment] Create Leave Adjustment', props<{ data: LeaveAdjustment }>());
export const updateLeaveAdjustment = createAction('[LeaveAdjustment] Update Leave Adjustment', props<{ leaveAdjustmentID: number, data: LeaveAdjustment }>());
export const deleteLeaveAdjustment = createAction('[LeaveAdjustment] Delete Leave Adjustment', props<{ data: number }>());
export const showHideLeaveAdjustmentForm = createAction('[LeaveAdjustment] Show Leave Adjustment Form', props<{ show: boolean }>());
export const showLeaveAdjustmentFormLoading = createAction('[LeaveAdjustment] Show Leave Adjustment Form Loading', props<{ show: boolean }>());
export const getEditLeaveAdjustmentDetails = createAction('[LeaveAdjustment] Get Edit Leave Adjustment Details', props<{ leaveAdjustmentID: number }>());
export const onEditLeaveAdjustmentDetailSuccess = createAction('[LeaveAdjustment] On Edit Leave Adjustment Details Success', props<{ data: LeaveAdjustment }>());
export const getDetailFormData = createAction('[LeaveAdjustment] Get Leave Adjustment Detail Form Data', props<{ leaveGroupID: number }>());
// Leave Adjustment Details
export const onGetDetailFormDataSuccess = createAction('[LeaveAdjustment] Get Leave Adjustment Detail Form Data Success', props<{ data: LeaveAdjustmentDetailFormData }>());
export const createLeaveAdjustmentDetail = createAction('[LeaveAdjustment] Create Leave Adjustment Detail', props<{ data: LeaveAdjustmentDetailCreate }>());
export const showHideLeaveAdjustmentDetailForm = createAction('[LeaveAdjustment] Show Leave Adjustment Detail Form', props<{ show: boolean }>());
export const showLeaveAdjustmentDetailFormLoading = createAction('[LeaveAdjustment] Show Leave Adjustment Detail Form Loading', props<{ show: boolean }>());

export const loadLeaveAdjustmentDetails = createAction('[LeaveAdjustment] Load Details', props<{ leaveAdjustmentID: number }>());
export const loadLeaveAdjustmentDetailsSuccess = createAction('[LeaveAdjustment] Load Details Success', props<{ data: LeaveAdjustmentDetailsVM }>());
export const loadLeaveAdjustmentDetailsFailure = createAction('[LeaveAdjustment] Load Details Failure', props<{ error: any }>());

export const saveLeaveAdjustmentDetails = createAction('[LeaveAdjustment] Save Details', props<{ payload: SaveLeaveAdjustmentDetailsPayload }>());
export const saveLeaveAdjustmentDetailsSuccess = createAction('[LeaveAdjustment] Save Details Success', props<{ resp: SaveLeaveAdjustmentDetailsResponse }>());
export const saveLeaveAdjustmentDetailsFailure = createAction('[LeaveAdjustment] Save Details Failure', props<{ error: any }>());

export const deleteLeaveAdjustmentDetail = createAction('[Leave Adjustment] Delete Employee Details', props<{ payload: DeleteLeaveAdjustmentDetail }>());
export const deleteLeaveAdjustmentDetailSuccess = createAction('[Leave Adjustment] Delete Employee Details Success', props<{ resp: DeleteLeaveAdjustmentDetailResponse }>());
export const deleteLeaveAdjustmentDetailFailure = createAction('[Leave Adjustment] Delete Employee Details Failure', props<{ error: any }>());
export const clearEditLeaveAdjustmentDetails = createAction(
  '[LeaveAdjustment] Clear Edit Leave Adjustment Details'
);

export const clearLeaveAdjustmentDetails = createAction(
  '[LeaveAdjustment] Clear Leave Adjustment Details'
);

