import {createAction, props} from "@ngrx/store";
import {LeaveType, LeaveTypeFilter, LeaveTypePaginate} from "@store/leave_type/leave_type.model";


export const getAllLeaveTypes = createAction('[LeaveType] Get All Leave Types',props<{data:LeaveTypeFilter}>());
export const onAllLeaveTypeSuccess = createAction('[LeaveType] Get All LeaveTypes Success',props<{data:LeaveTypePaginate}>());
export const manageLeaveTypeGridLoading = createAction('[LeaveType] Enable LeaveTypes Loading',props<{data:boolean}>());
export const createLeaveType = createAction('[LeaveType] Create LeaveTypes',props<{data:LeaveType}>());
export const updateLeaveType = createAction('[LeaveType] Update LeaveTypes',props<{LeaveTypeId: number,data:LeaveType}>());
export const deleteLeaveType = createAction('[LeaveType] Delete LeaveTypes',props<{data:number}>());
export const showHideLeaveTypeForm = createAction('[LeaveType] Show LeaveType Form',props<{show:boolean}>());
export const showLeaveTypeFormLoading = createAction('[LeaveType] Show LeaveType Form Loading',props<{show:boolean}>());
