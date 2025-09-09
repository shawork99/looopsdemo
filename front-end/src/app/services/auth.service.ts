import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'

import {CookieService} from 'ngx-cookie-service'
import type {Observable} from 'rxjs'
import {LoginResponse, LogoutResponse, MySystemDetailResponse, User,RecoverPasswordResponse} from '@store/authentication/auth.model'

@Injectable({providedIn: 'root'})
export class AuthenticationService {
    user: User | null = null

    public readonly authSessionKey = '_HANDO_AUTH_SESSION_KEY_'

    constructor(
        private http: HttpClient,
        private cookieService: CookieService
    ) {
    }

    login(email: string, password: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`/login`, {email, password});
    }

    logout(): Observable<LogoutResponse> {
        return this.http.get<LogoutResponse>(`/logout`);
    }

    getMySystemDetails(): Observable<MySystemDetailResponse> {
        return this.http.get<MySystemDetailResponse>(`/mydetails`);
    }

    get session(): string {
        return this.cookieService.get(this.authSessionKey)
    }

    saveSession(token: string): void {
        this.cookieService.set(this.authSessionKey, token)
    }

    removeSession(): void {
        this.cookieService.delete(this.authSessionKey)
    }

    recoverPassword(email: string): Observable<RecoverPasswordResponse> {
        return this.http.post<RecoverPasswordResponse>(`/recoverPassword`, { email });
    }

    resetPassword(payload: string, password: string, password_confirmation:string): Observable<any> {
        return this.http.post('/reset-password', { payload, password ,password_confirmation});
    }

   verifyPayload(payload: string): Observable<{ valid: boolean; message?: string }> {
        return this.http.post<{ valid: boolean; message?: string }>(
            '/verify-payload',
            { payload }
        );
    }

}
