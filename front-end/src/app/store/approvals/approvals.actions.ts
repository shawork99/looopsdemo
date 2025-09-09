import {createAction, props} from "@ngrx/store";
import { ApprovalsFilter, Approvals, ApprovalsPaginate, ApproveDocumentResponse} from '@store/approvals/approvals.model';

export const getAllApprovals = createAction('[Approvals] Get All Approvals', props<{ data: ApprovalsFilter }>());
export const onAllApprovalsSuccess = createAction('[Approvals] Get Approvals Success', props<{ data: ApprovalsPaginate }>());
export const manageApprovalsLoading = createAction('[Approvals] Enable Approvals Loading', props<{ data: boolean }>());
export const approveDocument = createAction('[ApprovalLevel] Create Approval Level', props<{ data: Approvals }>());
export const approveDocumentSuccess = createAction('[Approvals] Approve Document Success', props<{ data: ApproveDocumentResponse }>());