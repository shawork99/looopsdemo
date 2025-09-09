import { User } from "@store/users/user.model";
import { Role } from "@store/role/role.model";
import { DocumentMaster } from "@store/document-master/document-master.model";

export interface ApprovalLevelFilter {
    search: string;
    perPage: number;
    page: number;
}


export interface ApprovalLevel {
    id: number;
    level: number;
    approver_id: number;
    approver: User
    approver_role_id: number;
    role: Role
    document_system_id: number;
    document: DocumentMaster
    is_mandatory: boolean;
    status: string;
}

export interface ApprovalLevelFormData {
    roles: Role[];
    users: User[];
    documentMaster: DocumentMaster[];
}

export interface GetApprovalLevelFormDataResponse {
    success: boolean;
    message: string;
    data: ApprovalLevelFormData;
}

export interface GetAllApprovalLevelResponse {
    success:boolean;
    message:string;
    data:ApprovalLevelPaginate;
}

export interface ApprovalLevelPaginate {
    current_page: number;
    data: ApprovalLevel[];
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

export interface CreateApprovalLevelResponse {
    message:string;
    success:boolean;
}

export interface UpdateApprovalLevelResponse {
    message:string;
    success:boolean;
}

export interface DeleteApprovalLevelResponse {
    message:string;
    success:boolean;
}

export interface GetEditApprovalLevelResponse {
    message: string;
    data: ApprovalLevel;
    success: boolean;
}
export interface GetApproverRoleIDResponse {
    message: string;
    data: number;
    success: boolean;
}