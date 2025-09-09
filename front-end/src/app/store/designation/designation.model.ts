export interface DesignationFilter {
    search: string;
    perPage: number;
    page: number;
}

export interface Designation {
    id: number;
    title:string;
    description: string;
    company_id : number;
    is_active: boolean;
    users_count :number;
}

export interface GetAllDesignationResponse {
    success:boolean;
    message:string;
    data:DesignationPaginate;
}

export interface DesignationPaginate {
    current_page: number;
    data: Designation[];
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

export interface CreateDesignationResponse {
    message:string;
    success:boolean;
}

export interface UpdateDesignationResponse {
    message:string;
    success:boolean;
}

export interface DeleteDesignationResponse {
    message:string;
    success:boolean;
}