export interface ShiftFilter {
    search: string;
    perPage: number;
    page: number;
}

export interface Shift {
    id: number;
    code: string;
    name: string;
    company_id: number;
    is_active: boolean;
    shift_details: ShiftDetail[];
}

export interface ShiftDetail {
    id: number;
    shift_id: number;
    day_name: string;
    start_time: string;
    end_time: string;
    grace_time: string;
    work_hours: number;
    work_hours_minute: number;
    is_week_day: boolean;
    company_id: number;
}

export interface GetAllShiftResponse {
    success: boolean;
    message: string;
    data: ShiftPaginate;
}

export interface ShiftPaginate {
    current_page: number;
    data: Shift[];
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

export interface CreateShiftResponse {
    message: string;
    success: boolean;
}

export interface UpdateShiftResponse {
    message: string;
    success: boolean;
}

export interface GetEditShiftResponse {
    message: string;
    success: boolean;
    data: Shift;
}

export interface DeleteShiftResponse {
    message: string;
    success: boolean;
}