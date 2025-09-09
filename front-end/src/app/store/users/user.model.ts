import {Department} from "@store/department/department.model";
import {Designation} from "@store/designation/designation.model";
import {Role} from "@store/role/role.model";
import {Shift} from "@store/shift/shift.model";
import {LeaveGroup} from "@store/leave_group/leave_group.model";
import {Location} from "@store/location/location.model";

export interface UserFilter {
    search: string;
    perPage: number;
    page: number;
}


export interface User {
    id: number;
    first_name: string;
    last_name: string;
    calling_name: string;
    role_id: number;
    email: string;
    is_active: boolean;
    base_company_id: number;
    current_company_id: number;
    created_by: number;
    updated_by: number;
    deleted_by: number;
    is_discharged: boolean;
    details: UserDetails;
}

export interface UserDetails {
    id: number;
    user_id: number;
    employee_code: string;
    employee_code_id: number;
    department_id: number;
    designation_id: number;
    company_id: number;
    created_by: number;
    updated_by: number;
    deleted_by: number;
    address: string;
    contact_no: string;
    country: string;
    date_of_joined: Date;
    employee_code_reference: string;
    department: Department;
    designation: Designation;
    id_number: string;
    profile_image: string;
    reporting_manager_id: number;
    leave_group_id: number;
    location_id: number;
    shift_id: number;
    contact_number_office: string;
    date_of_birth :Date;
    gender :number;
}

export interface GetAllUsersResponse {
    success: boolean;
    message: string;
    data: UserPaginate;
}

export interface GetUserFormDataResponse {
    success: boolean;
    message: string;
    data: UserFormData;
}

export interface UserFormData {
    roles: Role[];
    departments: Department[];
    designations: Designation[];
    shifts: Shift[];
    users: User[];
    leaveGroups: LeaveGroup[];
    locations: Location[];
}

export interface UserPaginate {
    current_page: number;
    data: User[];
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

export interface CreateUserResponse {
    message: string;
    success: boolean;
}

export interface UpdateUserResponse {
    message: string;
    success: boolean;
}

export interface GetEditUserResponse {
    message: string;
    data: User;
    success: boolean;
}

export interface DeleteUserResponse {
    message: string;
    success: boolean;
}

export interface UserPasswordResetRequest {
    user_id: number;
    password: string;
    password_confirmation: string;
}

export interface UserPasswordResetResponse {
    message: string;
    success: boolean;
}

export interface SendPasswordMailResponse {
  success: boolean;
  message: string;
}
