import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { clockinclockout, load_clockinoutprfile, load_profile } from '@store/clockin-clockout/clockin_clockout.model';

@Injectable({ providedIn: 'root' })
export class ClockinClockoutservice {
  constructor(private http: HttpClient) {}

  getprofileuserdata(): Observable<load_clockinoutprfile> {
    return this.http.get<load_clockinoutprfile>('/profile');
  }

  getClockinoutDetails(): Observable<any> {
    return this.http.get(`/clockinout_details`);
  }

  getattandancestatus(): Observable<any> {
    return this.http.get(`/get_attandace_stasus`);
  }
    
  getallclockinoutsfortheday(): Observable<any> {
    return this.http.get(`/get_all_clockin_and_out`);
  }
  

  clockIn(userId: number, comment: string, latitude?: number, longitude?: number, deviceType = 'web'): Observable<any> {
    return this.http.post(`/clockinout`, {
      user_id: userId,
      action_type: 'clock_in',
      comments: comment || '',
      latitude: latitude ?? 0,
      longitude: longitude ?? 0,
      device_type: deviceType
    });
  }

  clockOut(userId: number, comment: string, latitude?: number, longitude?: number, deviceType = 'web'): Observable<any> {
    return this.http.post(`/clockinout`, {
      user_id: userId,
      action_type: 'clock_out',
      comments: comment || '',
      latitude: latitude ?? 0,
      longitude: longitude ?? 0,
      device_type: deviceType
    });
  }

  getWishes(): Observable<any> {
    return this.http.get(`/wishes`);
  }

}
