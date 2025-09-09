import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { HelperService } from "@/app/services/helper.service";
import {
    CreateLeaveAdjustmentResponse,
    DeleteLeaveAdjustmentResponse,
    GetAllLeaveAdjustmentResponse,
    GetEditLeaveAdjustmentResponse,
    UpdateLeaveAdjustmentResponse,
    LeaveAdjustment,
    LeaveAdjustmentFilter,
    GetLeaveAdjustmentFormDataResponse,
    GetLeaveAdjustmentDetailFormDataResponse,
    LeaveAdjustmentDetailCreate,
    CreateLeaveAdjustmentDetailResponse,
    GetLeaveAdjustmentDetailsResponse,
    SaveLeaveAdjustmentDetailsPayload,
    SaveLeaveAdjustmentDetailsResponse,
    DeleteLeaveAdjustmentDetail,
    DeleteLeaveAdjustmentDetailResponse
} from "@store/leave_adjustment/leave_adjustment.model";

@Injectable({
  providedIn: 'root'
})
export class LeaveAdjustmentService {
  lastFilter: LeaveAdjustmentFilter;

  constructor(
    private http: HttpClient,
    private helperService: HelperService
  ) { }

  getAllLeaveAdjustment(filter: LeaveAdjustmentFilter): Observable<GetAllLeaveAdjustmentResponse> {
    this.lastFilter = filter;
    return this.http.get<GetAllLeaveAdjustmentResponse>('/leave_adjustment', {params: this.helperService.convertToHttpParams(filter)});
  }
  createLeaveAdjustment(leaveAdjustment: LeaveAdjustment): Observable<CreateLeaveAdjustmentResponse> {
    return this.http.post<CreateLeaveAdjustmentResponse>('/leave_adjustment', leaveAdjustment);
  }
  getLeaveAdjustmentForEdit(leaveAdjustmentID: number): Observable<GetEditLeaveAdjustmentResponse> {
    return this.http.get<GetEditLeaveAdjustmentResponse>('/leave_adjustment/' + leaveAdjustmentID);
  }
  updateLeaveAdjustment(leaveAdjustmentID: number, leaveAdjustment: LeaveAdjustment): Observable<UpdateLeaveAdjustmentResponse> {
    return this.http.put<UpdateLeaveAdjustmentResponse>('/leave_adjustment/' + leaveAdjustmentID, leaveAdjustment);
  }
  deleteLeaveAdjustment(leaveAdjustmentID: number): Observable<DeleteLeaveAdjustmentResponse> {
    return this.http.delete<DeleteLeaveAdjustmentResponse>('/leave_adjustment/' + leaveAdjustmentID);
  }
  getFormData(): Observable<GetLeaveAdjustmentFormDataResponse> {
    return this.http.get<GetLeaveAdjustmentFormDataResponse>('/leave_adjustment?formdata=true');
  }
  getDetailFormData(leaveGroupID: number): Observable<GetLeaveAdjustmentDetailFormDataResponse>{
    const filters = {
      leaveGroupID: leaveGroupID
    };
    return this.http.get<GetLeaveAdjustmentDetailFormDataResponse>('/adjustmentFormData', {params: this.helperService.convertToHttpParams(filters)});
  }
  createLeaveAdjustmentDetail(leaveAdjustmentDetailCreate: LeaveAdjustmentDetailCreate): Observable<CreateLeaveAdjustmentDetailResponse> {
    return this.http.post<CreateLeaveAdjustmentDetailResponse>('/leave_adjustment_employee', leaveAdjustmentDetailCreate);
  }
  getDetails(leaveAdjustmentID: number): Observable<GetLeaveAdjustmentDetailsResponse> {
    return this.http.get<GetLeaveAdjustmentDetailsResponse>('/leave_adjustment_employee/' + leaveAdjustmentID + '/details');
  }
  saveDetails(payload: SaveLeaveAdjustmentDetailsPayload): Observable<SaveLeaveAdjustmentDetailsResponse> {
    return this.http.put<SaveLeaveAdjustmentDetailsResponse>('/leave_adjustment_employee/' + payload.leave_adjustment_id, payload);
  }
  deleteDetails(payload: DeleteLeaveAdjustmentDetail): Observable<DeleteLeaveAdjustmentDetailResponse> {
    return this.http.post<DeleteLeaveAdjustmentDetailResponse>('/leave_adjustment_employee/delete_employee_details', payload);
  
  }
}
