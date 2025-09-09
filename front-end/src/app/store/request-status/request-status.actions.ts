import {createAction, props} from "@ngrx/store";
import {RequestStatus, RequestStatusFilter, RequestStatusPaginate} from "./request-status.model";


export const getAllRequestStatus = createAction('[Request Status] Get All Request Status', props<{ data: RequestStatusFilter }>());
export const onAllRequestStatusSuccess = createAction('[Request Status] Get All Request Status Success', props<{ data: RequestStatusPaginate }>());
export const manageRequestStatusGridLoading = createAction('[Request Status] Enable Request Status Loading', props<{ data: boolean }>());
export const createRequestStatus = createAction('[Request Status] Create Request Status', props<{ data: RequestStatus }>());
export const updateRequestStatus = createAction('[RequestStatus] Update RequestStatus', props<{ requestStatusId: number, data: RequestStatus }>());
export const deleteRequestStatus = createAction('[Request Status] Delete Request Status', props<{ data: number }>());
export const showHideRequestStatusForm = createAction('[Request Status] Show Request Status Form', props<{ show: boolean }>());
export const showRequestStatusFormLoading = createAction('[Request Status] Show Request Status Form Loading', props<{ show: boolean }>());
