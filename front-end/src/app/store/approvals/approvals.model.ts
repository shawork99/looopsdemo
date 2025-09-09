export interface ApprovalsFilter {
    search: string;
    perPage: number;
    page: number;
}

export interface Approvals {
  id: number;
  doument_id: number;
  document_system_id: number;
  document_system_code: string;
  document_name: string;
  employee_name: string;
  level: number;
  status: string;
  comment: string;
  created_at: string;
}
export interface GetAllApprovalsResponse {
    success:boolean;
    message:string;
    data:ApprovalsPaginate;
}

export interface ApprovalsPaginate {
    current_page: number;
    data: Approvals[];
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

export interface ApproveDocumentResponse {
    message:string;
    success:boolean;
}