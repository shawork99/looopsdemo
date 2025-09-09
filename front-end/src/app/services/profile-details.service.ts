import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { profile, ProfiledetailsInfoResponse, UpdateProfiledetails,UpdatePasswordResponse } from '@store/profile-details/profile_details.model';

@Injectable({ providedIn: 'root' })
export class ProfileDetailsService {
  private readonly API_URL = '/profile';

  constructor(private http: HttpClient) {}

  getProfileDetails(): Observable<ProfiledetailsInfoResponse> {
    return this.http.get<ProfiledetailsInfoResponse>(this.API_URL);
  }

  updateProfileDetails(id: number, data: profile): Observable<UpdateProfiledetails> {
    return this.http.put<UpdateProfiledetails>(`${this.API_URL}/${id}`, data);
  }

updatePassword(id: number, data: { old_password: string; password: string; password_confirmation: string }): Observable<UpdatePasswordResponse> {
  return this.http.post<UpdatePasswordResponse>(`/profile_update/${id}`, data);
}



}