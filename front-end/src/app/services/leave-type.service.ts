import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {HelperService} from "@/app/services/helper.service";
import {
    CreateLeaveTypeResponse, DeleteLeaveTypeResponse,
    GetAllLeaveTypeResponse,
    LeaveType,
    LeaveTypeFilter, UpdateLeaveTypeResponse
} from "@store/leave_type/leave_type.model";

@Injectable({
    providedIn: 'root'
})
export class LeaveTypeService {
    lastFilter: LeaveTypeFilter;

    constructor(private http: HttpClient,
                private helperService: HelperService) {
    }

    getAllLeaveType(filter: LeaveTypeFilter): Observable<GetAllLeaveTypeResponse> {
        this.lastFilter = filter;
        return this.http.get<GetAllLeaveTypeResponse>('/leave_types', {params: this.helperService.convertToHttpParams(filter)});
    }

    createLeaveType(leaveType: LeaveType): Observable<CreateLeaveTypeResponse> {
        return this.http.post<CreateLeaveTypeResponse>('/leave_types', leaveType);
    }

    updateLeaveType(leaveTypeId: number, leaveType: LeaveType): Observable<UpdateLeaveTypeResponse> {
        return this.http.put<UpdateLeaveTypeResponse>('/leave_types/' + leaveTypeId, leaveType);
    }

    deleteLeaveType(leaveTypeId: number): Observable<DeleteLeaveTypeResponse> {
        return this.http.delete<DeleteLeaveTypeResponse>('/leave_types/' + leaveTypeId);
    }
}
