import { LeaveGroup } from "@store/leave_group/leave_group.model";

export type Policy = 'yearly' | 'monthly';

export interface LeaveAdjustmentFilter {
    search: string;
    perPage: number;
    page: number;
}

export interface LeaveAdjustment {
    id: number;
    document_code: string,
    adjustment_date: Date;
    description: string;
    leave_group_id: number;
    leave_group: LeaveGroup;
    policy_type: Policy;
    confirmed_yn: number,
    approved_yn: number,
    rejected_yn: number
}

export interface GetAllLeaveAdjustmentResponse {
    success:boolean;
    message:string;
    data:LeaveAdjustmentPaginate;
}

export interface LeaveAdjustmentPaginate {
    current_page: number;
    data: LeaveAdjustment[];
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

export interface CreateLeaveAdjustmentResponse {
    message:string;
    success:boolean;
}

export interface UpdateLeaveAdjustmentResponse {
    message:string;
    success:boolean;
}

export interface DeleteLeaveAdjustmentResponse {
    message:string;
    success:boolean;
}

export interface GetEditLeaveAdjustmentResponse {
    message: string;
    data: LeaveAdjustment;
    success: boolean;
}

export interface LeaveAdjustmentFormData {
    leaveGroup: LeaveGroup[];
}

export interface GetLeaveAdjustmentFormDataResponse {
    success: boolean;
    message: string;
    data: LeaveAdjustmentFormData;
}

export interface DetailFormData {
  id: number;
  name: string;
}

//Leave Adjustment Details 

export interface LeaveAdjustmentDetailFormData {
    employees: DetailFormData[],
    leaveType: DetailFormData[]
}

export interface GetLeaveAdjustmentDetailFormDataResponse {
  success: boolean;
  message: string;
  data: LeaveAdjustmentDetailFormData;
}
export interface LeaveAdjustmentDetailCreate {
    employees: [number],
    leave_adjustment_id: number,
    leave_group_id: number;
    leave_types: [number],
}
export interface CreateLeaveAdjustmentDetailResponse {
    message:string;
    success:boolean;
}
export interface LeaveType {
  id: number;
  name: string;
  no_of_days: number;
}
export interface LeaveAdjustmentEmployeeRow {
  id: number;
  leave_adjustment_id: number;
  employee_id: number;
  leave_type_id: number;
  previous_balance: number | null;
  adjusted_balance: number | null;
  new_balance: number | null;
  remarks: string | null;
  employee: { id: number; first_name: string; last_name: string };
  leave_type: { id: number; name: string };
}
export interface GetLeaveAdjustmentDetailsResponse {
  success: boolean;
  message: string;
  data: {
    leave_types: LeaveType[]; 
    items: LeaveAdjustmentEmployeeRow[];
  };
}
export interface LeaveAdjustmentDetailsVM {
  leaveTypes: LeaveType[];
  items: LeaveAdjustmentEmployeeRow[];
}
export interface SaveLeaveAdjustmentDetailsPayload {
  leave_adjustment_id: number;
  rows: Array<{
    id?: number;
    employee_id: number;
    leave_type_id: number;
    previous_balance?: number | null;
    adjusted_balance: number | null;
    new_balance?: number | null;
    remarks?: string | null;
  }>;
}

export interface SaveLeaveAdjustmentDetailsResponse {
  success: boolean;
  message: string;
}
export interface DeleteLeaveAdjustmentDetail {
  leave_adjustment_id: number,
  employee_id: number;
}
export interface DeleteLeaveAdjustmentDetailResponse {
  message: string;
  success: boolean;
}

