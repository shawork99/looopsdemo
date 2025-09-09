import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {HelperService} from "@/app/services/helper.service";
import {
  Approvals,
  ApprovalsFilter,
  GetAllApprovalsResponse,
  ApproveDocumentResponse
} from "@store/approvals/approvals.model";

@Injectable({
  providedIn: 'root'
})
export class ApprovalsService {
  lastFilter: ApprovalsFilter;
    
  constructor(
    private http: HttpClient,
    private helperService: HelperService
  ){}

  getAllApprovals(filter: ApprovalsFilter): Observable<GetAllApprovalsResponse> {
    this.lastFilter = filter;
    return this.http.get<GetAllApprovalsResponse>('/document_approved', {params: this.helperService.convertToHttpParams(filter)});
  }
  approveDocument(approvalLevel: Approvals): Observable<ApproveDocumentResponse> {
    return this.http.post<ApproveDocumentResponse>('/document_approved/approve', approvalLevel);
  }
}
