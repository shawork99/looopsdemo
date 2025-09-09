export interface LeaveTypeFilter {
    search: string;
    perPage: number;
    page: number;
}


export interface LeaveType {
    id: number;
    code:string;
    name: string;
    company_id : number;
    is_active: boolean;
}

export interface GetAllLeaveTypeResponse {
    success:boolean;
    message:string;
    data:LeaveTypePaginate;
}

export interface LeaveTypePaginate {
    current_page: number;
    data: LeaveType[];
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

export interface CreateLeaveTypeResponse {
    message:string;
    success:boolean;
}

export interface UpdateLeaveTypeResponse {
    message:string;
    success:boolean;
}

export interface DeleteLeaveTypeResponse {
    message:string;
    success:boolean;
}