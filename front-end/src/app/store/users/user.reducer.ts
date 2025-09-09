import * as UserActions from "./user.actions";
import {createReducer, on} from "@ngrx/store";
import {User, UserFormData, UserPaginate} from "@store/users/user.model";


export interface UserState {
    users: UserPaginate | null;
    hideUserForm: boolean,
    isGridLoading: boolean;
    showFormLoading: boolean;
    formData: UserFormData;
    editUserDetails: User;
    showPasswordResetForm : boolean;
    loading: boolean; 
    isExcelDownloading: boolean;
}

export const initialUserState: UserState = {
    users: null,
    hideUserForm: false,
    isGridLoading: false,
    showFormLoading: false,
    formData: null,
    editUserDetails: null,
    showPasswordResetForm: false,
    loading: false,
    isExcelDownloading: false
}

export const userReducer = createReducer(
    initialUserState,
    on(UserActions.getAllUsers, (state) => ({
        ...state,
        isGridLoading: true,
        hideUserForm: false
    })),
    on(UserActions.onAllUsersSuccess, (state, response) => ({
        ...state,
        users: response?.data,
        isGridLoading: false
    })),
    on(UserActions.showHideUserForm, (state, status) => ({
        ...state,
        hideUserForm: status?.show,
        editUserDetails: null
    })),
    on(UserActions.manageUserLoading, (state, data) => ({
        ...state,
        isGridLoading: data?.data
    })),
    on(UserActions.showUserFormLoading, (state, data) => ({
        ...state,
        showFormLoading: data?.show
    })),
    on(UserActions.onGetFormDataSuccess, (state, data) => ({
        ...state,
        formData: data?.data
    })),
    on(UserActions.onEditUserDetailSuccess, (state, data) => ({
        ...state,
        editUserDetails: data?.data,
        showFormLoading: false
    })),
    on(UserActions.getEditUserDetails, (state, data) => ({
        ...state,
        showFormLoading: true
    })),
    on(UserActions.onShowPasswordResetForm, (state, data) => ({
        ...state,
        showPasswordResetForm: data?.show
    })),
    on(UserActions.onSendUserPasswordMail, state => ({
        ...state,
        loading: true
    })),
    on(UserActions.onSendUserPasswordMailSuccess, state => ({
        ...state,
        loading: false
    })),
    on(UserActions.onSendUserPasswordMailFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
    on(UserActions.onDownloadExcel, (state) => ({
    ...state,
        isExcelDownloading: true,
        error: null
    })),
    on(UserActions.onDownloadExcelSuccess, (state) => ({
        ...state,
        isExcelDownloading: false
    })),
    on(UserActions.onDownloadExcelFailure, (state, { error }) => ({
        ...state,
        isExcelDownloading: false,
        error
    }))

)