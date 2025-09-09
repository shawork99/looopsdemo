import {createAction, props} from "@ngrx/store";
import { ApprovalLevel, ApprovalLevelFilter, ApprovalLevelFormData, ApprovalLevelPaginate} from '@store/approval-level/approval-level.model';

export const getFormData = createAction('[ApprovalLevel] Get Approval Level Form Data');
export const onGetFormDataSuccess = createAction('[ApprovalLevel] Get Approval Level Form Data Success', props<{
    data: ApprovalLevelFormData
}>());

export const getAllApprovalLevels = createAction('[ApprovalLevel] Get All Approval Level', props<{ data: ApprovalLevelFilter }>());
export const onAllApprovalLevelsSuccess = createAction('[ApprovalLevel] Get Approval Level Success', props<{ data: ApprovalLevelPaginate }>());
export const manageApprovalLevelLoading = createAction('[ApprovalLevel] Enable Approval Level Loading', props<{ data: boolean }>());
export const createApprovalLevel = createAction('[ApprovalLevel] Create Approval Level', props<{ data: ApprovalLevel }>());
export const updateApprovalLevel = createAction('[ApprovalLevel] Update Approval Level', props<{ approvalLevelId: number, data: ApprovalLevel }>());
export const deleteApprovalLevel = createAction('[ApprovalLevel] Delete Approval Level', props<{ data: number }>());
export const showHideApprovalLevelForm = createAction('[ApprovalLevel] Show Approval Level Form', props<{ show: boolean }>());
export const showApprovalLevelFormLoading = createAction('[ApprovalLevel] Show Approval Level Form Loading', props<{ show: boolean }>());
export const getEditApprovalLevelDetails = createAction('[ApprovalLevel] Get Edit Approval Level Details', props<{ approvalLevelId: number }>());
export const onEditApprovalLevelDetailSuccess = createAction('[ApprovalLevel] On Edit Approval Level Details Success', props<{ data: ApprovalLevel }>());
export const getApproverRoleID = createAction('[ApprovalLevel] GetApprover Role ID', props<{ roleId: number }>());
export const onGetApproverRoleIDSuccess = createAction('[ApprovalLevel] Approver Role Details Success', props<{ data: number }>());