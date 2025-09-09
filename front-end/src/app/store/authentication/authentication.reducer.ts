import {createReducer, on} from '@ngrx/store'
import {
    login,
    loginFailure,
    loginSuccess,
    logoutSuccess, onMySystemDetailSuccess, onSystemLanguageChanged,recoverPasswordFailure,recoverPasswordSuccess,recoverPasswordReset,resetPassword,resetPasswordSuccess,resetPasswordFailure,resetPasswordReset
} from './authentication.actions'
import type {Navigation, User} from './auth.model'
import {localStorageKeys} from "@/app/shared/config/common.config";
import {EncryptionService} from "@/app/services/encryption.service";

export type AuthenticationState = {
    user: User | null,
    token: string | null,
    navigation: Navigation[] | [],
    permissions: string | null,
    isLoggedIn: boolean,
    error: any | null,
    isLoading: boolean,
    systemLanguage: string | null,
    recoverLoading: boolean,
    recoverMessage: string | null,
    recoverError: string | null,
    resetLoading: boolean,
    resetMessage: string | null,
    resetError: string | null,
}

const initialState: AuthenticationState = getInitialState();

export const authenticationReducer = createReducer(
    initialState,
    on(login, (state) => ({...state, isLoggedIn: false, error: null, isLoading: true})),
    on(loginSuccess, (state, data) => ({
        ...state,
        isLoggedIn: true,
        ...data?.data,
        error: null,
        isLoading: false
    })),
    on(loginFailure, (state) => ({...state, error: null, isLoading: false})),
    on(onSystemLanguageChanged, (state, data) => ({...state, systemLanguage: data?.language})),
    on(logoutSuccess, (state) => ({
        ...state,
        ...getInitialState(),
    })),
    on(logoutSuccess, (state) => ({
        ...state,
        ...getInitialState(),
    })),
    on(onMySystemDetailSuccess, (state, data) => ({
        ...state,
        user: data?.data?.user,
        navigation: data?.data?.navigation,
        permissions: data?.data?.permissions
    })),
     on(recoverPasswordSuccess, (state, { message }) => ({
        ...state,
        recoverLoading: false,
        recoverMessage: message
    })),
    on(recoverPasswordFailure, (state, { error }) => ({
        ...state,
        recoverLoading: false,
        recoverError: error
    })),
    on(recoverPasswordReset, (state) => ({
        ...state,
        recoverMessage: null,
        recoverError: null
    })),
    on(resetPassword, (state) => ({ 
        ...state, 
        resetLoading: true, 
        resetError: null
    })),
    on(resetPasswordSuccess, (state, { message }) => ({ 
        ...state, 
        resetLoading: false, 
        resetMessage: message 
    })),
    on(resetPasswordFailure, (state, { error }) => ({ 
        ...state, 
        resetLoading: false,
        resetError: error 
    })),
    on(resetPasswordReset, (state) => ({ 
        ...state,
        resetMessage: null,
        resetError: null 
    })),
)

function getInitialState(): AuthenticationState {
    let userLocal = localStorage.getItem(localStorageKeys.user) || null;
    let user = null;
    if (userLocal) {
        const userData = EncryptionService.decrypt(userLocal);
        if (userData) {
            user = userData;
        }
    }
    let navigationLocal = localStorage.getItem(localStorageKeys.navigation) || null;
    let navigation = [];
    if (navigationLocal) {
        const navigationD = EncryptionService.decrypt(navigationLocal);
        if (navigationD) {
            navigation = navigationD;
        }
    }
    let permissionLocal = localStorage.getItem(localStorageKeys.permission) || null;
    let permission = null;
    if (permissionLocal) {
        const permissionD = EncryptionService.decrypt(permissionLocal);
        if (permissionD) {
            permission = permissionD;
        }
    }
    let tokenLocal = localStorage.getItem(localStorageKeys.token) || null;
    let token = null;
    if (tokenLocal) {
        const tokenD = EncryptionService.decrypt(tokenLocal);
        if (tokenD) {
            token = tokenD;
        }
    }
    let systemLanguageLocal = localStorage.getItem(localStorageKeys.systemLanguage);
    let systemLanguage = null;
    if (systemLanguageLocal) {
        const systemLanguageD = EncryptionService.decrypt(systemLanguageLocal);
        if (systemLanguageD) {
            systemLanguage = systemLanguageD;
        }
    } else {
        systemLanguage = 'en';
    }
    return {
        user: user,
        navigation: navigation,
        permissions: permission,
        token: token,
        isLoggedIn: user ? true : false,
        error: null,
        isLoading: false,
        systemLanguage: systemLanguage,
        recoverLoading: false,
        recoverMessage: null,
        recoverError: null,
        resetLoading: false,
        resetMessage: null,
        resetError: null,
    }
}

