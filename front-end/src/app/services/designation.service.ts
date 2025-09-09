import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {HelperService} from "@/app/services/helper.service";
import {
    CreateDesignationResponse, DeleteDesignationResponse,
    Designation,
    DesignationFilter,
    GetAllDesignationResponse, UpdateDesignationResponse
} from "@store/designation/designation.model";

@Injectable({
    providedIn: 'root'
})
export class DesignationService {
    lastFilter: DesignationFilter;

    constructor(private http: HttpClient,
                private helperService: HelperService) {
    }

    getAllDesignation(filter: DesignationFilter): Observable<GetAllDesignationResponse> {
        this.lastFilter = filter;
        return this.http.get<GetAllDesignationResponse>('/designation', {params: this.helperService.convertToHttpParams(filter)});
    }

    createDesignation(designation: Designation): Observable<CreateDesignationResponse> {
        return this.http.post<CreateDesignationResponse>('/designation', designation);
    }

    updateDesignation(designationId: number, designation: Designation): Observable<UpdateDesignationResponse> {
        return this.http.put<UpdateDesignationResponse>('/designation/' + designationId, designation);
    }

    deleteDesignation(designationId: number): Observable<DeleteDesignationResponse> {
        return this.http.delete<DeleteDesignationResponse>('/designation/' + designationId);
    }
}
