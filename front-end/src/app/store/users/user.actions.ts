import {createAction, props} from "@ngrx/store";
import {User, UserFilter, UserFormData, UserPaginate, UserPasswordResetRequest} from "@store/users/user.model";

export const getFormData = createAction('[Users] Get Users Form Data');
export const onGetFormDataSuccess = createAction('[Users] Get Users Form Data Success', props<{
    data: UserFormData
}>());
export const getAllUsers = createAction('[Users] Get All Users', props<{ data: UserFilter }>());
export const onAllUsersSuccess = createAction('[Users] Get All Users Success', props<{ data: UserPaginate }>());
export const manageUserLoading = createAction('[Users] Enable User Loading', props<{ data: boolean }>());
export const createUser = createAction('[Users] Create User', props<{ data: User }>());
export const updateUser = createAction('[Users] Update User', props<{ userId: number, data: User }>());
export const deleteUser = createAction('[Users] Delete User', props<{ data: number }>());
export const showHideUserForm = createAction('[Users] Show User Form', props<{ show: boolean }>());
export const showUserFormLoading = createAction('[Users] Show User Form Loading', props<{ show: boolean }>());
export const getEditUserDetails = createAction('[Users] Get Edit User Details', props<{ userId: number }>());
export const onEditUserDetailSuccess = createAction('[Users] On Edit User Details Success', props<{ data: User }>());
export const onShowPasswordResetForm = createAction('[Users] On Show Password Reset Form', props<{ show: boolean }>());
export const onResetUserPassword = createAction('[Users] On Reset User Password', props<{
    data: UserPasswordResetRequest
}>());
export const onSendUserPasswordMail  = createAction('[User] on Send Password Mail',props <{userId:number}>());
export const onSendUserPasswordMailSuccess  = createAction ('[User] on Send User PasswordMail Success');
export const onSendUserPasswordMailFailure  = createAction('[User] on Send User Password Mail Failure', props<{error:any}>());
export const onDownloadExcel = createAction(
  '[User] Download Excel',
  props<{ filters: any }>()
);

export const onDownloadExcelSuccess = createAction(
  '[User] Download Excel Success'
);

export const onDownloadExcelFailure = createAction(
  '[User] Download Excel Failure',
  props<{ error: any }>()
);
