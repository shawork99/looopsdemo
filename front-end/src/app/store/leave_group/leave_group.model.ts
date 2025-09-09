import {LeaveType} from "@store/leave_type/leave_type.model";

export interface LeaveGroupFilter {
    search: string;
    perPage: number;
    page: number;
}

export interface LeaveGroup {
    id: number;
    code: string;
    name: string;
    company_id: number;
    is_active: boolean;
}

export interface GetAllLeaveGroupResponse {
    success: boolean;
    message: string;
    data: LeaveGroupPaginate;
}

export interface LeaveGroupPaginate {
    current_page: number;
    data: LeaveGroup[];
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

export interface CreateLeaveGroupResponse {
    message: string;
    success: boolean;
}

export interface UpdateLeaveGroupResponse {
    message: string;
    success: boolean;
}

export interface DeleteLeaveGroupResponse {
    message: string;
    success: boolean;
}

export interface LeaveGroupDFormData {
    leaveTypes: LeaveType[];
    policyList: string[];
    leaveGroupDetails: LeaveGroupDetail[];
}

export interface LeaveGroupDFormDataR {
    data: LeaveGroupDFormData,
    message: string;
}

export interface CreateLeaveGroupDResponse {
    message: string;
    success: boolean;
}

export interface LeaveGroupDetail {
    id: number;
    is_allow_minus: boolean;
    is_calendar_day: boolean;
    is_carry_forward: number;
    leave_group_id: number;
    leave_type: LeaveType;
    leave_type_id: number;
    maximum_applicable_days: number;
    no_of_days: number;
    policy: string;
}