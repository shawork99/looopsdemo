import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {HelperService} from "@/app/services/helper.service";
import {
    CreateLeaveGroupDResponse,
    CreateLeaveGroupResponse, DeleteLeaveGroupResponse,
    GetAllLeaveGroupResponse,
    LeaveGroup, LeaveGroupDFormDataR,
    LeaveGroupFilter, UpdateLeaveGroupResponse
} from "@store/leave_group/leave_group.model";

@Injectable({
    providedIn: 'root'
})
export class LeaveGroupService {
    lastFilter: LeaveGroupFilter;

    constructor(private http: HttpClient,
                private helperService: HelperService) {
    }

    getAllLeaveGroup(filter: LeaveGroupFilter): Observable<GetAllLeaveGroupResponse> {
        this.lastFilter = filter;
        return this.http.get<GetAllLeaveGroupResponse>('/leave_groups', {params: this.helperService.convertToHttpParams(filter)});
    }

    createLeaveGroup(leaveGroup: LeaveGroup): Observable<CreateLeaveGroupResponse> {
        return this.http.post<CreateLeaveGroupResponse>('/leave_groups', leaveGroup);
    }

    updateLeaveGroup(leaveGroupId: number, LeaveGroup: LeaveGroup): Observable<UpdateLeaveGroupResponse> {
        return this.http.put<UpdateLeaveGroupResponse>('/leave_groups/' + leaveGroupId, LeaveGroup);
    }

    deleteLeaveGroup(leaveGroupId: number): Observable<DeleteLeaveGroupResponse> {
        return this.http.delete<DeleteLeaveGroupResponse>('/leave_groups/' + leaveGroupId);
    }

    getAllLeaveGroupDFormData(leaveGroupId: number): Observable<LeaveGroupDFormDataR> {
        return this.http.get<LeaveGroupDFormDataR>('/leave_group_details?formData=true&leaveGroupId='+leaveGroupId);
    }

    createLeaveGroupDetail(data: any): Observable<CreateLeaveGroupDResponse> {
        return this.http.post<CreateLeaveGroupDResponse>('/leave_group_details', data);
    }
}