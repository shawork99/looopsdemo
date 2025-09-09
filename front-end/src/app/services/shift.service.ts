import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {HelperService} from "@/app/services/helper.service";
import {
    CreateShiftResponse, DeleteShiftResponse,
    GetAllShiftResponse, GetEditShiftResponse,
    Shift,
    ShiftFilter,
    UpdateShiftResponse
} from "@store/shift/shift.model";

@Injectable({
    providedIn: 'root'
})
export class ShiftService {
    lastFilter: ShiftFilter;

    constructor(private http: HttpClient,
                private helperService: HelperService) {
    }

    getAllShifts(filter: ShiftFilter): Observable<GetAllShiftResponse> {
        this.lastFilter = filter;
        return this.http.get<GetAllShiftResponse>('/shifts', {params: this.helperService.convertToHttpParams(filter)});
    }

    createShift(shift: Shift): Observable<CreateShiftResponse> {
        return this.http.post<CreateShiftResponse>('/shifts', shift);
    }

    updateShift(shiftId: number, shift: Shift): Observable<UpdateShiftResponse> {
        return this.http.put<UpdateShiftResponse>('/shifts/' + shiftId, shift);
    }

    getEditShift(shiftId: number): Observable<GetEditShiftResponse> {
        return this.http.get<GetEditShiftResponse>('/shifts/' + shiftId);
    }

    deleteShift(shiftId: number): Observable<DeleteShiftResponse> {
        return this.http.delete<DeleteShiftResponse>('/shifts/' + shiftId);
    }
}
