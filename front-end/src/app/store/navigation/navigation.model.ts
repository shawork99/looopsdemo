import {Role} from "@store/role/role.model";
import {Navigation} from "@store/authentication/auth.model";

export interface NavigationFormDataR {
    message: string;
    data: NavigationFormData;
}

export interface NavigationFormData {
    roles: Role[];
}

export interface GetNavigationsByRoleR {
    message: string;
    data: GetNavigationsByRole;
}

export interface GetNavigationsByRole {
    role: Role;
    navigations: Navigation[];
    permissions: Permission[];
}

export interface Permission {
    label: string;
    key: string;
    permission_name: string;
}

export interface CreateNavigationRequest {
    roleId: number;
    navigationKeys:string[];
    permissionKeys:string[];
}

export interface CreateNavigationResponse {
    message: string;
}

