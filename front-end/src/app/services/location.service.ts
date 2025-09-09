import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { HelperService } from "@/app/services/helper.service";
import {
  Location,
  LocationFilter,
  CreateLocationResponse,
  GetAllLocationResponse,
  UpdateLocationResponse,
  DeleteLocationResponse
} from "@store/location/location.model";

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  lastFilter: LocationFilter;

  constructor(private http: HttpClient,
              private helperService: HelperService) {}

  getAllLocations(filter: LocationFilter): Observable<GetAllLocationResponse> {
    this.lastFilter = filter;
    return this.http.get<GetAllLocationResponse>(
      '/locations',
      { params: this.helperService.convertToHttpParams(filter) }
    );
  }

  createLocation(data: Location): Observable<CreateLocationResponse> {
    return this.http.post<CreateLocationResponse>('/locations', data);
  }

  updateLocation(id: number, data: Location): Observable<UpdateLocationResponse> {
    return this.http.put<UpdateLocationResponse>(`/locations/${id}`, data);
  }

  deleteLocation(id: number): Observable<DeleteLocationResponse> {
    return this.http.delete<DeleteLocationResponse>(`/locations/${id}`);
  }
}
