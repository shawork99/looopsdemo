import {createAction, props} from "@ngrx/store";
import {
    LeaveGroup,
    LeaveGroupDFormData,
    LeaveGroupFilter,
    LeaveGroupPaginate
} from "@store/leave_group/leave_group.model";

export const getAllLeaveGroups = createAction('[LeaveGroup] Get All Leave Groups', props<{ data: LeaveGroupFilter }>());
export const onAllLeaveGroupSuccess = createAction('[LeaveGroup] Get All LeaveGroups Success', props<{
    data: LeaveGroupPaginate
}>());
export const manageLeaveGroupGridLoading = createAction('[LeaveGroup] Enable Leave Group Loading', props<{
    data: boolean
}>());
export const createLeaveGroup = createAction('[LeaveGroup] Create Leave Group', props<{ data: LeaveGroup }>());
export const updateLeaveGroup = createAction('[LeaveGroup] Update Leave Group', props<{
    LeaveGroupId: number,
    data: LeaveGroup
}>());
export const deleteLeaveGroup = createAction('[LeaveGroup] Delete Leave Group', props<{ data: number }>());
export const showHideLeaveGroupForm = createAction('[LeaveGroup] Show Leave Group Form', props<{ show: boolean }>());
export const showLeaveGroupFormLoading = createAction('[LeaveGroup] Show Leave Group Form Loading', props<{
    show: boolean
}>());
//Leave Group Details Actions
export const getLeaveGroupDFormData = createAction('[LeaveGroup] Get Leave Group D Form Data', props<{
    leaveGroupId: number
}>());
export const onLeaveGroupDFormDataSuccess = createAction('[LeaveGroup] Get Leave Group D Success', props<{
    data: LeaveGroupDFormData
}>());
export const createLeaveGroupDetail = createAction('[LeaveGroup] Create Leave Group Detail', props<{ data: any }>());
export const showHideLeaveGroupDForm = createAction('[LeaveGroup] Show Leave Group Details Form', props<{
    show: boolean
}>());
