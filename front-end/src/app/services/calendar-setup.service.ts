import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { HelperService } from "@/app/services/helper.service";
import {
  CalendarSetup,
  CreateCalendarSetupResponse,
  UpdateCalendarSetupResponse,
  DeleteCalendarSetupResponse,
  GetEditCalendarSetupResponse,
  GetAllCalendarSetupResponse
} from '@store/calendar_steup/calendar_setup.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarSetupService {

  constructor(
    private http: HttpClient,
    private helperService: HelperService
  ) { }

  getAllCalendarSetup(): Observable <GetAllCalendarSetupResponse>{
    return this.http.get<GetAllCalendarSetupResponse>('/calendar_setup');
  }
  createApprovalLevel(calendarSetup: CalendarSetup): Observable<CreateCalendarSetupResponse> {
    return this.http.post<CreateCalendarSetupResponse>('/calendar_setup', calendarSetup);
  }
  getCalendarSetupForEdit(calenderSetupId: number): Observable<GetEditCalendarSetupResponse> {
    return this.http.get<GetEditCalendarSetupResponse>('/calendar_setup/' + calenderSetupId);
  }
  updateCalendarSetup(calenderSetupId: number, calendarSetup: CalendarSetup): Observable<UpdateCalendarSetupResponse> {
    return this.http.put<UpdateCalendarSetupResponse>('/calendar_setup/' + calenderSetupId, calendarSetup);
  }
  deleteCalendarSetup(calenderSetupId: number): Observable<DeleteCalendarSetupResponse> {
    return this.http.delete<DeleteCalendarSetupResponse>('/calendar_setup/' + calenderSetupId);
  }
}
