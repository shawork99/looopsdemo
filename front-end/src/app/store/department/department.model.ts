export interface DepartmentFilter {
    search: string;
    perPage: number;
    page: number;
}


export interface Department {
    id: number;
    code:string;
    name: string;
    company_id : number;
    is_active: boolean;
    users_count :number;
}

export interface GetAllDepartmentResponse {
    success:boolean;
    message:string;
    data:DepartmentPaginate;
}

export interface DepartmentPaginate {
    current_page: number;
    data: Department[];
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

export interface CreateDepartmentResponse {
    message:string;
    success:boolean;
}

export interface UpdateDepartmentResponse {
    message:string;
    success:boolean;
}

export interface DeleteDepartmentResponse {
    message:string;
    success:boolean;
}