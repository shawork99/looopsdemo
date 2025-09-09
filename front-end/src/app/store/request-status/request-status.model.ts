export interface RequestStatusFilter {
    search: string;
    perPage: number;
    page: number;
    requestTypeId: number;
}


export interface RequestStatus {
    id: number;
    code: string;
    name: string;
    company_id: number;
    is_active: boolean;
    sort_order: number;
    background_color: string;
    based_type?: string;
    request_type_id?: number;
}

export interface GetAllRequestStatusResponse {
    success: boolean;
    message: string;
    data: RequestStatusPaginate;
}

export interface RequestStatusPaginate {
    current_page: number;
    data: RequestStatus[];
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

export interface CreateRequestStatusResponse {
    message: string;
    success: boolean;
}

export interface UpdateRequestStatusResponse {
    message: string;
    success: boolean;
}

export interface DeleteRequestStatusResponse {
    message: string;
    success: boolean;
}