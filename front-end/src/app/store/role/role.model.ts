import {Navigation} from "@store/authentication/auth.model";

export interface RoleFilter {
    search: string;
    perPage: number;
    page: number;
}


export interface Role {
    id: number;
    name: string;
    description:string;
    company_id : number;
    is_admin : boolean;
    is_active: boolean;
    navigations:Navigation[];
    permissions:string[];
    users_count :number;
}

export interface GetAllRolesResponse {
    success:boolean;
    message:string;
    data:RolePaginate;
}

export interface RolePaginate {
    current_page: number;
    data: Role[];
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

export interface CreateRoleResponse {
    message:string;
    success:boolean;
}

export interface UpdateRoleResponse {
    message:string;
    success:boolean;
}

export interface DeleteRoleResponse {
    message:string;
    success:boolean;
}