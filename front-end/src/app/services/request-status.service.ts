import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {HelperService} from "@/app/services/helper.service";
import {
    CreateRequestStatusResponse, DeleteRequestStatusResponse,
    RequestStatus,
    RequestStatusFilter,
    GetAllRequestStatusResponse, UpdateRequestStatusResponse
} from "../store/request-status/request-status.model";

@Injectable({
    providedIn: 'root'
})
export class RequestStatusService {
    lastFilter: RequestStatusFilter;

    constructor(private http: HttpClient,
                private helperService: HelperService) {
    }

    getAllRequestStatus(filter: RequestStatusFilter): Observable<GetAllRequestStatusResponse> {
        this.lastFilter = filter;
        return this.http.get<GetAllRequestStatusResponse>('/request_status', {params: this.helperService.convertToHttpParams(filter)});
    }

    createRequestStatus(requestStatus: RequestStatus): Observable<CreateRequestStatusResponse> {
        return this.http.post<CreateRequestStatusResponse>('/request_status', requestStatus);
    }

    updateRequestStatus(requestStatusId: number, requestStatus: RequestStatus): Observable<UpdateRequestStatusResponse> {
        return this.http.put<UpdateRequestStatusResponse>('/request_status/' + requestStatusId, requestStatus);
    }

    deleteRequestStatus(requestStatusId: number): Observable<DeleteRequestStatusResponse> {
        return this.http.delete<DeleteRequestStatusResponse>('/request_status/' + requestStatusId);
    }
}
