import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {
    CreateNavigationRequest,
    CreateNavigationResponse,
    GetNavigationsByRoleR,
    NavigationFormDataR
} from "@store/navigation/navigation.model";

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    constructor(private http: HttpClient) {
    }

    getNavigationFormData(): Observable<NavigationFormDataR> {
        return this.http.get<NavigationFormDataR>('/navigations?formdata=true');
    }

    getNavigationsByRole(roleId: number): Observable<GetNavigationsByRoleR> {
        return this.http.get<GetNavigationsByRoleR>('/navigations?getNavigationsByRoleId=' + roleId);
    }

    createNavigationsByRole(data: CreateNavigationRequest): Observable<CreateNavigationResponse> {
        return this.http.post<CreateNavigationResponse>('/navigations', data);
    }
}