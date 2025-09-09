import {createAction, props} from '@ngrx/store'
import {LoginResponseData, SystemDetail, User} from './auth.model'

// login action
export const login = createAction(
    '[Authentication] Login',
    props<{ email: string; password: string }>()
)
export const loginSuccess = createAction(
    '[Authentication] Login Success',
    props<{ data: LoginResponseData }>()
)
export const loginFailure = createAction(
    '[Authentication] Login Failure')

export const getMySystemDetails = createAction(
    '[Authentication] Get My System Details')

export const onMySystemDetailSuccess = createAction(
    '[Authentication] On My System Details Success',
    props<{ data: SystemDetail }>()
)

export const onSystemLanguageChanged = createAction(
    '[Authentication] System Language Changed',
    props<{ language: string }>()
)
// logout action
export const logout = createAction('[Authentication] Logout')

export const logoutSuccess = createAction('[Auth] Logout Success')

export const recoverPassword = createAction(
    '[Authentication] Recover Password',
    props<{ email: string }>()
)

export const recoverPasswordSuccess = createAction(
  '[Authentication] Recover Password Success',
  props<{ message: string }>()
);

export const recoverPasswordFailure = createAction(
  '[Authentication] Recover Password Failure',
  props<{ error: any }>()
);

export const recoverPasswordReset = createAction('[Authentication] Recover Password Reset');

export const resetPassword = createAction(
  '[Authentication] Reset Password',
  props<{ payload: string; password: string; password_confirmation: string }>()
);

export const resetPasswordSuccess = createAction(
  '[Authentication] Reset Password Success',
  props<{ message: string }>()
);

export const resetPasswordFailure = createAction(
  '[Authentication] Reset Password Failure',
  props<{ error: any }>()
);

export const resetPasswordReset = createAction(
  '[Authentication] Reset Password Reset'
);
