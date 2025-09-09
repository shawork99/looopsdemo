import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {HelperService} from "@/app/services/helper.service";
import {
    CreateApprovalLevelResponse,
    DeleteApprovalLevelResponse,
    GetAllApprovalLevelResponse,
    GetEditApprovalLevelResponse,
    GetApprovalLevelFormDataResponse,
    UpdateApprovalLevelResponse,
    ApprovalLevel,
    ApprovalLevelFilter,
    GetApproverRoleIDResponse
} from "@store/approval-level/approval-level.model";

@Injectable({
  providedIn: 'root'
})
export class ApprovalLevelService {
  lastFilter: ApprovalLevelFilter;
  
  constructor(
    private http: HttpClient,
    private helperService: HelperService
  ){

  }

  getFormData(): Observable<GetApprovalLevelFormDataResponse> {
    return this.http.get<GetApprovalLevelFormDataResponse>('/approval_level?formdata=true');
  }
  getAllApprovalLevels(filter: ApprovalLevelFilter): Observable<GetAllApprovalLevelResponse> {
    this.lastFilter = filter;
    return this.http.get<GetAllApprovalLevelResponse>('/approval_level', {params: this.helperService.convertToHttpParams(filter)});
  }
  createApprovalLevel(approvalLevel: ApprovalLevel): Observable<CreateApprovalLevelResponse> {
    return this.http.post<CreateApprovalLevelResponse>('/approval_level', approvalLevel);
  }
  getApprovalLevelForEdit(approvalLevelId: number): Observable<GetEditApprovalLevelResponse> {
    return this.http.get<GetEditApprovalLevelResponse>('/approval_level/' + approvalLevelId);
  }
  updateApprovalLevel(approvalLevelId: number, approvalLevel: ApprovalLevel): Observable<UpdateApprovalLevelResponse> {
    return this.http.put<UpdateApprovalLevelResponse>('/approval_level/' + approvalLevelId, approvalLevel);
  }
  deleteApprovalLevel(approvalLevelId: number): Observable<DeleteApprovalLevelResponse> {
    return this.http.delete<DeleteApprovalLevelResponse>('/approval_level/' + approvalLevelId);
  }
  getApproverRoleID(approverId: number): Observable<GetApproverRoleIDResponse> {
    return this.http.get<GetApproverRoleIDResponse>('/approver_role/' + approverId);
  }
}
