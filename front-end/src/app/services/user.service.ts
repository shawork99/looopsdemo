import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {HelperService} from "@/app/services/helper.service";
import {
    CreateUserResponse,
    DeleteUserResponse,
    GetAllUsersResponse, GetEditUserResponse, GetUserFormDataResponse,
    UpdateUserResponse,
    User,
    UserFilter, UserPasswordResetRequest, UserPasswordResetResponse,SendPasswordMailResponse
} from "@store/users/user.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    lastFilter: UserFilter;

    constructor(private http: HttpClient,
                private helperService: HelperService) {
    }

    getFormData(): Observable<GetUserFormDataResponse> {
        return this.http.get<GetUserFormDataResponse>('/users?formdata=true');
    }

    getAllUsers(filter: UserFilter): Observable<GetAllUsersResponse> {
        this.lastFilter = filter;
        return this.http.get<GetAllUsersResponse>('/users', {params: this.helperService.convertToHttpParams(filter)});
    }

    createUser(user: User): Observable<CreateUserResponse> {
        return this.http.post<CreateUserResponse>('/users', user);
    }

    getUserForEdit(userId: number): Observable<GetEditUserResponse> {
        return this.http.get<GetEditUserResponse>('/users/' + userId);
    }

    updateUser(userId: number, user: User): Observable<UpdateUserResponse> {
        return this.http.put<UpdateUserResponse>('/users/' + userId, user);
    }

    resetUserPassword(data: UserPasswordResetRequest): Observable<UserPasswordResetResponse> {
        return this.http.post<UpdateUserResponse>('/reset_user_password', data);
    }

    deleteUser(userId: number): Observable<DeleteUserResponse> {
        return this.http.delete<DeleteUserResponse>('/users/' + userId);
    }

    SendPasswordMail(userId: number): Observable<SendPasswordMailResponse> {
        return this.http.post<SendPasswordMailResponse>(`/users/${userId}/send-password-mail`, {});
    }

    downloadExcel(filters: any): Observable<Blob> {
        return this.http.post('/users/excel', filters, { responseType: 'blob' });
    }

}
